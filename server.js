import dns from 'node:dns/promises';
 dns.setServers(["1.1.1.1", "8.8.8.8"])
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { UserRouter } from './routes/user.js';

dotenv.config();
const app = express();

app.use(express.json());

  
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-netlify-app.netlify.app"
  ],
  credentials: true
}));

app.use(cookieParser());
app.use('/auth', UserRouter);

// ---------- MONGODB CONNECTION ----------
const atlasUser = "menyagaseid2";       // your DB username
const atlasPass = encodeURIComponent("haruna123"); // URL-encoded password
const dbName = "authentication";

// Option 1: SRV connection (default)
const srvUri = `mongodb+srv://${atlasUser}:${atlasPass}@cluster0.a2odlnu.mongodb.net/${dbName}?retryWrites=true&w=majority`;

// Option 2: Non-SRV connection (fallback if SRV fails)
const nonSrvUri = `mongodb://${atlasUser}:${atlasPass}@cluster0-shard-00-00.a2odlnu.mongodb.net:27017,cluster0-shard-00-01.a2odlnu.mongodb.net:27017,cluster0-shard-00-02.a2odlnu.mongodb.net:27017/${dbName}?ssl=true&replicaSet=atlas-8tns1b-shard-0&authSource=admin&retryWrites=true&w=majority`;

async function connectDB() {
  try {
    await mongoose.connect(srvUri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log("✅ MongoDB Atlas connected (SRV)");

  } catch (err) {
    console.warn("⚠️ SRV connection failed, trying non-SRV fallback...");
    try {
      await mongoose.connect(nonSrvUri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
      });
      console.log("✅ MongoDB Atlas connected (Non-SRV fallback)");
    } catch (err2) {
      console.error("❌ MongoDB connection failed:", err2);
    }
  }
}
 
connectDB();
// ---------- BASIC ROUTES ----------
app.get('/', (req, res) => res.send("Application is listening"));

// ---------- SERVER ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});