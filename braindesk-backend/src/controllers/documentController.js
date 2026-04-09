import { processPdfDocument } from "../tools/pdfTool.js";

export const uploadPdfFile = async (req, res) => {
try{
    if(!req.file){
        return res.status(400).json({message:"No file uploaded"});
    }
    const userIdStr = req.user._id.toString();
    const fileName = req.file.originalname;
    const fileBuffer = req.file.buffer;

    // PDF ko process karo
    const result = await processPdfDocument(fileBuffer, fileName, userIdStr);
    if(!result.success){
 return res.status(400).json({message: result.error});
}
    if(result.success){
        res.status(200).json({message:"PDF processed and stored successfully", docId: result.docId, chunks: result.chunks});
    }
} catch (error) {
    console.error("Error in uploadPdfFile:", error);
    res.status(500).json({ success: false, message:"Failed to process the PDF file", error: error.message});
}
};