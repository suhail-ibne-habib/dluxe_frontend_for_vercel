"use client";
import React, { useEffect, useState, use } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HorizontalSearchForm from "@/components/booking/HorizontalSearchForm";
import Head from 'next/head';

export default function DynamicAirportPage({ params }) {
  const { slug } = use(params);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [packages, setPackages] = useState([]);
  const [airportConfig, setAirportConfig] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const sliderRef = React.useRef(null);

  const scrollLeft = () => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: -380, behavior: 'smooth' });
  };
  
  const scrollRight = () => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: 380, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/airport-pages/${slug}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Page not found");
          throw new Error("Failed to load page");
        }
        const data = await res.json();
        
        if (!data.is_published) {
          throw new Error("Page not found");
        }
        
        setPage(data);
        
        if (data.airport_id) {
          try {
            const [pkgRes, locRes, testRes] = await Promise.all([
              fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/packages`),
              fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/locations`),
              fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/testimonials`)
            ]);
            
            if (testRes.ok) {
               const testData = await testRes.json();
               setTestimonials(testData.filter(t => t.is_published));
            }

            if (pkgRes.ok && locRes.ok) {
               const allPkgs = await pkgRes.json();
               const allLocs = await locRes.json();
               
               let config = null;
               for (const loc of allLocs) {
                   const found = loc.airports?.find(a => a.id === data.airport_id);
                   if (found) {
                       config = found;
                       break;
                   }
               }

               if (config) {
                   setAirportConfig(config);
                   const activePkgs = allPkgs.filter(p => !!p.isActive);
                   const availablePkgs = activePkgs.filter(p => !(config.excludedPackages || []).includes(p._id || p.id));
                   setPackages(availablePkgs);
               }
            }
          } catch (e) {
            console.error("Failed to load packages/locations", e);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#ea580c] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Loading VIP experience...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-24 text-center px-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{error || "Page Not Found"}</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">The airport landing page you are looking for does not exist or has been removed.</p>
            <a href="/" className="inline-block bg-[#ea580c] text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">Return to Home</a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased overflow-x-hidden">
      <Head>
        <title>{page.page_title} | D'LUXE VIP Services</title>
        <meta name="description" content={page.meta_description} />
      </Head>
      
      <Navbar />

      {/* Hero Section */}
      <header className="relative w-full min-h-screen md:h-[80vh] md:min-h-[600px] flex items-center justify-center bg-gray-900 py-32 md:py-0">
        <div className="absolute inset-0 z-0">
          <img 
            src={page.hero_image_url || "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2600&auto=format&fit=crop"} 
            alt={page.page_title} 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#101428]/80 to-[#1e233a]/90"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-center justify-center text-center mt-12 md:mt-16">
            <span className="inline-block text-xs md:text-sm font-bold tracking-[0.2em] text-gray-300 mb-4 uppercase">
              {page.page_title.toUpperCase().includes('SXM') ? 'SINT MAARTEN - PRINCESS JULIANA INTERNATIONAL AIRPORT, SXM' : page.page_title}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white max-w-4xl tracking-tight">
              {page.page_title}
            </h1>
            <p className="text-sm md:text-base text-gray-200 mb-8 max-w-3xl leading-relaxed font-medium">
              {page.meta_description || "Enhance every step of your travel experience, whether it's arrival, departure, or connecting flights, with our VIP treatment."}
            </p>

            <HorizontalSearchForm defaultAirport={page.airport_name || page.page_title} />
        </div>
      </header>

      {/* Standard Premium Services Section */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] mb-4">VIP Premium Packages</h2>
            <p className="text-lg text-gray-600">Choose the perfect level of service for your arrival, departure, or connection.</p>
          </div>

          {packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg, idx) => {
                const pkgId = pkg._id || pkg.id;
                let price = pkg.basePrice;
                if (airportConfig && airportConfig.customPricing) {
                   const cp = airportConfig.customPricing.find(c => parseInt(c.package_id) === parseInt(pkgId));
                   if (cp && cp.custom_price) price = cp.custom_price;
                }
                const isPopular = pkg.name.toLowerCase().includes('gold') || pkg.name.toLowerCase().includes('terminal');
                const isBlack = pkg.name.toLowerCase().includes('black') || pkg.name.toLowerCase().includes('suite');

                return (
                  <div key={pkgId} className={`rounded-2xl p-8 relative overflow-hidden group transition-shadow hover:shadow-xl ${isPopular ? "bg-[#0f172a] text-white shadow-2xl shadow-[#0f172a]/20" : "bg-white border border-gray-200"}`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 ${isPopular ? "bg-[#ea580c] opacity-20" : "bg-gray-100 opacity-50"}`}></div>
                    {isPopular && (
                        <div className="absolute top-0 right-1/2 translate-x-1/2 -mt-3 bg-[#ea580c] text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-md z-20">Most Popular</div>
                    )}
                    <h3 className={`text-2xl font-bold mb-2 relative z-10 ${isPopular ? "text-white" : "text-[#0f172a]"}`}>{pkg.name}</h3>
                    <p className="text-[#ea580c] font-semibold mb-6 flex items-center gap-2 relative z-10">${price} / passenger</p>
                    <ul className={`space-y-4 mb-8 relative z-10 ${isPopular ? "text-gray-300" : "text-gray-600"}`}>
                      {(pkg.services || []).slice(0, 4).map((srv, i) => (
                        <li key={i} className="flex items-start gap-3"><svg className={`w-5 h-5 mt-0.5 shrink-0 ${isPopular ? "text-[#ea580c]" : "text-green-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{srv.title || srv}</li>
                      ))}
                    </ul>
                    <a href={`/booking?airport=${encodeURIComponent(page.airport_name || page.page_title)}&service=${encodeURIComponent(pkg.name)}`} className={`block w-full py-3 px-4 rounded-md text-center font-bold transition-colors relative z-10 ${isPopular ? "bg-[#ea580c] hover:bg-orange-500 text-white" : "bg-white border border-gray-300 text-[#0f172a] hover:border-[#ea580c] hover:text-[#ea580c]"}`}>Book {pkg.name.split(' ')[0]}</a>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Static fallbacks if no packages available / unlinked */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 opacity-50"></div>
                <h3 className="text-2xl font-bold text-[#0f172a] mb-2 relative z-10">Silver Package</h3>
                <p className="text-[#ea580c] font-semibold mb-6 flex items-center gap-2 relative z-10">VIP Meet & Greet</p>
                <ul className="space-y-4 mb-8 text-gray-600 relative z-10">
                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Personal escort through arrivals/departures</li>
                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Fast Track through security & customs</li>
                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Porter assistance with luggage</li>
                </ul>
                <a href="/booking" className="block w-full py-3 px-4 bg-white border border-gray-300 rounded-md text-center font-bold text-[#0f172a] hover:border-[#ea580c] hover:text-[#ea580c] transition-colors relative z-10">Book Silver</a>
              </div>

              <div className="bg-[#0f172a] text-white rounded-2xl p-8 shadow-2xl relative shadow-[#0f172a]/20 group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ea580c] rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 opacity-20"></div>
                <div className="absolute top-0 right-1/2 translate-x-1/2 -mt-3 bg-[#ea580c] text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-md z-20">Most Popular</div>
                <h3 className="text-2xl font-bold mb-2 relative z-10">Gold Package</h3>
                <p className="text-[#ea580c] font-semibold mb-6 flex items-center gap-2 relative z-10">VIP Terminal</p>
                <ul className="space-y-4 mb-8 text-gray-300 relative z-10">
                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-[#ea580c] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Chauffeured transfer between aircraft and lounge</li>
                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-[#ea580c] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Semi-private lounge with complimentary dining</li>
                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-[#ea580c] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Private customs and immigration processing</li>
                </ul>
                <a href="/booking" className="block w-full py-3 px-4 bg-[#ea580c] hover:bg-orange-500 rounded-md text-center font-bold text-white transition-colors relative z-10">Book Gold</a>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 opacity-50"></div>
                <h3 className="text-2xl font-bold text-[#0f172a] mb-2 relative z-10">Black Package</h3>
                <p className="text-[#ea580c] font-semibold mb-6 flex items-center gap-2 relative z-10">VIP Private Suite</p>
                <ul className="space-y-4 mb-8 text-gray-600 relative z-10">
                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Direct private transfer between aircraft and suite</li>
                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Private room with gourmet dining & dedicated staff</li>
                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>On-site private immigration clearance</li>
                </ul>
                <a href="/booking" className="block w-full py-3 px-4 bg-white border border-gray-300 rounded-md text-center font-bold text-[#0f172a] hover:border-[#ea580c] hover:text-[#ea580c] transition-colors relative z-10">Book Black</a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Global Reviews Section */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-12">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight">What our clients say</h2>
              <div className="flex items-center gap-3">
                <button onClick={scrollLeft} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={scrollRight} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            <div 
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((t) => (
                <div key={t.id} className="min-w-[320px] md:min-w-[380px] max-w-[380px] snap-start bg-[#f1f5f9] rounded-2xl p-8 flex flex-col relative">
                  <svg className="w-5 h-5 text-gray-400 absolute top-8 right-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                  <div className="flex gap-1 text-[#5c6bc0] mb-6">
                    {[...Array(t.rating || 5)].map((_, i) => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                  </div>
                  <p className="text-gray-600 mb-8 flex-grow leading-relaxed font-medium">
                    {t.content}
                  </p>
                  <div>
                    <h4 className="font-bold text-[#0f172a] text-sm mb-1">{t.author_name}</h4>
                    <p className="text-xs text-gray-500 font-medium">
                      {new Date(t.created_at || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <style dangerouslySetInnerHTML={{__html: `
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
          `}} />
        </section>
      )}

      {/* Dynamic Custom Content from Editor */}
      {page.content && (
        <section className="py-16 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 md:px-12 prose max-w-none text-gray-600 dynamic-content-block">
            <div dangerouslySetInnerHTML={{ __html: page.content }}></div>
          </div>
        </section>
      )}

      {/* Dynamic Native FAQ Section */}
      {(() => {
        let faqs = [];
        try {
          faqs = typeof page.faqs === 'string' ? JSON.parse(page.faqs) : (page.faqs || []);
        } catch (e) {
          faqs = [];
        }
        
        if (faqs.length > 0) {
          return (
            <section className="py-20 bg-white">
              <div className="max-w-4xl mx-auto px-4 md:px-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1f2937] mb-10 text-center tracking-tight">Frequently Asked Questions</h2>
                <div className="divide-y divide-gray-200 border-t border-gray-200">
                  {faqs.map((faq, index) => (
                    <div key={index} className="py-6">
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                        className="flex w-full items-center justify-between text-left focus:outline-none group"
                      >
                        <span className="text-lg font-medium text-gray-800 group-hover:text-[#ea580c] transition-colors pr-6">
                          {faq.question}
                        </span>
                        <span className="ml-6 flex items-center justify-center h-7 w-7 text-gray-400 group-hover:text-[#ea580c] transition-colors">
                          {openFaqIndex === index ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                          ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          )}
                        </span>
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-600 leading-relaxed pl-1">{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }
        return null;
      })()}

      <Footer />
    </div>
  );
}
