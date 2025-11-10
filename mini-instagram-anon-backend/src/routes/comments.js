import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { blockProfanity } from '../middleware/profanity.js';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

const router = express.Router();

router.post('/', requireAuth, blockProfanity, async (req, res) => {
  const { postId, text } = req.body;
  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const c = await Comment.create({ post: post._id, author: req.user._id, text });
  res.json(c);
});

router.get('/:postId', requireAuth, async (req, res) => {
  const items = await Comment.find({ post: req.params.postId }).sort({ createdAt: 1 }).lean();
  res.json(items);
});

export default router;
