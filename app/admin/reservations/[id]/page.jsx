"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plane, CreditCard, Undo, ShieldCheck, Clock } from "lucide-react";
export default function ReservationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [reservation, setReservation] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchReservation();
    fetchTransactions();
  }, [id]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/transactions`);
      if (res.ok) {
        const data = await res.json();
        const related = data.filter(t => t.reservationId?._id === id || t.reservationId === id);
        setTransactions(related);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  const fetchReservation = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/${id}`);
      if (!res.ok) throw new Error("Failed to fetch reservation");
      const data = await res.ok ? await res.json() : null;
      setReservation(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus, paymentStatus = null) => {
    setUpdating(true);
    try {
      const body = { status: newStatus };
      if (paymentStatus) body.paymentStatus = paymentStatus;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Update failed");
      await fetchReservation();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleRefund = async () => {
    if (!confirm("Are you sure you want to process a refund for this booking? This will also cancel the reservation.")) return;
    
    setUpdating(true);
    try {
      const lastPayment = transactions.find(t => t.status === 'Succeeded' && t.type === 'Payment');
      if (!lastPayment) {
        alert("No successful payment found to refund.");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/transactions/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: lastPayment._id,
          reservationId: id,
          reason: "Customer requested refund"
        })
      });

      if (!res.ok) throw new Error("Refund failed");
      
      alert("Refund processed successfully!");
      fetchReservation();
      fetchTransactions();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!reservation) return <div className="p-8 text-center">Reservation not found.</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/reservations" className="p-2 hover:bg-gray-100 rounded-full transition-colors print:hidden">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Reservation <span className="text-gray-400 font-mono text-xl ml-2">#{id.slice(-6).toUpperCase()}</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-semibold text-sm shadow-sm print:hidden"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Print Manifest
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block">
        <div className="lg:col-span-2 space-y-6 print:w-full print:mb-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Customer Information</h2>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                reservation.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                reservation.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                'bg-yellow-100 text-yellow-700'
              }`}>
                {reservation.status}
              </span>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                <p className="text-lg font-bold text-gray-900">{reservation.customerName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                <p className="text-[#ea580c] font-semibold">{reservation.customerEmail}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                <p className="text-gray-700 font-semibold">{reservation.customerPhone}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Service Level</p>
                <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-extrabold rounded uppercase tracking-widest">
                  {reservation.serviceLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Flight Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Route & Schedule</h2>
              <Plane className="w-4 h-4 text-gray-400" />
            </div>
            <div className="p-8 space-y-10">
              {/* Departure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-bold shrink-0 border border-orange-100 uppercase">
                    {reservation.fromLocation?.flag || "✈️"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Departure (Service Point)</p>
                    <p className="text-gray-900 font-bold">{reservation.fromAirport}</p>
                    <p className="text-sm text-gray-500">{reservation.fromLocation?.countryName || "International"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Schedule Date</p>
                  <p className="text-gray-900 font-bold text-lg">{reservation.departureDate ? new Date(reservation.departureDate).toLocaleDateString(undefined, { dateStyle: 'full' }) : 'N/A'}</p>
                </div>
              </div>

              {/* Arrival (Optional) */}
              {reservation.toAirport && (
                <div className="pt-8 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0 border border-blue-100 uppercase">
                      {reservation.toLocation?.flag || "🛬"}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Arrival Destination</p>
                      <p className="text-gray-900 font-bold">{reservation.toAirport}</p>
                      <p className="text-sm text-gray-500">{reservation.toLocation?.countryName || "International"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Return / Arrival Date</p>
                    <p className="text-gray-900 font-bold text-lg">
                      {reservation.returnDate ? new Date(reservation.returnDate).toLocaleDateString(undefined, { dateStyle: 'full' }) : "Not Specified"}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Passengers</p>
                  <p className="text-xl font-black text-gray-900">{reservation.passengers} PAX</p>
                </div>
                <div className="md:col-span-2 p-4 bg-orange-50/30 rounded-xl border border-orange-100/50">
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2">Internal Manifest Notes</p>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed italic">
                    "{reservation.notes || "No special requirements listed for this flight."}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 px-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <h2 className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">System Metadata</h2>
              <div className="flex gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Created: {reservation.createdAt ? new Date(reservation.createdAt).toLocaleString() : 'N/A'}</span>
                <span>ID: {reservation._id}</span>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 uppercase tracking-wider text-xs flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5" /> Transaction History
              </h2>
            </div>
            <div className="p-0">
              {transactions.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No recorded transactions for this booking.</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                    <tr>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {transactions.map(t => (
                      <tr key={t._id}>
                        <td className="px-6 py-4 text-gray-500">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td className="px-6 py-4 font-medium">{t.type}</td>
                        <td className="px-6 py-4 font-bold">${t.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            t.status === 'Succeeded' ? 'bg-green-100 text-green-700' : 
                            t.status === 'Refunded' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6 shrink-0">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">Service Package</h3>
            <div className="flex flex-col gap-6">
              <div className="p-4 bg-gray-900 text-white rounded-2xl shadow-lg">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Level</p>
                <p className="text-2xl font-black italic">{reservation.serviceLevel} SERVICE</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Unit Price</span>
                  <span className="font-bold text-gray-900">USD ${reservation.totalAmount / reservation.passengers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Total Value</span>
                  <span className="text-2xl font-black text-[#ea580c]">USD ${reservation.totalAmount}</span>
                </div>
              </div>

              <div className={`w-full py-2.5 px-4 rounded-xl text-center font-black text-[10px] uppercase tracking-widest shadow-inner ${
                reservation.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'
              }`}>
                {reservation.paymentStatus}
              </div>
              
              <button 
                disabled={updating}
                onClick={() => updateStatus(reservation.status, reservation.paymentStatus === 'Paid' ? 'Unpaid' : 'Paid')}
                className="w-full py-4 bg-gray-50 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all border border-gray-200 print:hidden"
              >
                Toggle Payment Status
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 print:hidden">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Admin Actions</h3>
            <div className="space-y-3">
              <button 
                disabled={updating || reservation.status === 'Confirmed'}
                onClick={() => updateStatus('Confirmed')}
                className="w-full py-3 bg-[#ea580c] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-orange-700 disabled:opacity-50 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> Confirm Booking
              </button>
              <button 
                disabled={updating || reservation.paymentStatus !== 'Paid'}
                onClick={handleRefund}
                className="w-full py-3 bg-white text-amber-600 border border-amber-100 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-amber-50 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Undo className="w-4 h-4" /> Issue Refund
              </button>
              <button 
                disabled={updating || reservation.status === 'Cancelled'}
                onClick={() => updateStatus('Cancelled')}
                className="w-full py-3 bg-white text-red-600 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-red-50 disabled:opacity-50 transition-all border border-red-100 flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" /> Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
