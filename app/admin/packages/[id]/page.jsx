"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Search, Info, ArrowRight, PlaneTakeoff } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';

export default function PackageViewPage() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sorting, setSorted] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/packages/${id}`).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations`).then(r => r.json())
    ])
    .then(([pkgData, locData]) => {
      setPkg(pkgData);
      setLocations(locData || []);
      setLoading(false);
    })
    .catch(e => { console.error(e); setLoading(false); });
  }, [id]);

  const airportsData = useMemo(() => {
    if (!pkg || !locations) return [];
    const packageIdNum = Number(id) || Number(pkg._id);
    const data = [];

    locations.forEach(loc => {
      if (!loc.airports) return;
      loc.airports.forEach(airport => {
        const isExcluded = airport.excludedPackages && airport.excludedPackages.includes(packageIdNum);
        const customPriceMatch = airport.customPricing ? airport.customPricing.find(p => p.package_id === packageIdNum) : null;
        let displayPrice = customPriceMatch && customPriceMatch.custom_price !== null ? customPriceMatch.custom_price : pkg.basePrice;
        let priceType = customPriceMatch && customPriceMatch.custom_price !== null ? 'Custom Override' : 'Base Price';
        
        if (isExcluded) {
          displayPrice = null;
          priceType = 'Unavailable';
        }

        data.push({
          id: airport.id,
          name: airport.name,
          countryName: loc.countryName,
          flagIcon: loc.flagIcon,
          status: isExcluded ? 'Excluded' : 'Supported',
          price: displayPrice,
          priceType: priceType
        });
      });
    });
    
    if (statusFilter !== 'All') {
      return data.filter(a => a.status === statusFilter);
    }
    
    return data;
  }, [pkg, locations, id, statusFilter]);

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Airport',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-sm shadow-sm overflow-hidden">
             {row.original.flagIcon?.startsWith('/') || row.original.flagIcon?.startsWith('http') ? <img src={row.original.flagIcon} alt="" className="w-full h-full object-cover" /> : row.original.flagIcon}
          </div>
          <span className="font-bold text-gray-900 text-sm whitespace-nowrap">{row.getValue('name')}</span>
        </div>
      )
    },
    {
      accessorKey: 'countryName',
      header: 'Location',
      cell: ({ row }) => (
        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">{row.getValue('countryName')}</span>
      )
    },
    {
      accessorKey: 'status',
      header: 'Coverage',
      cell: ({ row }) => (
        <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${
          row.getValue('status') === 'Supported' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {row.getValue('status')}
        </span>
      )
    },
    {
      accessorKey: 'price',
      header: () => <div className="text-right">Pricing Matrix</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {row.getValue('price') !== null ? (
            <>
              <p className="font-black text-[#ea580c]">${row.getValue('price')}</p>
              <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${row.original.priceType.includes('Custom') ? 'text-amber-600' : 'text-gray-400'}`}>
                {row.original.priceType}
              </p>
            </>
          ) : (
            <span className="text-gray-400 text-xs font-bold">—</span>
          )}
        </div>
      )
    }
  ], []);

  const table = useReactTable({
    data: airportsData,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorted,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (loading) return <div className="p-8 text-gray-500">Loading package...</div>;
  if (!pkg || pkg.message) return <div className="p-8 text-red-500">Package not found</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6 bg-white/50 p-4 rounded-t-2xl">
         <Link href="/admin/packages" className="p-2 hover:bg-gray-200 bg-gray-100 rounded-full transition-colors shrink-0">
           <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
         </Link>
         <div className="flex-1">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-1 uppercase italic">{pkg.name}</h1>
            <p className="text-sm text-gray-500">{pkg.description || 'No description provided.'}</p>
         </div>
         <div className="flex flex-col items-end gap-2">
           <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${pkg.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
             {pkg.isActive ? 'Active Configuration' : 'Disabled'}
           </span>
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {/* Sidebar Left: Metrics & Features */}
         <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-amber-400"></div>
              <h2 className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-5">Financial Core</h2>
              <div className="space-y-4">
                 <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                   <p className="text-3xl font-black text-gray-900">${pkg.basePrice}</p>
                   <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">Default Base Price (USD)</p>
                 </div>
                 
                 {/* Clickable Orders Block linked to Reservations Page */}
                 <Link 
                   href={`/admin/reservations?packageId=${pkg.id || pkg._id}`}
                   className="block bg-orange-50/50 p-5 rounded-xl border border-orange-100 hover:border-orange-300 hover:shadow-orange-100 hover:shadow-md transition-all group"
                   title="View Bookings for this Package"
                 >
                   <div className="flex justify-between items-start">
                     <div>
                       <p className="text-3xl font-black text-[#ea580c]">{pkg.totalOrders}</p>
                       <p className="text-[9px] text-orange-600 uppercase tracking-widest font-bold mt-1">Historical Bookings</p>
                     </div>
                     <ArrowRight className="w-5 h-5 text-orange-400 group-hover:text-[#ea580c] transition-colors" />
                   </div>
                   <div className="mt-4 pt-3 border-t border-orange-200/50">
                      <p className="text-sm font-black text-[#ea580c]">${pkg.totalRevenue}</p>
                      <p className="text-[9px] text-orange-500 uppercase tracking-widest font-bold">Total Revenue Gen.</p>
                   </div>
                 </Link>
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-5 mt-2 flex items-center justify-between">
                <span>Included Features</span>
                <span className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">{pkg.features?.length || 0}</span>
              </h2>
              {pkg.features && pkg.features.length > 0 ? (
                <ul className="space-y-4">
                   {pkg.features.map((f, i) => (
                      <li key={i} className="flex gap-3 text-xs text-gray-700 font-bold leading-tight">
                         <span className="w-5 h-5 bg-green-50 text-green-600 rounded flex items-center justify-center shrink-0 border border-green-100">✓</span> 
                         <span className="pt-0.5">{f}</span>
                      </li>
                   ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic text-xs">No standard features configured.</p>
              )}
           </div>
         </div>

         {/* Main Panel: Airports Table */}
         <div className="lg:col-span-3">
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
             <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
               <div>
                  <h2 className="text-sm text-gray-900 uppercase tracking-widest font-black flex items-center gap-2">
                    <PlaneTakeoff className="w-4 h-4 text-gray-400" />
                    Airport Assignment Matrix
                  </h2>
                  <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-widest">Pricing overrides and exclusion status</p>
               </div>
               
               <div className="flex items-center gap-3 w-full sm:w-auto">
                 <select
                   value={statusFilter}
                   onChange={e => setStatusFilter(e.target.value)}
                   className="py-2.5 px-3 text-xs font-bold border border-gray-200 rounded-lg outline-none cursor-pointer bg-white text-gray-700 focus:ring-2 focus:ring-orange-500"
                 >
                   <option value="All">All Coverage</option>
                   <option value="Supported">Supported Only</option>
                   <option value="Excluded">Excluded Only</option>
                 </select>
                 <div className="relative flex-1 sm:w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      value={globalFilter ?? ''}
                      onChange={e => setGlobalFilter(e.target.value)}
                      placeholder="Search airports..."
                      className="w-full pl-9 pr-4 py-2.5 text-xs font-bold border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ea580c] outline-none"
                    />
                 </div>
               </div>
             </div>
             
             <DataTable
                table={table}
                columns={columns}
                loading={loading}
                emptyText="No airports match your search query."
             />
           </div>
         </div>
      </div>
    </div>
  );
}
