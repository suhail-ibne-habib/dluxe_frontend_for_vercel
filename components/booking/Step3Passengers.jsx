import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Step3Passengers({ onNext }) {
  const { register, trigger, watch, setValue, formState: { errors } } = useFormContext();
  
  const passengerCount = watch('passengerCount') || 1;
  const wheelchairRequested = watch('wheelchairRequested') || false;

  const handleNext = async () => {
    // Validate only Step 3 fields
    const isValid = await trigger([
      'passengerType', 'firstName', 'lastName', 
      'dobMonth', 'dobDay', 'dobYear', 'email', 'phone'
    ]);
    if (isValid) {
      onNext();
    }
  };

  const handleIncrement = () => setValue('passengerCount', Number(passengerCount) + 1);
  const handleDecrement = () => passengerCount > 1 && setValue('passengerCount', Number(passengerCount) - 1);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm flex flex-col gap-8 w-full">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Enter Passengers Details</h2>
        <p className="text-sm text-gray-500">Add and review the number of passengers and their personal details.</p>
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between border-b pb-6 border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 leading-tight">Passengers</h4>
            <span className="text-xs font-semibold text-gray-400">Total Amount</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" onClick={handleDecrement} className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
          </button>
          <span className="font-bold text-lg w-4 text-center">{passengerCount}</span>
          <button type="button" onClick={handleIncrement} className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>
      </div>

      {/* Primary Passenger Block */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-gray-400">
             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Primary passenger</h4>
            <span className="text-xs text-gray-500">Provide the passenger details below to complete your booking.</span>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-800">First Name <span className="text-red-500">*</span></label>
            <input 
              {...register('firstName')} 
              className={`w-full border ${errors.firstName ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} rounded-lg px-4 py-3 outline-none focus:ring-2 transition-all`} 
              placeholder="Enter first name" 
            />
            {errors.firstName && <span className="text-red-500 text-xs font-semibold">{errors.firstName.message}</span>}
          </div>
          
          {/* Last Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-800">Last Name <span className="text-red-500">*</span></label>
            <input 
              {...register('lastName')} 
              className={`w-full border ${errors.lastName ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} rounded-lg px-4 py-3 outline-none focus:ring-2 transition-all`} 
              placeholder="Enter last name" 
            />
            {errors.lastName && <span className="text-red-500 text-xs font-semibold">{errors.lastName.message}</span>}
          </div>

          {/* DOB */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-800">Date of birth <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-3 gap-2">
              <select {...register('dobMonth')} className={`border ${errors.dobMonth ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-blue-100 text-gray-700 bg-white`}>
                <option value="">Month</option>
                <option value="01">Jan</option><option value="02">Feb</option><option value="03">Mar</option><option value="04">Apr</option><option value="05">May</option><option value="06">Jun</option><option value="07">Jul</option><option value="08">Aug</option><option value="09">Sep</option><option value="10">Oct</option><option value="11">Nov</option><option value="12">Dec</option>
              </select>
              <input {...register('dobDay')} placeholder="Day" className={`w-full border ${errors.dobDay ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-blue-100 text-gray-700 text-center`} maxLength={2} />
              <input {...register('dobYear')} placeholder="Year" className={`w-full border ${errors.dobYear ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-blue-100 text-gray-700 text-center`} maxLength={4} />
            </div>
            {(errors.dobMonth || errors.dobDay || errors.dobYear) && <span className="text-red-500 text-xs font-semibold">Valid Date of birth required</span>}
          </div>

          {/* Class of Travel */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-800">Class of travel <span className="text-gray-400 font-normal">optional</span></label>
            <div className="relative">
              <select {...register('travelClass')} className="w-full border border-gray-200 focus:border-blue-500 focus:ring-blue-100 rounded-lg px-4 py-3 outline-none focus:ring-2 transition-all appearance-none cursor-pointer bg-white text-gray-700">
                <option value="">Select</option>
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-800">Email <span className="text-red-500">*</span></label>
            <input 
              type="email"
              {...register('email')} 
              className={`w-full border ${errors.email ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} rounded-lg px-4 py-3 outline-none focus:ring-2 transition-all`} 
              placeholder="Enter email" 
            />
            {errors.email && <span className="text-red-500 text-xs font-semibold">{errors.email.message}</span>}
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
                {...register('phone')} 
                className={`w-full border ${errors.phone ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} rounded-r-lg px-4 py-3 outline-none focus:ring-2 transition-all`} 
                placeholder="--- --- ----" 
              />
            </div>
            <span className="text-xs text-gray-500 mt-1">You may receive SMS updates about your booking</span>
            {errors.phone && <span className="text-red-500 text-xs font-semibold mt-0">{errors.phone.message}</span>}
          </div>
        </div>

        {/* Wheelchair Toggle */}
        <div className="mt-8 bg-gray-50/50 p-4 rounded-lg flex items-center gap-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" {...register('wheelchairRequested')} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2a3bb1]"></div>
          </label>
          <span className="text-sm font-bold text-gray-700">Wheelchair requested from the airline</span>
        </div>
      </div>

      <button 
        type="button" 
        onClick={handleNext}
        className="w-full bg-[#2a3bb1] hover:bg-[#202d8f] text-white font-bold py-4 rounded-lg shadow-sm transition-colors text-sm tracking-wide"
      >
        Confirm & Continue to next step
      </button>
    </div>
  );
}
