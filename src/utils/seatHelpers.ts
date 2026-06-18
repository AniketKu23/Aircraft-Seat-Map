import { FlightSegment, AircraftLayoutConfig } from '../types/aircraft';
import { SeatItem, SeatStatus, SeatCategory } from '../types/seat';
import { getAircraftLayout } from '../config/aircraftLayouts';

/**
 * Extracts all flight segments from the loaded raw JSON data.
 */
export function extractFlightMetadata(rawJson: any, fileName: string = ''): FlightSegment[] {
  if (!rawJson) return [];

  // 1. Format: seatData.json (Single segment format)
  if (rawJson.Service && Array.isArray(rawJson.Service)) {
    const seatService = rawJson.Service.find((s: any) => s.Type === 'SEAT' && s.Code !== 'NoSeat');
    if (seatService) {
      const info = seatService.AdditionalInfo || {};
      return [{
        ref: seatService.AirSegRef || 'single-segment',
        carrier: info.AirlineCode || 'IX',
        flightNumber: info.FlightNumber || '2564',
        aircraftCode: info.CraftType || '320',
        origin: info.Origin || 'DEL',
        destination: info.Destination || 'SXR',
        departureDate: '2026-06-25',
        departureTime: '12:00'
      }];
    }
  }

  // 2. Format: req1.json.json / req2.json.json
  const preBookResponse = rawJson.CheckoutData?.FlightPreBookResponse || rawJson.FlightPreBookResponse;
  if (preBookResponse?.Flight?.AirlineList?.AI?.[0]) {
    const ai = preBookResponse.Flight.AirlineList.AI[0];
    const rSegs = ai.RSegs?.RSeg || [];
    const segments: FlightSegment[] = [];

    rSegs.forEach((rseg: any) => {
      const gsegs = rseg.GSeg || [];
      gsegs.forEach((gseg: any) => {
        const asegs = gseg.ASeg || [];
        asegs.forEach((aseg: any) => {
          segments.push({
            ref: aseg.ARef,
            carrier: aseg.OC || ai.VC || 'GF',
            flightNumber: aseg.OCFN || '',
            aircraftCode: aseg.ACT || '320',
            origin: aseg.DApot || '',
            destination: aseg.AApot || '',
            departureDate: aseg.DDat || '',
            departureTime: aseg.DTim || '',
            arrivalDate: aseg.ADat || '',
            arrivalTime: aseg.ATim || ''
          });
        });
      });
    });

    if (segments.length > 0) return segments;
  }

  // 3. Format: seatdata2.json (No top-level checkout data, only ACAI.SL.SV)
  const acai = rawJson.ACAI || rawJson;
  const sv = acai?.SL?.SV || [];
  if (Array.isArray(sv) && sv.length > 0) {
    const seatServices = sv.filter((s: any) => s.TP === 'SEAT' && s.CD !== 'NoSeat');
    const uniqueArefs = Array.from(new Set(seatServices.map((s: any) => s.ARef).filter(Boolean))) as string[];
    
    if (uniqueArefs.length > 0) {
      // Mock segments corresponding to these ARefs
      const mockRoutes = [
        { origin: 'DXB', dest: 'BAH', carrier: 'GF', fn: '509', craft: '32N' },
        { origin: 'BAH', dest: 'RUH', carrier: 'GF', fn: '169', craft: '32Q' },
        { origin: 'RUH', dest: 'JED', carrier: 'SV', fn: '1045', craft: '330' },
        { origin: 'JED', dest: 'DXB', carrier: 'SV', fn: '598', craft: '321' }
      ];

      return uniqueArefs.map((ref, idx) => {
        const route = mockRoutes[idx % mockRoutes.length];
        return {
          ref: ref,
          carrier: route.carrier,
          flightNumber: route.fn,
          aircraftCode: route.craft,
          origin: route.origin,
          destination: route.dest,
          departureDate: '2026-06-25',
          departureTime: idx % 2 === 0 ? '14:30' : '18:15'
        };
      });
    }
  }

  return [];
}

/**
 * Normalizes raw seat data from raw json based on segment selection.
 */
