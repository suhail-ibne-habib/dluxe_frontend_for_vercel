"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function ServiceLevels() {
  const container = useRef(null);

  useGSAP(() => {
    // Header animation
    gsap.fromTo(".service-header",
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: ".service-header",
          start: "top 80%",
        }
      }
    );

    // Cards staggered animation
    gsap.fromTo(".service-card",
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out",
        scrollTrigger: {
          trigger: ".service-cards-container",
          start: "top 75%",
        }
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="py-24 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="service-header text-center mb-16">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Elite Service Levels</h2>
        <div className="w-16 h-1 bg-[#ea580c] mx-auto rounded-full"></div>
      </div>

      <div className="service-cards-container grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="service-card group relative rounded-2xl overflow-hidden shadow-xl aspect-[3/4]">
          <img src="https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=800&auto=format&fit=crop" alt="Meet & Greet" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-32">
            <div className="bg-[#ea580c] w-10 h-10 flex items-center justify-center rounded-lg mb-4 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">VIP Meet & Greet</h3>
            <p className="text-gray-300 text-sm mb-4">Bypass airport congestion with priority access and a dedicated personal concierge managing your entire journey.</p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2"><svg className="text-[#ea580c] w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> Seamless Luggage Porterage</li>
              <li className="flex items-center gap-2"><svg className="text-[#ea580c] w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> Priority Customs Clearance</li>
            </ul>
          </div>
        </div>

        {/* Card 2 */}
        <div className="service-card group relative rounded-2xl overflow-hidden shadow-xl aspect-[3/4] border-2 border-[#ea580c]">
          <div className="absolute top-4 right-4 z-20 bg-[#ea580c] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            Popular
          </div>
          <img src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=800&auto=format&fit=crop" alt="VIP Terminal" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-32 backdrop-blur-[2px]">
            <div className="bg-[#ea580c] w-10 h-10 flex items-center justify-center rounded-lg mb-4 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">VIP Terminal</h3>
            <p className="text-gray-300 text-sm mb-4">Experience ultimate discretion in a standalone VIP terminal with private tarmac transfers directly to your aircraft.</p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2"><svg className="text-[#ea580c] w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> Dedicated Security & Passport Control</li>
              <li className="flex items-center gap-2"><svg className="text-[#ea580c] w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> Gourmet Catering & Premium Lounge</li>
            </ul>
          </div>
        </div>

        {/* Card 3 */}
        <div className="service-card group relative rounded-2xl overflow-hidden shadow-xl aspect-[3/4]">
          <img src="https://images.unsplash.com/photo-1571210862729-78a52d3779a2?q=80&w=800&auto=format&fit=crop" alt="Private Suite" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-32">
            <div className="bg-[#ea580c] w-10 h-10 flex items-center justify-center rounded-lg mb-4 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">VIP Private Suite</h3>
            <p className="text-gray-300 text-sm mb-4">Your sanctuary before departure. Enjoy a secluded, sound-proof suite equipped with luxurious amenities and personal service.</p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2"><svg className="text-[#ea580c] w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> En-Suite Spa Facilities</li>
              <li className="flex items-center gap-2"><svg className="text-[#ea580c] w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> Personalized Butler Service</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
