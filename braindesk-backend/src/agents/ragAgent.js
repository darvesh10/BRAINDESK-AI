import { Agent, tool } from "@openai/agents";
import { z } from "zod";
import { processYouTubeVideo } from "../tools/youtubeTool.js";
import { processRawText } from "../tools/textTool.js";
import { askDocument } from "../services/ragService.js";

// 1. YouTube Save Tool Fix
export const save_youtube_video_tool = tool({
    name: "save_youtube_video",
    description: "Fetch transcript from a YouTube video and store it in the knowledge base.",
    parameters: z.object({
        // .url() hata diya kyunki OpenAI iske 'uri' format se chidta hai
        url: z.string(), 
        userId: z.string()
    }),
    async execute({ url, userId }) {
        console.log(`[RAG Agent Tool] Executing save for: ${url}`);
        const res = await processYouTubeVideo(url, userId);
        return res.success 
            ? `Success! Video saved. Document ID: ${res.docId}. Total chunks: ${res.chunks}.`
            : `Failed: ${res.error}`;
    }
});

//naya tool for raw text;
export const save_raw_text_tool = tool({
    name: "save_raw_text",
    description: "Save raw text, code snippets, or notes into the user's knowledge base.",
    parameters: z.object({
        text: z.string().describe("The actual text content, notes, or code to be saved."),
        title: z.string().describe("A short, descriptive title for the text."),
        userId: z.string()
    }),
    async execute({ text, title, userId }) {
        console.log(`[RAG Agent Tool] Executing text save for title: ${title}`);
        const res = await processRawText(text, title, userId);
        return res.success 
            ? `Success! Text saved. Document ID: ${res.docId}. Total chunks: ${res.chunks}.`
            : `Failed: ${res.error}`;
    }
});


// 2. Search Tool Fix
export const search_knowledge_tool = tool({
    name: "search_knowledge",
    description: "Search the user's saved documents and videos.",
    parameters: z.object({
        question: z.string(),
        userId: z.string()
    }),
    async execute({ question, userId }) {
        console.log(`[RAG Agent Tool] Searching Qdrant for: ${question}`);
        const context = await askDocument({ question, userId });
        return (context && context.trim() !== "") 
            ? context 
            : "No relevant document context found.";
    }
});

// 3. RAG Agent Definition
export const ragAgent = new Agent({
    name: "RAG Tutor Agent",
    model: "gpt-4o-mini",
   instructions: `
       You are the Knowledge Master. Your job is to save and retrieve information.

        🚨 **STRICT EXECUTION RULES:**
        1. **YouTube Workflow:**
           - First, ALWAYS call 'save_youtube_video'.
           - **CRITICAL:** If 'save_youtube_video' returns a "Failed" message, STOP IMMEDIATELY. Do not search and do not give a summary from old data. Tell the user: "Bhai, YouTube block kar raha hai, naya data nahi mil paya."
           - If and ONLY IF saving is successful, then call 'search_knowledge' to get the transcript for summary.

        2. **Search Logic:**
           - Use 'search_knowledge' only for the specific document just saved or if the user asks about past notes.
           - If the search returns nothing relevant to the CURRENT request, say you don't know.

        3. **Formatting:**
           - Use 3 clear bullet points for summaries.
           - If it fails, don't apologize too much, just state the technical error.
    `,
    tools: [save_youtube_video_tool, save_raw_text_tool, search_knowledge_tool]
});