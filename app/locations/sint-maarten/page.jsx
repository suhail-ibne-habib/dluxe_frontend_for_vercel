import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AirportHero from "@/components/airport/AirportHero";
import AirportPackages from "@/components/airport/AirportPackages";
import AirportTestimonials from "@/components/airport/AirportTestimonials";
import AirportFAQ from "@/components/airport/AirportFAQ";
import AdditionalInfo from "@/components/airport/AdditionalInfo";
import AirportAbout from "@/components/airport/AirportAbout";
import { Zap } from "lucide-react";

export const metadata = {
  title: "Princess Juliana Airport VIP Services (SXM) | D'LUXE",
  description: "Experience premium VIP treatment at Princess Juliana International Airport (SXM). Enjoy personalized meet & greet, fast-track clearance, and exclusive lounge access.",
};

const additionalItems = [
  {
    title: "SXM Fast Track",
    description: "Explore more about our Fast Track services to elevate your airport experience in Sint Maarten.",
    link: "/booking?airport=Princess Juliana International Airport&service=Silver Package",
    icon: <Zap className="w-5 h-5" />
  }
];

const aboutContent = `
  <p>
    Traveling through a busy island airport can turn out to be unexpectedly challenging, even when the destination itself promises complete relaxation. Sint Maarten is one of the most visited Caribbean hubs, welcoming tourists, business guests, and private aviation throughout the year. This airport also serves as a transit point for flights to St. Barths and several other Caribbean destinations.
  </p>
  <p>
    Princess Juliana International Airport (SXM) is world-renowned, not just for its proximity to Maho Beach, but for being the premier gateway to the dual-nation island of Saint Martin / Sint Maarten. Handling millions of passengers annually, the terminal can become quite congested during peak season.
  </p>
  <p>
    Our VIP services at SXM are meticulously crafted to provide a sanctuary of calm amidst the airport's hustle. Whether you require a swift transition through customs with our Fast Track service or prefer the ultimate privacy of the VIP Terminal, our team ensures every detail is handled with professionalism and care.
  </p>
`;

export default function SintMaartenPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased overflow-x-hidden">
      <Navbar />
      
      <AirportHero 
        title="Princess Juliana Airport VIP Services (SXM)"
        subtitle="Enhance every step of your travel experience, whether it's arrival, departure, or connecting flights, with our VIP treatment. Our top-notch service is available to ensure your journey is seamless."
        iata="SXM"
        backgroundImage="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2600&auto=format&fit=crop"
        airportName="Princess Juliana International Airport"
      />

      <AirportPackages 
        airportName="Princess Juliana International Airport"
      />

      <AirportTestimonials />

      <AdditionalInfo items={additionalItems} />

      <AirportFAQ />

      <AirportAbout 
        airportName="Princess Juliana International Airport"
        content={aboutContent}
      />

      <Footer />
    </div>
  );
}
