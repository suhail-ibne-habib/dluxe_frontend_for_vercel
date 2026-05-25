"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  
  // The login page does not need protection
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex print:bg-white">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white flex flex-col print:hidden">
          <a href="/" className="p-6 border-b border-gray-800 flex items-center hover:bg-gray-800 transition-colors">
            <img src="/dluxe-logo.jpg" alt="D'LUXE Logo" className="h-16 w-auto object-contain rounded-lg" />
          </a>
          <nav className="flex-1 p-4 space-y-2">
            <a 
              href="/admin" 
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                pathname === '/admin' ? 'bg-[#ea580c] text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Dashboard
            </a>
            <a 
              href="/admin/locations" 
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                pathname.startsWith('/admin/locations') ? 'bg-[#ea580c] text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Locations
            </a>
            <a 
              href="/admin/packages" 
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                pathname.startsWith('/admin/packages') ? 'bg-[#ea580c] text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Packages
            </a>
            <a 
              href="/admin/reservations" 
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                pathname.startsWith('/admin/reservations') ? 'bg-[#ea580c] text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Reservations
            </a>
            <a 
              href="/admin/transactions" 
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                pathname.startsWith('/admin/transactions') ? 'bg-[#ea580c] text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Transactions
            </a>
            <a 
              href="/admin/customers" 
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                pathname.startsWith('/admin/customers') ? 'bg-[#ea580c] text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Customers
            </a>
            <a 
              href="/admin/leads" 
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                pathname.startsWith('/admin/leads') ? 'bg-[#ea580c] text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Leads
            </a>

            <a 
              href="/admin/testimonials" 
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                pathname.startsWith('/admin/testimonials') ? 'bg-[#ea580c] text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Testimonials
            </a>
            <a 
              href="/admin/settings" 
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                pathname.startsWith('/admin/settings') ? 'bg-[#ea580c] text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Settings
            </a>
          </nav>
          <div className="p-4 border-t border-gray-800 space-y-2">
            <a 
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-between"
            >
              <span>View Website</span>
              <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
            <button 
              onClick={async () => {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, { method: 'POST' });
                window.location.href = '/admin/login';
              }}
              className="w-full text-left px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 print:p-0 print:m-0">
          {children}
        </main>
      </div>
    </>
  );
}
