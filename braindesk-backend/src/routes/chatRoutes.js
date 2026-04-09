import express from 'express';
import { createChatSession, sendMessage, getUserChats, getSingleChat,  deleteChat  } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/new",protect, createChatSession);
router.post("/message", protect, sendMessage);

router.get("/", protect, getUserChats);
router.get("/:id", protect, getSingleChat);

router.delete("/:id", protect, deleteChat);

export default router;