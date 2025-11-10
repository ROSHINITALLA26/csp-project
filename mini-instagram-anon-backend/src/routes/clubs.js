import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Club from "../models/Club.js";

const router = express.Router();

// Get all clubs
router.get("/", async (_req, res) => {
  const clubs = await Club.find().lean();
  res.json(clubs);
});

// Join / leave
router.post("/:id/toggle", requireAuth, async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) return res.status(404).json({ error: "Not found" });

  const idx = club.members.indexOf(req.user._id);
  if (idx === -1) club.members.push(req.user._id);
  else club.members.splice(idx, 1);
  await club.save();
  res.json({ joined: idx === -1 });
});

export default router;
