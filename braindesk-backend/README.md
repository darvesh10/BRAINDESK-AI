# BrainDesk AI 🧠 (Multi-Agent Hybrid Memory System)

An intelligent AI workspace that combines conversational agents, dual-layer long-term memory, Universal RAG, and live GitHub automation and api testing full automated into a single developer productivity platform.

---

## 📌 Vision
BrainDesk AI is designed to be the ultimate intelligent co-pilot for developers. It goes beyond a simple chatbot by integrating:
- **Multi-Agent Orchestration:** Specialized agents (Router, RAG, Automator) for complex task handling.
- **Dual-Layer Memory:** Implicit long-term semantic memory (Mem0) + Explicit knowledge base (Qdrant).
- **Live GitHub Automation:** OAuth 2.0 integrated agent capable of reading, writing, and managing repositories autonomously.
- **Universal RAG Pipeline:** Ingests and queries data from PDFs, YouTube videos, and raw text snippets.

---

## 🚀 Core Capabilities

### 🤖 The Tri-Agent Architecture
- **Triage (Router) Agent:** An LLM-based gateway that dynamically routes user queries to specialized agents without hardcoded `if/else` logic.
- **RAG Tutor Agent:** Parses user's uploaded documents and videos, enforcing a strict "Context vs. Explanation" response protocol.
- **Automator Action Agent:** Connects securely to GitHub APIs to read existing code, apply logical AI updates, and push commits directly to repos.

### 🧠 Dual-Layer Memory System
- **Implicit Memory (Mem0):** Automatically extracts and stores user preferences, technical stack, and conversational context across sessions.
- **Explicit Memory (Qdrant Vector DB):** High-performance semantic retrieval for heavy documents, PDFs, and chunked YouTube transcripts.

### 🌐 Secure Integrations
- **GitHub OAuth 2.0:** Secure, token-based authentication flow (No manual PAT copy-pasting).
- **Safety Guardrails:** Hardcoded AI boundaries preventing destructive actions (e.g., restricted from deleting entire repositories).

---

## 🏗️ System Architecture

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **API Gateway** | Express.js / Node.js | RESTful routing and middleware execution. |
| **Authentication** | JWT, bcrypt, Cookies/LocalStorage | Secure session management & API protection. |
| **Agent Orchestration**| OpenAI Agents SDK (`gpt-4o-mini`) | Autonomous decision-making and tool execution. |
| **Vector Database** | Qdrant | Fast semantic search for the RAG pipeline. |
| **Document Parsing** | pdfjs-dist, yt-dlp | Extracting text from complex formats. |

---

## 📊 Performance & Cost Optimization
- ✔ **Vector-based Recall:** Transitioned from full history injection to Top-K semantic recall, reducing LLM token costs by over 40% per request.
- ✔ **Granular File Updates:** GitHub Agent fetches specific file SHAs to perform targeted `PUT` updates instead of full repo overwrites.
- ✔ **ESM Compatibility:** Custom ESM-compatible PDF parsing to prevent Node.js memory leaks and dependency clashes.

---

## 📅 Development Timeline
- **Phase 1:** MongoDB Setup, JWT Auth, Bcrypt Hashing & User Isolation.
- **Phase 2:** OpenAI Agents SDK integration, Triage System & ChatSession persistence.
- **Phase 3:** Mem0 Long-term Memory & Qdrant Vector-based RAG setup.
- **Phase 4:** Universal Parsers (YouTube subtitles via `yt-dlp`, PDF parsing).
- **Phase 5 (Current):** **GitHub OAuth 2.0 & Automator Agent (Read/Push/Delete capabilities).**
- **Next:** Next.js Full-Stack UI Integration.

---

## 👨‍💻 Author
**Darvesh Soni** *Computer Science Engineering* *Focused on AI Systems, Agentic Architectures, and Full-Stack Development.*
