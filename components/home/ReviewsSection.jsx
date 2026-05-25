"use client";
import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const container = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/testimonials`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.filter(t => t.is_published));
        }
      } catch (err) {
        console.error("Failed to load generic reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  useGSAP(() => {
    if (loading || reviews.length === 0) return;

    gsap.fromTo(".review-left",
      { opacity: 0, x: -50 },
      {
        opacity: 1, x: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: ".review-left",
          start: "top 75%",
        }
      }
    );

    gsap.fromTo(".review-card",
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out",
        scrollTrigger: {
          trigger: ".reviews-grid",
          start: "top 75%",
        }
      }
    );
  }, { scope: container, dependencies: [loading, reviews] });

  if (loading) {
     return <section className="py-24 max-w-7xl mx-auto px-4 md:px-12 bg-white flex justify-center text-gray-500">Loading reviews...</section>;
  }

  if (reviews.length === 0) return null;

  const featuredReview = reviews.find(r => r.is_featured) || reviews[0];
  const otherReviews = reviews.filter(r => r.id !== featuredReview.id).slice(0, 4);

  return (
    <section ref={container} className="py-24 max-w-7xl mx-auto px-4 md:px-12 bg-white overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Left Hero Review */}
        <div className="review-left lg:w-1/3">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-8">What Our VIPs Say</h2>
          <div className="flex text-[#ea580c] mb-6">
            {[...Array(featuredReview.rating || 5)].map((_, i) => (
              <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
          </div>
          <blockquote className="text-2xl font-light text-gray-600 italic mb-8 leading-snug">
            "{featuredReview.content}"
          </blockquote>
          <div className="flex items-center gap-4">
            {featuredReview.author_image_url ? (
              <img src={featuredReview.author_image_url} alt={featuredReview.author_name} className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                {featuredReview.author_name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="font-bold text-gray-900">{featuredReview.author_name}</h4>
              <p className="text-sm text-gray-500">{featuredReview.author_title}</p>
            </div>
          </div>
        </div>

        {/* Right Reviews Grid */}
        <div className="reviews-grid lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            {otherReviews.filter((_, i) => i % 2 === 0).map((review) => (
              <div key={review.id} className="review-card bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <p className="text-gray-600 italic mb-6">"{review.content}"</p>
                <div className="flex items-center gap-2">
                   <div className="flex text-[#ea580c]">
                     {[...Array(review.rating || 5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                     ))}
                   </div>
                   <p className="text-xs font-bold text-[#ea580c] uppercase tracking-wider">- {review.author_name}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-6 md:mt-12">
            {otherReviews.filter((_, i) => i % 2 !== 0).map((review) => (
              <div key={review.id} className="review-card bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <p className="text-gray-600 italic mb-6">"{review.content}"</p>
                <div className="flex items-center gap-2">
                   <div className="flex text-[#ea580c]">
                     {[...Array(review.rating || 5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                     ))}
                   </div>
                   <p className="text-xs font-bold text-[#ea580c] uppercase tracking-wider">- {review.author_name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
