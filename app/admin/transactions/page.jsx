"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Search, Filter, RefreshCcw } from 'lucide-react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';
import DataTable from '@/components/ui/DataTable';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/transactions`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filter === 'All' || t.status === filter;
    const matchesSearch = t.transactionId?.toLowerCase().includes(search.toLowerCase()) || 
                          t.reservationId?.customerName?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Succeeded': return 'bg-green-100 text-green-700';
      case 'Failed': return 'bg-red-100 text-red-700';
      case 'Refunded': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'transactionId',
      header: 'Transaction ID',
      cell: ({ row }) => <span className="font-mono text-xs text-gray-500">{row.original.transactionId || row.original._id.substring(0, 10).toUpperCase()}</span>
    },
    {
      id: 'customer',
      header: 'Customer',
      accessorFn: row => row.reservationId?.customerName || '',
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{row.original.reservationId?.customerName || 'Unknown'}</div>
          <div className="text-xs text-gray-500">{row.original.reservationId?.customerEmail || '-'}</div>
        </div>
      )
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <span className="font-semibold text-gray-900">${row.original.amount.toLocaleString()}</span>
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <span className={`text-xs px-2 py-1 rounded-full ${row.original.type === 'Refund' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
          {row.original.type}
        </span>
      )
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Method'
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.original.status)}`}>
          {row.original.status}
        </span>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => <span className="text-sm text-gray-500">{row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : 'N/A'}</span>
    }
  ], []);

  const table = useReactTable({
    data: filteredTransactions,
    columns,
    state: { globalFilter: search },
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Transactions</h1>
          <p className="text-gray-500">Monitor all payment activity and process refunds</p>
        </div>
        <button 
          onClick={fetchTransactions}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCcw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">Monthly Revenue</span>
            <div className="p-2 bg-green-50 rounded-lg"><ArrowUpRight className="w-4 h-4 text-green-600" /></div>
          </div>
          <p className="text-2xl font-bold">${transactions.filter(t => t.status === 'Succeeded').reduce((acc, t) => acc + t.amount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">Refunds Processed</span>
            <div className="p-2 bg-amber-50 rounded-lg"><ArrowDownLeft className="w-4 h-4 text-amber-600" /></div>
          </div>
          <p className="text-2xl font-bold">${transactions.filter(t => t.status === 'Refunded').reduce((acc, t) => acc + t.amount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">Failed Attempts</span>
            <div className="p-2 bg-red-50 rounded-lg"><CreditCard className="w-4 h-4 text-red-600" /></div>
          </div>
          <p className="text-2xl font-bold">{transactions.filter(t => t.status === 'Failed').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Customer or ID..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
            >
              <option value="All">All Statuses</option>
              <option value="Succeeded">Succeeded</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>

        <DataTable
          table={table}
          columns={columns}
          loading={loading}
          emptyText="No transactions found."
        />
      </div>
    </div>
  );
}
