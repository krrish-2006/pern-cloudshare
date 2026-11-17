import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import fileRoutes from "./routes/files.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server is working"));