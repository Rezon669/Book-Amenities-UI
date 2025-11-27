import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import BookSlot from "./components/BookSlot";
import MyBookings from "./components/MyBookings";
import SignUp from "./components/SignUp";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book" element={<BookSlot />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}
