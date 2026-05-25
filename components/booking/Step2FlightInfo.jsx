import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Step2FlightInfo({ onNext }) {
  const { register, trigger, formState: { errors } } = useFormContext();

  const handleNext = async () => {
    // Validate only this step's fields before proceeding
    const isValid = await trigger(['airline', 'flightNumber']);
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm flex flex-col gap-6 w-full">
      <div className="flex gap-3 items-center text-gray-500 mb-2">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 16.084V18.5a1.5 1.5 0 01-1.5 1.5h-17A1.5 1.5 0 012 18.5v-2.416l19.5-3.25a.5.5 0 01.5.5zM22 13.92V6.5a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 6.5v7.42l19.5-3.25a.5.5 0 01.5.5z" opacity={0.3}/><path d="M21.583 11.233L2.417 14.426A.5.5 0 012 13.934V10.5h20v2.4a.5.5 0 01-.417.493z" /></svg>
        <span className="text-lg font-medium">Please provide us with your <strong className="font-bold text-gray-800">Arrival</strong> flight details</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Airline Select */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-800">Airline <span className="text-red-500">*</span></label>
          <div className="relative">
            <select 
              {...register('airline')}
              className={`w-full border ${errors.airline ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} rounded-lg px-4 py-3.5 outline-none focus:ring-2 transition-all appearance-none cursor-pointer bg-white text-gray-700`}
            >
              <option value="">Enter airline name</option>
              <option value="Delta">Delta Airlines</option>
              <option value="American">American Airlines</option>
              <option value="United">United Airlines</option>
              <option value="KLM">KLM Royal Dutch Airlines</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          {errors.airline && <span className="text-red-500 text-xs font-semibold">{errors.airline.message}</span>}
        </div>

        {/* Flight Number */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-800">Flight number <span className="text-red-500">*</span></label>
          <input 
            {...register('flightNumber')}
            className={`w-full border ${errors.flightNumber ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} rounded-lg px-4 py-3.5 outline-none focus:ring-2 transition-all text-gray-700`}
            placeholder="e.g. 1234"
          />
          <span className="text-xs text-gray-500 mt-1 leading-relaxed">
            You can find your flight number on your ticket, please provide us with <strong>numbers only</strong>.
          </span>
          {errors.flightNumber && <span className="text-red-500 text-xs font-semibold mt-0">{errors.flightNumber.message}</span>}
        </div>
      </div>

      <button 
        type="button" 
        onClick={handleNext}
        className="mt-4 w-full bg-[#2a3bb1] hover:bg-[#202d8f] text-white font-bold py-4 rounded-lg shadow-sm transition-colors text-sm tracking-wide"
      >
        Confirm & Continue to next step
      </button>
    </div>
  );
}
