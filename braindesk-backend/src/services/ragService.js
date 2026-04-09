import OpenAI from "openai";
import { qdrant } from "../config/qdrant.js";
import crypto from "crypto"; // unique id generate karne ke liye, docId ke liye use karenge

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

//text ko vector me convert karne ke liye
export async function embedText(text) {
const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
});
return response.data[0].embedding;
}

// bade text ko chunks me convert karne ke liye
export function chunkText(text, chunkSize = 800, overlap = 100) {
    const chunks = [];
    let start = 0;
    while (start<text.length) {
       const end = start + chunkSize;
       chunks.push(text.slice(start, end));
         start += chunkSize - overlap; // overlap ke liye thoda peeche jate hain
    }
   return chunks;
}

// Qdrant me vector store karne ke liye
export async function storeDocument({text, userId, docId}) {
 const chunks = chunkText(text);

    for (let i=0; i<chunks.length; i++) {
        const embedding = await embedText(chunks[i]);

        await qdrant.upsert("braindesk-rag", {
            wait: true,
            points: [{
                id: crypto.randomUUID(), // unique id har chunk ke liye
                vector: embedding,
                payload: {
                    userId,
                    docId, // same docId har chunk me, taaki pata chale ye chunks ek hi document se belong karte hain
                    text: chunks[i],
                },
            }],
        });
    }
    console.log("[RAG Service] Storing document...", chunks.length, "chunks successfully!");
    return chunks.length;
}


//question ke basis pe relevant chunks retrieve karne ke liye

export async function askDocument({question, userId }) {
    const queryVector = await embedText(question);
    const searchResult = await qdrant.search("braindesk-rag", {
    vector: queryVector,
    limit: 5, // top 5 relevant chunks
    filter: {
        must: [
            {key: "userId", match: {value: userId}},
        ],
    },
    });

//llm ke liye relevant chunks ko concatenate karna

const context = searchResult.map(r => r.payload.text).join("\n---\n");
return context;
}