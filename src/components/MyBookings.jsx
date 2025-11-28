import React, { useState, useEffect } from "react";
import Header from "./Header";

export default function MyBookings() {
  const userId = localStorage.getItem("userId");
  const [activeTab, setActiveTab] = useState("past");
  const [pastBookings, setPastBookings] = useState([]);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [editBooking, setEditBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const amenities = [
    "Swimming Pool",
    "Badminton Court",
    "BasketBall Court",
    "Table Tennis",
    "Convention Hall",
  ];

  // Generate time slots
  const generateTimeSlots = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const HH = h.toString().padStart(2, "0");
        const MM = m.toString().padStart(2, "0");
        times.push(`${HH}:${MM}`);
      }
    }
    return times;
  };

  const timeSlots = generateTimeSlots();

  // Fetch bookings
  const fetchPastBookings = async () => {
    try {
      const res = await fetch(`http://localhost:8080/book-amenities/booking/past/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPastBookings(await res.json());
    } catch {
      setErrorMsg("Failed to load past bookings");
    }
  };

  const fetchCurrentBookings = async () => {
    try {
      const res = await fetch(`http://localhost:8080/book-amenities/booking/upcoming/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCurrentBookings(await res.json());
    } catch {
      setErrorMsg("Failed to load current bookings");
    }
  };

  // Delete booking
  const deleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    const res = await fetch(
      `http://localhost:8080/book-amenities/booking/${bookingId}/user/${userId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    const data = await res.json();
    alert(data.message);
    fetchCurrentBookings();
  };

  // Update booking
  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const body = {
      userId,
      amenityName: editBooking.amenityName,
      bookingDate: editBooking.bookingDate,
      startTime: editBooking.startTime,
      endTime: editBooking.endTime,
    };

    try {
      const res = await fetch(
        `http://localhost:8080/book-amenities/booking/${editBooking.bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message);
        return;
      }

      setSuccessMsg("Booking updated successfully");
      setEditBooking(null);
      fetchCurrentBookings();
      setActiveTab("current");
    } catch {
      setErrorMsg("Failed to update booking");
    }
  };

  useEffect(() => {
    fetchPastBookings();
    fetchCurrentBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-gray-900 text-white p-6">

      {/* Tabs */}
      <div className="flex justify-center gap-6 mt-6">
        <button
          className={`px-6 py-2 text-lg rounded-xl ${activeTab === "past" ? "bg-blue-600" : "bg-white/20"}`}
          onClick={() => setActiveTab("past")}
        >
          Past Bookings
        </button>

        <button
          className={`px-6 py-2 text-lg rounded-xl ${activeTab === "current" ? "bg-blue-600" : "bg-white/20"}`}
          onClick={() => setActiveTab("current")}
        >
          Current Bookings
        </button>
      </div>

      {errorMsg && <p className="text-red-400 text-center mt-4">{errorMsg}</p>}
      {successMsg && <p className="text-green-400 text-center mt-4">{successMsg}</p>}

      {/* Current Bookings */}
      {activeTab === "current" && !editBooking && (
        <div className="mt-8 w-full max-w-2xl mx-auto bg-white/10 p-6 rounded-2xl border border-white/20">
          <h3 className="text-xl font-semibold mb-4 text-center">Current Bookings</h3>

          {currentBookings.length === 0 ? (
            <p className="text-center text-gray-300">No upcoming bookings found.</p>
          ) : (
            currentBookings.map((b) => (
              <div key={b.bookingId} className="p-4 bg-white/10 rounded-xl mb-4 flex justify-between items-center">
                <div>
                  <p><b>Amenity:</b> {b.amenityName}</p>
                  <p><b>Date:</b> {b.bookingDate}</p>
                  <p><b>Time:</b> {b.startTime} - {b.endTime}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditBooking(b)}
                    className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteBooking(b.bookingId)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Form */}
      {editBooking && (
        <form
          onSubmit={handleUpdate}
          className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 max-w-xl mx-auto space-y-4 mt-10"
        >
          <h3 className="text-2xl font-bold text-center mb-4">Edit Booking</h3>

          <label>Amenity</label>
          <select
            className="w-full p-3 rounded-lg bg-black/40 border border-white/30"
            value={editBooking.amenityName}
            onChange={(e) => setEditBooking({ ...editBooking, amenityName: e.target.value })}
          >
            {amenities.map((a) => <option key={a}>{a}</option>)}
          </select>

          <label>Date</label>
          <input
            type="date"
            className="w-full p-3 rounded-lg bg-black/40 border border-white/30"
            value={editBooking.bookingDate.split("-").reverse().join("-")}
            onChange={(e) =>
              setEditBooking({
                ...editBooking,
                bookingDate: e.target.value.split("-").reverse().join("-"),
              })
            }
          />

          <label>Start Time</label>
          <select
            className="w-full p-3 rounded-lg bg-black/40 border border-white/30"
            value={editBooking.startTime}
            onChange={(e) => setEditBooking({ ...editBooking, startTime: e.target.value })}
          >
            {timeSlots.map((t) => <option key={t}>{t}</option>)}
          </select>

          <label>End Time</label>
          <select
            className="w-full p-3 rounded-lg bg-black/40 border border-white/30"
            value={editBooking.endTime}
            onChange={(e) => setEditBooking({ ...editBooking, endTime: e.target.value })}
          >
            {timeSlots.map((t) => <option key={t}>{t}</option>)}
          </select>

          <div className="flex justify-between mt-5">
            <button type="button" onClick={() => setEditBooking(null)} className="px-6 py-2 bg-gray-500 rounded-lg">
              Discard
            </button>
            <button type="submit" className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
              Update
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
