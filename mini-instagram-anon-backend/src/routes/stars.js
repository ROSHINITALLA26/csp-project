import express from "express";
import mongoose from "mongoose";
import Star from "../models/Star.js";

const router = express.Router();

// Get all stars
router.get("/", async (req, res) => {
  try {
    const stars = await Star.find().lean();
    res.json(stars);
  } catch (err) {
    console.error("Error fetching stars:", err);
    res.status(500).json({ error: "Failed to fetch stars" });
  }
});

// Create star (optional)
router.post("/", async (req, res) => {
  try {
    const { postId, userId, brightness } = req.body;

    const star = await Star.create({
      postId: new mongoose.Types.ObjectId(postId),
      userId: new mongoose.Types.ObjectId(userId),
      brightness: brightness || 1,
      createdAt: new Date(),
    });

    res.json(star);
  } catch (err) {
    console.error("Error creating star:", err);
    res.status(500).json({ error: "Star creation failed" });
  }
});

export default router; // ✅ this line fixes the error
