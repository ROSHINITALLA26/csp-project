import express from "express";
import { requireAuth } from "../middleware/auth.js";
import GameScore from "../models/GameScore.js";

const router = express.Router();

// Save score
router.post("/score", requireAuth, async (req, res) => {
  const { gameName, score } = req.body;
  await GameScore.create({ userId: req.user._id, gameName, score });
  res.json({ ok: true });
});

// Leaderboard
router.get("/leaderboard/:gameName", async (req, res) => {
  const scores = await GameScore.find({ gameName: req.params.gameName })
    .sort({ score: -1 })
    .limit(10)
    .populate("userId", "username")
    .lean();
  res.json(scores);
});

export default router;
