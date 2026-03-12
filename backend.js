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

// ✅ Non-SRV MongoDB Atlas connection
/**mongoose.connect(
  "mongodb://menyagaseid2:menyaga123@cluster0-shard-00-00.a2odlnu.mongodb.net:27017,cluster0-shard-00-01.a2odlnu.mongodb.net:27017,cluster0-shard-00-02.a2odlnu.mongodb.net:27017/authentication?ssl=true&replicaSet=atlas-8tns1b-shard-0&authSource=admin&retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB Atlas connected"))
.catch(err => console.log("MongoDB error:", err));
**/
mongoose.connect(
"mongodb+srv://menyagaseid2:YOUR_PASSWORD@cluster0.a2odlnu.mongodb.net/authDB?retryWrites=true&w=majority"

)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log("MongoDB error:", err));
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send("application is listening"));

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});