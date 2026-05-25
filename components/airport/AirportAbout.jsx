"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function AirportAbout({ title, content, airportName }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-24 bg-[#f8fafc] border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 md:px-12">
        <div className={`relative overflow-hidden transition-all duration-700 ${isExpanded ? "max-h-[2000px]" : "max-h-[250px]"}`}>
          <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-loose space-y-6">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <>
                <p>
                  Traveling through a busy island airport can turn out to be unexpectedly challenging, even when the destination itself promises complete relaxation. {airportName || "This airport"} is one of the most visited Caribbean hubs, welcoming tourists, business guests, and private aviation throughout the year.
                </p>
                <p>
                  Our VIP services are designed to remove the stress of travel. From the moment you land, our dedicated staff will be there to greet you, assist with your luggage, and expedite your journey through the necessary airport procedures.
                </p>
                <p>
                  Whether you are arriving for a luxury vacation or departing after a memorable stay, our goal is to ensure that your time at the airport is as comfortable and efficient as possible. With access to exclusive lounges, direct tarmac transfers, and personalized assistance, you can start or end your journey on a high note.
                </p>
              </>
            )}
          </div>
          
          {!isExpanded && (
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f8fafc] to-transparent"></div>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-8 py-3 rounded-full border border-gray-200 bg-white text-[#0f172a] font-bold hover:border-[#ea580c] hover:text-[#ea580c] transition-all duration-300 shadow-sm"
          >
            <span>{isExpanded ? "Read less" : "Read more"}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </section>
  );
}
