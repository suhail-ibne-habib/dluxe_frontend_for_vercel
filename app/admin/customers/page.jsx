"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Search, User, Mail, Phone, History, ArrowRight, X, Plane, Calendar, CreditCard } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';

export default function CustomersAdmin() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorted] = useState([]);
  
  // History state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/customers`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (email) => {
    try {
      setLoadingHistory(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleViewHistory = (customer) => {
    setSelectedCustomer(customer);
    fetchHistory(customer.email);
  };

  const deleteCustomer = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this customer? All associated data may be lost.')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCustomers(customers.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete customer:', err);
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Customer Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-[#ea580c]">
            <User className="h-4 w-4" />
          </div>
          <span className="font-semibold text-gray-900">{row.original.name}</span>
        </div>
      )
    },
    {
      accessorKey: 'email',
      header: 'Contact Info',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Mail className="h-3 w-3 text-gray-400" />
            {row.original.email}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Phone className="h-3 w-3 text-gray-400" />
            {row.original.phone}
          </div>
        </div>
      )
    },
    {
      accessorKey: 'totalBookings',
      header: 'Bookings',
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {row.getValue('totalBookings')} missions
        </span>
      )
    },
    {
      accessorKey: 'totalSpent',
      header: 'Total Value',
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">
          ${row.original.totalSpent?.toLocaleString()}
        </span>
      )
    },
    {
      accessorKey: 'lastBookingDate',
      header: 'Last Flight',
      cell: ({ row }) => (
        <span className="text-gray-500 text-xs">
          {row.original.lastBookingDate ? new Date(row.original.lastBookingDate).toLocaleDateString() : 'N/A'}
        </span>
      )
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <button 
            onClick={() => handleViewHistory(row.original)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#ea580c] hover:bg-orange-50 rounded-lg transition-colors group"
          >
            Details
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => deleteCustomer(row.original.id)}
            className="p-1.5 px-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Customer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      )
    }
  ], []);

  const table = useReactTable({
    data: customers,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorted,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 12 } },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Customer Records</h1>
          <p className="text-gray-500 mt-1">Manage client relationships and booking history.</p>
        </div>
      </div>

      <DataTable
        table={table}
        columns={columns}
        loading={loading}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        searchPlaceholder="Search by name, email or phone..."
        loadingText="Initializing CRM database..."
        emptyText="No customer records found."
      />

      {/* History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-end z-50 transition-all duration-300">
          <div className="bg-white h-full w-full max-w-2xl shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#ea580c] flex items-center justify-center text-white shadow-lg shadow-orange-200">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                  <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total spent</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">${selectedCustomer.totalSpent?.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bookings</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedCustomer.totalBookings}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</p>
                  <p className="text-sm font-medium text-gray-700 mt-2 truncate">{selectedCustomer.phone}</p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <History className="h-5 w-5 text-[#ea580c]" />
                  Booking History
                </h3>

                {loadingHistory ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-32 bg-gray-50 animate-pulse rounded-2xl" />
                    ))}
                  </div>
                ) : history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((booking) => (
                      <div key={booking._id} className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-[#ea580c]/30 hover:shadow-lg transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="px-3 py-1 bg-orange-50 text-[#ea580c] text-xs font-bold rounded-full border border-orange-100">
                            {booking.serviceLevel}
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex-1">
                            <p className="text-xs text-gray-400 uppercase font-semibold">From</p>
                            <p className="font-bold text-gray-900">{booking.fromAirport?.split(',')[0]}</p>
                          </div>
                          <Plane className="h-4 w-4 text-gray-300" />
                          <div className="flex-1 text-right">
                            <p className="text-xs text-gray-400 uppercase font-semibold">To</p>
                            <p className="font-bold text-gray-900">{booking.toAirport?.split(',')[0]}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2 text-gray-500 font-medium">
                            <Calendar className="h-4 w-4" />
                            {booking.departureDate ? new Date(booking.departureDate).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className="flex items-center gap-2 text-gray-900 font-bold">
                            <CreditCard className="h-4 w-4 text-gray-400" />
                            ${booking.totalAmount?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-12 text-gray-400 italic bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    No historic bookings found for this customer.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
