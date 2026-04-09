import "./config/env.js";
import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import { connectDB } from './config/db.js';
import { initQdrant } from './config/qdrant.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';  
import chatRoutes from './routes/chatRoutes.js';  
import documentRoutes from './routes/documentRoutes.js';

const app = express();

const originURL = process.env.FRONTEND_URL;

app.use(cors({
  origin: originURL,    
  credentials: true,    
}));

app.use(cookieParser());



app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/documents', documentRoutes);

connectDB();
initQdrant(); // Qdrant collection initialize karne ke liye

app.get('/',(req,res)=>{
    res.send('braindesk ai is running 🚀 hloo')
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});