"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalReservations: 0,
    pendingRequests: 0,
    activeLocations: 0,
    recentActivity: []
  });
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [resStats, resRevenue] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations`), // Assuming this exists or returns list
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics/revenue`)
        ]);

        if (resStats.ok && resRevenue.ok) {
          const reservations = await resStats.json();
          const revenue = await resRevenue.json();

          setStats({
            totalReservations: reservations.length,
            pendingRequests: reservations.filter(r => r.status === 'Pending').length,
            activeLocations: 0, // We'd need another API for this
            recentActivity: reservations.slice(0, 5)
          });
          setRevenueData(revenue);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const maxRevenue = Math.max(...revenueData.map(d => d.total), 1000);

  return (
    <div className="text-gray-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">System Dashboard</h1>
        <p className="text-gray-500 mt-1">Real-time overview of your terminal operations.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Calendar className="w-6 h-6" /></div>
          <div>
            <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Total Reservations</h3>
            <p className="text-3xl font-black text-gray-900">{stats.totalReservations}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-[#ea580c] rounded-xl"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Pending Requests</h3>
            <p className="text-3xl font-black text-[#ea580c]">{stats.pendingRequests}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><MapPin className="w-6 h-6" /></div>
          <div>
            <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Network Growth</h3>
            <p className="text-3xl font-black text-indigo-600">+12%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-gray-900">Revenue Analytics</h2>
            <select className="text-xs font-bold uppercase tracking-widest border-none bg-gray-50 rounded-lg px-3 py-1.5 focus:ring-0">
              <option>Last 12 Months</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {revenueData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-sm">Waiting for transaction data...</div>
            ) : (
              revenueData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                  <div 
                    className="w-full bg-gray-900 rounded-t-lg transition-all duration-500 group-hover:bg-[#ea580c] relative"
                    style={{ height: `${(d.total / maxRevenue) * 100}%`, minHeight: '4px' }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      ${d.total}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase rotate-45 md:rotate-0">{d.name.split(' ')[0]}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <ArrowRight className="w-4 h-4 text-gray-300" />
          </div>
          
          <div className="space-y-6">
            {stats.recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-300 italic text-sm">No recent bookings</div>
            ) : (
              stats.recentActivity.map((r) => (
                <div key={r._id} className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${r.status === 'Confirmed' ? 'bg-green-500' : 'bg-orange-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{r.customerName}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{r.fromAirport}</p>
                  </div>
                  <p className="text-xs font-bold text-gray-400">${r.totalAmount}</p>
                </div>
              ))
            )}
          </div>
          
          <button className="w-full mt-8 py-3 bg-gray-50 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-colors">
            View All Manifests
          </button>
        </div>
      </div>
    </div>
  );
}
