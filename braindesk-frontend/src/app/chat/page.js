"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Bot, User, Github, LogOut, 
  Paperclip, Sparkles, MessageSquare, Plus, Loader2,
  Trash2, Info, X, FileText, Youtube, FlaskConical, Sun, Moon
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../lib/api.js";

export default function ChatPage() {
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // 🟢 States
  const [isMounted, setIsMounted] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]); 
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  
  // 🟢 New States for History & Files
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // 🟢 Mount & Theme Setup
useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    fetchChatHistory(); 
    
    // NAYA: Backend se check karo token hai ya nahi
    const checkProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        if (res.data.githubToken) {
          setIsGithubConnected(true);
        }
      } catch (err) {
        console.error("Profile fetch error", err);
      }
    };
    checkProfile();
  }, []);

  const toggleTheme = () => {
    const modes = ["light", "dim", "dark"];
    const next = modes[(modes.indexOf(theme) + 1) % modes.length];
    document.documentElement.classList.remove("light", "dim", "dark");
    document.documentElement.classList.add(next);
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ─── API CALLS (HISTORY & DELETE) ───
  const fetchChatHistory = async () => {
    try {
      const res = await api.get("/chats");
      setChatHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const loadSingleChat = async (id) => {
    try {
      const res = await api.get(`/chats/${id}`);
      setSessionId(res.data._id);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Failed to load chat:", err);
    }
  };

  const deleteChat = async (e, id) => {
    e.stopPropagation(); // Prevent loading the chat when clicking delete
    try {
      await api.delete(`/chats/${id}`);
      setChatHistory(prev => prev.filter(chat => chat._id !== id));
      if (sessionId === id) {
        setSessionId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  // ─── FILE UPLOAD HANDLERS ───
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 2) {
      alert("You can only upload a maximum of 2 files at a time.");
      return;
    }
    setSelectedFiles(prev => [...prev, ...files]);
    // In future: Yahan /api/documents/upload-pdf ki API call laga dena
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // ─── CHAT LOGIC (REPLACED WITH FILE UPLOAD) ───
  const handleSend = async (e, customMsg = null) => {
    e?.preventDefault();
    let messageToSend = customMsg || input.trim();
    
    // 1. Agar text bhi nahi hai aur file bhi nahi hai, toh ruk jao
    if ((!messageToSend && selectedFiles.length === 0) || isLoading) return;

    setInput(""); 
    setIsLoading(true);

    // 2. 🔥 FILE UPLOAD LOGIC 🔥
    if (selectedFiles.length > 0) {
      setMessages(prev => [...prev, { role: "assistant", content: `Uploading ${selectedFiles.length} file(s)... ⏳` }]);
      
      let uploadedNames = [];
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("document", file); // Tere backend mein 'document' naam set hai
        
        try {
          await api.post("/documents/upload-pdf", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          uploadedNames.push(file.name);
        } catch (err) {
          console.error("Upload failed", err);
          setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: `❌ Failed to upload ${file.name}` }]);
          setIsLoading(false);
          return;
        }
      }
      
      setSelectedFiles([]); // Upload ke baad file clear kar do
      setMessages(prev => prev.slice(0, -1)); // "Uploading..." wala message hata do
      
      // Agent ko batane ke liye prompt modify karo
      messageToSend = `[System Context: User has uploaded files: ${uploadedNames.join(", ")}].\n` + messageToSend;
    }

    setMessages((prev) => [...prev, { role: "user", content: messageToSend }]);

    try {
      let currentSessionId = sessionId;

      if (!currentSessionId) {
        // System text ko chat title se hatane ke liye
        const titleText = messageToSend.replace(/\[System Context:.*?\].\n/, '');
        const sessionRes = await api.post("/chats/new", { title: titleText.substring(0, 25) || "Uploaded Document" }); 
        currentSessionId = sessionRes.data._id || sessionRes.data.chatId || sessionRes.data.sessionId; 
        setSessionId(currentSessionId);
        fetchChatHistory(); // Refresh sidebar
      }

      const res = await api.post("/chats/message", { 
        chatId: currentSessionId,   
        sessionId: currentSessionId, 
        message: messageToSend 
      });
      
     // Hum backend se pure 'messages' array ko uthayenge (jisme reasoning saved hai)
  if (res.data && res.data.messages) {
    const updatedMessages = res.data.messages.map((m, idx) => ({
      ...m,
      // Sirf aakhri message (jo abhi aaya hai) ke liye isNew true hoga
      isNew: idx === res.data.messages.length - 1 
    }));
    setMessages(updatedMessages);
  } else {
    // Fallback logic agar messages array nahi milta
    let aiContent = res.data.response || res.data.message || "Response received";
    setMessages((prev) => [...prev, { role: "assistant", content: aiContent, isNew: true }]);
  }

} catch (error) {
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        router.push("/login");
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: `❌ Error: ${error.response?.data?.message || "Server Error"}` }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); 
      router.push("/login");
    } catch (err) {
      router.push("/login"); 
    }
  };

