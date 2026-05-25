"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const defaultFaqs = [
  {
    question: "What is VIP Airport Meet & Greet service?",
    answer: "Our VIP Meet & Greet service provides a personal concierge to escort you through the airport, helping with luggage, fast-tracking you through security and customs, and ensuring a seamless transition from your vehicle to the plane or vice versa."
  },
  {
    question: "What is the difference between Meet & Greet, VIP Terminal, and VIP Private Suite?",
    answer: "Meet & Greet happens in the main terminal with fast-track services. VIP Terminal uses a separate standalone facility away from the main terminal crowds. VIP Private Suite offers a fully private, luxury room within the airport for ultimate privacy and relaxation."
  },
  {
    question: "What is included in VIP Airport Meet & Assist?",
    answer: "It typically includes a personal escort, porter services for your luggage, priority check-in assistance, and fast-track clearance through security, immigration, and customs."
  },
  {
    question: "Does VIP Meet & Greet include baggage porter, lounge access, golf cart buggy or airport transfer?",
    answer: "Baggage porter is usually included. Lounge access depends on the package level. Golf cart buggies and airport transfers can be added as supplementary services or are included in premium packages like the VIP Terminal."
  }
];

export default function AirportFAQ({ faqs = defaultFaqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight mb-4">Frequently Asked Questions</h2>
          <div className="h-1.5 w-16 bg-[#ea580c] mx-auto rounded-full"></div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border-b border-gray-100 last:border-0 transition-all duration-300 ${openIndex === index ? "bg-gray-50/50 rounded-2xl px-6" : "px-2"}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between py-8 text-left focus:outline-none group"
              >
                <span className={`text-lg md:text-xl font-bold transition-colors duration-300 ${openIndex === index ? "text-[#ea580c]" : "text-gray-800 group-hover:text-[#ea580c]"}`}>
                  {faq.question}
                </span>
                <span className={`ml-6 shrink-0 transition-transform duration-500 ${openIndex === index ? "rotate-180 text-[#ea580c]" : "text-gray-300 group-hover:text-[#ea580c]"}`}>
                  {openIndex === index ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-[500px] pb-8 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
