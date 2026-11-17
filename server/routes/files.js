import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import pool from "../db.js";
import auth from "../middleware/auth.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "Only image files are allowed!" });
    }
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const cloudResult = await cloudinary.uploader.upload(dataURI);
    const result = await pool.query(
      "INSERT INTO files(user_id,url,public_id,original_name)VALUES ($1, $2, $3, $4)",
      [
        req.user.id,
        cloudResult.secure_url,
        cloudResult.public_id,
        req.file.originalname,
      ],
    );
    res.status(201).json({ message: "File uploaded!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Couldn't upload" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM files WHERE user_id = $1", [
      req.user.id,
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Couldn't retrieve data" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM files WHERE id = $1 AND user_id = $2 ",
      [id, req.user.id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }
    const cloudResult = await cloudinary.uploader.destroy(
      result.rows[0].public_id,
    );
    const deleteResult = await pool.query("DELETE FROM files WHERE id=$1", [
      id,
    ]);
    res.json({ message: "File deleted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Couldn't delete data" });
  }
});

export default router;
