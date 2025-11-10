import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './src/routes/auth.js';
import postRouter from './src/routes/posts.js';
import commentRouter from './src/routes/comments.js';
import echoRouter from './src/routes/echo.js';
import clubRouter from './src/routes/clubs.js';
import profileRouter from './src/routes/profile.js';
import metricsRouter from './src/routes/metrics.js';
import { runDailyReminders } from './src/services/reminders.js';
import cron from "node-cron";
import { runRecommendationEngine } from "./src/utils/recommendationEngine.js";

import clubRoutes from "./src/routes/clubs.js";
import gameRoutes from "./src/routes/games.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Core middlewares
app.use(cors({ origin: process.env.ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Static files for uploaded media
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.join(__dirname, uploadDir)));

// Routes
app.get('/', (req, res) => {
  res.json({ ok: true, service: 'mini-instagram-anon-backend' });
});
app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);
app.use('/echo', echoRouter);
app.use('/clubs', clubRouter);
app.use('/profile', profileRouter);
app.use('/metrics', metricsRouter);
app.use("/uploads", express.static("uploads"));
app.use("/clubs", clubRoutes);
app.use("/games", gameRoutes);

// DB + server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mini_instagram_anon';

mongoose.connect(MONGO_URI).then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log('🚀 Server listening on', PORT);
  });
  runDailyReminders();
}).catch(err => {
  console.error('❌ MongoDB error:', err.message);
  process.exit(1);
});

// ✅ Schedule the daily sentiment check at 9 AM
cron.schedule("0 9 * * *", () => {
  console.log("🔁 Running daily sentiment check...");
  runRecommendationEngine();
});


import { analyzeSentiment } from "./src/utils/sentiment.js";

app.post("/posts", async (req, res) => {
  try {
    const { text, image, voice, userId } = req.body;
    
    // 1️⃣  Analyze sentiment (text only)
    const sentiment = text ? await analyzeSentiment(text) : "neutral";
    
    // 2️⃣  Save in DB
    const newPost = new Post({
      userId,
      text,
      image,
      voice,
      sentiment, // ✅ store sentiment
      createdAt: new Date(),
    });

    await newPost.save();

    res.json({ ok: true, post: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

import starRoutes from "./src/routes/stars.js";
app.use("/stars", starRoutes);

import Star from "./src/models/Star.js";


