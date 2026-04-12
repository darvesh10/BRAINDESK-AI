# 🎨 BrainDesk AI Frontend

### A Modern AI Workspace UI for Multi-Agent Systems

---

## 🚀 Overview

The BrainDesk AI Frontend is a **modern, interactive developer workspace UI** built with Next.js. It enables seamless interaction with a powerful multi-agent backend system, allowing users to perform tasks like API testing, GitHub automation, and knowledge retrieval — all through a single chat interface.

This frontend focuses on **developer experience, smooth UX, and intelligent interaction design**.

---

## ⚙️ Key Features

### 💬 Unified Chat Interface

* Single chat interface to interact with all AI agents
* Supports Markdown rendering for structured AI responses
* Real-time typing indicators and smooth message animations

---

### 🧠 Multi-Agent Interaction (via Backend)

* Automatically routes queries to:

  * RAG Agent (knowledge)
  * QA Agent (API testing)
  * GitHub Agent (automation)
  * Assistant Agent (general queries)

👉 Frontend sends user input → backend handles agent orchestration

---

### 📂 File Upload System

* Upload up to 2 files (PDF/Text)
* Files are processed via backend RAG pipeline
* Injects system context for AI understanding

Example:

```
[System Context: User has uploaded files...]
```

---

### 🗂️ Chat History Management

* View all past chats
* Load previous conversations
* Delete chats dynamically

---

### 🔗 GitHub Integration

* Connect GitHub via OAuth
* Enables AI-powered code automation
* Visual status: Connected / Not Connected

---

### 🎨 Advanced UI/UX

* Smooth animations (Framer Motion)
* Responsive design
* Sidebar navigation
* Agent hint cards for better UX

---

### 🌗 Theme System

* Supports 3 modes:

  * Light
  * Dim
  * Dark
* Persisted using localStorage

---

## 🧩 Pages Overview

### 🏠 Landing Page

* Explains product vision and features
* Animated sections with storytelling
* CTA for onboarding

---

### 🔐 Auth Page

* Login / Register system
* Google OAuth integration
* Clean SaaS-style UI

---

### 💬 Chat Page (Core)

* Main AI interaction interface
* Handles:

  * Chat messages
  * File uploads
  * GitHub connection
  * Session management

---

### 🚀 Updates Page

* Displays upcoming features
* Shows product roadmap
* Enhances product storytelling

---

## 🔌 API Integration

* Axios-based API layer
* Centralized configuration
* Cookie-based authentication

### Special Features:

* `withCredentials: true` for cookies
* Token auto-injection via interceptor

---

## 🏗️ Architecture

```
User → UI (Next.js Frontend)
     → API Layer (Axios)
     → Backend (Express)
     → Multi-Agent System
     → Response → UI Render
```

---

## 🧰 Tech Stack

### Frontend Framework

* Next.js (App Router)

### Styling

* Tailwind CSS

### Animations

* Framer Motion

### Icons

* Lucide React

### API Communication

* Axios

---

## 🧠 Design Principles

* **Chat-first UX** → Everything happens in one interface
* **Minimal context switching** → No multiple dashboards
* **Agent abstraction** → User doesn’t need to know internal system
* **Developer-focused design** → Clean, fast, and intuitive

---

## 🧪 Example Use Cases

* 💬 Ask coding questions
* 📄 Upload PDF and query it
* 🔍 Analyze YouTube content (via backend)
* 🧪 Test backend APIs
* 🐙 Automate GitHub tasks

---

## 🚀 Getting Started

### 1. Install dependencies

```
npm install
```

### 2. Run development server

```
npm run dev
```

### 3. Open in browser

```
http://localhost:3000
```

---

## 🔮 Future Enhancements

* Voice-based interaction
* Real-time streaming responses
* Advanced UI dashboards
* Multi-agent visualization

---

## 👨‍💻 Author

**Darvesh Soni**

---

## ⭐ Final Note

This frontend is designed as a **next-generation developer interface**, combining AI, automation, and memory into a single seamless experience.

It transforms complex multi-agent systems into a **simple, intuitive chat-driven workflow**.

---

