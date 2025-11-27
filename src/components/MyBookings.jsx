import React, { useState, useEffect } from "react";
import Header from "./Header";

export default function MyBookings() {
  const userId = localStorage.getItem("userId");
  const [activeTab, setActiveTab] = useState("past");
  const [pastBookings, setPastBookings] = useState([]);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch Past Bookings
  const fetchPastBookings = async () => {
    try {
      const res = await fetch(`http://localhost:8080/book-amenities/booking/past/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      const data = await res.json();
      setPastBookings(data);
    } catch (err) {
      setErrorMsg("Failed to load past bookings");
    }
  };

  // Fetch Current Bookings
  const fetchCurrentBookings = async () => {
    try {
      const res = await fetch(`http://localhost:8080/book-amenities/booking/upcoming/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      const data = await res.json();
      setCurrentBookings(data);
    } catch (err) {
      setErrorMsg("Failed to load current bookings");
    }
  };

  // Delete Booking
  const deleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const res = await fetch(
        `http://localhost:8080/book-amenities/booking/${bookingId}/user/${userId}`,
        { 
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`, // 🔥 Add token
            }
        }
         
      );

    const data = await res.json();
     if (res.ok) {
      alert(data.message || "Booking deleted successfully");
      fetchCurrentBookings(); // refresh UI
     } else {
      alert(data.message || "Failed to delete booking");
     }
    } catch (err) {
    alert("Unable to connect to server");
  }
  };

  useEffect(() => {
    fetchPastBookings();
    fetchCurrentBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-gray-900 text-white p-6 w-[500px]">

    
      <div className="flex justify-center gap-6 mt-6">
        <button
          className={`px-6 py-2 rounded-xl ${activeTab === "past" ? "bg-blue-600" : "bg-white/20"}`}
          onClick={() => setActiveTab("past")}
        >
          Past Bookings
        </button>

        <button
          className={`px-6 py-2 rounded-xl ${activeTab === "current" ? "bg-blue-600" : "bg-white/20"}`}
          onClick={() => setActiveTab("current")}
        >
          Current Bookings
        </button>
      </div>

      {errorMsg && <p className="text-red-400 text-center mt-4">{errorMsg}</p>}

      {activeTab === "past" && (
        <div className="mt-8 w-full max-w-2xl mx-auto bg-white/10 p-6 rounded-2xl border border-white/20">
          <h3 className="text-xl font-semibold mb-4 text-center">Past Bookings</h3>
          {pastBookings.length === 0 ? (
            <p className="text-center text-gray-300">No past bookings found.</p>
          ) : pastBookings.map((b) => (
            <div key={b.bookingId} className="p-4 bg-white/10 rounded-xl mb-4">
              <p><b>Amenity:</b> {b.amenityName}</p>
              <p><b>Date:</b> {b.bookingDate}</p>
              <p><b>Time:</b> {b.fromTime} - {b.toTime}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "current" && (
        <div className="mt-8 w-full max-w-2xl mx-auto bg-white/10 p-6 rounded-2xl border border-white/20">
          <h3 className="text-xl font-semibold mb-4 text-center">Current Bookings</h3>
          {currentBookings.length === 0 ? (
            <p className="text-center text-gray-300">No upcoming bookings found.</p>
          ) : currentBookings.map((b) => (
            <div key={b.bookingId} className="p-4 bg-white/10 rounded-xl mb-4 flex justify-between items-center">
              <div>
                <p><b>Amenity:</b> {b.amenityName}</p>
                <p><b>Date:</b> {b.bookingDate}</p>
                <p><b>Time:</b> {b.fromTime} - {b.toTime}</p>
              </div>
              <button
                onClick={() => deleteBooking(b.bookingId)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
