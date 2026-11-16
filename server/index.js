import "dotenv/config";
import pool from "./db.js";
import express from 'express';
import cors from "cors";
import authRoutes from "./routes/auth.js";
import auth from "./middleware/auth.js"

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.get("/api/test", auth, (req, res) =>
  res.json({ message: "You are in!", user: req.user }),
);



app.listen(5000,() => console.log("Server is working"));