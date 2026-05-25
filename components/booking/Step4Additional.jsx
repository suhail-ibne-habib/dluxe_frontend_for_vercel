import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Step4Additional({ onNext }) {
  const { register, trigger, watch, setValue, formState: { errors } } = useFormContext();
  
  const bagCount = watch('bagCount') || 0;

  const handleNext = async () => {
    // Validate only Step 4 fields
    const isValid = await trigger(['specialRequirements', 'driverInformation', 'travelingWithPets']);
    if (isValid) {
      onNext();
    }
  };

  const handleIncrement = () => setValue('bagCount', Number(bagCount) + 1);
  const handleDecrement = () => bagCount > 0 && setValue('bagCount', Number(bagCount) - 1);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm flex flex-col gap-8 w-full">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Additional Services & Information</h2>
        <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">Please provide accurate details about your luggage. If you have any specific requests or concerns, please include them in the field below</p>
      </div>

      <div className="flex flex-col gap-8 mt-2">
        {/* Counter Block */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-gray-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"/></svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 leading-tight">Amount of bags</h4>
              <span className="text-xs font-semibold text-gray-400">over 11 lbs</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={handleDecrement} className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
            </button>
            <span className="font-bold text-lg w-4 text-center">{bagCount}</span>
            <button type="button" onClick={handleIncrement} className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
        </div>

        {/* Upload Tickets Block */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="text-gray-400">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/></svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Upload your Flight Tickets <span className="text-gray-400 font-normal">optional</span></h4>
              <p className="text-xs text-gray-500">You can upload your tickets now, or our team will contact you about this later on.</p>
            </div>
          </div>
          
          {/* Fancier mock drag drop area */}
          <div className="mt-2 border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer relative">
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".jpg,.jpeg,.png,.pdf" />
            <div className="p-3 bg-gray-200 text-gray-500 rounded-full mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            </div>
            <p className="text-sm font-semibold text-gray-700">Drag & drop your files or <span className="text-[#2a3bb1]">click here</span> to select files</p>
            <p className="text-xs font-semibold text-gray-400 mt-2">JPEG, PNG, PDF files supported, up to 5MB</p>
          </div>
        </div>

        {/* Special Requirements */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Special requirements <span className="text-gray-400 font-normal">optional</span></label>
          <textarea 
            {...register('specialRequirements')} 
            className="w-full border border-gray-200 focus:border-blue-500 focus:ring-blue-100 rounded-lg px-4 py-3 outline-none focus:ring-2 transition-all min-h-[100px] text-gray-700 resize-none" 
            placeholder="Any special notes" 
          />
        </div>

        {/* Driver Information */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Add your Driver Information <span className="text-gray-400 font-normal">optional</span></label>
          <textarea 
            {...register('driverInformation')} 
            className="w-full border border-gray-200 focus:border-blue-500 focus:ring-blue-100 rounded-lg px-4 py-3 outline-none focus:ring-2 transition-all min-h-[100px] text-gray-700 resize-none" 
            placeholder="Any special notes" 
          />
        </div>

        {/* Pets Checkbox */}
        <div className="mt-2 flex items-center gap-3">
          <label className="relative flex items-center cursor-pointer">
            <input type="checkbox" {...register('travelingWithPets')} className="w-5 h-5 border-gray-300 rounded text-[#2a3bb1] focus:ring-[#2a3bb1]" />
            <span className="ml-3 text-sm font-bold text-gray-900">Traveling with pets</span>
          </label>
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
