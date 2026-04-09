<div align="center">
  
  # 🧠 BrainDesk AI
  
  **A Unified, Multi-Agent AI Workspace for Developers**
  
  [![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](#)
  [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](#)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)
  [![Qdrant](https://img.shields.io/badge/Qdrant-Vector_DB-blue?style=for-the-badge)](#)
  [![OpenAI](https://img.shields.io/badge/OpenAI-Agents-412991?style=for-the-badge&logo=openai&logoColor=white)](#)

</div>

<br/>

> **🚀 Watch the Full Demo Video:** [Link to your YouTube/Drive Video here]

## ⚡ The Problem vs. The Solution

As developers, we constantly context-switch. We write code in our IDE, push to GitHub, test APIs in Postman, and ask questions on ChatGPT. This fragmentation breaks the flow state. 

**BrainDesk AI** is an experimental architecture built to solve this. It is a stateful, agentic workspace where specialized AI agents autonomously handle domain-specific tasks (API Testing, Git operations, RAG-based context retrieval) while you stay in one unified interface.

---

## 🏗️ High-Level System Architecture

BrainDesk doesn't use a massive, confused LLM. It uses a **Multi-Agent Orchestration** pattern. A central Gateway (Triage Agent) intercepts the user's prompt and routes it to the most capable specialized agent.

```mermaid
graph TD
    User([👨‍💻 User]) --> |Prompt / File Upload| UI[Next.js Frontend]
    UI --> |REST API| Gateway[Express.js Backend]
    
    Gateway --> |Intent Analysis| Triage[🕵️ Master Triage Agent]
    
    Triage --> |"Test this endpoint"| QA[🧪 QA Automation Agent]
    Triage --> |"Push this code"| Git[🐙 GitHub Automator Agent]
    Triage --> |"Summarize this PDF/Video"| RAG[📚 RAG Tutor Agent]
    Triage --> |"General Chat"| Normal[💬 Assistant Agent]

    QA --> |Executes HTTP Requests| TargetServer[(Target APIs)]
    Git --> |OAuth 2.0 Token| GitHubAPI[(GitHub API)]
    
    RAG --> |Embeddings Extraction| TextExtract[PDF / YouTube Parsers]
    TextExtract --> |HNSW / ANN Search| Qdrant[(Qdrant Vector DB)]
    
    Gateway --> |User Sessions| Mongo[(MongoDB)]

    classDef agent fill:#f9f,stroke:#333,stroke-width:2px;
    class Triage,QA,Git,RAG,Normal agent;
