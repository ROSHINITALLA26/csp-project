import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

function makeAnonId() {
  const adjectives = ['Calm','Bright','Kind','Brave','Quiet','Misty','Silver','Nova','Star','Echo'];
  const nouns = ['Comet','River','Sky','Dawn','Pulse','Beacon','Lumen','Quill','Leaf','Aurora'];
  const a = adjectives[Math.floor(Math.random()*adjectives.length)];
  const n = nouns[Math.floor(Math.random()*nouns.length)];
  const num = Math.floor(100 + Math.random()*900);
  return `${a}${n}${num}`;
}

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email: email || undefined, anonId: makeAnonId() });
    if (password) await user.setPassword(password);
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '14d' });
    res.json({ token, anonId: user.anonId });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await user.checkPassword(password || '');
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '14d' });
  res.json({ token, anonId: user.anonId });
});

export default router;
