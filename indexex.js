import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import { UserRouter } from './routes/user.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}));

app.use(cookieParser());

app.use('/auth', UserRouter);


// ✅ MongoDB Atlas connection
mongoose.connect("mongodb+srv://menyagaseid2:menyaga123@cluster0.a2odlnu.mongodb.net/authentication?retryWrites=true&w=majority")
.then(()=>console.log("MongoDB Atlas connected"))
.catch(err=>console.log("MongoDB error:", err));



app.get('/', (req, res) => res.send("application is listening"));


// ✅ Fix PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});