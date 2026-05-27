import React, { useState } from "react";
import Header from "./Header";
import BookSlot from "./BookSlot";
import MyBookings from "./MyBookings";
import { Menu, User, LogOut, Trash2, MessageCircle, Send, X } from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("book");
  const [showMenu, setShowMenu] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/api/book-amenities/logout", {
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

  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem("userId");

    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/book-amenities/user/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }

      });
      localStorage.removeItem("userId");
      localStorage.removeItem("token");

      navigate("/");

      if (response.ok) {
        alert("Account deleted successfully");
      } else {
        alert("Account removed locally");
      }

    } catch (err) {

      localStorage.removeItem("userId");
      localStorage.removeItem("token");

      navigate("/");

      alert("Network error");
    }
  }

  const fetchUserProfile = async () => {

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {

      const response = await fetch(
        `http://localhost:8080/api/book-amenities/user/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.ok) {

        const data = await response.json();

        setProfileData(data);

        setShowProfilePopup(true);

      } else {
        alert("Failed to fetch profile");
      }

    } catch (err) {
      alert("Network error");
    }
  };

  const handleSendMessage = async () => {

    if (!inputMessage.trim()) return;

    const userMessage = {
      sender: "user",
      text: inputMessage
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = inputMessage;

    setInputMessage("");

    setLoading(true);

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/book-amenities/chat-client",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query: currentMessage,
            userId: localStorage.getItem("userId")
          })
        }
      );

      const data = await response.json();

      const botMessage = {
        sender: "bot",
        text: data.response
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (err) {

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Something went wrong"
        }
      ]);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-gray-900 p-6 text-white">
      {/* Header visible on top */}
      <Header />

      {/* Tabs Section */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => { setActiveTab("book"); setShowMenu(false); }}
          className={`flex-1 px-20 py-3 text-xl font-semibold rounded-l-xl border ${activeTab === "book"
            ? "bg-blue-600"
            : "bg-white/10 hover:bg-white/20"
            }`}
        >
          Book
        </button>

        <button
          onClick={() => {
            setActiveTab("myBookings");
            setShowMenu(false);
          }}
          className={`flex-1 px-20 py-3 text-xl font-semibold rounded-r-xl border ${activeTab === "myBookings"
            ? "bg-blue-600"
            : "bg-white/10 hover:bg-white/20"
            }`}
        >
          My Bookings
        </button>
      </div>
      {/* Menu Section */}
      <div className="flex justify-end pr-6 mt-4 relative">

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="bg-white/10 hover:bg-white/20 p-3 rounded-xl"
        >
          <Menu size={24} />
        </button>

        {showMenu && (

          <div className="absolute top-14 right-0 w-56 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">

            {/* Profile */}
            <button
              onClick={fetchUserProfile}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/10 transition"
            >
              <User size={18} />
              Profile
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-500/20 transition text-red-400"
            >
              <LogOut size={18} />
              Logout
            </button>

            {/* Delete Account */}
            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-700/30 transition text-red-500"
            >
              <Trash2 size={18} />
              Delete Account
            </button>

          </div>
        )}
      </div>

      {/* Tab Content Section */}
      <div className="mt-10 flex justify-center">
        {activeTab === "book" ? <BookSlot /> : <MyBookings />}
      </div>
      {/* Profile Popup */}
      {showProfilePopup && profileData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-gray-900 text-white rounded-2xl p-8 w-[420px] shadow-2xl border border-white/10 relative">
            <button
              onClick={() => setShowProfilePopup(false)}
              className="absolute top-3 right-4 text-xl hover:text-red-400"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center">Profile Details</h2>

            <div className="space-y-5">
              <div>
                <p className="text-gray-400 text-sm">Username</p>
                <p className="text-lg font-semibold">{profileData.username}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Name</p>
                <p className="text-lg font-semibold">{profileData.firstName} {profileData.lastName}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Flat Number</p>
                <p className="text-lg font-semibold">{profileData.flatNumber}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Block</p>
                <p className="text-lg font-semibold">{profileData.block}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Mobile Number</p>
                <p className="text-lg font-semibold">{profileData.mobile}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Chatbot Button + Panel */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
        <div className="mb-3">
          <button
            onClick={() => setShowChatbot(!showChatbot)}
            className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full shadow-2xl transition-all"
            aria-label="Toggle chatbot"
          >
            <MessageCircle size={28} />
          </button>
        </div>

        {showChatbot && (
          <div className="w-80 max-w-sm bg-gray-900 rounded-2xl shadow-lg p-2 border border-white/10">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
              <div className="font-semibold">AI Assistant</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowChatbot(false)} className="p-1 hover:text-red-400">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="h-56 overflow-y-auto p-3 space-y-3 bg-black/20">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-6 text-sm">
                  Ask anything about amenities, bookings, timings...
                </div>
              )}

              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-white/10 text-gray-100"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && <div className="text-gray-400 text-sm">AI is typing...</div>}
            </div>

            <div className="p-3 border-t border-white/5 flex gap-2 bg-gray-950 rounded-b-2xl">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
                placeholder="Ask something..."
                className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
              />
              <button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 p-2 rounded-xl">
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
