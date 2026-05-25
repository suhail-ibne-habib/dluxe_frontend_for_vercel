"use client";
import React from "react";
import { Zap, ArrowUpRight } from "lucide-react";

export default function AdditionalInfo({ title, items = [] }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] mb-12 tracking-tight">
          {title || "Additional information"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <a 
              key={idx} 
              href={item.link || "#"}
              className="group bg-[#f8fafc] border border-gray-100 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-start justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-white p-3 rounded-xl shadow-sm group-hover:bg-[#ea580c] group-hover:text-white transition-colors">
                  {item.icon || <Zap className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0f172a] mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    {item.description || "Explore more about our services to elevate your airport experience."}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-[#ea580c] transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