export function parseSeatData(rawJson: any, segmentRef: string): SeatItem[] {
  if (!rawJson) return [];

  let rawSeats: any[] = [];
  let isFormat1 = false; // seatData.json style

  // Detect format
  if (rawJson.Service && Array.isArray(rawJson.Service)) {
    rawSeats = rawJson.Service;
    isFormat1 = true;
  } else {
    // Check if CheckoutData nested path exists
    const preBookResponse = rawJson.CheckoutData?.FlightPreBookResponse || rawJson.FlightPreBookResponse;
    const ai = preBookResponse?.Flight?.AirlineList?.AI?.[0];
    
    if (ai?.ACAI?.SL?.SV) {
      rawSeats = ai.ACAI.SL.SV;
    } else if (rawJson.ACAI?.SL?.SV) {
      rawSeats = rawJson.ACAI.SL.SV;
    } else if (rawJson.SL?.SV) {
      rawSeats = rawJson.SL.SV;
    } else {
      rawSeats = [];
    }
  }

  // Filter for seat items and filter out "NoSeat" placeholders
  const seatServices = rawSeats.filter((s: any) => {
    const isSeatType = isFormat1 ? s.Type === 'SEAT' : s.TP === 'SEAT';
    const hasSeatCode = isFormat1 ? (s.Code && s.Code !== 'NoSeat') : (s.CD && s.CD !== 'NoSeat');
    const matchesSegment = isFormat1 ? true : (s.ARef === segmentRef);
    return isSeatType && hasSeatCode && matchesSegment;
  });

  const craftCode = seatServices[0]?.AdditionalInfo?.CraftType || 
                    (rawJson.CheckoutData?.FlightPreBookResponse?.Flight?.AirlineList?.AI?.[0]?.RSegs?.RSeg?.[0]?.GSeg?.[0]?.ASeg?.find((x: any) => x.ARef === segmentRef)?.ACT) ||
                    '320';
  
  const layout = getAircraftLayout(craftCode);

  return seatServices.map((s: any) => {
    const code = isFormat1 ? s.Code : s.CD;
    const rowNo = isFormat1 ? parseInt(s.RowNo || '0') : parseInt(code.match(/\d+/)?.[0] || '0');
    const letter = isFormat1 ? s.SeatNo : (code.match(/[A-Z]+/)?.[0] || '');
    const priceStr = isFormat1 ? s.PricingInfo?.TotalGrossPrice : s.PI?.TGP;
    const price = priceStr ? parseFloat(priceStr) : 0;
    const currency = isFormat1 ? s.PricingInfo?.Currency : s.PI?.SC || 'AED';
    const description = isFormat1 ? s.Description : s.DES || 'Standard Seat';

    // Categories
    const category = determineSeatCategory(rowNo, letter, price, layout);

    // Dynamic Availability Hashing
    const status = determineSeatAvailability(code, rowNo, letter, category);

    // Grid placement helpers
    const isWindow = layout.columns[0] === letter || layout.columns[layout.columns.length - 1] === letter;
    
    // Determine Aisle
    let isAisle = false;
    for (const aisleIdx of layout.aisles) {
      if (layout.columns[aisleIdx] === letter || layout.columns[aisleIdx + 1] === letter) {
        isAisle = true;
      }
    }

    const isMiddle = !isWindow && !isAisle;
    
    // Baby bassinet support (usually first rows of cabin sections)
    const isBassinetRow = layout.cabinClasses.some(c => c.startRow === rowNo);
    const bassinet = isBassinetRow && (letter === 'A' || letter === 'F' || letter === 'D');

    return {
      id: code,
      code,
      rowNo,
      letter,
      price,
      currency,
      originalPrice: price,
      status,
      category,
      description,
      segmentRef,
      isWindow,
      isAisle,
      isMiddle,
      bassinet
    };
  });
}

/**
 * Classifies seat category based on row placement, letters, price, and configuration layout.
 */
function determineSeatCategory(
  rowNo: number,
  letter: string,
  price: number,
  layout: AircraftLayoutConfig
): SeatCategory {
  // Check if exit row
  if (layout.emergencyExitRows.includes(rowNo)) {
    return 'EXIT_ROW';
  }

  // Check cabin class configuration
  const cabinClass = layout.cabinClasses.find(c => rowNo >= c.startRow && rowNo <= c.endRow);
  
  if (cabinClass) {
    if (cabinClass.name === 'BUSINESS CLASS') {
      return 'BUSINESS';
    }
    if (cabinClass.name === 'PREMIUM ECONOMY') {
      return 'PREMIUM';
    }
  }

  // Extra legroom criteria (first row of class sections or specific pricing)
  const isFirstRowOfSection = layout.cabinClasses.some(c => c.startRow === rowNo);
  if (isFirstRowOfSection) {
    return 'EXTRA_LEGROOM';
  }

  // Preferred seats (front section of Economy class or window/aisle premium pricing)
  const economyConfig = layout.cabinClasses.find(c => c.name === 'ECONOMY');
  if (economyConfig && rowNo >= economyConfig.startRow && rowNo <= economyConfig.startRow + 4) {
    return 'PREFERRED';
  }

  // Standard pricing
  return 'STANDARD';
}

/**
 * Assigns deterministic occupancy states to seat maps so it looks like a real booking map.
 */
function determineSeatAvailability(
  code: string,
  rowNo: number,
  letter: string,
  category: SeatCategory
): SeatStatus {
  // We want to make sure some seats are occupied, some blocked, and some available.
  // We want deterministic behavior (so reloading the segment doesn't change seats randomly).
  
  // Create a simple hash value
  const numLetter = letter.charCodeAt(0);
  const val = (rowNo * 13 + numLetter * 7);

  // Business class is less occupied
  if (category === 'BUSINESS') {
    if (val % 5 === 0) return 'OCCUPIED';
    if (val % 13 === 0) return 'BLOCKED';
    return 'AVAILABLE';
  }

  // Exit rows are highly guarded (mostly available, but some blocked)
  if (category === 'EXIT_ROW') {
    if (val % 7 === 0) return 'OCCUPIED';
    if (val % 11 === 0) return 'BLOCKED';
    return 'AVAILABLE';
  }

  // Economy rows:
  // Use patterns of consecutive seats (families booking together)
  // Let's check row modular patterns
  const rowMod = rowNo % 7;
  
  if (rowMod === 1) {
    // Row mostly full (A, B, C occupied, D, E, F open)
    return ['A', 'B', 'C'].includes(letter) ? 'OCCUPIED' : 'AVAILABLE';
  }
  if (rowMod === 3) {
    // Row mostly empty
    return letter === 'B' ? 'OCCUPIED' : 'AVAILABLE';
  }
  if (rowMod === 5) {
    // Row completely full except window
    return letter !== 'A' && letter !== 'F' ? 'OCCUPIED' : 'AVAILABLE';
  }
  if (rowMod === 6) {
    // Some blocked seats
    if (letter === 'E') return 'BLOCKED';
    if (letter === 'A' || letter === 'F') return 'OCCUPIED';
    return 'AVAILABLE';
  }

  // General distribution
  const score = val % 10;
  if (score < 4) {
    return 'OCCUPIED';
  }
  if (score === 4) {
    return 'BLOCKED';
  }

  return 'AVAILABLE';
}
