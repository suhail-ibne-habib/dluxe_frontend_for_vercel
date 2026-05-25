"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

export default function HorizontalSearchForm({ defaultAirport, defaultAirportObj }) {
  const router = useRouter();
  const [servicePackages, setServicePackages] = useState([]);
  const [locations, setLocations] = useState([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      airport: defaultAirport || "",
      serviceType: "",
      date: "",
      passengers: "1 adult • no children",
      email: ""
    }
  });

  useEffect(() => {
    // If slug passes a default airport name dynamically
    if (defaultAirport) {
        setValue("airport", defaultAirport, { shouldValidate: true });
    }
  }, [defaultAirport, setValue]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/packages`);
        if (res.ok) {
          const data = await res.json();
          const activePackages = data.filter(p => !!p.isActive);
          setServicePackages(activePackages);
        }
      } catch (err) {
        console.error("Failed to fetch packages:", err);
      }
    };
    
    // We only need locations if we need to filter excluded packages (or want a dropdown for airports)
    // In this template, maybe it's fixed to the page's airport, but let's allow it to be robust
    const fetchLocations = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/locations`);
            if (res.ok) {
                setLocations(await res.json());
            }
        } catch (err) {
            console.error(err);
        }
    };

    fetchPackages();
    fetchLocations();
  }, []);

  const selectedAirportName = watch("airport");

  // Dynamic IATA code extraction
  const getIataCode = (airportName) => {
    if (!airportName) return "";
    const parts = airportName.split(',');
    if (parts.length > 1) {
      return parts[parts.length - 1].trim();
    }
    const spaceParts = airportName.split(' ');
    if (spaceParts[spaceParts.length - 1].length === 3) {
      return spaceParts[spaceParts.length - 1].toUpperCase();
    }
    return "SXM"; // Default fallback keeping original UI flavor
  };
  const iataCode = getIataCode(selectedAirportName);

  // Filter packages based on selected airport
  const filteredPackages = useMemo(() => {
    if (!selectedAirportName || locations.length === 0) return servicePackages;

    let airportObj = null;
    for (const country of locations) {
      const match = country.airports.find(a => a.name === selectedAirportName);
      if (match) {
        airportObj = match;
        break;
      }
    }

    if (!airportObj || !airportObj.excludedPackages || airportObj.excludedPackages.length === 0) {
      return servicePackages;
    }

    return servicePackages.filter(p => !airportObj.excludedPackages.includes(p.id));
  }, [selectedAirportName, locations, servicePackages]);

  useEffect(() => {
    const currentService = watch("serviceType");
    if (filteredPackages.length > 0) {
      if (!currentService || !filteredPackages.find(p => p.name === currentService)) {
        setValue("serviceType", filteredPackages[0].name);
      }
    }
  }, [filteredPackages, setValue, watch]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    if (data.email) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch (err) {
        console.error('Failed to capture lead:', err);
      }
    }

    const query = new URLSearchParams({
      airport: data.airport,
      service: data.serviceType,
      date: data.date,
      passengers: data.passengers,
      email: data.email
    });

    router.push(`/booking?${query.toString()}`);
  };

  return (
    <form className="w-full max-w-5xl mx-auto flex flex-col gap-4 mt-8" onSubmit={handleSubmit(onSubmit)}>
      {/* Horizontal Input Row */}
      <div className="flex flex-col md:flex-row w-full bg-white rounded-lg shadow-lg overflow-hidden divide-y md:divide-y-0 md:divide-x divide-gray-200">
        
        {/* Airport Field */}
        <div className="flex-1 relative flex items-center px-4 py-3 min-h-[56px] text-gray-700 bg-white">
          <svg className="w-5 h-5 text-gray-400 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <input 
            type="text" 
            {...register("airport")}
            placeholder="Airport"
            className="w-full bg-transparent border-none focus:ring-0 outline-none font-medium text-sm text-gray-700 placeholder-gray-400 truncate"
            readOnly
          />
          <span className="text-xs text-gray-400 font-bold ml-2 shrink-0 pr-2">{iataCode}</span>
        </div>

        {/* Service Type Dropdown */}
        <div className="flex-1 relative flex items-center px-4 py-3 min-h-[56px] text-gray-700 bg-white">
          <select
            {...register("serviceType")}
            className="w-full appearance-none bg-transparent border-none focus:ring-0 outline-none font-medium text-sm text-gray-500 placeholder-gray-400 cursor-pointer"
          >
            <option value="" disabled>Service type</option>
            {filteredPackages.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Date Field */}
        <div className="flex-1 relative flex items-center px-4 py-3 min-h-[56px] text-gray-700 bg-white">
          <input
            type="date"
            {...register("date", { required: true })}
            placeholder="Service date"
            className="w-full appearance-none bg-transparent border-none focus:ring-0 outline-none font-medium text-sm text-gray-500 placeholder-gray-400 cursor-text"
            required
          />
        </div>

        {/* Passengers */}
        <div className="flex-1 relative flex items-center px-4 py-3 min-h-[56px] text-gray-700 bg-white">
          <input
            type="text"
            {...register("passengers")}
            placeholder="1 adult • no children"
            className="w-full bg-transparent border-none focus:ring-0 outline-none font-medium text-sm text-gray-500 placeholder-gray-400"
          />
          <svg className="w-5 h-5 text-gray-400 ml-2 shrink-0 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>

        {/* Email */}
        <div className="flex-1 relative flex items-center px-4 py-3 min-h-[56px] text-gray-700 bg-white md:border-r-0">
          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            className="w-full bg-transparent border-none focus:ring-0 outline-none font-medium text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="w-full mt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#3b5bdb] hover:bg-[#324db0] text-white font-bold py-4 rounded-lg transition-colors shadow-md flex justify-center items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
          Check Price
        </button>
        <p className="text-center text-xs text-gray-300 font-medium mt-3">
          By clicking "Check Price" you agree to receive email notifications.
        </p>
      </div>
    </form>
  );
}
