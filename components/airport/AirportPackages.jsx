"use client";
import React, { useEffect, useState } from "react";
import { Check, ArrowRight } from "lucide-react";

export default function AirportPackages({ airportId, airportName }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [airportConfig, setAirportConfig] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgRes, locRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/packages`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/locations`)
        ]);
        
        if (pkgRes.ok && locRes.ok) {
          const allPkgs = await pkgRes.json();
          const allLocs = await locRes.json();
          
          let config = null;
          const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

          // Find the airport config to check for excluded packages and custom pricing
          if (airportId) {
            for (const loc of allLocs) {
              const found = loc.airports?.find(a => a.id === airportId || a._id === airportId);
              if (found) {
                config = found;
                break;
              }
            }
          } else {
            // First try to find by explicit link (highly reliable connection with the dashboard)
            if (currentPath) {
              for (const loc of allLocs) {
                const found = loc.airports?.find(a => a.link && (a.link === currentPath || a.link === currentPath.replace(/\/$/, '')));
                if (found) {
                  config = found;
                  break;
                }
              }
            }
            
            // Fallback to name matching if no link is configured yet
            if (!config && airportName) {
              for (const loc of allLocs) {
                const found = loc.airports?.find(a => a.name.toLowerCase().includes(airportName.toLowerCase()));
                if (found) {
                  config = found;
                  break;
                }
              }
            }
          }

          setAirportConfig(config);
          const activePkgs = allPkgs.filter(p => !!p.isActive);
          
          // Filter out excluded packages
          const availablePkgs = activePkgs.filter(p => {
            const pkgId = p._id || p.id;
            return !config?.excludedPackages?.includes(pkgId);
          });
          
          setPackages(availablePkgs);
        }
      } catch (e) {
        console.error("Failed to load packages", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [airportId, airportName]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-[#ea580c] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-[#ea580c] tracking-[0.2em] uppercase mb-4">Service Levels</h2>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-6 tracking-tight">Service levels available at {airportName || "this location"}</h2>
          <p className="text-lg text-gray-600 font-medium">Choose the perfect level of service for your arrival, departure, or connection.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {packages.map((pkg, idx) => {
            const pkgId = pkg._id || pkg.id;
            let price = pkg.basePrice;
            
            // Apply custom pricing if exists
            if (airportConfig?.customPricing) {
              const cp = airportConfig.customPricing.find(c => String(c.package_id) === String(pkgId));
              if (cp && cp.custom_price) price = cp.custom_price;
            }

            const isGold = pkg.name.toLowerCase().includes('gold') || pkg.name.toLowerCase().includes('terminal');
            const isBlack = pkg.name.toLowerCase().includes('black') || pkg.name.toLowerCase().includes('suite');
            const isSilver = pkg.name.toLowerCase().includes('silver') || pkg.name.toLowerCase().includes('meet');

            return (
              <div 
                key={pkgId} 
                className={`group relative flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 ${isGold ? "ring-2 ring-[#ea580c]/10" : ""}`}
              >
                {/* Package Image / Icon Header */}
                <div className="h-56 relative overflow-hidden">
                  <img 
                    src={isSilver ? "https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=800&auto=format&fit=crop" : 
                         isGold ? "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=800&auto=format&fit=crop" : 
                         "https://images.unsplash.com/photo-1571210862729-78a52d3779a2?q=80&w=800&auto=format&fit=crop"} 
                    alt={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white ${isSilver ? "bg-gray-500" : isGold ? "bg-amber-500" : "bg-zinc-900"}`}>
                      {pkg.name.split(' ')[0]} Package
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-[#0f172a] mb-2">{pkg.name}</h3>
                  <div className="mb-6">
                    <span className="text-gray-400 text-sm font-medium uppercase tracking-wider block mb-1">Included in package</span>
                    <div className="h-1 w-8 bg-[#ea580c] rounded-full"></div>
                  </div>

                  <ul className="space-y-4 mb-8 flex-1">
                    {(pkg.services || []).slice(0, 4).map((srv, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1 bg-blue-50 rounded-full p-0.5 shrink-0">
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <span className="text-gray-600 text-sm font-medium leading-tight">{srv.title || srv}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => {
                        const query = new URLSearchParams({
                          airport: airportName || "",
                          service: pkg.name,
                        });
                        window.location.href = `/booking?${query.toString()}`;
                    }}
                    className="group/btn relative w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl border border-gray-200 text-[#0f172a] font-bold hover:bg-[#0f172a] hover:text-white hover:border-[#0f172a] transition-all duration-300"
                  >
                    <span>Read more</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
