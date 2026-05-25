import React from 'react';

export default function ProgressBar({ currentStep = 1 }) {
  const steps = [
    { num: 1, title: 'Select service' },
    { num: 2, title: 'Flight information' },
    { num: 3, title: 'Passengers details' },
    { num: 4, title: 'Additional services' },
    { num: 5, title: 'Contact information' },
  ];

  return (
    <div className="w-full bg-white border-b border-gray-100 py-6 overflow-x-auto shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-12 flex justify-between items-center min-w-[800px]">
        {steps.map((step, idx) => {
          const isCompleted = step.num < currentStep || (step.num === 1 && currentStep > 1);
          const isActive = step.num === currentStep;
          const isPending = step.num > currentStep;

          return (
            <React.Fragment key={step.num}>
              <div className="flex flex-col gap-1.5 focus:outline-none cursor-default group">
                <span className={`text-sm font-bold transition-colors ${isActive || isCompleted ? 'text-[#0f172a]' : 'text-gray-500'}`}>
                  {step.num}. {step.title}
                </span>
                
                <span className={`text-xs font-semibold flex items-center gap-1.5 transition-colors ${isActive ? 'text-[#2a3bb1]' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                  {isCompleted && (
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                  )}
                  {isActive && (
                    <span className="w-2.5 h-2.5 bg-[#2a3bb1] rounded-full animate-pulse mr-0.5"></span>
                  )}
                  {isPending && (
                    <svg className="w-3.5 h-3.5 opacity-60" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1.5-12.293a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414l2.293-2.293 2.293 2.293a1 1 0 101.414-1.414l-3-3z" clipRule="evenodd"/></svg>
                  )}
                  {isCompleted ? 'Completed' : isActive ? 'In progress' : 'Not completed'}
                </span>
              </div>
              
              {idx < steps.length - 1 && (
                <svg className="w-4 h-4 text-gray-300 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
