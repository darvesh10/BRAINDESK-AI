import fs from "fs";
import path from "path";
import { storeDocument } from "../services/ragService.js";
import pkg from "yt-dlp-wrap";
import { YoutubeTranscript } from 'youtube-transcript'; // 👈 Naya backup import

const YTDlpWrap = pkg.default;
const ytDlp = new YTDlpWrap("./yt-dlp.exe");

function extractVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function cleanSubtitles(text) {
  return text
    .replace(/<[^>]+>/g, '') 
    .replace(/^[0-9:\.,\->\s]+$/gm, '') 
    .replace(/WEBVTT/g, '') 
    .replace(/Kind: captions/g, '')
    .replace(/Language: en/g, '')
    .replace(/\n+/g, ' ') 
    .trim();
}

export const processYouTubeVideo = async (videoUrl, userId) => {
  const videoId = extractVideoId(videoUrl);
  if (!videoId) return { success: false, error: "Invalid YouTube URL." };

  const baseFileName = `temp_subs_${videoId}`;
  const filePath = path.join(process.cwd(), `${baseFileName}.en.vtt`);

  try {
    console.log(`\n[YouTube Tool] 🚀 Attempting yt-dlp for: ${videoId}`);

  await ytDlp.execPromise([
  `https://www.youtube.com/watch?v=${videoId}`,
  "--skip-download",
  "--write-auto-sub",
  "--sub-lang", "en",
  "--no-check-certificates", 
  "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36", // 👈 browser mimick karo
  "-o", baseFileName
]);

    if (!fs.existsSync(filePath)) {
      throw new Error("yt-dlp file not found");
    }

    const rawText = fs.readFileSync(filePath, "utf-8");
    const cleanText = cleanSubtitles(rawText);
    fs.unlinkSync(filePath);

    console.log(`[YouTube Tool] 🎉 yt-dlp Success! Extracted ${cleanText.length} chars.`);
    const totalChunks = await storeDocument({ text: cleanText, userId, docId: `yt-${Date.now()}` });
    return { success: true, docId: `yt-${Date.now()}`, chunks: totalChunks };

  } catch (error) {
    console.warn(`[YouTube Tool] ⚠️ yt-dlp failed (Rate Limited?). Switching to backup library...`);

    // KACHRA SAAF KARO: Agar yt-dlp ne koi adhi-adhuri file chhodi hai toh delete karo
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    try {
      // 🔥 FALLBACK: Simple library use karo jo browser-like request maarti hai
      const transcriptConfig = await YoutubeTranscript.fetchTranscript(videoId);
      const fallbackText = transcriptConfig.map(t => t.text).join(' ');

      if (fallbackText.length < 10) throw new Error("Transcript too short");

      console.log(`[YouTube Tool] ✅ Backup Library Success! Extracted ${fallbackText.length} chars.`);
      const totalChunks = await storeDocument({ text: fallbackText, userId, docId: `yt-${Date.now()}` });
      return { success: true, docId: `yt-${Date.now()}`, chunks: totalChunks };

    } catch (fallbackError) {
      console.error("[YouTube Tool] ❌ All methods failed:", fallbackError.message);
      return { success: false, error: "YouTube blocked both methods. Please try a different video or try again later." };
    }
  }
};











// import { YoutubeTranscript } from "youtube-transcript";
// import { getSubtitles } from "youtube-captions-scraper"; // Hum isko as a backup use karenge
// import { storeDocument } from "../services/ragService.js";

// // Video ID Extractor
// function extractVideoId(url) {
//   const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
//   const match = url.match(regex);
//   return match ? match[1] : url;
// }

// export const processYouTubeVideo = async (videoUrl, userId) => {
//   try {
//     console.log(`\n[YouTube Tool] 🚀 Starting process for: ${videoUrl}`);
//     const videoId = extractVideoId(videoUrl);
//     console.log(`[YouTube Tool] Extracted ID: ${videoId}`);
    
//     let transcriptText = "";

