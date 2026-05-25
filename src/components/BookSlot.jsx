import React, { useState } from "react";
import Header from "./Header";

export default function BookSlot() {
  const userId = localStorage.getItem("userId"); // get from localStorage
  const [amenityName, setAmenityName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const amenities = [
    "Swimming Pool",
    "Badminton Court",
    "BasketBall Court",
    "Table Tennis",
    "Convention Hall",
  ];

  // Generate 30 min time slots
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

  const minDate = new Date().toISOString().split("T")[0]; // disable past dates

  const formatDate = (inputDate) => {
  const [year, month, day] = inputDate.split("-");
  return `${day}-${month}-${year}`;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    // basic frontend validation
    if (!amenityName || !date || !startTime || !endTime) {
      setErrorMsg("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/book-amenities/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId,
          amenityName,
          bookingDate: formatDate(date),
          startTime,
          endTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      setSuccessMsg("Slot booked successfully!");
      setLoading(false);

    } catch (err) {
      setErrorMsg("Unable to connect to server");
      setLoading(false);
    }
  };

  return (
    <div>
      
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 w-full max-w-lg mt-10">
        <h2 className="text-3xl font-bold text-center mb-6">Book a Slot</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm">Amenity</label>
            <select
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/30 text-white text-sm"
              value={amenityName}
              onChange={(e) => setAmenityName(e.target.value)}
              required
            >
              <option value="">Select amenity</option>
              {amenities.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm">Date</label>
            <input
              type="date"
              min={minDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/30 text-white text-sm"
              required
            />
          </div>

          <div>
            <label className="text-sm">Start Time</label>
            <select
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/30 text-white text-sm"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            >
              <option value="">Select time</option>
              {timeSlots.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm">End Time</label>
            <select
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/30 text-white text-sm"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            >
              <option value="">Select time</option>
              {timeSlots.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {errorMsg && <p className="text-red-400 text-center text-sm">{errorMsg}</p>}
          {successMsg && <p className="text-green-400 text-center text-sm">{successMsg}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow text-center text-sm font-semibold"
          >
            {loading ? "Booking..." : "Book Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