const handleGitHubConnect = async () => {
    try {
      // 1. Backend se user ki profile mangwao taaki ID mil sake
      const profileRes = await api.get('/users/profile'); // Make sure ye route tere backend mein chal raha ho
      const userId = profileRes.data._id; 

      if (!userId) {
        alert("User ID nahi mili! Backend check karo.");
        return;
      }

      // 2. ID ke sath GitHub wale route pe bhej do
      window.location.href = `http://localhost:5000/api/auth/github?userId=${userId}`;
      
    } catch (error) {
      console.error("GitHub Connect Error:", error);
      alert("Error: Profile fetch nahi hui, check console.");
    }
  };


  // ─── AGENT INFO CARDS DATA ───
  const featureCards = [
    {
      icon: Github,
      title: "GitHub Automation",
      desc: "Modify & push code instantly.",
      action: "Create a new file in my repo...",
      instructions: "💡 Prompt: 'Create/Update a file in my repo' or 'Push this code'. Note: Cannot delete entire repositories for security.",
    },
    {
      icon: FlaskConical,
      title: "API Testing",
      desc: "Auto-generate QA reports.",
      action: "Test my POST /api/register endpoint...",
      instructions: "💡 Prompt: 'Test my login API'. It automatically deduces JSON schema, generates random emails, tests edge cases, and chains requests!",
    },
    {
      icon: Youtube,
      title: "Universal RAG & Memory",
      desc: "Chat with PDFs & YouTube.",
      action: "Save this YouTube video...",
      instructions: "💡 Prompt: 'Save this YouTube link' or upload a PDF. Then ask: 'Based on my context, what did the video say?'",
    },
  ];

  if (!isMounted) return null;

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden transition-colors duration-500">
      
      {/* ─── LEFT SIDEBAR ─── */}
      <aside className="w-64 bg-card border-r border-border flex flex-col justify-between hidden md:flex shrink-0 transition-colors duration-500">
        
        {/* Top: Logo & New Chat */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-light flex items-center justify-center shadow-lg">
                <Bot size={18} color="white" />
              </div>
              <span className="font-bold text-lg tracking-tight">BrainDesk AI</span>
            </div>
            {/* Theme Toggle in Sidebar */}
            <button onClick={toggleTheme} className="text-muted hover:text-accent transition-colors">
              {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <button 
            onClick={() => { setMessages([]); setSessionId(null); }}
            className="w-full flex items-center gap-2 bg-background border border-border hover:border-accent/50 p-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-hover shadow-sm"
          >
            <Plus size={16} className="text-accent" />
            New Chat
          </button>
        </div>

        {/* Middle: Recent Chats (WORKING) */}
        <div className="flex-1 overflow-y-auto px-5 custom-scrollbar">
          <div className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Recent Chats</div>
          <div className="space-y-1">
            <AnimatePresence>
              {chatHistory.length === 0 ? (
                <div className="text-xs text-muted px-2 italic">No recent chats</div>
              ) : (
                chatHistory.map((chat) => (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    key={chat._id} 
                    className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${sessionId === chat._id ? 'bg-hover text-foreground border border-border' : 'text-muted hover:bg-hover hover:text-foreground border border-transparent'}`}
                    onClick={() => loadSingleChat(chat._id)}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <MessageSquare size={14} className="shrink-0" /> 
                      <span className="truncate">{chat.title || "New Chat"}</span>
                    </div>
                    {/* Delete Button */}
                    <button 
                      onClick={(e) => deleteChat(e, chat._id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-red-500 transition-all"
                      title="Delete Chat"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom: Profile & Logout */}
        <div className="p-5 border-t border-border space-y-2">
          <button 
            onClick={() => router.push("/account")}
            className="w-full flex items-center gap-3 mb-2 px-3 py-2 hover:bg-hover rounded-lg transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center border border-accent/30">
              <User size={14} className="text-accent" />
            </div>
            <div className="text-sm font-semibold truncate text-foreground">My Account</div>
          </button>

          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted hover:bg-red-500/10 hover:text-red-500 transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

   {/* ─── MAIN CHAT AREA ─── */}
      <main className="flex-1 flex flex-col relative min-w-0 bg-background transition-colors duration-500">
        
        {/* Header (FIXED: Removed absolute positioning so chat doesn't go under it) */}
       {/* Header: Right Top GitHub Button */}
       {/* Header: Right Top GitHub Button & Updates */}
        <header className="shrink-0 h-16 flex items-center justify-between px-6 border-b border-border bg-background/80 backdrop-blur-md z-20">
          <div className="text-xs font-semibold text-muted bg-hover px-3 py-1.5 rounded-full border border-border flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Multi-Agent Active
          </div>
          
          {/* NAYA LOGIC: Wrapper for right side buttons */}
          <div className="flex items-center gap-3">
            
            {/* 🚀 Roadmap / Updates Button */}
            <button 
              onClick={() => router.push('/updates')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/30 hover:border-amber-500/60 rounded-lg text-sm font-semibold text-amber-500 transition-all shadow-sm"
            >
              <Sparkles size={16} />
              Upcoming Updates
            </button>

            {/* GitHub Button */}
            {isGithubConnected ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-sm font-semibold text-emerald-500 transition-all shadow-sm cursor-default">
                <Github size={16} />
                GitHub Connected ✅
              </div>
            ) : (
              <button 
                onClick={handleGitHubConnect}
                className="flex items-center gap-2 px-4 py-2 bg-[#161b22] dark:bg-[#21262d] hover:bg-[#21262d] dark:hover:bg-[#30363d] border border-border rounded-lg text-sm font-semibold text-white transition-all shadow-sm"
              >
                <Github size={16} />
                Connect GitHub
              </button>
            )}
          </div>
        </header>

        {/* Chat Feed (FIXED: Removed pt-24, added padding bottom so input box doesn't cover last message) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32 scroll-smooth custom-scrollbar">
          
          {/* EMPTY STATE */}
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center pb-20">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-cyan-500/20 border border-accent/20 flex items-center justify-center mb-6 shadow-lg shadow-accent/5">
                <Bot className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-3xl font-bold mb-2">How can BrainDesk help today?</h1>
              <p className="text-muted text-sm max-w-md mb-8">
                Ask a question, upload a PDF, test an API, or manage GitHub. <br/>
                <strong className="text-accent">BrainDesk automatically routes your query to the right agent.</strong>
              </p>

              {/* Agent Hint Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
                {featureCards.map((card, idx) => (
                  <div key={idx} className="relative group p-4 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all text-left">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center">
                        <card.icon size={18} className="text-accent" />
                      </div>
                      {/* Info Tooltip Icon */}
                      <div className="relative">
                        <Info size={16} className="text-muted hover:text-foreground cursor-pointer peer" />
                        {/* Hover Popup */}
                        <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-foreground text-background text-xs rounded-xl shadow-xl opacity-0 invisible peer-hover:opacity-100 peer-hover:visible transition-all z-50 pointer-events-none">
                          {card.instructions}
                          <div className="absolute -bottom-1 right-2 w-2 h-2 bg-foreground rotate-45"></div>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-bold text-sm mb-1">{card.title}</h3>
                    <p className="text-xs text-muted mb-4">{card.desc}</p>
                   
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MESSAGES */}
          <div className="space-y-6 pb-24 max-w-4xl mx-auto">
            {messages.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                key={idx} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 shadow-sm ${msg.role === "user" ? "bg-accent" : "bg-card border border-border"}`}>
                  {msg.role === "user" ? <User size={14} color="white" /> : <Bot size={14} className="text-accent" />}
                </div>
                
                <div className={`px-5 py-3.5 rounded-2xl max-w-[85%] text-[15px] leading-relaxed shadow-sm ${
                  msg.role === "user" ? "bg-accent text-white rounded-tr-sm" : "bg-card border border-border text-foreground rounded-tl-sm ai-prose overflow-x-auto"
                }`}>
                  {/* 🟢 CHANGE YAHAN HOGA: Assistant Message ke liye reasoning check */}


        {/* Normal Message Content */}
        {msg.role === "user" ? (
          msg.content
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {msg.content}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  ))}

            {/* TYPING INDICATOR */}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 flex-row">
                <div className="w-8 h-8 shrink-0 rounded-full bg-card border border-border flex items-center justify-center mt-1 shadow-sm">
                  <Bot size={14} className="text-accent" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-card border border-border rounded-tl-sm flex items-center gap-2">
                  <Loader2 size={16} className="text-muted animate-spin" />
                  <span className="text-xs text-muted font-medium">BrainDesk is thinking...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} className="h-2" />
          </div>
        </div>

        {/* ─── INPUT BOX AREA ─── */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-background via-background to-transparent pt-10 pb-4 px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* File Upload Chips */}
            {selectedFiles.length > 0 && (
              <div className="flex gap-2 mb-2 px-2">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-hover border border-border px-3 py-1.5 rounded-lg text-xs font-medium text-foreground">
                    <FileText size={14} className="text-accent" />
                    <span className="truncate max-w-[100px]">{file.name}</span>
                    <button onClick={() => removeFile(idx)} className="text-muted hover:text-red-500 ml-1"><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSend} className="flex items-end gap-2 bg-card border border-border rounded-xl p-2 shadow-lg focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/50 transition-all relative z-10">
              
              {/* File Upload Button */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                accept=".pdf,.txt"
                onChange={handleFileSelect}
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current.click()} 
                className="p-3 text-muted hover:text-accent hover:bg-hover rounded-lg transition-colors shrink-0"
                title="Upload up to 2 files"
              >
                <Paperclip size={20} />
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                placeholder="Ask anything or test an API... (Shift+Enter for new line)"
                disabled={isLoading}
                rows={1}
                className="w-full bg-transparent text-foreground placeholder-muted resize-none py-3 focus:outline-none max-h-32 custom-scrollbar text-[15px]"
                style={{ minHeight: "44px" }}
              />

              <button
                type="submit"
                disabled={(!input.trim() && selectedFiles.length === 0) || isLoading}
                className="p-3 bg-accent hover:bg-accent-light disabled:bg-hover disabled:text-muted text-white rounded-lg transition-colors shadow-sm shrink-0 mb-0.5"
              >
                <Send size={18} />
              </button>
            </form>

            <div className="text-center mt-2 text-[11px] text-muted font-mono flex items-center justify-center gap-1">
              For best results, be specific. e.g., "Test my /login endpoint with edge cases."
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}