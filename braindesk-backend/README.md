# 🧠 BrainDesk AI - Backend Orchestrator

This is the core intelligence engine of BrainDesk AI. It is a Node.js/Express application that manages multi-agent orchestration, RAG (Retrieval-Augmented Generation), and secure integration with external tools like GitHub and YouTube.

---

## 🏗️ Backend Architecture Overview

The backend follows a strict **Modular & Controller-Agent-Tool** pattern to prevent tight coupling and ensure high scalability.

### 1. Controllers (The Gateways)
*   **`chatController.js`** 🔥: Manages the active chat stream. It intercepts the user message, queries **Mem0** for long-term user facts, builds the context prompt, executes the `triageAgent`, and saves the response.
*   **`authController.js`**: Handles standard Register/Login/Logout along with OAuth 2.0 (GitHub & Google) utilizing secure `httpOnly` cookies and JWT.
*   **`documentController.js`**: Specifically handles PDF uploads and routes them to the PDF parser tool.

### 2. Services (The Infrastructure)
*   **`ragService.js`** 🔥🔥: The backbone of our knowledge system. It handles chunking text, generating vectors via OpenAI (`text-embedding-3-small`), storing them in **Qdrant**, and performing ANN (Approximate Nearest Neighbor) searches.

---

## 🤖 The Multi-Agent Ecosystem

BrainDesk Backend does not rely on a single prompt. It orchestrates specialized agents using strict domain rules.

### 1. 🕵️ Triage Agent (The Core Router)
*   **Purpose:** Decides which agent handles the request.
*   **Rule:** It *never* answers queries directly. It strictly delegates tasks (YouTube/PDFs -> RAG Agent, APIs -> QA Agent, Code -> Automator Agent).

### 2. 🧪 QA Agent
*   **Purpose:** Automated API testing.
*   **Smart Feature:** It chains stateful requests (Register -> Login) and dynamically generates randomized emails to avoid database duplicate errors.
*   **Anti-Loop Mechanism:** To prevent infinite loops or burning API tokens, it stops immediately if the target server throws a 500 error.

### 3. 📚 RAG Agent
*   **Purpose:** Context retrieval and data saving.
*   **Rule:** Strict instructions to stop if YouTube fails and *never* hallucinate or make up fake answers.

### 4. 🐙 Automator Agent (GitHub AI)
*   **Rule:** It can read, update, or create files via push. However, a hardcoded guardrail strictly forbids this agent from deleting repositories.

---

## 🛠️ Specialized Tools (The Arms of the AI)

Agents cannot interact with the real world without tools. These custom JavaScript tools execute the heavy lifting:

### 1. API Testing Tool ⚙️
*   **Masterstroke Logic:** Uses Axios with `validateStatus: () => true`. This overrides default error throwing on 4xx/500 status codes, preventing server crashes and allowing the AI to read the raw error response payload.

### 2. YouTube Transcript Tool 🎥
*   **2-Layer Extraction:** First tries `yt-dlp` for auto-generated subtitles. If that fails, it falls back to the `youtube-transcript` library to ensure high reliability.

### 3. PDF & Text Tools 📄
*   Uses `pdfjs` to extract text from pages, chunks the clean text, and calls the RAG service to store it directly in Qdrant.

---


## 🔐 Security Highlights

* HTTP-only cookies
* Password hashing (bcrypt)
* OAuth integrations
* No destructive GitHub actions (repo delete restricted)

---

## 📂 Project Structure (Simplified)

```
/controllers   → Auth, Chat, Document logic  
/agents        → AI agents (Triage, QA, RAG, etc.)  
/tools         → GitHub, API tester, YouTube, PDF  
/services      → RAG logic (embeddings, Qdrant)  
/routes        → API routes  
/config        → DB & environment setup  
```

---

## 🚀 Getting Started

### 1. Install dependencies

```
npm install
```

### 3. Run the server

```
npm run dev
```

---

## 🔮 Future Improvements

* Multi-agent collaboration chains
* UI for agent workflows
* Advanced memory tuning
* Autonomous debugging agent

---


