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
      const response = await fetch("http://localhost:8080/book-amenities/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId,
          amenityName,
          date: formatDate(date),
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
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-black to-gray-900 p-6 text-white w-[500px] ">

      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-6">Book Slot</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-white/20 max-w-3xl w-full mx-auto space-y-3">

        {/* Amenity Dropdown */}
        <div>
          <label className="block mb-0.5 text-sm">Amenity</label>
          <select
            className="w-full mx-auto p-1 rounded-lg bg-black/40 border border-white/30 text-white"
            value={amenityName}
            onChange={(e) => setAmenityName(e.target.value)}
          >
            <option value="">Select Amenity</option>
            {amenities.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Date Input */}
        <div>
          <label className="max-w-lg mx-auto text-sm">Date</label>
          <input
            type="date"
            min={minDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-1 rounded-lg bg-black/40 border border-white/30 text-white"
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="max-w-lg mx-auto text-sm">Start Time</label>
          <select
            className="w-full p-1 rounded-lg bg-black/40 border border-white/30 text-white"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          >
            <option value="">Select Time</option>
            {timeSlots.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* End Time */}
        <div>
          <label className="max-w-lg mx-auto text-sm">End Time</label>
          <select
            className="w-full p-1 rounded-lg bg-black/40 border border-white/30 text-white"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          >
            <option value="">Select Time</option>
            {timeSlots.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Error */}
        {errorMsg && <p className="text-red-400 text-center">{errorMsg}</p>}
        {successMsg && <p className="text-green-400 text-center">{successMsg}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full h-[50px] py-3 text-lg rounded-xl bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Booking..." : "Book Now"}
        </button>
      </form>
    </div>
  );
}
