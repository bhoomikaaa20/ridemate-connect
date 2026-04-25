import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import rideRoutes from "./routes/rideRoutes";



dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: "http://localhost:8080",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rides", rideRoutes);


app.listen(5000, () => console.log("Server running"));