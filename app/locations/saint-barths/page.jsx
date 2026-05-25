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
  title: "SBH, Saint Barthélemy Airport VIP Services | D'LUXE",
  description: "Experience premium VIP treatment at Saint Barthélemy Airport (SBH). Enjoy personalized meet & greet, fast-track clearance, and exclusive lounge access.",
};

const additionalItems = [
  {
    title: "SBH Fast Track",
    description: "Expedite your airport experience with our priority fast-track service through security and customs.",
    link: "/booking?airport=Saint Barthélemy Airport&service=Silver Package",
    icon: <Zap className="w-5 h-5" />
  }
];

const aboutContent = `
  <p>
    Saint Barthélemy Airport (SBH), also known as Gustaf III Airport, is famous for its unique and thrilling landing approach. As the gateway to one of the most exclusive islands in the Caribbean, SBH handles a high volume of private charters and regional flights.
  </p>
  <p>
    Our VIP services at SBH ensure that your arrival or departure is as sophisticated as the island itself. From the moment your aircraft touches down, our personal concierges are ready to assist you, managing your luggage and whisking you through the arrivals process so you can reach your villa or yacht sooner.
  </p>
  <p>
    For departures, we provide a seamless check-in experience and access to comfortable waiting areas, ensuring that your final moments on the island are spent in relaxation. Whether you are traveling for business or pleasure, our team is dedicated to providing the highest level of service at Saint Barthélemy Airport.
  </p>
`;

export default function SaintBarthsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased overflow-x-hidden">
      <Navbar />
      
      <AirportHero 
        title="SBH, Saint Barthélemy Airport"
        subtitle="Enhance every step of your travel experience, whether it's arrival, departure, or connecting flights, with our VIP treatment. Our top-notch service is available to ensure your journey is seamless."
        iata="SBH"
        backgroundImage="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2600&auto=format&fit=crop"
        airportName="Saint Barthélemy Airport"
      />

      <AirportPackages 
        airportName="Saint Barthélemy Airport"
      />

      <AirportTestimonials />

      <AdditionalInfo items={additionalItems} />

      <AirportFAQ />

      <AirportAbout 
        airportName="Saint Barthélemy Airport"
        content={aboutContent}
      />

      <Footer />
    </div>
  );
}
