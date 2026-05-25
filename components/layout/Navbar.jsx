"use client";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('18555759847');
  const [displayNumber, setDisplayNumber] = useState('+1 855 575 98 47');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`);
        if (res.ok) {
          const data = await res.json();
          if (data.whatsapp_number) {
            setPhoneNumber(data.whatsapp_number.replace(/[^\d+]/g, ''));
            setDisplayNumber(data.whatsapp_number);
          }
        }
      } catch (e) {}
    };
    fetchSettings();
  }, []);

  const waLink = phoneNumber ? `https://wa.me/${phoneNumber.replace('+', '')}` : '#';

  return (
    <>
      <nav className="absolute top-0 w-full z-50 flex justify-between items-center py-6 px-4 md:px-12 text-white">
        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          {/* Logo Image */}
          <img src="/dluxe-logo.jpg" alt="D'LUXE Logo" className="h-20 w-auto object-contain rounded-xl" />
        </a>
        <div className="hidden md:flex items-center gap-8 font-medium text-sm">
          <a href="/locations" className="hover:text-[#ea580c] transition-colors py-2 uppercase tracking-wider font-bold">
            Locations
          </a>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-green-600 flex items-center gap-2 text-white px-6 py-2.5 rounded border border-[#25D366] hover:border-green-600 font-bold transition-all shadow-lg shadow-[#25D366]/20">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            <span className="tracking-wide">{displayNumber}</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white hover:text-[#ea580c] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0f172a]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-8 text-white md:hidden animate-in fade-in duration-200">
          <a href="/locations" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold hover:text-[#ea580c] transition-colors">Locations</a>

          <a href={waLink} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-green-600 flex items-center gap-3 text-white px-8 py-3 rounded-md font-semibold text-lg transition-colors mt-4">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            <span className="tracking-wide text-2xl">{displayNumber}</span>
          </a>
        </div>
      )}
    </>
  );
}
