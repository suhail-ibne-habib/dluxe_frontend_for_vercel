"use client";
import React, { useState, useEffect } from "react";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    author_name: "",
    author_title: "",
    author_image_url: "",
    content: "",
    rating: 5,
    is_featured: false,
    is_published: true
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const ts = new Date().getTime();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/testimonials?t=${ts}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch testimonials');
      const data = await res.json();
      setTestimonials(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openModal = (testimonial = null) => {
    if (testimonial) {
      setIsEditing(true);
      setFormData({
        id: testimonial.id,
        author_name: testimonial.author_name || "",
        author_title: testimonial.author_title || "",
        author_image_url: testimonial.author_image_url || "",
        content: testimonial.content || "",
        rating: testimonial.rating || 5,
        is_featured: !!testimonial.is_featured,
        is_published: !!testimonial.is_published
      });
    } else {
      setIsEditing(false);
      setFormData({
        id: null,
        author_name: "",
        author_title: "",
        author_image_url: "",
        content: "",
        rating: 5,
        is_featured: false,
        is_published: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/testimonials/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error((await res.json()).message || "Failed to delete");
      await fetchTestimonials();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL || ''}/api/testimonials/${formData.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || ''}/api/testimonials`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save testimonial");
      }

      closeModal();
      await fetchTestimonials();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Testimonials</h1>
          <p className="text-gray-500 text-sm">Manage client reviews across the platform.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-[#0f172a] hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Testimonial
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Client</th>
                <th className="p-4 font-semibold">Quote Preview</th>
                <th className="p-4 font-semibold">Features</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {testimonials.map((testimonial) => (
                <tr key={testimonial.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    {testimonial.author_image_url ? (
                      <img src={testimonial.author_image_url} alt={testimonial.author_name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm">
                        {testimonial.author_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author_name}</div>
                      <div className="text-xs text-gray-500">{testimonial.author_title || "Verified Traveler"}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-0.5 text-[#ea580c] mb-1">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                         <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 truncate max-w-md italic">"{testimonial.content}"</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 items-start">
                      {testimonial.is_featured && (
                         <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 uppercase tracking-wider border border-orange-200">
                           Hero Feat
                         </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        testimonial.is_published ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {testimonial.is_published ? 'Published' : 'Hidden'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => openModal(testimonial)}
                      className="text-[#ea580c] hover:text-orange-700 font-medium text-sm mr-4 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No testimonials found. Click "Add Testimonial" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">{isEditing ? "Edit Testimonial" : "Add Testimonial"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.author_name}
                    onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#ea580c] focus:border-transparent outline-none"
                    placeholder="e.g. Victoria Chen"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Author Title</label>
                  <input
                    type="text"
                    value={formData.author_title}
                    onChange={(e) => setFormData({...formData, author_title: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#ea580c] focus:border-transparent outline-none"
                    placeholder="e.g. Founder, CEO, Verified Traveler"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Author Image URL</label>
                <input
                  type="text"
                  value={formData.author_image_url}
                  onChange={(e) => setFormData({...formData, author_image_url: e.target.value})}
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#ea580c] focus:border-transparent outline-none"
                  placeholder="https://i.pravatar.cc/150?img=11"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Review Content *</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#ea580c] focus:border-transparent outline-none"
                  rows="4"
                  placeholder="The private terminal in Paris provided an absolute sanctuary..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Star Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    required
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#ea580c] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                    className="w-4 h-4 text-[#ea580c] focus:ring-[#ea580c] border-gray-300 rounded"
                  />
                  <label htmlFor="is_featured" className="text-sm font-semibold text-gray-700">Hero Featured (Main Spotlight text block on /home)</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                    className="w-4 h-4 text-[#ea580c] focus:ring-[#ea580c] border-gray-300 rounded"
                  />
                  <label htmlFor="is_published" className="text-sm font-semibold text-gray-700">Published (Visible to public)</label>
                </div>
              </div>
            </form>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={closeModal}
                className="px-5 py-2.5 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSubmit} 
                className="px-6 py-2.5 bg-[#ea580c] hover:bg-orange-600 text-white font-medium rounded-lg transition-colors cursor-pointer"
              >
                Save Testimonial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
