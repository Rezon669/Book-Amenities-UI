import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/book-amenities/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Invalid username or password");
        setLoading(false);
        return;
      }

      localStorage.setItem("userId", data.userId);
      localStorage.setItem("token", data.token);

      setLoading(false);
      navigate("/dashboard");

    } catch (err) {
      setErrorMsg("Unable to connect to server");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-900 via-black to-gray-900 p-6 text-white">
      <Header />

      <div className="w-full max-w-sm bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 mt-10">

        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/30 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/30 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && <p className="text-red-400 text-sm text-center">{errorMsg}</p>}

          <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-300">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
