"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Calendar, User, Search, Filter, Loader2, Info, Eye } from 'lucide-react';
import Link from 'next/link';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
      }
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  const deleteLead = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this lead?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads(leads.filter(l => l.id !== id && l._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const search = searchTerm.toLowerCase();
    if (!search) return true;
    if (lead.email.toLowerCase().includes(search)) return true;
    
    if (lead.airport) {
        if (lead.airport.toLowerCase().includes(search)) return true;
        
        // IATA code custom check
        const parts = lead.airport.split(',');
        let iata = "";
        if (parts.length > 1) {
            iata = parts[parts.length - 1].trim().toLowerCase();
        } else {
            const spaceParts = lead.airport.split(' ');
            if (spaceParts[spaceParts.length - 1].length === 3) {
                iata = spaceParts[spaceParts.length - 1].toLowerCase();
            }
        }
        if (iata && search === iata) return true;
        if (iata && iata.includes(search)) return true;
    }
    
    return false;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Leads & Inquiries</h1>
          <p className="text-gray-500 mt-1">Manage potential customers and track follow-ups.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by email or airport..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ea580c] w-64 transition-all focus:bg-white"
            />
          </div>
          <button 
            onClick={fetchLeads}
            className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 flex items-center gap-2 transition-colors active:scale-95"
          >
            <Loader2 className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {loading && leads.length === 0 ? (
          <div className="p-24 flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 text-[#ea580c] animate-spin mb-4" />
            <p className="text-gray-400 font-medium">Loading your leads...</p>
          </div>
        ) : filteredLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center w-16">#</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Departure / Service</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">PX</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status Tracking</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.map((lead, index) => (
                  <tr key={lead.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-5 text-xs text-gray-400 text-center font-bold">{index + 1}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#ea580c] ring-4 ring-orange-50">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 leading-tight">{lead.email}</span>
                          <span className="text-gray-400 text-[11px] font-medium uppercase mt-0.5">Direct Inquiry</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm">{lead.airport || 'Unknown'}</span>
                        <span className="text-[#ea580c] text-xs font-bold mt-0.5">{lead.serviceType || 'Standard'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="px-2 py-1 rounded-md text-[11px] font-black bg-slate-100 text-slate-600 border border-slate-200">
                        {lead.passengers || 1}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <select 
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        className={`text-[11px] font-black px-3 py-1.5 rounded-full border cursor-pointer outline-none transition-all ${
                          lead.status === 'Booked' 
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                            : lead.status === 'Contacted'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                            : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
                        }`}
                      >
                        <option value="Inquiry">INQUIRY</option>
                        <option value="Contacted">CONTACTED</option>
                        <option value="Booked">BOOKED</option>
                      </select>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-2 font-bold text-gray-400 text-xs uppercase">
                        <Calendar className="h-3.5 w-3.5" />
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right flex justify-end gap-1">
                      <Link 
                        href={`/admin/leads/${lead.id || lead._id}`}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="View Lead Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button 
                        onClick={() => deleteLead(lead.id || lead._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Lead"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-gray-50/50">
              <Info className="h-10 w-10 text-gray-200" />
            </div>
            <h3 className="text-gray-900 font-bold text-lg">No leads found</h3>
            <p className="text-gray-400 text-sm mt-1 max-w-xs">Try searching with a different term or refresh the page.</p>
          </div>
        )}
      </div>
    </div>
  );
}
