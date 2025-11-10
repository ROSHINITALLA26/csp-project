import React, { useState } from "react";

export default function GamesPage() {
  const [score, setScore] = useState(0);

  const submitScore = async () => {
    await fetch(`${import.meta.env.VITE_API_BASE}/games/score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ gameName: "reaction-tap", score }),
    });
    alert("Score saved! 🏆");
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">🎮 Reaction Tap Game</h1>
      <p className="text-gray-600 mb-2">Tap the button as fast as you can!</p>
      <button
        onClick={() => setScore(score + 1)}
        className="bg-yellow-400 text-black px-6 py-3 rounded-full text-lg font-bold hover:bg-yellow-500"
      >
        Tap Me! ({score})
      </button>
      <div className="mt-4">
        <button
          onClick={submitScore}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Save Score
        </button>
      </div>
    </div>
  );
}
