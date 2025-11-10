import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../utils/uploader.js';
import Post from '../models/Post.js';
import { analyzeText } from '../services/sentiment.js';
import { imageHasHuman } from '../services/humanDetector.js';
import Star from '../models/Star.js'; // ✅ add this line
import User from '../models/User.js'; // ✅ required for /feed route
import mongoose from "mongoose";


const router = express.Router();

// Create post (text / image / voice)
router.post('/', requireAuth, upload.single('media'), async (req, res) => {
  try {
    const { kind, text } = req.body;
    if (!['text','image','voice'].includes(kind)) {
      return res.status(400).json({ error: 'Invalid kind' });
    }
    let mediaUrl = null;
    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
    }
if (kind === 'image' && req.file) {
  const absPath = req.file.path;
  const hasHuman = await imageHasHuman(absPath);
  if (hasHuman) {
    return res.status(400).json({ error: "Human faces are not allowed" });
  }
}


    const sentiment = analyzeText(text || '');
    const post = await Post.create({
  author: req.user._id,
  kind,
  text,
  mediaUrl,
  sentiment,
  starPosition: {
    x: Math.random() * 1920,
    y: Math.random() * 1080,
  },
});

    // ⭐ Automatically create a star entry for voice posts
if (kind === 'voice') {
  await Star.create({
    postId: post._id,      // real MongoDB ObjectId
    userId: req.user._id,  // real MongoDB ObjectId
    brightness: 1,
    createdAt: new Date()
  });
}

    res.json(post);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get feed (all posts, newest first). Optional kind filter.
router.get('/', requireAuth, async (req, res) => {
  const { kind } = req.query;
  const filter = {};
  if (kind && ['text','image','voice'].includes(kind)) filter.kind = kind;
  const posts = await Post.find(filter).sort({ createdAt: -1 }).limit(200).lean();
  res.json(posts);
});

// Support a voice post (Echo star brighter)
router.post('/:id/support', requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  if (post.kind !== 'voice') return res.status(400).json({ error: 'Support only for voice posts' });
  post.supportCount += 1;
  await post.save();
  res.json({ ok: true, supportCount: post.supportCount });
});



// Fetch recommended posts based on sentiment
router.get("/feed/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    const posts = await Post.find().sort({ createdAt: -1 });
    let filtered = posts;

    // If user's mood is negative, show positive posts first
    if (posts.length) {
      const recentPosts = await Post.find({ userId }).sort({ createdAt: -1 }).limit(5);
      const mood =
        recentPosts.filter(p => p.sentiment === "negative").length >
        recentPosts.filter(p => p.sentiment === "positive").length
          ? "negative"
          : "positive";

      if (mood === "negative") {
        filtered = posts.filter(p => p.sentiment === "positive");
      }
    }

    res.json(filtered);
  } catch (err) {
    console.error("Error fetching feed:", err);
    res.status(500).json({ error: "Failed to fetch feed" });
  }
});

function containsHuman(image) {
  // TODO: integrate face detection later
  return false; // temporarily disable blocking for testing
}

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  kind: { type: String, enum: ["text", "image", "voice"], required: true },
  text: String,
  mediaUrl: String, // <-- stores uploaded audio/image path
  sentiment: String,
  supportCount: { type: Number, default: 0 },
}, { timestamps: true });

// 🌌 Get all voice posts for Echo Chamber stars
router.get("/voices", async (req, res) => {
  try {
    const voicePosts = await Post.find({ kind: "voice" })
      .select("mediaUrl author createdAt starPosition")
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json(voicePosts);
  } catch (err) {
    console.error("Error fetching voice posts:", err);
    res.status(500).json({ error: "Failed to fetch voice posts" });
  }
});

// ❤️ Like / Unlike a post
router.post("/:id/like", requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  const userId = req.user._id;

  const alreadyLiked = post.likes.includes(userId);
  if (alreadyLiked) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);
  }

  await post.save();
  res.json({ liked: !alreadyLiked, likeCount: post.likes.length });
});

// 💬 Add a comment
router.post("/:id/comment", requireAuth, async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === "")
    return res.status(400).json({ error: "Comment cannot be empty" });

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  post.comments.push({
    user: req.user._id,
    text,
  });
  await post.save();

  res.json({ message: "Comment added", comments: post.comments });
});


export default router;

