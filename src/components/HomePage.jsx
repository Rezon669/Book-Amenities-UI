import React from "react";
import { Button } from "@/components/ui/button";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const amenities = [
    { name: "Swimming Pool", img: "/images/swimmingpool.jpg" },
    { name: "Badminton Court", img: "/images/badminton.jpg" },
    { name: "BasketBall Court", img: "/images/basketball.jpg" },
    { name: "Table Tennis", img: "/images/tabletennis.jpg" },
    { name: "Convention Hall", img: "/images/conventionhall.jpg" }
  ];

  const navigate = useNavigate();

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-gray-900 p-6 text-white">

      <Header />

      {/* Amenities Grid */}
      <div className="flex flex-col items-center gap-4">

        {/* First Row - 3 images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {amenities.slice(0, 3).map((item) => (
            <div
              key={item.name}
              className="bg-white/5 rounded-xl shadow-lg border border-white/20 overflow-hidden w-64"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-3 text-center font-semibold text-lg">
                {item.name}
              </div>
            </div>
          ))}
        </div>

        {/* Second Row - Center 2 images */}
        <div className="grid grid-cols-2 gap-6 justify-center">
          {amenities.slice(3, 5).map((item) => (
            <div
              key={item.name}
              className="bg-white/5 rounded-xl shadow-lg border border-white/20 overflow-hidden w-64 mx-auto"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-3 text-center font-semibold text-lg">
                {item.name}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Book Now Button */}
      <div className="w-full flex justify-center mt-10">
        <Button className="px-8 py-3 text-lg rounded-2xl shadow bg-blue-600 hover:bg-blue-700" 
        onClick={() => navigate("/login")}>
          Book Slot
        </Button>
      </div>
    </div>
  );
}
