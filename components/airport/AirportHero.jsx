"use client";
import React from "react";
import HorizontalSearchForm from "@/components/booking/HorizontalSearchForm";

export default function AirportHero({ title, subtitle, iata, backgroundImage, airportName }) {
  return (
    <header className="relative w-full min-h-screen md:h-[80vh] md:min-h-[650px] flex items-center justify-center bg-gray-900 py-32 md:py-0 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage || "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2600&auto=format&fit=crop"} 
          alt={title} 
          className="w-full h-full object-cover opacity-65 mix-blend-overlay scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#101428]/60 to-[#1e233a]/80"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-center justify-center text-center mt-12 md:mt-16">
        <span className="inline-block text-xs md:text-sm font-bold tracking-[0.25em] text-[#ea580c] mb-6 uppercase animate-fade-in">
          {iata ? `${title} (${iata})` : title}
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 text-white max-w-4xl tracking-tight drop-shadow-lg">
          {title}
        </h1>
        <p className="text-base md:text-lg text-gray-200 mb-10 max-w-2xl leading-relaxed font-medium opacity-90">
          {subtitle || "Enhance every step of your travel experience, whether it's arrival, departure, or connecting flights, with our VIP treatment. Our top-notch service is available to ensure your journey is seamless."}
        </p>

        <div className="w-full animate-slide-up">
          <HorizontalSearchForm defaultAirport={airportName || title} />
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }
      `}</style>
    </header>
  );
}
