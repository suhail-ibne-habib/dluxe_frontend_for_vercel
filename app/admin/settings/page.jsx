"use client";

import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    smtp_host: '',
    smtp_port: '',
    smtp_user: '',
    smtp_pass: '',
    smtp_secure: 'true',
    mail_from: '',
    whatsapp_number: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`);
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({
            ...prev,
            ...data
        }));
      }
    } catch (error) {
      console.error('Failed to load settings', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setMessage('Settings saved successfully!');
      } else {
        setMessage('Error saving settings.');
      }
    } catch (error) {
      setMessage('Error saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
      </div>

      {message && (
        <div className={`p-4 rounded mb-6 ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        
        {/* Contact info setting */}
        <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                <input
                    type="text"
                    name="whatsapp_number"
                    value={settings.whatsapp_number}
                    onChange={handleChange}
                    placeholder="+590 690 69 50 79"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Include country code (e.g. +590)</p>
                </div>
            </div>
        </div>

        {/* Mail Mailer setting */}
        <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">SMTP Email Configuration</h2>
            <p className="text-sm text-gray-500 mb-6">These settings override the .env defaults for the mailing system.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                <input
                    type="text"
                    name="smtp_host"
                    value={settings.smtp_host}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                    placeholder="smtp.gmail.com"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                <input
                    type="text"
                    name="smtp_port"
                    value={settings.smtp_port}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                    placeholder="465"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
                <input
                    type="text"
                    name="smtp_user"
                    value={settings.smtp_user}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                    placeholder="user@example.com"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password / App Password</label>
                <input
                    type="password"
                    name="smtp_pass"
                    value={settings.smtp_pass}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                    placeholder="••••••••••••"
                />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Name & Email</label>
                <input
                    type="text"
                    name="mail_from"
                    value={settings.mail_from}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                    placeholder="&quot;D'LUXE&quot; <no-reply@dluxe.com>"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Use Secure Connection (SSL/TLS)</label>
                <select
                    name="smtp_secure"
                    value={settings.smtp_secure}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                >
                    <option value="true">Yes (True)</option>
                    <option value="false">No (False)</option>
                </select>
                </div>
            </div>
        </div>

        <div className="p-6 bg-gray-50 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-[#ea580c] text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  );
}
