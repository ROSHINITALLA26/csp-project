import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PostCard({ post }: { post: any }) {
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);

  // ❤️ Like handler
  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.likeCount !== undefined) {
        setLikes(data.likeCount);
        setLiked(data.liked);
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // 💬 Comment handler
  const handleComment = async (postId: string) => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text: newComment }),
      });
      const data = await res.json();
      setComments(data.comments || []);
      setNewComment("");
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 mb-4 rounded-2xl shadow-lg bg-white/70 backdrop-blur-md border border-gray-100"
    >
      {/* 🕒 Post Header */}
      <div className="text-xs text-gray-500 mb-2">
        Anon • {new Date(post.createdAt).toLocaleString()}
      </div>

      {/* 🖼️ Post Content */}
      {post.kind === "text" && (
        <p className="whitespace-pre-wrap text-gray-800">{post.text}</p>
      )}
      {post.kind === "image" && post.mediaUrl && (
        <img
          className="w-full rounded-xl mt-2 object-cover shadow-md"
          src={post.mediaUrl}
          alt="post"
        />
      )}
      {post.kind === "voice" && post.mediaUrl && (
        <audio className="w-full mt-2" src={post.mediaUrl} controls />
      )}

      {/* 😌 Sentiment Info */}
      {post.sentiment?.label && (
        <div className="mt-3 text-xs text-gray-500">
          Mood:{" "}
          <span className="capitalize">{post.sentiment.label}</span> (
          {post.sentiment.score})
        </div>
      )}

      {/* ❤️💬 Buttons */}
      <div className="mt-3 flex items-center justify-between text-gray-600">
        <div className="flex items-center space-x-6">
          <motion.button
            whileTap={{ scale: 1.3 }}
            animate={{
              scale: liked ? [1, 1.3, 1] : 1,
              color: liked ? "#ef4444" : "#6b7280",
              textShadow: liked ? "0px 0px 8px #ef4444" : "none",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            onClick={() => handleLike(post._id)}
            className="text-lg focus:outline-none"
          >
            ❤️ {likes}
          </motion.button>

          <motion.button
            whileTap={{ scale: 1.2 }}
            onClick={() => setShowComments(!showComments)}
            className="hover:text-blue-500 text-lg focus:outline-none"
          >
            💬 {comments.length}
          </motion.button>
        </div>
      </div>

      {/* 💭 Comment Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-3 bg-gray-50 rounded-lg p-3 shadow-inner border border-gray-100"
          >
            {comments.length === 0 && (
              <p className="text-xs text-gray-500 mb-2">No comments yet.</p>
            )}
            {comments.map((c: any, i: number) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="text-sm text-gray-700 mb-1"
              >
                <strong>Anon:</strong> {c.text}
              </motion.p>
            ))}

            {/* ✍️ Add new comment */}
            <div className="flex items-center mt-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleComment(post._id)}
                className="ml-2 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
              >
                Post
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
