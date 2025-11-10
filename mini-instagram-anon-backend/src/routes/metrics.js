import express from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import { getReminderMetrics } from '../services/reminders.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const [users, posts, comments, voice] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
    Comment.countDocuments(),
    Post.countDocuments({ kind: 'voice' }),
  ]);
  res.json({ users, posts, comments, voice, reminders: getReminderMetrics() });
});

export default router;
