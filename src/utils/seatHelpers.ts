import { FlightSegment, AircraftLayoutConfig } from '../types/aircraft';
import { SeatItem, SeatStatus, SeatCategory, Passenger } from '../types/seat';
import { getAircraftLayout } from '../config/aircraftLayouts';

/**
 * Extracts all flight segments from the raw JSON payload.
 */
export function extractFlightMetadata(rawJson: any): FlightSegment[] {
  if (!rawJson) return [];

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

    return segments;
  }

  return [];
}

/**
 * Normalizes raw seat list from the active segment.
 */
export function parseSeatData(rawJson: any, segmentRef: string): SeatItem[] {
  if (!rawJson) return [];

  let rawSeats: any[] = [];

  // Extract from AI ACAI structure
  const preBookResponse = rawJson.CheckoutData?.FlightPreBookResponse || rawJson.FlightPreBookResponse;
  const ai = preBookResponse?.Flight?.AirlineList?.AI?.[0];
  
  if (ai?.ACAI?.SL?.SV) {
    rawSeats = ai.ACAI.SL.SV;
  } else {
    return [];
  }

  // Filter for seat items matching active segment reference
  const seatServices = rawSeats.filter((s: any) => {
    const isSeatType = s.TP === 'SEAT';
    const hasSeatCode = s.CD && s.CD !== 'NoSeat';
    const matchesSegment = s.ARef === segmentRef;
    return isSeatType && hasSeatCode && matchesSegment;
  });

  const craftCode = ai?.RSegs?.RSeg?.[0]?.GSeg?.[0]?.ASeg?.find((x: any) => x.ARef === segmentRef)?.ACT || '320';
  const layout = getAircraftLayout(craftCode);

  return seatServices.map((s: any) => {
    const code = s.CD;
    const rowNo = parseInt(code.match(/\d+/)?.[0] || '0');
    const letter = code.match(/[A-Z]+/)?.[0] || '';
    const price = s.PI?.TGP ? parseFloat(s.PI.TGP) : 0;
    const currency = s.PI?.SC || 'AED';
    const description = s.DES || 'Standard Seat';

    // Categories
    const category = determineSeatCategory(rowNo, letter, price, layout);

    // Dynamic Availability Hashing
    const status = determineSeatAvailability(code, rowNo, letter, category);

    // Grid helpers
    const isWindow = layout.columns[0] === letter || layout.columns[layout.columns.length - 1] === letter;
    
    // Determine Aisle
    let isAisle = false;
    for (const aisleIdx of layout.aisles) {
      if (layout.columns[aisleIdx] === letter || layout.columns[layout.columns.indexOf(letter)] === layout.columns[aisleIdx + 1]) {
        isAisle = true;
      }
    }

    const isMiddle = !isWindow && !isAisle;
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
 * Extracts passengers dynamically from the CheckoutInfo array.
 */
export function extractPassengers(rawJson: any): Passenger[] {
  const pList = rawJson?.CheckoutInfo?.Passengers || [];
  if (!Array.isArray(pList)) return [];

  let adtCount = 0;
  let chdCount = 0;
  let infCount = 0;

  return pList.map((p: any) => {
    let name = '';
    let type: 'ADULT' | 'CHILD' | 'INFANT' = 'ADULT';

    if (p.Type === 'ADT') {
      adtCount++;
      name = `Adult ${adtCount}`;
      type = 'ADULT';
    } else if (p.Type === 'CHD') {
      chdCount++;
      name = `Child ${chdCount}`;
      type = 'CHILD';
    } else if (p.Type === 'INF') {
      infCount++;
      name = `Infant ${infCount}`;
      type = 'INFANT';
    } else {
      adtCount++;
      name = `Adult ${adtCount}`;
      type = 'ADULT';
    }

    return {
      id: p.PaxRef || `p-${Math.random()}`,
      name,
      type,
      selectedSeat: null
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
  if (layout.emergencyExitRows.includes(rowNo)) {
    return 'EXIT_ROW';
  }

  const cabinClass = layout.cabinClasses.find(c => rowNo >= c.startRow && rowNo <= c.endRow);
  
  if (cabinClass) {
    if (cabinClass.name === 'BUSINESS CLASS') {
      return 'BUSINESS';
    }
    if (cabinClass.name === 'PREMIUM ECONOMY') {
      return 'PREMIUM';
    }
  }

  const isFirstRowOfSection = layout.cabinClasses.some(c => c.startRow === rowNo);
  if (isFirstRowOfSection) {
    return 'EXTRA_LEGROOM';
  }

  const economyConfig = layout.cabinClasses.find(c => c.name === 'ECONOMY');
  if (economyConfig && rowNo >= economyConfig.startRow && rowNo <= economyConfig.startRow + 4) {
    return 'PREFERRED';
  }

  return 'STANDARD';
}

/**
 * Assigns deterministic occupancy states.
 */
function determineSeatAvailability(
  code: string,
  rowNo: number,
  letter: string,
  category: SeatCategory
): SeatStatus {
  const numLetter = letter.charCodeAt(0);
  const val = (rowNo * 13 + numLetter * 7);

  if (category === 'BUSINESS') {
    if (val % 5 === 0) return 'OCCUPIED';
    if (val % 13 === 0) return 'BLOCKED';
    return 'AVAILABLE';
  }

  if (category === 'EXIT_ROW') {
    if (val % 7 === 0) return 'OCCUPIED';
    if (val % 11 === 0) return 'BLOCKED';
    return 'AVAILABLE';
  }

  const rowMod = rowNo % 7;
  
  if (rowMod === 1) {
    return ['A', 'B', 'C'].includes(letter) ? 'OCCUPIED' : 'AVAILABLE';
  }
  if (rowMod === 3) {
    return letter === 'B' ? 'OCCUPIED' : 'AVAILABLE';
  }
  if (rowMod === 5) {
    return letter !== 'A' && letter !== 'F' ? 'OCCUPIED' : 'AVAILABLE';
  }
  if (rowMod === 6) {
    if (letter === 'E') return 'BLOCKED';
    if (letter === 'A' || letter === 'F') return 'OCCUPIED';
    return 'AVAILABLE';
  }

  const score = val % 10;
  if (score < 4) {
    return 'OCCUPIED';
  }
  if (score === 4) {
    return 'BLOCKED';
  }

  return 'AVAILABLE';
}
