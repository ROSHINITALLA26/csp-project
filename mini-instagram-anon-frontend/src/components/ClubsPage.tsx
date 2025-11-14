import React, { useEffect, useState } from "react";

export default function ClubsPage() {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/clubs`)
      .then(r => r.json())
      .then(setClubs);
  }, []);

  const toggleJoin = async (id: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/clubs/${id}/toggle`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    alert(data.joined ? "Joined Club 🎉" : "Left Club 👋");
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">🌈 Clubs</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clubs.map((c: any) => (
          <div key={c._id} className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition">
            <img src={c.banner || "/club.jpg"} alt={c.name} className="rounded-xl h-40 w-full object-cover" />
            <h2 className="text-lg font-semibold mt-2">{c.name}</h2>
            <p className="text-sm text-gray-600">{c.description}</p>
            <button
              onClick={() => toggleJoin(c._id)}
              className="mt-3 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
            >
              Join / Leave
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
