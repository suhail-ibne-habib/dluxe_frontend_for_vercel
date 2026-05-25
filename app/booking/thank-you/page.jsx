"use client";

import React from "react";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Booking Received!</h1>
        <p className="text-gray-500 mb-10 leading-relaxed font-medium">
          Thank you for choosing D'LUXE. Your reservation request has been received and our concierge team is currently reviewing the details.
        </p>
        
        <div className="bg-gray-50 rounded-2xl p-6 mb-10 text-left border border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">What happens next?</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-gray-700">
              <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm flex-shrink-0">1</span>
              <span>We'll verify the availability with the airport authorities.</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-700">
              <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm flex-shrink-0">2</span>
              <span>An official confirmation and invoice will be sent to your email.</span>
            </li>
          </ul>
        </div>
        
        <Link 
          href="/"
          className="inline-block w-full bg-[#ea580c] text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/30"
        >
          Return to Homepage
        </Link>
        
        <p className="mt-8 text-xs text-gray-400 font-semibold uppercase tracking-widest">
          Need immediate help? <span className="text-[#ea580c] cursor-pointer">24/7 Concierge Support</span>
        </p>
      </div>
    </div>
  );
}
