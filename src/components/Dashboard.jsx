import React, { useState } from "react";
import Header from "./Header";
import BookSlot from "./BookSlot";
import MyBookings from "./MyBookings";

import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("book");

  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/book-amenities/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      // Clear local storage
      localStorage.removeItem("userId");
      localStorage.removeItem("token");

      // Navigate to home page
      navigate("/");

      if (response.ok) {
        alert("Logout successful!");
      } else {
        alert("Logged out locally, but server logout failed.");
      }

     } catch (err) {
      alert("Network error. Logged out locally.");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-gray-900 p-6 text-white">
      {/* Header visible on top */}
      <Header />

      {/* Tabs Section */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setActiveTab("book")}
          className={`flex-1 px-20 py-3 text-xl font-semibold rounded-l-xl border ${
            activeTab === "book"
              ? "bg-blue-600"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          Book
        </button>

        <button
          onClick={() => setActiveTab("myBookings")}
          className={`flex-1 px-20 py-3 text-xl font-semibold rounded-r-xl border ${
            activeTab === "myBookings"
              ? "bg-blue-600"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          My Bookings
        </button>
      </div>

       {/* Logout Button */}
      <div className="flex justify-end pr-6">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-sm font-semibold shadow"
        >
          Logout
        </button>
      </div>

      {/* Tab Content Section */}
      <div className="mt-10 flex justify-center">
        {activeTab === "book" ? <BookSlot /> : <MyBookings />}
      </div>
    </div>
  );
}