//     // ==========================================
//     // ENGINE 1: Try `youtube-transcript` package
//     // ==========================================
//     try {
//       console.log("[YouTube Tool] ⚙️ Running Engine 1 (youtube-transcript)...");
//       const ytTranscript = await YoutubeTranscript.fetchTranscript(videoId);
      
//       if (ytTranscript && ytTranscript.length > 0) {
//         transcriptText = ytTranscript.map(t => t.text).join(" ");
//         console.log("[YouTube Tool] ✅ Engine 1 Success!");
//       } else {
//         console.log("[YouTube Tool] ⚠️ Engine 1 returned 0 length. Moving to Engine 2.");
//       }
//     } catch (err) {
//       console.log("[YouTube Tool] ⚠️ Engine 1 Failed:", err.message);
//     }

//     // ==========================================
//     // ENGINE 2: Try `youtube-captions-scraper` (The Fallback)
//     // ==========================================
//     if (!transcriptText || transcriptText.trim() === "") {
//       console.log("[YouTube Tool] ⚙️ Running Engine 2 (youtube-captions-scraper)...");
      
//       // YouTube pe commonly ye 3 language codes use hote hain English ke liye
//       const langsToTry = ['en', 'a.en', 'en-US']; 
      
//       for (const lang of langsToTry) {
//         try {
//           console.log(`[YouTube Tool] Searching for language: '${lang}'...`);
//           const captions = await getSubtitles({ videoID: videoId, lang: lang });
          
//           if (captions && captions.length > 0) {
//             transcriptText = captions.map(c => c.text).join(" ");
//             console.log(`[YouTube Tool] ✅ Engine 2 Success with language: '${lang}'!`);
//             break; // Text mil gaya, loop roko
//           }
//         } catch (e) {
//           console.log(`[YouTube Tool] Language '${lang}' not found.`);
//         }
//       }
//     }

//     // ==========================================
//     // FINAL CHECK & SAVE TO QDRANT
//     // ==========================================
//     if (!transcriptText || transcriptText.trim() === "") {
//       return { 
//         success: false, 
//         error: "Could not find any English captions (manual or auto-generated) for this video." 
//       };
//     }

//     console.log(`[YouTube Tool] 🎉 Total Text Extracted: ${transcriptText.length} characters.`);
//     const docId = `yt-${Date.now()}`;

//     // Vector DB mein daalna
//     console.log("[YouTube Tool] Saving to Qdrant Vector DB...");
//     const totalChunks = await storeDocument({ text: transcriptText, userId, docId });

//     return { success: true, docId, chunks: totalChunks };

//   } catch (error) {
//     console.error("[YouTube Tool] ❌ Fatal Error:", error.message);
//     return { success: false, error: "System encountered a fatal error while fetching the video." };
//   }
// };






// import {getSubtitles} from "youtube-captions-scraper";  
// import { storeDocument } from "../services/ragService.js";


// function extractVideoId(url){
//      const regex =
//     /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
//     const match = url.match(regex);
//     return match ? match[1] : null;
// };

// export const processYouTubeVideo = async (videoUrl, userId) => {
// try{
//   const videoId = extractVideoId(videoUrl);
//   if(!videoId){
//     return { success: false, error: "Invalid YouTube video URL." };
//   }

// const captions = await getSubtitles({
//   videoID: videoId,
//   lang: "en",
// });

// console.log("captions length", captions.length);

// if(!captions || captions.length === 0){
//   return {
//     success: false,
//     error : "No cations found for this video"
//   };
// }

// const text = captions.map((c) => c.text).join(" "); //
// const docId = `yt-${Date.now()}`;

// const totalChunks = await storeDocument({
//   text,
//   userId,
//   docId
// });

// return {
//   success: true,
//   docId,
//   chunks: totalChunks,
// }

// } catch(error){
//   console.error("Error processing YouTube video:", error);
//   return {
//     success: false,
//     error: "Failed to process YouTube video"
//   };
// }
// };