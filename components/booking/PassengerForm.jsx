import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function PassengerForm() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm flex flex-col gap-6 mt-8">
      <h3 className="text-2xl font-bold text-gray-900">Passenger Details</h3>
      <p className="text-sm text-gray-500 -mt-4">Please provide the primary contact and flight details for this booking.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">First Name <span className="text-red-500">*</span></label>
          <input 
            {...register('firstName')} 
            className={`border ${errors.firstName ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'} rounded-lg px-4 py-3 outline-none focus:ring-2 transition-all`} 
            placeholder="John" 
          />
          {errors.firstName && <span className="text-red-500 text-xs font-semibold">{errors.firstName.message}</span>}
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Last Name <span className="text-red-500">*</span></label>
          <input 
            {...register('lastName')} 
            className={`border ${errors.lastName ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'} rounded-lg px-4 py-3 outline-none focus:ring-2 transition-all`} 
            placeholder="Doe" 
          />
          {errors.lastName && <span className="text-red-500 text-xs font-semibold">{errors.lastName.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Email Address <span className="text-red-500">*</span></label>
          <input 
            type="email"
            {...register('email')} 
            className={`border ${errors.email ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'} rounded-lg px-4 py-3 outline-none focus:ring-2 transition-all`} 
            placeholder="john.doe@example.com" 
          />
          {errors.email && <span className="text-red-500 text-xs font-semibold">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Phone Number <span className="text-red-500">*</span></label>
          <input 
            type="tel"
            {...register('phone')} 
            className={`border ${errors.phone ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'} rounded-lg px-4 py-3 outline-none focus:ring-2 transition-all`} 
            placeholder="+1 (555) 000-0000" 
          />
          {errors.phone && <span className="text-red-500 text-xs font-semibold">{errors.phone.message}</span>}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700">Flight Number <span className="text-red-500">*</span></label>
          <input 
            {...register('flightNumber')} 
            className={`border ${errors.flightNumber ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'} rounded-lg px-4 py-3 outline-none focus:ring-2 transition-all`} 
            placeholder="e.g. AA1234 or BA012" 
          />
          {errors.flightNumber && <span className="text-red-500 text-xs font-semibold">{errors.flightNumber.message}</span>}
        </div>
        
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700">Special Requests <span className="text-gray-400 font-normal">(Optional)</span></label>
          <textarea 
            {...register('specialRequests')} 
            className="border border-gray-300 focus:border-orange-500 focus:ring-orange-200 rounded-lg px-4 py-3 outline-none focus:ring-2 transition-all min-h-[100px]" 
            placeholder="Do you have any oversized luggage or require wheelchair assistance?" 
          />
        </div>
      </div>
    </div>
  );
}
