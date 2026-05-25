"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import ServiceLevels from "@/components/home/ServiceLevels";
import GlobalNetwork from "@/components/home/GlobalNetwork";
import ReviewsSection from "@/components/home/ReviewsSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ServiceLevels />
      <GlobalNetwork />
      <ReviewsSection />
      <Footer />
    </div>
  );
}
