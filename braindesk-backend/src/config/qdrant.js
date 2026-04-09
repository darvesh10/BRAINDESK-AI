import { QdrantClient } from "@qdrant/js-client-rest";

export const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL || "http://localhost:6333",
    config:{
        checkCompatibility: false, // version mismatch ke issues ko ignore karne ke liye
    }
});

//ye function server start hone se pehle call karna hoga taki collection create ho jaye
export const initQdrant = async () =>{
    try{
        const collections = await qdrant.getCollections();
        const exists = collections.collections.some(c => c.name === "braindesk-rag");

       if (!exists) {
      await qdrant.createCollection("braindesk-rag", {
        vectors: {
          size: 1536, // text-embedding-3-small ka size
          distance: "Cosine", // Similarity check karne ka math formula
        },
      });
        console.log("Collection 'braindesk-rag' created successfully.");
        } else{
        console.log("Collection 'braindesk-rag' already exists.");
        }
    } catch (error) {
        console.error("Error initializing Qdrant:", error);
    }
}