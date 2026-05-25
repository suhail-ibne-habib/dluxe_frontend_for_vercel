"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function LocationViewPage() {
  const { id } = useParams();
  const [loc, setLoc] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations/${id}`).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/packages`).then(r => r.json())
    ])
    .then(([locData, pkgData]) => {
      setLoc(locData);
      setPackages((pkgData || []).filter(p => p.isActive));
      setLoading(false);
    })
    .catch(e => { console.error(e); setLoading(false); });
  }, [id]);

  if (loading) return <div className="p-8 text-gray-500">Loading location...</div>;
  if (!loc || loc.message) return <div className="p-8 text-red-500">Location not found</div>;

  const isUrl = loc.flagIcon?.startsWith('/') || loc.flagIcon?.startsWith('http');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
         <Link href="/admin/locations" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
           <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
         </Link>
         <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-4">
           {isUrl ? <img src={loc.flagIcon} alt="Flag" className="h-8 shadow-sm rounded-sm" /> : <span>{loc.flagIcon}</span>}
           {loc.countryName}
         </h1>
      </div>
      
      <div className="space-y-6">
         <h2 className="text-sm text-gray-600 uppercase tracking-widest font-black flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Configured Airports in {loc.countryName} ({loc.airports?.length || 0})
         </h2>
         
         {(!loc.airports || loc.airports.length === 0) && (
            <div className="p-8 bg-gray-50 rounded-xl text-center text-gray-500 italic border border-gray-100">
               No arrival branches are configured for this country yet.
            </div>
         )}
         
         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {(loc.airports || []).map(a => (
               <div key={a.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                  <div className="mb-5 pb-5 border-b border-gray-100">
                    <h3 className="text-2xl font-black text-gray-900 leading-tight flex items-center justify-between">
                       {a.name}
                       {a.link && (
                          <a href={a.link} target="_blank" rel="noreferrer" title="Booking Link">
                            <svg className="w-5 h-5 text-gray-300 hover:text-[#ea580c] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                       )}
                    </h3>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1.5 flex items-center gap-1.5">
                       <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                       {loc.countryName}
                    </p>
                  </div>
                  
                  {a.note && (
                     <div className="mb-5 bg-orange-50 border border-orange-100 p-4 rounded-xl text-sm text-gray-800 flex gap-3 shadow-sm shadow-orange-100/50">
                        <svg className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p>{a.note}</p>
                     </div>
                  )}
                  
                  <div className="flex-1">
                     <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-2 flex items-center justify-between">
                        Service Tiers
                        <span className="bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full text-[9px]">{packages.length} Packages</span>
                     </p>
                     <div className="bg-gray-50/50 rounded-xl border border-gray-100 overflow-hidden">
                        {packages.map(pkg => {
                          const isExcluded = (a.excludedPackages || []).includes(pkg._id);
                          const pricingObj = (a.customPricing || []).find(p => p.package_id === pkg._id);
                          const customPrice = pricingObj ? pricingObj.custom_price : pkg.basePrice;
                          
                          return (
                            <div key={pkg._id} className="flex justify-between items-center py-3.5 px-4 border-b border-gray-100 last:border-0 hover:bg-white transition-colors">
                               <div className="flex items-center gap-2.5">
                                 {!isExcluded ? (
                                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
                                 ) : (
                                    <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                 )}
                                 <span className={`text-sm font-black ${!isExcluded ? 'text-gray-900' : 'text-gray-400 line-through decoration-gray-300'}`}>
                                   {pkg.name}
                                 </span>
                               </div>
                               
                               <div className="text-right flex items-center gap-2">
                                 {!isExcluded ? (
                                    <>
                                       {pricingObj && (
                                          <span className="px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 border border-amber-200" title="Custom Airport Pricing Overlay Active">Override</span>
                                       )}
                                       <span className="font-extrabold text-[#ea580c]">${customPrice}</span>
                                    </>
                                 ) : (
                                    <span className="text-[9px] font-black tracking-widest uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">Unavailable</span>
                                 )}
                               </div>
                            </div>
                          );
                        })}
                        {packages.length === 0 && (
                          <div className="p-4 text-center text-xs text-gray-400 italic">No packages configured system-wide.</div>
                        )}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
