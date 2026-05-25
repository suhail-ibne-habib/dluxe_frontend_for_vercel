"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import BookingHeader from '@/components/booking/BookingHeader';
import ProgressBar from '@/components/booking/ProgressBar';
import QuoteSidebar from '@/components/booking/QuoteSidebar';

// Steps
import BookingDetails from '@/components/booking/BookingDetails';
import Step2FlightInfo from '@/components/booking/Step2FlightInfo';
import Step3Passengers from '@/components/booking/Step3Passengers';
import Step4Additional from '@/components/booking/Step4Additional';
import Step5Contact from '@/components/booking/Step5Contact';

import { submitBooking } from '@/app/actions/booking';

const bookingSchema = z.object({
  // Step 2
  airline: z.string().min(1, 'Airline is required'),
  flightNumber: z.string().min(1, 'Flight number is required'),
  // Step 3
  passengerCount: z.number().min(1),
  passengerType: z.string().default('Adult'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dobMonth: z.string().min(1, 'Required'),
  dobDay: z.string().min(1, 'Required'),
  dobYear: z.string().min(4, 'Required'),
  travelClass: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is too short').max(20, 'Phone number is too long'),
  wheelchairRequested: z.boolean().optional(),
  // Step 4
  bagCount: z.number().optional(),
  specialRequirements: z.string().optional(),
  driverInformation: z.string().optional(),
  travelingWithPets: z.boolean().optional(),
  // Step 5
  sameAsPassenger: z.boolean().optional(),
  contactFirstName: z.string().optional(),
  contactLastName: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
});

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [airport, setAirport] = useState('');
  const [date, setDate] = useState('');
  const [activeService, setActiveService] = useState('meet-greet');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availablePackages, setAvailablePackages] = useState([]);
  const [locations, setLocations] = useState([]);

  const methods = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      airline: '',
      flightNumber: '',
      passengerCount: 1,
      passengerType: 'Adult',
      firstName: '',
      lastName: '',
      dobMonth: '',
      dobDay: '',
      dobYear: '',
      travelClass: '',
      email: '',
      phone: '',
      wheelchairRequested: false,
      bagCount: 0,
      specialRequirements: '',
      driverInformation: '',
      travelingWithPets: false,
      sameAsPassenger: false,
      contactFirstName: '',
      contactLastName: '',
      contactEmail: '',
      contactPhone: ''
    }
  });

  const passengers = methods.watch('passengerCount') || 1;

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/packages`);
        if (res.ok) {
          const data = await res.json();
          setAvailablePackages(data.filter(p => p.isActive));
        }
      } catch (err) {
        console.error("Failed to fetch packages:", err);
      }
    };
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations`);
        if (res.ok) {
            const data = await res.json();
            setLocations(data);
            
            // Apply default SXM if parameter is empty
            if (!searchParams.get('airport')) {
               let defaultAirport = null;
               for (const country of data) {
                   if (country.countryName && country.countryName.toLowerCase().includes('maarten')) {
                       defaultAirport = country.airports[0];
                       break;
                   }
                   const sxmMatch = country.airports.find(a => a.name.toLowerCase().includes('sxm'));
                   if (sxmMatch) { defaultAirport = sxmMatch; break; }
               }
               if (defaultAirport) {
                   setAirport(defaultAirport.name);
               } else {
                   setAirport('Princess Juliana International Airport, SXM');
               }
            }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchPackages();
    fetchLocations();
  }, []);

  useEffect(() => {
    // We handle the empty case inside fetchLocations array, but set from query here
    if (searchParams.get('airport')) {
      setAirport(searchParams.get('airport'));
    }
    setDate(searchParams.get('date') || '');
    
    // Attempt to match the service from parameters with a package in the DB
    const serviceParam = searchParams.get('service') || '';
    if (availablePackages.length > 0) {
      const matched = availablePackages.find(p => p.name.toLowerCase() === serviceParam.toLowerCase());
      if (matched) {
        setActiveService(matched.name);
      } else {
        // Fallback or specific logic for old strings
        if (serviceParam.toLowerCase().includes('terminal')) {
          setActiveService('VIP Terminal');
        } else {
          setActiveService(availablePackages[0].name);
        }
      }
    }

    const emailParam = searchParams.get('email');
    if (emailParam) {
      methods.setValue('email', emailParam);
      methods.setValue('contactEmail', emailParam);
    }

    const passengersParam = searchParams.get('passengers');
    if (passengersParam) {
      methods.setValue('passengerCount', parseInt(passengersParam, 10) || 1);
    }
  }, [searchParams, methods, availablePackages]);

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find the current selected package object to get its price
  const selectedPkg = availablePackages.find(p => p.name === activeService) || availablePackages[0];
  let computedPrice = selectedPkg?.basePrice || 474;

  if (selectedPkg && airport && locations.length > 0) {
    let matchedAirport = null;
    for (const country of locations) {
      const match = country.airports.find(a => a.name === airport);
      if (match) {
        matchedAirport = match;
        break;
      }
    }
    
    if (matchedAirport && matchedAirport.customPricing) {
      const customRule = matchedAirport.customPricing.find(cp => parseInt(cp.package_id) === parseInt(selectedPkg._id || selectedPkg.id));
      if (customRule && customRule.custom_price) {
        computedPrice = parseFloat(customRule.custom_price);
      }
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    const unitPrice = computedPrice;

    const finalData = {
      ...data,
      airport,
      date,
      serviceType: activeService,
      packageId: selectedPkg._id || selectedPkg.id,
      pricePerPassenger: unitPrice,
      totalPrice: unitPrice * parseInt(passengers)
    };

    try {
      const response = await submitBooking(finalData);
      
      if (response.success) {
        router.push('/booking/thank-you');
      } else {
        alert("There was an error submitting your booking: " + response.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 font-sans pb-20">
      <BookingHeader />
      <ProgressBar currentStep={currentStep} />
      
      <FormProvider {...methods}>
        <main className="max-w-7xl mx-auto px-4 md:px-12 py-10 flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {currentStep > 1 && (
              <button 
                type="button" 
                onClick={handlePrevStep}
                className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#2a3bb1] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                Back to previous step
              </button>
            )}

            <form id="booking-form" onSubmit={methods.handleSubmit(onSubmit)} className={isSubmitting ? 'opacity-50 pointer-events-none' : ''}>
              
              <div className={currentStep === 1 ? 'block' : 'hidden'}>
                <BookingDetails 
                  airport={airport} 
                  date={date} 
                  passengers={passengers.toString()} 
                  activeService={activeService}
                  setActiveService={setActiveService}
                  unitPrice={computedPrice}
                  selectedPkg={selectedPkg}
                />
                <button 
                  type="button" 
                  onClick={handleNextStep}
                  className="mt-6 w-full bg-[#2a3bb1] hover:bg-[#202d8f] text-white font-bold py-4 rounded-lg shadow-sm transition-colors text-sm tracking-wide"
                >
                  Confirm & Continue to next step
                </button>
              </div>

              <div className={currentStep === 2 ? 'block' : 'hidden'}>
                <Step2FlightInfo onNext={handleNextStep} />
              </div>

              <div className={currentStep === 3 ? 'block' : 'hidden'}>
                <Step3Passengers onNext={handleNextStep} />
              </div>

              <div className={currentStep === 4 ? 'block' : 'hidden'}>
                <Step4Additional onNext={handleNextStep} />
              </div>

              <div className={currentStep === 5 ? 'block' : 'hidden'}>
                <Step5Contact />
              </div>

            </form>
          </div>
          
          <div className="lg:w-1/3">
            <div className="sticky top-10">
              <QuoteSidebar 
                airport={airport} 
                passengers={passengers.toString()} 
                activeService={activeService}
                unitPrice={computedPrice}
                selectedPkg={selectedPkg}
              />
            </div>
          </div>
        </main>
      </FormProvider>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-indigo-900 font-bold">Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
