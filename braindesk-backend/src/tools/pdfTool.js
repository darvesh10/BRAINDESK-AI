import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { storeDocument } from "../services/ragService.js";

export const processPdfDocument = async (pdfBuffer, fileName, userId) => {
  try {
    console.log(`[PDF Tool] Extracting text from ${fileName}`);

const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer) });
    const pdf = await loadingTask.promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const pageText = content.items.map(item => item.str).join(" ");
      fullText += pageText + "\n";
    }

    if (!fullText.trim()) {
      return { success: false, error: "No text found in PDF" };
    }

    const docId = `pdf-${Date.now()}`;

    const totalChunks = await storeDocument({
      text: fullText,
      userId,
      docId
    });

    return { success: true, docId, chunks: totalChunks };

  } catch (err) {
    console.error("PDF error:", err);
    return { success: false, error: "Failed to parse PDF" };
  }
};