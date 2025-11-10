import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  kind: { type: String, enum: ['text','image','voice'], required: true },
  text: { type: String },
  mediaUrl: { type: String },
  sentiment: { score: Number, comparative: Number, label: String },
  humanDetected: { type: Boolean, default: false },
  supportCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
    // 🪐 NEW: Store galaxy star position
  starPosition: {
    x: { type: Number, default: () => Math.random() * 1920 },
    y: { type: Number, default: () => Math.random() * 1080 },
  },

  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
},
{ timestamps: true }, { versionKey: false });




export default mongoose.model('Post', postSchema);
