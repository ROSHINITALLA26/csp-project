import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', requireAuth, async (req, res) => {
  const u = req.user;
  res.json({ anonId: u.anonId, email: u.email || null, createdAt: u.createdAt, lastActiveAt: u.lastActiveAt });
});

export default router;
