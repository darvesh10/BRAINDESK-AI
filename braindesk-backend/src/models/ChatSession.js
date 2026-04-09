import mongoose from "mongoose";
 const messageSchema = new mongoose.Schema({
    role:{
        type:String,
        enum: ["user","assistant","system"],
        required:true
    },
    reasoning: [String],
    content: {
        type:String,
        required:true,
    },
 },{timestamps:true});

 const chatSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        default: 'New Chat',
    },
    messages: [messageSchema],
 },{timestamps:true});

   export const ChatSession = mongoose.model('ChatSession', chatSessionSchema);