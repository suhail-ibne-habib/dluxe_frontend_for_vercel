"use server";

import { fetchAPI } from '@/lib/api';
import crypto from 'crypto';

function formatToMySQLDate(dateStr) {
  if (!dateStr) return null;
  // If already YYYY-MM-DD, return it
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  
  // Try to parse standard dates (e.g. "18 Mar, 2026")
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }
  return dateStr; // fallback
}

export async function submitBooking(data, existingId = null) {
  try {
    // 1. Find Location ID by airport name
    const airportParts = (data.airport || '').split(',').map(p => p.trim());
    const searchTarget = airportParts.length > 1 ? airportParts[1] : airportParts[0];
    
    let fromLocationId = null;
    try {
      const locations = await fetchAPI('/locations');
      const matchedLocation = locations.find(loc => 
        loc.countryName.toLowerCase() === airportParts[0].toLowerCase() ||
        loc.airports?.some(a => a.name.toLowerCase().includes(searchTarget.toLowerCase()))
      );
      if (matchedLocation) {
        fromLocationId = matchedLocation.id;
      }
    } catch (locError) {
      console.error("[API] Failed to fetch locations for mapping:", locError);
    }

    // 2. Prepare Reservation Data for PHP Backend
    const reservationData = {
      customerName: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Guest User',
      customerEmail: data.email,
      customerPhone: data.phone || 'N/A',
      fromLocation: fromLocationId,
      fromAirport: data.airport,
      toLocation: null,
      toAirport: null,
      departureDate: formatToMySQLDate(data.date), 
      returnDate: null,
      passengers: parseInt(data.passengerCount) || 1,
      serviceLevel: data.serviceType || 'Premium',
      packageId: data.packageId || null,
      status: 'Pending',
      totalAmount: parseFloat(data.totalPrice) || 0,
      paymentStatus: 'Unpaid',
      notes: `Airline: ${data.airline || 'N/A'}, Flight: ${data.flightNumber || 'N/A'}. ${data.specialRequirements || ''}`
    };

    let bookingResponse;
    if (existingId) {
      bookingResponse = await fetchAPI(`/reservations/${existingId}`, {
        method: 'PATCH',
        body: JSON.stringify(reservationData)
      });
    } else {
      bookingResponse = await fetchAPI('/reservations', {
        method: 'POST',
        body: JSON.stringify(reservationData)
      });
    }

    const bookingId = existingId || bookingResponse.id;

    // 3. Auto-Registration Logic via PHP API
    try {
      const existingUser = await fetchAPI(`/user?email=${encodeURIComponent(data.email)}`);

      if (!existingUser) {
        // Create new user
        const tempPassword = crypto.randomBytes(4).toString('hex');
        await fetchAPI('/user', {
          method: 'POST',
          body: JSON.stringify({
            name: reservationData.customerName,
            email: data.email,
            password: tempPassword,
            phone: reservationData.customerPhone,
            isPasswordTemp: true
          })
        });
        console.log(`[AUTH] Created user for ${data.email} with temp password: ${tempPassword}`);
        
        // Note: Email sending should be handled by the PHP backend or a separate service
      } else if (existingUser.is_password_temp) {
        // Regenerate temp password if they haven't changed it
        const tempPassword = crypto.randomBytes(4).toString('hex');
        await fetchAPI(`/user/${existingUser.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            password: tempPassword,
            isPasswordTemp: true
          })
        });
        console.log(`[AUTH] Regenerated temp password for ${data.email}: ${tempPassword}`);
      }
    } catch (authError) {
      console.error("[AUTH] Auto-registration error (non-blocking):", authError);
    }

    // 4. Lead Conversion Logic via PHP API
    try {
      // Find leads for this email and update to 'Booked'
      const allLeads = await fetchAPI('/leads');
      const userLeads = allLeads.filter(l => l.email === data.email && l.status === 'Inquiry');
      
      for (const lead of userLeads) {
        await fetchAPI(`/leads/${lead.id || lead._id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'Booked' })
        });
      }
    } catch (leadError) {
      console.error("[LEADS] Lead conversion error (non-blocking):", leadError);
    }

    return {
      success: true,
      message: existingId ? "Booking updated successfully" : "Booking received successfully",
      bookingId: bookingId.toString()
    };
  } catch (error) {
    console.error("Booking Action Error:", error);
    return {
      success: false,
      message: error.message || "Unknown error occurred during booking."
    };
  }
}
