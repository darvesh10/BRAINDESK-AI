import { ChatSession } from "../models/ChatSession.js";
import { triageAgent } from "../agents/triageAgent.js";
import { run } from "@openai/agents";
import { Memory } from "mem0ai/oss";

const mem0 = new Memory({
  version: "v1.1",
  embedder: {
    provider: "openai",
    config: {
      apiKey: process.env.OPENAI_API_KEY,
      model: "text-embedding-3-small",
    },
  },
  llm: {
    provider: "openai",
    config: {
      model: "gpt-4o-mini", // Sasta aur fast model
      apiKey: process.env.OPENAI_API_KEY,
    },
  },
});

//
export const createChatSession = async (req, res) => {
  try {
    const chat = await ChatSession.create({
      userId: req.user._id,
      title: "New Chat",
      messages: [],
    });
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const userIdStr = req.user._id.toString();

    const chat = await ChatSession.findOne({
      _id: chatId,
      userId: req.user._id,
    });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // 1️⃣ Save user message
    chat.messages.push({ role: "user", content: message });
    if (chat.messages.length === 1) {
      chat.title =
        message.length > 25 ? message.substring(0, 25) + "..." : message;
    }

    // 2️⃣ Quick Mem0 Search
    const searchResult = await mem0.search(message, {
      userId: userIdStr,
      limit: 5,
    });
    let relevantMemories = searchResult?.results || [];
    const memoryContext = relevantMemories.map((m) => m.memory).join("\n");

    // 3️⃣ Compile Context Prompt
    let contextPrompt =
      "You are a personalized assistant. Use the following retrieved facts about the user to answer accurately:\n";
    if (memoryContext) contextPrompt += `[User Facts]:\n${memoryContext}\n\n`;

    if (chat.messages.length > 2) {
      const recentHistory = chat.messages
        .slice(-3, -1)
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n");
      contextPrompt += `[Recent History]:\n${recentHistory}\n\n`;
    }

    contextPrompt += `[Current Message]: ${message}\n\n`;
    contextPrompt += `[SYSTEM NOTE: The current user's ID is "${userIdStr}". You MUST pass this exact ID to your tools when asked for 'userId'.]`;

const result = await run(triageAgent, contextPrompt);

// chatController.js mein run() ke baad
const finalReply = result.finalOutput;

// Array ka order badal do: Agent name pehle rakho
chat.messages.push({
  role: "assistant",
  content: finalReply,
});
    await chat.save();

    mem0
      .add(
        [
          { role: "user", content: message },
          { role: "assistant", content: finalReply },
        ],
        { userId: userIdStr },
      )
      .catch((e) => console.log("Mem0 warning:", e.message));

    return res.status(200).json(chat);
  } catch (error) {
    console.error("Agent Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

//get all chat sessions for user
export const getUserChats = async (req, res) => {
  try {
    const chats = await ChatSession.find({ userId: req.user._id }).sort({
      updatedAt: -1,
    });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get single chat session by id
export const getSingleChat = async (req, res) => {
  try {
    const chat = await ChatSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete chat
export const deleteChat = async (req, res) => {
  try {
    const chat = await ChatSession.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
