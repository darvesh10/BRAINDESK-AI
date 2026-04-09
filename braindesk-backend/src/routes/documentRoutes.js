import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { uploadPdfFile } from '../controllers/documentController.js'; // Jo controller humne upar banaya tha

const router = express.Router();

// Multer config: File ko disk pe save karne ki jagah RAM (memory) mein rakho, fast hota hai
const upload = multer({ storage: multer.memoryStorage() });

// POST route for PDF upload
router.post("/upload-pdf", protect, upload.single("document"), uploadPdfFile);

export default router;