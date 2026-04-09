"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Rocket, Zap, CreditCard, 
  GitPullRequest, Code2, Heart, Sparkles 
} from "lucide-react";

export default function UpdatesPage() {
  const router = useRouter();

  const updates = [
    {
      icon: Zap,
      title: "Mass Auto-API Testing",
      desc: "Upload a complete backend file, and the AI will auto-extract all routes, generate valid payloads, and test every single endpoint automatically in one click.",
      status: "In Progress"
    },
    {
      icon: CreditCard,
      title: "Razorpay Credit System",
      desc: "Integration with Razorpay. AI execution will cost credits to manage LLM API costs. Special users will get a dedicated dashboard to buy and track credits.",
      status: "Planning"
    },
    {
      icon: GitPullRequest,
      title: "Automated PR Reviewer",
      desc: "Connect your repo and the AI will automatically read your latest commits, generate a beautiful Pull Request description, and find potential bugs.",
      status: "Future"
    },
    {
      icon: Code2,
      title: "Voice-to-Code Workspace",
      desc: "Talk to BrainDesk naturally. Say 'Test my login API' and watch the agent execute it hands-free while you focus on the architecture.",
      status: "Future"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-hidden relative">
      
      {/* Golden Background Glow */}
      <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[150px] pointer-events-none -z-10" />
      
      {/* Header */}
      <header className="h-16 flex items-center px-6 border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-20">
        <button 
          onClick={() => router.push('/chat')}
          className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Back to Workspace
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20 relative z-10">
        
        {/* Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-6 shadow-lg shadow-amber-500/10">
            <Rocket className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            The Future Roadmap
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            BrainDesk AI is constantly evolving. Here are the premium features currently being forged in the development pipeline.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {updates.map((update, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-3xl bg-card border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-amber-500/5 relative overflow-hidden"
            >
              {/* Subtle hover gradient inside card */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-background border border-amber-500/20 flex items-center justify-center">
                  <update.icon size={20} className="text-amber-500" />
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  update.status === 'In Progress' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
                  update.status === 'Planning' ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' :
                  'bg-muted/10 border-border text-muted'
                }`}>
                  {update.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-foreground relative z-10">{update.title}</h3>
              <p className="text-sm text-muted leading-relaxed relative z-10">{update.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Important Note Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto p-8 rounded-3xl bg-background border border-border/50 text-center relative overflow-hidden"
        >
          {/* Subtle noise/grid could go here, but keeping it clean */}
          <Heart className="w-8 h-8 text-red-500 mx-auto mb-4 opacity-80" />
          <h4 className="text-lg font-bold mb-2">A Quick Developer Note</h4>
          <p className="text-sm text-muted leading-relaxed italic">
            "While these features sound like a full-fledged SaaS startup, I have no intention of building a company out of this right now. Building a real startup demands massive infrastructure, compliance, and capital. I built BrainDesk AI purely for my own learning, to push my boundaries as an SDE, and to share this cool tech with you all."
          </p>
        </motion.div>

      </main>
    </div>
  );
}