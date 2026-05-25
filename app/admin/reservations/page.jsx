"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Search, Edit, Trash2, ArrowUpDown, Calendar, User, Plane, Wallet, Eye } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';

export default function ReservationsAdmin() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // We wrap the searchParams usage in a generic way or use it safely
  const searchStr = typeof window !== 'undefined' ? window.location.search : '';
  const initialFilter = searchStr ? new URLSearchParams(searchStr).get('filter') || '' : '';
  const initialPackageId = searchStr ? new URLSearchParams(searchStr).get('packageId') : null;
  const [globalFilter, setGlobalFilter] = useState(initialFilter);
  const [sorting, setSorted] = useState([]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  
  // Form state for status updates
  const [formData, setFormData] = useState({
    status: 'Pending',
    paymentStatus: 'Unpaid'
  });

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations`);
      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      }
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleOpenModal = (reservation) => {
    setEditingReservation(reservation);
    setFormData({
      status: reservation.status,
      paymentStatus: reservation.paymentStatus
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReservation(null);
  };

  const handleSubmitStatus = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/${editingReservation._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        handleCloseModal();
        fetchReservations();
      } else {
        alert('Failed to update reservation');
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reservation? This cannot be undone.')) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        fetchReservations();
      } else {
        alert('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{row.original.customerName}</span>
          <span className="text-xs text-gray-500">{row.original.customerEmail}</span>
        </div>
      )
    },
    {
      accessorKey: 'route',
      header: 'Route',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
          <span>{row.original.fromLocation?.countryName || (row.original.fromAirport ? row.original.fromAirport.split(',')[0] : 'N/A')}</span>
          {row.original.toAirport && (
            <>
              <Plane className="h-3 w-3 text-gray-400" />
              <span>{row.original.toLocation?.countryName || row.original.toAirport.split(',')[0]}</span>
            </>
          )}
        </div>
      ),
      accessorFn: row => `${row.fromAirport} ${row.toAirport || ''}`,
      filterFn: (row, id, filterValue) => {
        const val = row.getValue(id) || "";
        const search = filterValue.toLowerCase();
        if (val.toLowerCase().includes(search)) return true;

        // IATA code custom check
        const checkIata = (airportStr) => {
           if (!airportStr) return false;
           const parts = airportStr.split(',');
           let iata = "";
           if (parts.length > 1) {
               iata = parts[parts.length - 1].trim().toLowerCase();
           } else {
               const spaceParts = airportStr.split(' ');
               if (spaceParts[spaceParts.length - 1].length === 3) {
                   iata = spaceParts[spaceParts.length - 1].toLowerCase();
               }
           }
           if (iata && search === iata) return true;
           if (iata && iata.includes(search)) return true;
           return false;
        };
        return checkIata(row.original.fromAirport) || checkIata(row.original.toAirport);
      }
    },
    {
      accessorKey: 'departureDate',
      header: 'Departure',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="h-3.3 w-3.5 text-[#ea580c]" />
          {row.original.departureDate ? new Date(row.original.departureDate).toLocaleDateString() : 'N/A'}
        </div>
      )
    },
    {
      accessorKey: 'serviceLevel',
      header: 'Service',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
          row.original.serviceLevel === 'VIP' ? 'bg-purple-100 text-purple-700' :
          row.original.serviceLevel === 'Premium' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {row.getValue('serviceLevel')}
        </span>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          row.original.status === 'Confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
          row.original.status === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
          row.original.status === 'Completed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
          'bg-yellow-100 text-yellow-800 border-yellow-200'
        }`}>
          {row.getValue('status')}
        </span>
      )
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          row.original.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800 border-green-200' :
          row.original.paymentStatus === 'Refunded' ? 'bg-orange-100 text-orange-800 border-orange-200' :
          'bg-gray-100 text-gray-800 border-gray-200'
        }`}>
          {row.getValue('paymentStatus')}
        </span>
      )
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Link 
            href={`/admin/reservations/${row.original._id}`}
            className="p-2 text-gray-400 hover:text-[#ea580c] hover:bg-orange-50 rounded-md transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button 
            onClick={() => handleOpenModal(row.original)}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(row.original._id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ], []);

  const processedReservations = useMemo(() => {
    if (initialPackageId) {
      return reservations.filter(r => String(r.packageId) === String(initialPackageId));
    }
    return reservations;
  }, [reservations, initialPackageId]);

  const table = useReactTable({
    data: processedReservations,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorted,
    globalFilterFn: (row, columnId, filterValue) => {
      const search = (filterValue ?? "").toLowerCase();
      
      // Default behavior: check if any cell string value contains search
      const rowValues = Object.values(row.original).map(v => String(v).toLowerCase());
      if (rowValues.some(v => v.includes(search))) return true;
      if (row.original.fromLocation?.countryName?.toLowerCase().includes(search)) return true;
      if (row.original.toLocation?.countryName?.toLowerCase().includes(search)) return true;
      
      // IATA Check for Airports
      const checkIata = (airportStr) => {
         if (!airportStr) return false;
         const parts = airportStr.split(',');
         let iata = "";
         if (parts.length > 1) {
             iata = parts[parts.length - 1].trim().toLowerCase();
         } else {
             const spaceParts = airportStr.split(' ');
             if (spaceParts.length > 0 && spaceParts[spaceParts.length - 1].length === 3) {
                 iata = spaceParts[spaceParts.length - 1].toLowerCase();
             }
         }
         return iata === search || (iata && iata.includes(search));
      };
      
      return checkIata(row.original.fromAirport) || checkIata(row.original.toAirport);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Reservations</h1>
          <p className="text-gray-500 mt-1">Track and manage all flight bookings.</p>
        </div>
      </div>

      <DataTable 
        table={table}
        columns={columns}
        loading={loading}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        searchPlaceholder="Filter reservations..."
        loadingText="Connecting to database..."
        emptyText="No bookings found."
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Update Status</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitStatus} className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Booking Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full h-10 px-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#ea580c] outline-none bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Payment Status</label>
                  <select 
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({...formData, paymentStatus: e.target.value})}
                    className="w-full h-10 px-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#ea580c] outline-none bg-white"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-[#ea580c] text-white rounded-md hover:bg-orange-700">Update Reservation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
