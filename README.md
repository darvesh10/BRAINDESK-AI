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

> **🚀 Watch the Demo:** [Watch on YouTube / Insert Video Link Here]

## ⚡ The Engineering Challenge

While powerful AI developer tools exist in the market, **BrainDesk AI was built as an intensive engineering playground** to deeply understand Agentic Architecture, Vector Databases, and secure external tool integrations (OAuth). 

Instead of relying on a single, monolithic LLM prompt that gets easily confused, BrainDesk utilizes a **Multi-Agent Orchestration** pattern. It breaks down complex developer tasks into isolated, highly specialized agents working under a central router.

---

## 🏗️ High-Level System Architecture

This flowchart represents the data flow of a user request. The **Triage Agent** acts as the gateway—it never answers queries directly. Instead, it analyzes the user's intent and autonomously routes the payload to the specific agent equipped with the right tools.

```mermaid
graph TD
    User([👨‍💻 User Request]) --> UI[Next.js Frontend]
    UI --> Backend[Express.js Backend]
    
    Backend --> Triage{🕵️ Master Triage Agent}
    
    Triage -->|Intent: Code/Repo| Git[🐙 GitHub Automator]
    Triage -->|Intent: API Test| QA[🧪 QA Automation Agent]
    Triage -->|Intent: PDF/Video/Search| RAG[📚 RAG Knowledge Agent]
    Triage -->|Intent: Chat| Normal[💬 Assistant Agent]

    Git --> |OAuth 2.0| GitHubAPI[(GitHub API)]
    QA --> |HTTP Requests| TargetServer[(Target Local APIs)]
    RAG --> |Vector Search| Qdrant[(Qdrant Vector DB)]