"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function GlobalNetwork() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.fromTo(".network-header",
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: ".network-header",
          start: "top 80%",
        }
      }
    );

    gsap.fromTo(".network-card",
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: "power2.out",
        scrollTrigger: {
          trigger: ".network-cards-container",
          start: "top 75%",
        }
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="py-20 bg-gray-50 border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="network-header flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Global Network</h2>
            <p className="text-gray-500">Available in over 150+ international airports.</p>
          </div>
          <a href="#" className="flex items-center gap-2 text-[#ea580c] font-semibold hover:text-orange-700 transition-colors">
            View All Destinations
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </div>

        <div className="network-cards-container grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Dest 1 */}
          <a href="/airport/london-heathrow" className="network-card relative rounded-xl overflow-hidden aspect-[4/5] group cursor-pointer block">
            <img src="https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=600&auto=format&fit=crop" alt="London" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <h4 className="text-white font-bold text-lg md:text-xl">London (LHR)</h4>
              <p className="text-gray-300 text-xs font-semibold uppercase tracking-wider">United Kingdom</p>
            </div>
          </a>
          {/* Dest 2 */}
          <div className="network-card relative rounded-xl overflow-hidden aspect-[4/5] group cursor-pointer">
            <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600&auto=format&fit=crop" alt="Dubai" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <h4 className="text-white font-bold text-lg md:text-xl">Dubai (DXB)</h4>
              <p className="text-gray-300 text-xs font-semibold uppercase tracking-wider">UAE</p>
            </div>
          </div>
          {/* Dest 3 */}
          <div className="network-card relative rounded-xl overflow-hidden aspect-[4/5] group cursor-pointer">
            <img src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=600&auto=format&fit=crop" alt="New York" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <h4 className="text-white font-bold text-lg md:text-xl">New York (JFK)</h4>
              <p className="text-gray-300 text-xs font-semibold uppercase tracking-wider">USA</p>
            </div>
          </div>
          {/* Dest 4 */}
          <a href="/airport/princess-juliana-sxm" className="network-card relative rounded-xl overflow-hidden aspect-[4/5] group cursor-pointer block">
            <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop" alt="Sint Maarten" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <h4 className="text-white font-bold text-lg md:text-xl">Sint Maarten (SXM)</h4>
              <p className="text-gray-300 text-xs font-semibold uppercase tracking-wider">Caribbean</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
