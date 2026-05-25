"use client";
import React, { useEffect, useState, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

export default function AirportTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/testimonials`);
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data.filter(t => t.is_published));
        }
      } catch (e) {
        console.error("Failed to load testimonials", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: -400, behavior: 'smooth' });
  };
  
  const scrollRight = () => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: 400, behavior: 'smooth' });
  };

  if (loading || testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-sm font-bold text-[#ea580c] tracking-[0.2em] uppercase mb-4">Testimonials</h2>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight">What our clients say</h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={scrollLeft} 
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#ea580c] hover:text-[#ea580c] hover:bg-orange-50 transition-all duration-300 shadow-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={scrollRight} 
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#ea580c] hover:text-[#ea580c] hover:bg-orange-50 transition-all duration-300 shadow-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div 
          ref={sliderRef}
          className="flex gap-8 overflow-x-auto pb-10 snap-x snap-mandatory scrollbar-hide no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((t) => (
            <div 
              key={t.id} 
              className="min-w-[320px] md:min-w-[420px] max-w-[420px] snap-start bg-[#f8fafc] rounded-3xl p-10 flex flex-col relative group hover:bg-[#f1f5f9] transition-colors duration-500"
            >
              <ArrowUpRight className="w-6 h-6 text-gray-300 absolute top-10 right-10 group-hover:text-[#ea580c] transition-colors" />
              
              <div className="flex gap-1 text-blue-500 mb-8">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              <p className="text-gray-600 text-lg mb-10 flex-grow leading-relaxed font-medium italic">
                "{t.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[#0f172a] font-bold text-lg">
                  {t.author_name?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-[#0f172a] text-base">{t.author_name}</h4>
                  <p className="text-xs text-gray-400 font-bold tracking-wider uppercase">
                    {new Date(t.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
