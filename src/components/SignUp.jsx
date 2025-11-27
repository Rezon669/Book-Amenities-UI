import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";


export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    mobile: ""
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({});
    setErrorMsg("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Frontend Password Match validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/book-amenities/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
          mobile: formData.mobile
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Show backend validation errors
        if (data.details) {
          setFieldErrors(data.details);
        }
        setErrorMsg(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      alert("Account created successfully!");
      navigate("/login");

    } catch (err) {
      setErrorMsg("Unable to connect to server");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-gray-900 p-6 text-white flex flex-col items-center">
      <Header />

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 w-full max-w-lg mt-10">
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSignup} className="space-y-3">

          {/* Username */}
          <div>
            <label className="text-sm">Username</label>
            <input
              type="text"
              name="username"
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/30 text-white text-sm"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {fieldErrors.username && <p className="text-red-400 text-sm">{fieldErrors.username}</p>}
          </div>

          {/* First Name */}
          <div>
            <label className="text-sm">First Name</label>
            <input
              type="text"
              name="firstName"
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/30 text-white text-sm"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            {fieldErrors.firstName && <p className="text-red-400 text-sm">{fieldErrors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="text-sm">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/30 text-white text-sm"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            {fieldErrors.lastName && <p className="text-red-400 text-sm">{fieldErrors.lastName}</p>}
          </div>

          {/* Mobile */}
          <div>
            <label className="text-sm">Mobile</label>
            <input
              type="text"
              name="mobile"
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/30 text-white text-sm"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
            {fieldErrors.mobile && <p className="text-red-400 text-sm">{fieldErrors.mobile}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/30 text-white text-sm"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/30 text-white text-sm"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Error Message */}
          {errorMsg && <p className="text-red-400 text-center text-sm">{errorMsg}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow text-center mt-2"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-4 text-sm text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
