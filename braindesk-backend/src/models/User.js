import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    techStack:{
        type:[String],
        default:[],
    },
    githubToken:{
        type:String,
        default: null, // Default null rahega jab tak user connect na kare
    },
},{
    timestamps:true,
});

export const User = mongoose.model("User",userSchema);