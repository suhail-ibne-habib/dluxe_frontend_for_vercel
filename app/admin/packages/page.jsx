"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit, Check, X, GripVertical, Eye } from 'lucide-react';
import Link from 'next/link';

export default function PackagesAdmin() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    description: '',
    features: [''],
    isActive: true,
    order: 0
  });

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/packages`);
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenModal = (p = null) => {
    if (p) {
      setEditingPackage(p);
      setFormData({
        name: p.name,
        basePrice: p.basePrice,
        description: p.description || '',
        features: p.features.length > 0 ? p.features : [''],
        isActive: p.isActive,
        isPopular: p.isPopular || false,
        order: p.order || 0
      });
    } else {
      setEditingPackage(null);
      setFormData({
        name: '',
        basePrice: '',
        description: '',
        features: [''],
        isActive: true,
        isPopular: false,
        order: packages.length
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPackage(null);
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures.length > 0 ? newFeatures : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingPackage ? 'PATCH' : 'POST';
    const url = editingPackage ? `/api/packages/${editingPackage._id}` : '/api/packages';
    
    // Clean up empty features
    const submissionData = {
      ...formData,
      features: formData.features.filter(f => f.trim() !== '')
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });
      
      if (res.ok) {
        handleCloseModal();
        fetchPackages();
      } else {
        const err = await res.json();
        alert(err.message || 'Error saving package');
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service level? It may affect existing bookings.')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/packages/${id}`, { method: 'DELETE' });
      if (res.ok) fetchPackages();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase italic">Service Packages</h1>
          <p className="text-gray-500 mt-2 font-medium">Define service levels, pricing, and premium features.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/20 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Create Level
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">
            Syncing catalog...
          </div>
        ) : packages.map((p) => (
          <div key={p._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-gray-900 uppercase italic leading-none">{p.name}</h3>
                    {p.isPopular && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[8px] font-black uppercase tracking-widest rounded-full">Popular</span>
                    )}
                  </div>
                  <p className="text-[#ea580c] font-black text-3xl mt-2 tracking-tighter">
                    <span className="text-sm font-bold text-gray-400 mr-1 uppercase">USD</span> ${p.basePrice}
                  </p>
                  <div className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span>{p.totalOrders || 0} Orders</span>
                    <span>•</span>
                    <span className="text-gray-500">${Number(p.totalRevenue || 0).toLocaleString()} Rev</span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/admin/packages/${p._id || p.id}`} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"><Eye className="h-4 w-4" /></Link>
                  <button onClick={() => handleOpenModal(p)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(p._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {(p.features || []).slice(0, 4).map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                    <div className="w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-orange-600" />
                    </div>
                    {f}
                  </div>
                ))}
                {(p.features || []).length > 4 && (
                  <p className="text-xs text-gray-400 font-bold uppercase pl-8">+{(p.features || []).length - 4} more features</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {p.isActive ? 'Active' : 'Disabled'}
                </span>
                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Order: {p.order}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <div>
                <h2 className="text-3xl font-black text-gray-900 uppercase italic">{editingPackage ? 'Edit Level' : 'New Service Level'}</h2>
                <p className="text-gray-500 text-sm font-medium mt-1">Configure pricing and premium features.</p>
              </div>
              <button onClick={handleCloseModal} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Package Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. VIP Terminal"
                      className="w-full h-14 px-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Base Price (USD)</label>
                    <input 
                      required
                      type="number"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                      placeholder="850"
                      className="w-full h-14 px-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-gray-900"
                    />
                  </div>
                  <div className="flex flex-col gap-4 py-4">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                        className={`w-14 h-8 rounded-full transition-all relative ${formData.isActive ? 'bg-orange-600' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.isActive ? 'right-1' : 'left-1'}`} />
                      </button>
                      <span className="text-sm font-black text-gray-900 uppercase">Service {formData.isActive ? 'Active' : 'Disabled'}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, isPopular: !formData.isPopular})}
                        className={`w-14 h-8 rounded-full transition-all relative ${formData.isPopular ? 'bg-blue-600' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.isPopular ? 'right-1' : 'left-1'}`} />
                      </button>
                      <span className="text-sm font-black text-gray-900 uppercase">Mark as Popular</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Features List</label>
                    <button type="button" onClick={addFeature} className="text-xs font-black text-orange-600 uppercase tracking-widest hover:text-orange-700">+ Add</button>
                  </div>
                  <div className="space-y-3">
                    {formData.features.map((f, i) => (
                      <div key={i} className="flex gap-2 group">
                        <input 
                          value={f}
                          onChange={(e) => handleFeatureChange(i, e.target.value)}
                          placeholder="Include feature..."
                          className="flex-1 h-12 px-4 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-gray-900 text-sm"
                        />
                        <button 
                          type="button" 
                          onClick={() => removeFeature(i)}
                          className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-12 pt-8 border-t border-gray-50">
                <button type="button" onClick={handleCloseModal} className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">Discard</button>
                <button type="submit" className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-gray-200 active:scale-95">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
