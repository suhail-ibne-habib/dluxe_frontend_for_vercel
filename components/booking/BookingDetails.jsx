import React, { useState, useEffect } from 'react';

export default function BookingDetails({ airport, date, passengers, activeService, setActiveService }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [airportNote, setAirportNote] = useState('');
  const [customPricingState, setCustomPricingState] = useState([]);

  useEffect(() => {
    const fetchPkgs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/packages`);
        if (res.ok) {
          const data = await res.json();
          const active = data.filter(p => p.isActive);
          
          // Fetch locations to check for exclusions
          const locRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations`);
          let excludedIds = [];
          if (locRes.ok) {
            const locations = await locRes.json();
            for (const country of locations) {
              const match = country.airports.find(a => a.name === airport);
              if (match) {
                excludedIds = match.excludedPackages || [];
                setAirportNote(match.note || '');
                setCustomPricingState(match.customPricing || []);
                break;
              }
            }
          }

          const filtered = active.filter(p => !excludedIds.includes(p._id));
          setPackages(filtered);

          // If the current active service isn't in the list, default to first
          if (filtered.length > 0 && !filtered.find(p => p.name === activeService)) {
            setActiveService(filtered[0].name);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPkgs();
  }, [activeService, setActiveService, airport]);

  const selectedPkg = packages.find(p => p.name === activeService) || packages[0];
  
  const getComputedPrice = (pkg) => {
    if (!pkg) return 0;
    const rule = customPricingState.find(cp => parseInt(cp.package_id) === parseInt(pkg._id || pkg.id));
    if (rule && rule.custom_price) {
      return parseFloat(rule.custom_price);
    }
    return pkg.basePrice;
  };

  if (loading) return <div className="p-20 text-center font-bold text-gray-400 animate-pulse uppercase tracking-widest">Loading services...</div>;

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Header Block */}
      <div className="bg-[#f3f4f6] rounded-xl p-8 text-center flex flex-col gap-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-gray-100/50">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1f2937]">Arrival {airport || 'AMS, Amsterdam Airport Schiphol'}</h2>
        <div className="flex justify-center items-center gap-6 text-sm font-semibold text-gray-600">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {date || '18 Mar, 2026'}
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            {passengers || '1'} {parseInt(passengers || '1') === 1 ? 'Adult' : 'Adults'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mt-2">
        {packages.map(p => (
          <button
            key={p._id}
            onClick={() => setActiveService(p.name)}
            className={`flex-1 min-w-[160px] p-5 rounded-2xl border-2 transition-all relative group ${activeService === p.name ? 'border-[#ea580c] bg-white shadow-xl translate-y-[-2px]' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300'}`}
          >
            {p.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ea580c] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-orange-500/30 whitespace-nowrap">
                Most Popular
              </div>
            )}
            <div className="text-left pt-1">
              <h4 className="font-bold text-gray-900 mb-1">{p.name}</h4>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Total USD ${getComputedPrice(p) * parseInt(passengers || '1')}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Airport Note Section */}
      {airportNote && (
        <div className="bg-orange-50/50 rounded-xl border border-orange-100 p-6 mt-2 flex items-start gap-4">
          <div className="p-3 bg-white text-[#ea580c] rounded-xl shrink-0 shadow-sm border border-orange-100">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="pt-0.5">
            <h4 className="text-sm font-bold text-[#ea580c] mb-1">Airport Notice</h4>
            <p className="text-sm text-gray-700 font-medium leading-relaxed">{airportNote}</p>
          </div>
        </div>
      )}

      {/* Service Details Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm flex flex-col md:flex-row gap-12 mt-2">
        {/* Left Side: Pricing */}
        <div className="md:w-1/3 flex flex-col justify-between">
          <div>
            <span className="inline-block px-3 py-1 bg-gray-900 text-white text-[10px] font-extrabold uppercase tracking-widest rounded mb-4">Elite Selection</span>
            <h3 className="text-3xl font-bold text-gray-900 leading-tight">
              {selectedPkg?.name}
            </h3>
            <p className="text-sm text-gray-500 mt-2 font-medium leading-relaxed">{selectedPkg?.description || "Experience seamless luxury with our curated airport services."}</p>
          </div>
          <div className="mt-8 md:mt-0 pt-6 border-t border-gray-50">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total package price</p>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-gray-900">USD {getComputedPrice(selectedPkg) * parseInt(passengers || '1')}</span>
              </div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {parseInt(passengers || '1')} {parseInt(passengers || '1') === 1 ? 'Passenger' : 'Passengers'} (@ ${getComputedPrice(selectedPkg)})
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Features */}
        <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-gray-100 pt-8 md:pt-0 md:pl-12">
          <p className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Included in Package:</p>
          <ul className="grid grid-cols-1 gap-6">
            {selectedPkg?.features.map((feature, idx) => (
              <li key={idx} className="flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#ea580c]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-xs text-gray-700 font-bold leading-relaxed">{feature}</p>
              </li>
            ))}
            {selectedPkg?.features.length === 0 && (
              <li className="text-sm text-gray-400 italic col-span-full">Standard concierge features included.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

