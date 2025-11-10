import Post from "../models/Post.js";
import User from "../models/User.js";
import { sendNotification } from "./notify.js";

// Analyze users' sentiments and send motivational messages
export async function runRecommendationEngine() {
  console.log("🧠 Running sentiment-based recommendation engine...");

  try {
    const users = await User.find();

    for (const user of users) {
      const posts = await Post.find({ userId: user._id });
      if (!posts.length) continue;

      // Calculate sentiment score
      const score = posts.reduce((acc, post) => {
        if (post.sentiment === "positive") return acc + 1;
        if (post.sentiment === "negative") return acc - 1;
        return acc;
      }, 0);

      // Send appropriate motivation
      if (score < 0) {
        await sendNotification(
          user,
          "Hey 👋 Just a little reminder — you are stronger than you think 🌻"
        );
      } else if (score >= 0 && score <= 2) {
        await sendNotification(
          user,
          "Hope you’re having a peaceful day 💫 Keep expressing yourself freely!"
        );
      } else {
        await sendNotification(
          user,
          "Love your positive energy ✨ Keep shining and inspiring others!"
        );
      }
    }

    console.log("✅ Recommendation engine completed.");
  } catch (err) {
    console.error("❌ Error in recommendation engine:", err);
  }
}
