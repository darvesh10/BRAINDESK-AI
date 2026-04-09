import { storeDocument } from "../services/ragService.js";

export const processRawText = async (text, title, userId) => {
  try {
    console.log(`\n[Text Tool] 🚀 Saving raw text document: "${title}"`);
    
    // Check if text is valid
    if (!text || text.trim().length < 10) {
        return { success: false, error: "Text is too short to save." };
    }

    // Ek unique Document ID banate hain title ke basis pe
    const safeTitle = title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const docId = `text-${safeTitle}-${Date.now()}`;

    // Seedha Qdrant mein store karo
    console.log("[Text Tool] Storing in Qdrant Vector DB...");
    const totalChunks = await storeDocument({ text, userId, docId });

    console.log(`[Text Tool] 🎉 Success! Saved ${totalChunks} chunks.`);
    return { success: true, docId, chunks: totalChunks };

  } catch (error) {
    console.error("[Text Tool] ❌ Error saving text:", error.message);
    return { success: false, error: "Failed to save text document." };
  }
};