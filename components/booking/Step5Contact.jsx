import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Step5Contact({ onBack }) {
  const { register, watch, formState: { errors } } = useFormContext();
  
  const isSameAsPassenger = watch('sameAsPassenger') || false;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
        <p className="text-sm text-gray-500 font-medium tracking-wide">The best point of contact for this reservation.</p>
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" {...register('sameAsPassenger')} className="w-5 h-5 border-gray-300 rounded text-[#2a3bb1] focus:ring-[#2a3bb1]" />
          <span className="text-sm font-semibold text-gray-700">Same as a primary passenger</span>
        </label>
      </div>

      {!isSameAsPassenger && (
        <>
          <div className="flex items-center my-2">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="px-4 text-xs font-semibold text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {/* First Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-800">First Name <span className="text-red-500">*</span></label>
              <input 
                {...register('contactFirstName')} 
                className={`w-full border ${errors.contactFirstName ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} rounded-lg px-4 py-3 outline-none focus:ring-2 transition-all`} 
              />
              {errors.contactFirstName && <span className="text-red-500 text-xs font-semibold">{errors.contactFirstName.message}</span>}
            </div>
            
            {/* Last Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-800">Last Name <span className="text-red-500">*</span></label>
              <input 
                {...register('contactLastName')} 
                className={`w-full border ${errors.contactLastName ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} rounded-lg px-4 py-3 outline-none focus:ring-2 transition-all`} 
              />
              {errors.contactLastName && <span className="text-red-500 text-xs font-semibold">{errors.contactLastName.message}</span>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-800">Email <span className="text-red-500">*</span></label>
              <input 
                type="email"
                {...register('contactEmail')} 
                className={`w-full border ${errors.contactEmail ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} rounded-lg px-4 py-3 outline-none focus:ring-2 transition-all`} 
              />
              {errors.contactEmail && <span className="text-red-500 text-xs font-semibold">{errors.contactEmail.message}</span>}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-800">Phone number <span className="text-red-500">*</span></label>
              <div className="flex">
                <div className="flex items-center gap-1 border border-r-0 border-gray-200 rounded-l-lg px-3 bg-gray-50 text-gray-700">
                  <span className="text-lg">🇺🇸</span>
                  <span className="text-xs">▼</span>
                  <span className="text-sm font-medium ml-1">+1</span>
                </div>
                <input 
                  type="tel"
                  {...register('contactPhone')} 
                  className={`w-full border ${errors.contactPhone ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} rounded-r-lg px-4 py-3 outline-none focus:ring-2 transition-all`} 
                  placeholder="--- --- ----" 
                />
              </div>
              <span className="text-[11px] text-gray-500 mt-1 leading-tight w-2/3">By adding your number you agree to receive text messages.</span>
              {errors.contactPhone && <span className="text-red-500 text-xs font-semibold mt-0">{errors.contactPhone.message}</span>}
            </div>
          </div>
        </>
      )}

      {/* Notice that the submit button is handled natively by the form's `onSubmit` when button type="submit". */}
      <button 
        type="submit" 
        className="mt-6 w-full bg-[#2a3bb1] hover:bg-[#202d8f] text-white font-bold py-4 rounded-lg shadow-sm transition-colors text-sm tracking-wide"
      >
        Proceed to Pay
      </button>
      
      <p className="text-xs text-center text-gray-400 mt-2">
        By clicking "Proceed to Pay" I acknowledge that I agree with D'LUXE <a href="#" className="text-[#2a3bb1] hover:underline transition-colors">Terms & Conditions</a> & <a href="#" className="text-[#2a3bb1] hover:underline transition-colors">Privacy Policy</a>
      </p>
    </div>
  );
}
