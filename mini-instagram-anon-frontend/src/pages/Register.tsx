import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register(email || undefined, password || undefined);
      nav("/");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Register failed");
    }
  }

  return (
    <div className="px-4 pt-8">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold mb-2">
          Create your anonymous ID ✨
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          Register with or without email — your identity stays private.
        </p>
        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full card px-3 py-2"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full card px-3 py-2"
            placeholder="Password (optional)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-sm text-red-500">{error}</div>}
          <button className="btn btn-primary w-full">Create account</button>
        </form>
        <div className="text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
