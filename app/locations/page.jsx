"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, MapPin } from "lucide-react";
import Link from "next/link";

const popularDestinations = [

  {
    name: "Saint Barths",
    airport: "Saint Barthélemy (SBH)",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop",
    link: "/locations/saint-barths"
  },
  {
    name: "Sint Maarten",
    airport: "Princess Juliana (SXM)",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop",
    link: "/locations/sint-maarten"
  }
];

export default function LocationsPage() {
  const staticLocations = [
    {
      countryName: "Saint Barthélemy",
      flagIcon: "🇧🇱",
      airports: [
        { name: "Saint Barthélemy Airport (SBH)", link: "/locations/saint-barths" }
      ]
    },
    {
      countryName: "Sint Maarten",
      flagIcon: "🇸🇽",
      airports: [
        { name: "Princess Juliana International Airport (SXM) - Fast Track", link: "/locations/sint-maarten" }
      ]
    },

  ];

  const [searchQuery, setSearchQuery] = useState("");

  const getFlagUrl = (iconStr) => {
    if (!iconStr) return '';
    if (iconStr.includes('/http')) return 'http' + iconStr.split('/http')[1];
    return iconStr;
  };

  const isUrl = (str) => {
    return str?.startsWith('/') || str?.startsWith('http');
  };

  // Filter locations based on search query
  const filteredLocations = staticLocations.map(loc => {
    const matchedAirports = loc.airports.filter(a => 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      loc.countryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...loc, airports: matchedAirports };
  }).filter(loc => loc.airports.length > 0 || loc.countryName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-white text-[#0f172a] font-sans antialiased overflow-x-hidden">
      {/* Set a dark background for navbar visibility */}
      <div className="bg-[#0f172a]"><Navbar /></div>
      
      {/* Hero Section */}
      <header className="relative pt-32 pb-24 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?q=80&w=2600&auto=format&fit=crop" 
            alt="Airport Aerial" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0f172a]/70 backdrop-blur-[2px]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 shadow-sm">
            World's leading Meet & Greet service
          </h1>
          <p className="text-lg text-gray-200 mb-8 font-medium">
            Enter your airport to see the service cost
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 rounded-full border-0 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#ea580c] sm:text-lg shadow-xl text-gray-900 bg-white"
              placeholder="Find your airport / service here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Popular Destinations */}
      {!searchQuery && (
        <section className="py-16 max-w-7xl mx-auto px-4 md:px-12 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-center mb-10 text-[#0f172a] uppercase tracking-wider">Popular Destinations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularDestinations.map((loc, idx) => (
              <a 
                key={idx} 
                href={loc.link}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block"
              >
                <div className="aspect-[4/5] md:aspect-square relative">
                  <img 
                    src={loc.image} 
                    alt={loc.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 p-5 w-full">
                    <h3 className="text-xl font-bold text-white mb-1">{loc.name}</h3>
                    <p className="text-xs text-gray-300 font-medium truncate">{loc.airport}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* All Destinations Directory */}
      <section className="py-16 max-w-7xl mx-auto px-4 md:px-12">
        <h2 className="text-2xl font-bold text-center mb-12 text-[#0f172a] uppercase tracking-wider">
          {searchQuery ? "Search Results" : "All Destinations"}
        </h2>
        

        {filteredLocations.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No airports found matching "{searchQuery}".
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-4 gap-8 space-y-8 pb-12">
            {filteredLocations.map((country, idx) => (
              <div key={idx} className="break-inside-avoid mb-8">
                <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
                  {isUrl(country.flagIcon) ? (
                    <img src={getFlagUrl(country.flagIcon)} alt={country.countryName} className="h-5 w-auto object-contain shadow-sm rounded-sm" />
                  ) : (
                    <span className="text-xl">{country.flagIcon}</span>
                  )}
                  <h3 className="text-lg font-bold text-[#0f172a]">{country.countryName}</h3>
                </div>
                
                <ul className="space-y-3">
                  {country.airports.map((airport, aIdx) => (
                    <li key={aIdx}>
                      <a 
                        href={airport.link || `/booking?airport=${encodeURIComponent(airport.name)}`}
                        className="group flex flex-col items-start hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors"
                      >
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-[#ea580c] transition-colors line-clamp-2">
                          {airport.name}
                        </span>
                        {/* Optional Fast Track indicator if we had that data, hardcoding just for visual matching inspiration */}
                        {airport.name.toLowerCase().includes('fast track') && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c] mt-1 bg-orange-50 px-2 py-0.5 rounded">
                            Fast Track
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
