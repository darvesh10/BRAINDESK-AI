
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Github, LogIn, Brain, Zap, Database, Code2, TestTube2, GitBranch, Cpu, Sun, Moon } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'

export default function HomePage() {
  const router = useRouter()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll()
  
  const [theme, setTheme] = useState("dark")
  const [isMounted, setIsMounted] = useState(false)
  
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])

  useEffect(() => {
    setIsMounted(true)
    const saved = localStorage.getItem("theme") || "dark"
    setTheme(saved)
    document.documentElement.classList.add(saved)
  }, [])

  const toggleTheme = () => {
    const modes = ["light", "dim", "dark"]
    const next = modes[(modes.indexOf(theme) + 1) % modes.length]

    document.documentElement.classList.remove("light", "dim", "dark")
    document.documentElement.classList.add(next)

    setTheme(next)
    localStorage.setItem("theme", next)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const featureCards = [
    {
      icon: Cpu,
      title: "Multi-Agent Architecture",
      description: "Smart triage router that intelligently delegates tasks to specialized agents without context switching. Everything happens in one unified chat interface.",
      accent: "accent",
    },
    {
      icon: Database,
      title: "Dual-Layer Memory",
      description: "Semantic long-term memory combined with high-performance vector retrieval for instant context recall across all your conversations and documents.",
      accent: "accent",
    },
    {
      icon: GitBranch,
      title: "GitHub Automation",
      description: "Secure OAuth integration that empowers AI agents to read, understand, and push code directly to your repositories with confidence.",
      accent: "accent",
    },
    {
      icon: TestTube2,
      title: "Automated API Testing",
      description: "Intelligent QA agent that generates comprehensive test cases, validates endpoints, and produces detailed reports automatically.",
      accent: "amber",
    },
  ]

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-500">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-500"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent-light flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">BrainDesk AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.open("https://github.com", "_blank")}
              className="p-2 rounded-lg hover:bg-hover text-muted hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </button>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-hover text-muted hover:text-foreground transition-colors flex items-center justify-center w-10 h-10"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Sun className="w-5 h-5 text-yellow-500" /> : 
               theme === "dim" ? <Moon className="w-5 h-5 text-purple-400" /> : 
               <Moon className="w-5 h-5 text-blue-300" />}
            </button>
            
            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent-light transition-colors font-semibold shadow-md"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        {/* Gradient background */}
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-40 right-0 w-80 h-80 rounded-full bg-accent-light/10 blur-3xl" />
          <div className="grid-overlay absolute inset-0 opacity-40" />
        </div>

        <motion.div
          style={{ opacity }}
          className="text-center max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo + Brain icon */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent via-accent-light to-accent flex items-center justify-center glow">
              <Brain className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl font-bold mb-6 tracking-tight text-balance"
          >
            BrainDesk AI
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted mb-8 leading-relaxed text-balance max-w-2xl mx-auto"
          >
            An intelligent AI workspace that combines conversational agents, dual-layer long-term memory, Universal RAG, GitHub automation and automated API testing into a single developer productivity platform.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/login")}
            className="brain-btn px-8 py-4 text-lg font-semibold inline-flex items-center gap-2 shadow-lg"
          >
            Get Started <Zap className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="relative py-20 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-4xl font-bold mb-6 text-balance">What is BrainDesk AI?</h2>
            <p className="text-lg text-muted leading-relaxed mb-4">
              BrainDesk AI is more than just another AI assistant. It's a complete workspace designed specifically for developers who need intelligent automation, seamless memory, and powerful integrations—all in one place.
            </p>
            <p className="text-lg text-muted leading-relaxed">
              Instead of juggling multiple tools and contexts, BrainDesk consolidates conversational intelligence, persistent memory, code automation, and API testing into a unified interface that understands your workflow.
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

          <div>
            <h3 className="text-3xl font-bold mb-6">The Problem We Solve</h3>
            <ul className="space-y-4 text-muted text-lg">
              <li className="flex gap-4">
                <span className="text-accent font-bold">→</span>
                <span>Developers waste time switching between AI assistants, memory systems, and automation tools</span>
              </li>
              <li className="flex gap-4">
                <span className="text-accent font-bold">→</span>
                <span>Context gets lost when you need to reference past conversations or previous code</span>
              </li>
              <li className="flex gap-4">
                <span className="text-accent font-bold">→</span>
                <span>Manual API testing and GitHub operations slow down development cycles</span>
              </li>
              <li className="flex gap-4">
                <span className="text-accent font-bold">→</span>
                <span>AI agents often lack the right context to make intelligent, autonomous decisions</span>
              </li>
            </ul>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

          {/* 🔥 RESTORED "HOW WE HELP" SECTION */}
          <div>
            <h3 className="text-3xl font-bold mb-6">How We Help</h3>
            <p className="text-lg text-muted leading-relaxed mb-4">
              BrainDesk empowers developers with an intelligent agent system that learns, remembers, and automates. With multi-agent architecture, you get specialized agents working in harmony—code readers, API testers, GitHub operators, and RAG tutors—all coordinated by a smart triage router.
            </p>
            <p className="text-lg text-muted leading-relaxed">
              Your long-term memory is preserved across sessions, your code is integrated directly, and your API tests run intelligently. Everything you need, one place to access it.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Special Feature Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl font-bold mb-12 text-center text-balance">The Multi-Agent Advantage</h2>
            
            <div className="relative group">
              {/* Glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent via-accent-light to-accent rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
              
              <div className="relative bg-card border border-accent/30 rounded-2xl p-8 md:p-12 backdrop-blur-sm transition-colors duration-300">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">One Chat. Everything Works.</h3>
                    <p className="text-muted text-lg leading-relaxed mb-6">
                      Unlike traditional AI tools where you switch between different interfaces, BrainDesk routes all your requests through a unified chat. Our smart triage agent understands what you need and delegates to the right specialized agent—whether it's code analysis, API testing, GitHub automation, or knowledge retrieval.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-accent">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-foreground">Ask once. Get everything done.</span>
                      </div>
                      <div className="flex items-center gap-3 text-accent">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-foreground">No context switching. Pure flow.</span>
                      </div>
                      <div className="flex items-center gap-3 text-accent">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-foreground">Intelligent, autonomous agents.</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 🔥 RESTORED COMPLEX ANIMATED ZAP BOX */}
                  <div className="flex-1 flex justify-center">
                    <div className="relative w-full max-w-xs h-64">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full h-full bg-gradient-to-br from-card to-hover rounded-xl border border-accent/20 flex items-center justify-center shadow-lg relative overflow-hidden"
                      >
                        <div className="absolute inset-0 grid-overlay opacity-10 mix-blend-overlay"></div>
                        <div className="text-center space-y-4 relative z-10">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border border-accent/30 shadow-md">
                            <Zap className="w-8 h-8 text-accent" />
                          </div>
                          <p className="text-lg font-bold">Multi-Agent</p>
                          <p className="text-xs text-muted font-mono">Seamless Coordination</p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-balance">Powerful Features</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Everything you need to build faster, test smarter, and automate your workflow
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {featureCards.map((feature, index) => {
              const Icon = feature.icon
              const isAmber = feature.accent === "amber"
              
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`group relative rounded-xl p-8 border transition-all duration-300 bg-card hover:bg-hover ${
                    isAmber ? "border-border hover:border-amber/60" : "border-border hover:border-accent/50"
                  }`}
                >
                  {/* Subtle background glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-${isAmber ? 'amber' : 'accent'}/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10`} />

                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isAmber ? "bg-amber/10 border border-amber/30 group-hover:border-amber/60" : "bg-accent/10 border border-accent/30 group-hover:border-accent/60"
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isAmber ? "text-amber-500" : "text-accent"}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 transition-colors ${isAmber ? 'group-hover:text-amber-500' : 'group-hover:text-accent'}`}>
                        {feature.title}
                      </h3>
                      <p className="text-muted leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center bg-card p-12 rounded-3xl border border-border"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Ready to revolutionize your development workflow?
            </h2>
            <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
              Join developers who are already experiencing the power of unified, intelligent automation.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/login")}
              className="brain-btn px-10 py-4 text-lg font-semibold inline-flex items-center gap-2 shadow-lg"
            >
              Get Started Today <Zap className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-border bg-card/30 transition-colors duration-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-muted text-sm">
          <div>© 2026 BrainDesk AI. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <button
              onClick={() => window.open("https://github.com", "_blank")}
              className="hover:text-foreground transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4" /> GitHub
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}