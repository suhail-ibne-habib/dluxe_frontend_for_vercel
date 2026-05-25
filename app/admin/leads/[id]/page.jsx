"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function LeadViewPage() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/${id}`)
      .then(r => r.json())
      .then(d => { setLead(d); setLoading(false); })
      .catch(e => { console.error(e); setLoading(false); });
  }, [id]);

  if (loading) return <div className="p-8 text-gray-500">Loading lead profile...</div>;
  if (!lead || lead.message) return <div className="p-8 text-red-500">Lead not found</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300 font-sans">
      <div className="flex items-center gap-4 mb-8">
         <Link href="/admin/leads" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
           <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
         </Link>
         <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Lead Analytics Profile</h1>
      </div>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
         <div className="flex justify-between items-start border-b border-gray-100 pb-8 mb-8">
            <div className="flex gap-4 items-center">
               <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-[#ea580c]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
               </div>
               <div>
                  <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Inquiry Contact</p>
                  <p className="text-2xl font-bold mt-1 text-gray-900">{lead.email}</p>
               </div>
            </div>
            <span className={`px-4 py-1.5 font-black uppercase text-[10px] tracking-widest rounded-full border ${
               lead.status === 'Booked' ? 'bg-green-50 text-green-700 border-green-200' :
               lead.status === 'Contacted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
               'bg-orange-50 text-orange-700 border-orange-200'
            }`}>
               Status: {lead.status || 'Pending'}
            </span>
         </div>
         
         <div className="grid grid-cols-2 gap-x-8 gap-y-10">
            <div>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 Target Airport
               </p>
               <p className="text-lg font-bold text-gray-900">{lead.airport || 'General Inquiry'}</p>
            </div>
            <div>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Service Type</p>
               <p className="inline-block bg-gray-900 text-white text-xs px-3 py-1 font-bold rounded uppercase tracking-wider">{lead.service_type || lead.serviceType || 'Not specified'}</p>
            </div>
            <div>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                 Passengers
               </p>
               <p className="text-lg font-bold text-gray-900">{lead.passengers || 1} PAX</p>
            </div>
            <div>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 Requested Flight Date
               </p>
               <p className="text-lg font-bold text-gray-900">{lead.date || 'Not specified'}</p>
            </div>
         </div>
      </div>
      
      <div className="text-center">
         <p className="text-xs text-gray-400 font-medium">Acquired on {(lead.created_at || lead.createdAt) ? new Date(lead.created_at || lead.createdAt).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' }) : 'N/A'}</p>
      </div>
    </div>
  );
}
