import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Post from '../models/Post.js';

const router = express.Router();

// Return voice posts as "stars" (minimal fields)
router.get('/stars', requireAuth, async (req, res) => {
  const voices = await Post.find({ kind: 'voice' }).select('_id mediaUrl supportCount createdAt').lean();
  res.json({
    count: voices.length,
    stars: voices.map(v => ({
      id: v._id,
      audio: v.mediaUrl,
      support: v.supportCount,
      createdAt: v.createdAt
    }))
  });
});

export default router;
