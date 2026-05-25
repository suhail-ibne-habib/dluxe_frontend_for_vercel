"use client";

import React, { useState, useEffect } from "react";

export default function AirportSearchField({ selectedAirport, onSelect }) {
  const [locations, setLocations] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations`);
        if (res.ok) {
          const data = await res.json();
          const flattened = [];
          data.forEach(country => {
             let flagUrl = country.flagIcon;
             if (flagUrl.includes('http')) {
                 flagUrl = flagUrl.substring(flagUrl.indexOf('http'));
             } else {
                 flagUrl = `https://skyvipservices.com${flagUrl}`;
             }
             country.airports.forEach(apt => {
                 flattened.push({
                     ...apt,
                     countryName: country.countryName,
                     flagIcon: flagUrl
                 });
             });
          });
          setLocations(flattened);
        }
      } catch (err) {
        console.error("Failed to fetch locations", err);
      }
    }
    fetchLocations();
  }, []);

  const filteredAirports = locations.filter(loc => {
      if (searchQuery === "") return true;
      const lowerQuery = searchQuery.toLowerCase();
      if (loc.name.toLowerCase().includes(lowerQuery) || loc.countryName.toLowerCase().includes(lowerQuery)) return true;
      
      // Explicit IATA extraction for robust matching
      const parts = loc.name.split(',');
      let iata = "";
      if (parts.length > 1) {
          iata = parts[parts.length - 1].trim().toLowerCase();
      } else {
          const spaceParts = loc.name.split(' ');
          if (spaceParts[spaceParts.length - 1].length === 3) {
              iata = spaceParts[spaceParts.length - 1].toLowerCase();
          }
      }
      if (iata && lowerQuery === iata) return true;
      if (iata && iata.includes(lowerQuery)) return true;
      
      return false;
  }).slice(0, 10);

  return (
    <div className="relative">
      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transform rotate-45 z-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 16.023l-8.544-4.814V4.536a2.536 2.536 0 10-5.072 0v6.673L-.001 16.023v2.336l8.417-2.671v4.46L6.155 22.1v1.898l5.845-1.583 5.846 1.583V22.1l-2.261-1.954v-4.46l8.415 2.671z" />
      </svg>
      <input 
        type="text"
        placeholder="Select airport of service"
        value={isDropdownOpen ? searchQuery : selectedAirport}
        onFocus={() => {
          setSearchQuery("");
          setIsDropdownOpen(true);
        }}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsDropdownOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && isDropdownOpen && filteredAirports.length > 0) {
            e.preventDefault();
            onSelect(filteredAirports[0].name);
            setIsDropdownOpen(false);
          }
        }}
        onBlur={() => setTimeout(() => {
          setIsDropdownOpen(false);
          setSearchQuery("");
        }, 200)}
        className={`w-full bg-white border-2 text-gray-900 rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none shadow-sm transition-colors ${isDropdownOpen ? 'border-[#2a3bb1]' : 'border-gray-200'}`}
      />
      {isDropdownOpen && filteredAirports.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-64 overflow-y-auto py-2">
          {filteredAirports.map((loc, idx) => {
            const parts = loc.name.split(',');
            let iata = "";
            let airportText = loc.name;
            if (parts.length > 1) {
              iata = parts[parts.length - 1].trim();
              airportText = parts.slice(0, -1).join(',').trim();
            } else {
                const spaceParts = loc.name.split(' ');
                if (spaceParts[spaceParts.length - 1].length === 3) {
                    iata = spaceParts.pop();
                    airportText = spaceParts.join(' ').trim();
                }
            }

            return (
              <li 
                key={idx}
                onClick={() => {
                  onSelect(loc.name);
                  setIsDropdownOpen(false);
                }}
                className="px-5 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
              >
                <div className="flex gap-4 items-center w-[85%]">
                    <span className="text-sm font-bold text-gray-800 w-[40%] truncate">{loc.countryName}</span>
                    <span className="text-sm text-gray-500 w-[60%] truncate">{airportText}</span>
                </div>
                <span className="text-sm font-bold text-gray-400">{iata}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
