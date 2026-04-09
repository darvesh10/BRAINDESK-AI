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

---

## 🦸‍♂️ The "Avengers" (Agent Capabilities)

BrainDesk AI consists of 5 specialized agents. Each agent is equipped with specific tools and strict instructions to handle a dedicated domain.

### 1. 🕵️ Master Triage Agent (The Router)
* **Role:** The brain of the operation. It never answers user queries directly.
* **Mechanism:** It analyzes the user's prompt (and any attached file contexts) and strictly routes the payload to the appropriate sub-agent. It enforces safety by preventing cross-domain confusion (e.g., stopping the GitHub agent from trying to read a PDF).

### 2. 📚 RAG Knowledge Agent (Semantic Memory)
* **Role:** Handles document ingestion and semantic information retrieval.
* **Mechanism:** When a user uploads a PDF or provides a YouTube link, this agent (via the backend) extracts the text, chunks it, and stores the embeddings in **Qdrant**. When asked a question, it uses the `search_knowledge` tool to perform Approximate Nearest Neighbor (ANN) search, ensuring it answers *only* from the user's context, mitigating LLM hallucinations.

### 3. 🧪 QA Automation Agent (The Tester)
* **Role:** Intelligent, stateful API testing.
* **Mechanism:** Capable of hitting both local (`localhost`) and production APIs. It doesn't just ping endpoints; it:
  1. Deduces the required JSON schema based on the endpoint name.
  2. Generates randomized test data (to avoid database duplication errors).
  3. **Chains Requests:** Registers a user, saves the credentials in memory, and immediately tests the Login API using those exact credentials.
  4. Generates a highly professional Markdown Test Report, catching edge cases and backend crashes (500 errors).

### 4. 🐙 GitHub Automator Agent (The DevOps Engineer)
* **Role:** Directly interacts with the user's GitHub repositories.
* **Mechanism:** Integrated via GitHub OAuth 2.0. By using custom tools (`github_read_file`, `github_push_file`), it can autonomously create, update, or delete specific files in a repository. 
* **Safety Guardrail:** Hardcoded instructions completely restrict the agent from deleting entire repositories, ensuring destructive actions are blocked.

### 5. 💬 BrainDesk Assistant (The Fallback)
* **Role:** Standard conversational agent for general programming queries, debugging raw code snippets, and casual interactions when no specific tools are required.

---