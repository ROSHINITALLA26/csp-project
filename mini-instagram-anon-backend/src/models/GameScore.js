import mongoose from "mongoose";

const gameScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  gameName: String,
  score: Number,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("GameScore", gameScoreSchema);
