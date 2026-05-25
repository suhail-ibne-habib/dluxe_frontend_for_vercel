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
import { Search, Plus, Edit, Trash2, ArrowUpDown, Eye } from 'lucide-react';
import Link from 'next/link';
import DataTable from '@/components/ui/DataTable';

export default function LocationsAdmin() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [servicePackages, setServicePackages] = useState([]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    countryName: '',
    flagIcon: '',
    airports: []
  });

  // Helper to extract true URL from Next/Nuxt IPX optimizations
  const getFlagUrl = (iconStr) => {
    if (!iconStr) return '';
    if (iconStr.includes('/http')) {
      return 'http' + iconStr.split('/http')[1];
    }
    return iconStr;
  };

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const ts = new Date().getTime();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations?t=${ts}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setLocations(data);
      }
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
    const fetchReferences = async () => {
      try {
        const ts = new Date().getTime();
        const pkgRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/packages?t=${ts}`, { cache: 'no-store' });
        
        if (pkgRes.ok) {
          const data = await pkgRes.json();
          setServicePackages(data.filter(p => p.isActive));
        }
      } catch (err) {
        console.error('Failed to fetch references:', err);
      }
    };
    fetchReferences();
  }, []);

  const handleOpenModal = (location = null) => {
    if (location) {
      setEditingLocation(location);
      setFormData({
        countryName: location.countryName,
        flagIcon: location.flagIcon,
        airports: location.airports.map(a => ({ 
          name: a.name, 
          link: a.link || a.page_id || '', // fallback to page_id if it existed before 
          note: a.note || '',
          excludedPackages: a.excludedPackages || [],
          customPricing: a.customPricing || []
        }))
      });
    } else {
      setEditingLocation(null);
      setFormData({
        countryName: '',
        flagIcon: '',
        airports: [{ name: '', link: '', note: '', excludedPackages: [], customPricing: [] }]
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLocation(null);
  };

  const handleAirportChange = (index, field, value) => {
    const newAirports = [...formData.airports];
    newAirports[index][field] = value;
    setFormData({ ...formData, airports: newAirports });
  };

  const addAirportField = () => {
    setFormData({
      ...formData,
      airports: [...formData.airports, { name: '', link: '', note: '', excludedPackages: [], customPricing: [] }]
    });
  };

  const removeAirportField = (index) => {
    const newAirports = formData.airports.filter((_, i) => i !== index);
    setFormData({ ...formData, airports: newAirports });
  };

  const togglePackage = (airportIndex, packageId) => {
    const newAirports = [...formData.airports];
    const excluded = [...(newAirports[airportIndex].excludedPackages || [])];
    const customPricing = [...(newAirports[airportIndex].customPricing || [])];
    
    if (excluded.includes(packageId)) {
      // It was excluded, now make it available
      newAirports[airportIndex].excludedPackages = excluded.filter(id => id !== packageId);
    } else {
      // It was available, now exclude it
      newAirports[airportIndex].excludedPackages = [...excluded, packageId];
      // Since it's excluded, remove its custom pricing override if it exists
      newAirports[airportIndex].customPricing = customPricing.filter(p => p.package_id !== packageId);
    }
    
    setFormData({ ...formData, airports: newAirports });
  };

  const handleCustomPriceChange = (airportIndex, packageId, val) => {
    const newAirports = [...formData.airports];
    let customPricing = [...(newAirports[airportIndex].customPricing || [])];
    
    const idx = customPricing.findIndex(p => p.package_id === packageId);
    if (idx >= 0) {
      customPricing[idx].custom_price = val;
    } else {
      customPricing.push({ package_id: packageId, custom_price: val });
    }
    
    newAirports[airportIndex].customPricing = customPricing;
    setFormData({ ...formData, airports: newAirports });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isEditing = !!editingLocation;
      const url = isEditing 
        ? `/api/locations/${editingLocation._id || editingLocation.id}` 
        : `/api/locations`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        airports: formData.airports.map(a => ({
          ...a,
          link: a.link,
          page_id: '' // Clear page_id as it's no longer used
        }))
      };
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        handleCloseModal();
        fetchLocations();
      } else {
        alert('Failed to save location');
      }
    } catch (error) {
      console.error('Error saving location:', error);
      alert('An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this location?')) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        fetchLocations();
      } else {
        alert('Failed to delete location');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('An error occurred');
    }
  };

  // TanStack Table Columns
  const columns = useMemo(() => [
    {
      accessorKey: 'countryName',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 hover:text-gray-900 font-semibold"
        >
          Country
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => {
        const flagIcon = row.original.flagIcon;
        const countryName = row.getValue('countryName');
        const isUrl = flagIcon?.startsWith('/') || flagIcon?.startsWith('http') || getFlagUrl(flagIcon).startsWith('http');
        return (
          <div className="flex items-center gap-3">
            {isUrl ? (
              <img src={getFlagUrl(flagIcon)} alt={`${countryName} flag`} className="h-6 w-auto object-contain shrink-0 shadow-sm rounded-sm" />
            ) : (
              <span className="text-xl">{flagIcon}</span>
            )}
            <span className="font-medium text-gray-900">{countryName}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'airports',
      header: 'Airports',
      cell: ({ row }) => {
        const airports = row.getValue('airports');
        if (!airports || airports.length === 0) {
          return <span className="text-gray-400 text-sm italic">No airports</span>;
        }
        return (
          <div className="flex flex-wrap gap-1.5">
            {airports.map((airport, idx) => (
              <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md border border-blue-100 font-medium whitespace-nowrap">
                {airport.name}
              </span>
            ))}
          </div>
        );
      },
      filterFn: (row, id, filterValue) => {
        // Search across country and airports
        const countryName = row.original.countryName.toLowerCase();
        const airports = row.getValue(id) || [];
        const search = filterValue.toLowerCase();
        
        return countryName.includes(search) || airports.some(a => {
            if (a.name.toLowerCase().includes(search)) return true;
            
            // Explicit IATA extraction
            const parts = a.name.split(',');
            let iata = "";
            if (parts.length > 1) {
                iata = parts[parts.length - 1].trim().toLowerCase();
            } else {
                const spaceParts = a.name.split(' ');
                if (spaceParts[spaceParts.length - 1].length === 3) {
                    iata = spaceParts[spaceParts.length - 1].toLowerCase();
                }
            }
            if (iata && search === iata) return true;
            if (iata && iata.includes(search)) return true;
            
            return false;
        });
      }
    },
    {
      id: 'actions',
      header: () => <div className="text-right font-semibold">Actions</div>,
      cell: ({ row }) => {
        const loc = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <Link 
              href={`/admin/locations/${loc._id || loc.id}`}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
              title="View Location"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <button 
              onClick={() => handleOpenModal(loc)}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              title="Edit Location"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleDelete(loc._id || loc.id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete Location"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      }
    }
  ], []);

  const table = useReactTable({
    data: locations,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: (row, columnId, filterValue) => {
       const search = (filterValue ?? "").toLowerCase();
       const country = (row.original.countryName || "").toLowerCase();
       if (country.includes(search)) return true;

       const airports = row.original.airports || [];
       return airports.some(a => {
            const name = a.name || "";
            if (name.toLowerCase().includes(search)) return true;
            
            const parts = name.split(',');
            let iata = "";
            if (parts.length > 1) {
                iata = parts[parts.length - 1].trim().toLowerCase();
            } else {
                const spaceParts = name.split(' ');
                if (spaceParts.length > 0 && spaceParts[spaceParts.length - 1].length === 3) {
                    iata = spaceParts[spaceParts.length - 1].toLowerCase();
                }
            }
            if (iata && search === iata) return true;
            if (iata && iata.includes(search)) return true;
            
            return false;
       });
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // Set 10 per page to match previous logic
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="text-gray-900 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Locations</h1>
          <p className="text-gray-500 mt-1">Manage countries and available airports.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors bg-[#ea580c] text-white hover:bg-orange-700 h-10 px-4 py-2 shadow"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </button>
      </div>

      <DataTable
        table={table}
        columns={columns}
        loading={loading}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        searchPlaceholder="Filter countries or airports..."
        loadingText="Loading locations..."
        emptyText="No results found."
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold tracking-tight text-gray-900">{editingLocation ? 'Edit Location' : 'Add New Location'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:bg-gray-100 hover:text-gray-900 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-gray-700">Country Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.countryName}
                    onChange={(e) => setFormData({...formData, countryName: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                    placeholder="e.g. United Kingdom"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-gray-700">Flag Icon (Emoji or Image URL)</label>
                  <input 
                    type="text" 
                    required
                    value={formData.flagIcon}
                    onChange={(e) => setFormData({...formData, flagIcon: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                    placeholder="e.g. 🇬🇧 or /images/flag.png"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium leading-none text-gray-700">Airports Configuration</label>
                  <button 
                    type="button"
                    onClick={addAirportField}
                    className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-[#ea580c] hover:bg-orange-50 h-9 rounded-md px-3"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Airport
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.airports.map((airport, index) => (
                    <div key={index} className="flex gap-3 items-start bg-gray-50/50 p-4 rounded-lg border border-gray-200/60 shadow-sm relative group transition-all hover:border-gray-300">
                      <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Airport Name</label>
                          <input 
                            type="text" 
                            required
                            value={airport.name}
                            onChange={(e) => handleAirportChange(index, 'name', e.target.value)}
                            className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ea580c] disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="e.g. Heathrow (LHR)"
                          />
                        </div>
                        <div className="space-y-2">
                           <div className="flex items-center justify-between mb-1">
                             <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Airport Landing Page Link</label>
                           </div>
                           <input 
                              type="url" 
                              value={airport.link || ''}
                              onChange={(e) => handleAirportChange(index, 'link', e.target.value)}
                              className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ea580c] disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="/locations/saint-barths or https://..."
                           />
                           <p className="text-[10px] text-gray-400 italic">Provide the URL for the airport's dedicated landing page.</p>
                        </div>
                        
                        <div className="space-y-2">
                           <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Airport Note (Optional)</label>
                           <textarea 
                              value={airport.note || ''}
                              onChange={(e) => handleAirportChange(index, 'note', e.target.value)}
                              className="flex min-h-[60px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ea580c] disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Write an airport-specific note here..."
                           />
                        </div>
                        
                        <div className="space-y-2">
                           <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Available Packages</label>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                               {servicePackages.map(pkg => {
                                 const isExcluded = (airport.excludedPackages || []).includes(pkg._id);
                                 const pricingObj = (airport.customPricing || []).find(p => p.package_id === pkg._id);
                                 const customPrice = pricingObj ? pricingObj.custom_price : '';
                                 
                                 return (
                                   <div key={pkg._id} className={`flex flex-col gap-1 p-2 rounded-lg border transition-all ${
                                     !isExcluded ? 'bg-orange-50/30 border-orange-200' : 'bg-gray-50 border-gray-200 opacity-60'
                                   }`}>
                                     <button
                                       type="button"
                                       onClick={() => togglePackage(index, pkg._id)}
                                       className={`flex items-center text-left gap-2 text-xs font-bold uppercase tracking-wider ${
                                         !isExcluded ? 'text-[#ea580c]' : 'text-gray-400'
                                       }`}
                                     >
                                       {!isExcluded ? '✓ ' : '+ '} {pkg.name}
                                     </button>
                                     
                                     {!isExcluded && (
                                       <div className="flex items-center gap-2 mt-1">
                                         <label className="text-[10px] text-gray-500 uppercase tracking-widest whitespace-nowrap">Price (USD)</label>
                                         <input 
                                           type="number"
                                           value={customPrice}
                                           onChange={(e) => handleCustomPriceChange(index, pkg._id, e.target.value)}
                                           className="h-7 w-full rounded border border-orange-200 bg-white px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ea580c]"
                                           placeholder={`Base: $${pkg.basePrice}`}
                                         />
                                       </div>
                                     )}
                                   </div>
                                 );
                               })}
                               {servicePackages.length === 0 && (
                                 <span className="text-xs text-gray-400 italic col-span-2">No active packages found</span>
                               )}
                            </div>
                           <p className="text-[10px] text-gray-400 mt-1 italic">Click to toggle availability. Orange = Available, Gray = Hidden.</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeAirportField(index)}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md shrink-0 mt-[1.35rem] transition-colors border border-transparent hover:border-red-100"
                        title="Remove Airport"
                        disabled={formData.airports.length === 1}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-gray-200 bg-white shadow-sm hover:bg-gray-100 hover:text-gray-900 h-10 px-4 py-2"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-[#ea580c] text-white shadow hover:bg-orange-700 h-10 px-4 py-2"
                >
                  {editingLocation ? 'Save Changes' : 'Create Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
