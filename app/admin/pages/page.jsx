"use client";
import React, { useState, useEffect, useRef } from "react";

const SearchableAirportSelect = ({ locations, value, onChange }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const airports = locations.flatMap(loc => 
    (loc.airports || []).map(a => ({ ...a, countryName: loc.countryName }))
  );

  const selectedAirport = airports.find(a => a.id == value);

  const filteredAirports = airports.filter(a => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();
    if (a.name.toLowerCase().includes(lowerSearch)) return true;
    if (a.countryName.toLowerCase().includes(lowerSearch)) return true;

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
    if (iata && lowerSearch === iata) return true;
    if (iata && iata.includes(lowerSearch)) return true;

    return false;
  }).slice(0, 50);

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        className="w-full border border-gray-300 rounded-md p-2.5 bg-white cursor-pointer flex justify-between items-center focus-within:ring-2 focus-within:ring-[#ea580c] focus-within:border-transparent transition-all"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex="0"
      >
        <span className={selectedAirport ? "text-gray-900 font-medium" : "text-gray-500"}>
          {selectedAirport ? selectedAirport.name : "-- Unlinked --"}
        </span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-xl max-h-80 flex flex-col">
          <div className="p-2 border-b border-gray-100 shrink-0 bg-gray-50 rounded-t-md">
            <div className="relative">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-md py-2 pl-9 pr-3 text-sm focus:ring-1 focus:ring-[#ea580c] focus:border-[#ea580c] outline-none" 
                placeholder="Search airport name or SXM..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-1">
            <div 
              className="px-3 py-2.5 text-sm hover:bg-gray-100 cursor-pointer text-gray-600 font-medium rounded-md flex items-center gap-2 mb-1"
              onClick={() => { onChange(""); setIsOpen(false); setSearch(""); }}
            >
              -- Unlinked --
            </div>
            {filteredAirports.length > 0 ? filteredAirports.map(a => (
              <div 
                key={a.id} 
                className="px-3 py-2 text-sm hover:bg-orange-50 cursor-pointer rounded-md mb-0.5 flex flex-col"
                onClick={() => { onChange(a.id); setIsOpen(false); setSearch(""); }}
              >
                <span className="font-semibold text-gray-800">{a.name}</span>
                <span className="text-[11px] text-gray-500 uppercase tracking-widest">{a.countryName}</span>
              </div>
            )) : (
              <div className="p-6 text-sm text-gray-500 text-center flex flex-col items-center gap-2">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                No airports found matching "{search}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    slug: "",
    page_title: "",
    meta_description: "",
    hero_image_url: "",
    content: "",
    is_published: true,
    airport_id: ""
  });

  const fetchPagesAndLocations = async () => {
    setLoading(true);
    try {
      const ts = new Date().getTime();
      const [pagesRes, locsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/airport-pages?t=${ts}`, { cache: 'no-store' }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/locations?t=${ts}`, { cache: 'no-store' })
      ]);
      if (!pagesRes.ok) throw new Error('Failed to fetch pages');
      const data = await pagesRes.json();
      setPages(data);

      if (locsRes.ok) {
        const locsData = await locsRes.json();
        setLocations(locsData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagesAndLocations();
  }, []);

  const openModal = (page = null) => {
    if (page) {
      setIsEditing(true);
      setFormData({
        id: page.id,
        slug: page.slug || "",
        page_title: page.page_title || "",
        meta_description: page.meta_description || "",
        hero_image_url: page.hero_image_url || "",
        content: page.content || "",
        is_published: !!page.is_published,
        airport_id: page.airport_id || "",
        faqs: typeof page.faqs === 'string' ? JSON.parse(page.faqs) : (page.faqs || [])
      });
    } else {
      setIsEditing(false);
      setFormData({
        id: null,
        slug: "",
        page_title: "",
        meta_description: "",
        hero_image_url: "",
        content: "",
        is_published: true,
        airport_id: "",
        faqs: []
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this page?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/airport-pages/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error((await res.json()).message || "Failed to delete");
      await fetchPagesAndLocations();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL || ''}/api/airport-pages/${formData.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || ''}/api/airport-pages`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save page");
      }

      closeModal();
      await fetchPagesAndLocations();
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
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Landing Pages</h1>
          <p className="text-gray-500 text-sm">Manage dynamic airport landing pages.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-[#0f172a] hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Page
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">URL Slug</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">{page.page_title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-sm">{page.meta_description}</div>
                  </td>
                  <td className="p-4 font-mono text-sm text-gray-600">
                    /{page.slug}
                    <div className="text-xs text-gray-400 mt-1">{page.airport_name ? `Linked: ${page.airport_name}` : "Not linked"}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      page.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {page.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <a
                      href={`/airport/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-800 font-medium text-sm mr-4"
                    >
                      View
                    </a>
                    <button
                      onClick={() => openModal(page)}
                      className="text-[#ea580c] hover:text-orange-700 font-medium text-sm mr-4 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(page.id)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {pages.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No landing pages found. Click "Add New Page" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">{isEditing ? "Edit Landing Page" : "Add Landing Page"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Page Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.page_title}
                    onChange={(e) => setFormData({...formData, page_title: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#ea580c] focus:border-transparent outline-none"
                    placeholder="e.g. Princess Juliana VIP Services"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">URL Slug *</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      /airport/
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
                      className="flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none rounded-r-md border border-gray-300 focus:ring-2 focus:ring-[#ea580c] focus:border-transparent outline-none"
                      placeholder="e.g. princess-juliana-sxm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Linked Airport</label>
                <SearchableAirportSelect 
                  locations={locations}
                  value={formData.airport_id}
                  onChange={(val) => setFormData({...formData, airport_id: val ? Number(val) : ""})}
                />
                <p className="text-xs text-gray-500 mt-2">Linking an airport will automatically load its packages pricing and availability inside the search form.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Hero Image URL</label>
                <input
                  type="text"
                  value={formData.hero_image_url}
                  onChange={(e) => setFormData({...formData, hero_image_url: e.target.value})}
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#ea580c] focus:border-transparent outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Description</label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#ea580c] focus:border-transparent outline-none"
                  rows="2"
                  placeholder="Short description for SEO"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Content (HTML)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#ea580c] focus:border-transparent outline-none font-mono text-sm h-[300px]"
                  placeholder="<div>Place HTML or text content here</div>"
                ></textarea>
                <p className="text-xs text-gray-500 mt-2">You can use raw HTML here to structure the page exactly how you want it below the hero section.</p>
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

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-semibold text-gray-700">FAQ Widget Builder</label>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, faqs: [...formData.faqs, { question: "", answer: "" }]})}
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                    Add Question
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-4">Questions added here will automatically render as a beautiful, animated accordion below your main content block.</p>
                
                <div className="space-y-4">
                  {formData.faqs.map((faq, index) => (
                    <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 border border-gray-100 rounded-lg relative group">
                      <div className="flex-grow space-y-3">
                        <input
                          type="text"
                          placeholder="Question (e.g. What is Fast Track?)"
                          value={faq.question}
                          onChange={(e) => {
                            const newFaqs = [...formData.faqs];
                            newFaqs[index].question = e.target.value;
                            setFormData({...formData, faqs: newFaqs});
                          }}
                          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#ea580c] focus:border-transparent outline-none"
                        />
                        <textarea
                          placeholder="Answer..."
                          value={faq.answer}
                          onChange={(e) => {
                            const newFaqs = [...formData.faqs];
                            newFaqs[index].answer = e.target.value;
                            setFormData({...formData, faqs: newFaqs});
                          }}
                          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#ea580c] focus:border-transparent outline-none h-20"
                        ></textarea>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newFaqs = formData.faqs.filter((_, i) => i !== index);
                          setFormData({...formData, faqs: newFaqs});
                        }}
                        className="text-red-400 hover:text-red-600 mt-1 cursor-pointer transition-colors"
                        title="Remove Question"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                  {formData.faqs.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 text-sm">
                      No FAQs added yet. Click "Add Question" to get started.
                    </div>
                  )}
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
                className="px-6 py-2.5 bg-[#ea580c] hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
              >
                Save Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
