"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Brain, ArrowRight, GitBranch, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import api from "../lib/api.js"; // Tera sahi API path

export default function AuthPage() {
  const router = useRouter();
  
  const [isMounted, setIsMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    techStack: "",
  });

  // Hydration fix
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        router.push("/chat");
      } else {
        const techArray = formData.techStack ? formData.techStack.split(",").map(t => t.trim()) : [];
        await api.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          techStack: techArray,
        });
        router.push("/chat"); 
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong! Check backend.");
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent UI flash before mounting
  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-background transition-colors duration-500 relative overflow-hidden text-foreground">
      
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="grid-overlay absolute inset-0 opacity-30" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl bg-card border border-border rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10"
      >
        
        {/* ─── LEFT PANEL: PREMIUM INFO (GITHUB HIGHLIGHT) ─── */}
        <div className="w-full md:w-5/12 bg-hover p-10 flex flex-col justify-between relative overflow-hidden border-r border-border">
          {/* Glow effect inside left panel */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2 mb-10 cursor-pointer" onClick={() => router.push("/")}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-light flex items-center justify-center shadow-lg">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">BrainDesk AI</span>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-balance leading-tight">
              Your ultimate <br/><span className="text-accent">AI Workspace.</span>
            </h2>
            
            <p className="text-muted mb-8 leading-relaxed text-sm">
              Log in to access your dual-layer memory, universal RAG pipeline, and autonomous testing agents. Everything syncs perfectly.
            </p>

            {/* Premium GitHub Promo Box */}
            <div className="bg-card border border-accent/30 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                  <GitBranch className="w-4 h-4 text-accent" />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-accent">GitHub Autopilot</h3>
              </div>
              
              <p className="text-sm text-muted leading-relaxed relative z-10 mb-4">
                Connect your GitHub account <strong>inside the workspace</strong> to let BrainDesk instantly read, modify, and push code files to your repositories completely autonomously.
              </p>

              <div className="flex flex-col gap-2 relative z-10">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure OAuth 2.0 Access
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Auto-Commit Generation
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-xs text-muted flex items-center gap-2">
            <span>© 2026 BrainDesk AI</span>
            <span>•</span>
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
          </div>
        </div>

        {/* ─── RIGHT PANEL: AUTH FORM ─── */}
        <div className="w-full md:w-7/12 p-10 lg:p-14 bg-card flex flex-col justify-center">
          
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-3xl font-extrabold mb-2 tracking-tight">
              {isLogin ? "Welcome Back" : "Create an Account"}
            </h2>
            <p className="text-muted text-sm mb-8">
              {isLogin ? "Enter your details to access your workspace." : "Join developers automating their workflow today."}
            </p>

            {/* OAuth Buttons (Sirf Google) */}
          <div className="mb-6">
              <button 
                type="button"
                onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
                className="w-full flex items-center justify-center gap-3 bg-hover border border-border hover:border-accent/50 p-3.5 rounded-xl text-sm font-semibold transition-all shadow-sm group"
              >
                {/* Authentic Google SVG Icon */}
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-border"></div>
              <span className="px-4 text-muted text-xs uppercase tracking-widest font-semibold">Or continue with email</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            {/* Error Banner */}
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!isLogin && (
                <div className="flex gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-background border border-border text-foreground placeholder-muted rounded-xl p-3.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                  <input
                    type="text"
                    name="techStack"
                    placeholder="Tech Stack (React, Node)"
                    value={formData.techStack}
                    onChange={handleChange}
                    className="w-full bg-background border border-border text-foreground placeholder-muted rounded-xl p-3.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-background border border-border text-foreground placeholder-muted rounded-xl p-3.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
              <input
                type="password"
                name="password"
                placeholder="Password (min 6 chars)"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-background border border-border text-foreground placeholder-muted rounded-xl p-3.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />

              <button 
                type="submit" 
                disabled={isLoading}
                className="brain-btn mt-4 p-4 text-sm flex items-center justify-center gap-2 w-full disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    {isLogin ? "Sign In to Workspace" : "Create Workspace"}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Logic */}
            <p className="mt-8 text-center text-sm text-muted">
              {isLogin ? "New to BrainDesk? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(""); }}
                className="text-accent hover:text-accent-light font-semibold transition-colors"
              >
                {isLogin ? "Create an account" : "Log in"}
              </button>
            </p>

          </div>
        </div>

      </motion.div>
    </div>
  );
}