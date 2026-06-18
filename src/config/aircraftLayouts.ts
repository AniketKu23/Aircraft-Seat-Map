import { AircraftLayoutConfig } from '../types/aircraft';

export const AIRCRAFT_LAYOUTS: Record<string, AircraftLayoutConfig> = {
  // --- NARROW BODY (3-3) ---
  '320': {
    code: '320',
    name: 'Airbus A320',
    bodyType: 'NARROW',
    layoutType: '3-3',
    columns: ['A', 'B', 'C', 'D', 'E', 'F'],
    aisles: [2], // Aisle after C (index 2)
    wingStartRow: 11,
    wingEndRow: 18,
    emergencyExitRows: [12, 14], // superstitions skip 13
    cabinClasses: [
      { name: 'BUSINESS CLASS', startRow: 1, endRow: 3, seatColor: 'from-amber-500 to-yellow-400 text-black border-amber-600' },
      { name: 'PREMIUM ECONOMY', startRow: 4, endRow: 7, seatColor: 'from-indigo-600 to-indigo-400 text-white border-indigo-700' },
      { name: 'ECONOMY', startRow: 8, endRow: 31, seatColor: 'from-emerald-600 to-emerald-400 text-white border-emerald-700' }
    ]
  },
  '32N': {
    code: '32N',
    name: 'Airbus A320neo',
    bodyType: 'NARROW',
    layoutType: '3-3',
    columns: ['A', 'B', 'C', 'D', 'E', 'F'],
    aisles: [2],
    wingStartRow: 11,
    wingEndRow: 18,
    emergencyExitRows: [12, 14],
    cabinClasses: [
      { name: 'BUSINESS CLASS', startRow: 1, endRow: 3, seatColor: 'from-amber-500 to-yellow-400 text-black border-amber-600' },
      { name: 'PREMIUM ECONOMY', startRow: 4, endRow: 8, seatColor: 'from-indigo-600 to-indigo-400 text-white border-indigo-700' },
      { name: 'ECONOMY', startRow: 9, endRow: 32, seatColor: 'from-emerald-600 to-emerald-400 text-white border-emerald-700' }
    ]
  },
  '321': {
    code: '321',
    name: 'Airbus A321',
    bodyType: 'NARROW',
    layoutType: '3-3',
    columns: ['A', 'B', 'C', 'J', 'K', 'L'], // Alternate letter schemes sometimes used
    aisles: [2],
    wingStartRow: 13,
    wingEndRow: 22,
    emergencyExitRows: [11, 12, 26],
    cabinClasses: [
      { name: 'BUSINESS CLASS', startRow: 1, endRow: 4, seatColor: 'from-amber-500 to-yellow-400 text-black border-amber-600' },
      { name: 'PREMIUM ECONOMY', startRow: 5, endRow: 10, seatColor: 'from-indigo-600 to-indigo-400 text-white border-indigo-700' },
      { name: 'ECONOMY', startRow: 11, endRow: 38, seatColor: 'from-emerald-600 to-emerald-400 text-white border-emerald-700' }
    ]
  },
  '32Q': {
    code: '32Q',
    name: 'Airbus A321neo',
    bodyType: 'NARROW',
    layoutType: '3-3',
    columns: ['A', 'B', 'C', 'D', 'E', 'F'],
    aisles: [2],
    wingStartRow: 13,
    wingEndRow: 22,
    emergencyExitRows: [12, 13, 27],
    cabinClasses: [
      { name: 'BUSINESS CLASS', startRow: 1, endRow: 4, seatColor: 'from-amber-500 to-yellow-400 text-black border-amber-600' },
      { name: 'PREMIUM ECONOMY', startRow: 5, endRow: 10, seatColor: 'from-indigo-600 to-indigo-400 text-white border-indigo-700' },
      { name: 'ECONOMY', startRow: 11, endRow: 38, seatColor: 'from-emerald-600 to-emerald-400 text-white border-emerald-700' }
    ]
  },
  '737': {
    code: '737',
    name: 'Boeing 737 MAX 8',
    bodyType: 'NARROW',
    layoutType: '3-3',
    columns: ['A', 'B', 'C', 'D', 'E', 'F'],
    aisles: [2],
    wingStartRow: 10,
    wingEndRow: 18,
    emergencyExitRows: [15, 16],
    cabinClasses: [
      { name: 'BUSINESS CLASS', startRow: 1, endRow: 3, seatColor: 'from-amber-500 to-yellow-400 text-black border-amber-600' },
      { name: 'PREMIUM ECONOMY', startRow: 4, endRow: 7, seatColor: 'from-indigo-600 to-indigo-400 text-white border-indigo-700' },
      { name: 'ECONOMY', startRow: 8, endRow: 30, seatColor: 'from-emerald-600 to-emerald-400 text-white border-emerald-700' }
    ]
  },

  // --- REGIONAL (2-2) ---
  'ATR': {
    code: 'ATR',
    name: 'ATR 72-600',
    bodyType: 'REGIONAL',
    layoutType: '2-2',
    columns: ['A', 'C', 'D', 'F'],
    aisles: [1], // Aisle after C (index 1)
    wingStartRow: 5,
    wingEndRow: 10,
    emergencyExitRows: [1, 2], // ATR exits are front and rear
    cabinClasses: [
      { name: 'PREMIUM ECONOMY', startRow: 1, endRow: 2, seatColor: 'from-indigo-600 to-indigo-400 text-white border-indigo-700' },
      { name: 'ECONOMY', startRow: 3, endRow: 18, seatColor: 'from-emerald-600 to-emerald-400 text-white border-emerald-700' }
    ]
  },
  'ATR72': {
    code: 'ATR72',
    name: 'ATR 72',
    bodyType: 'REGIONAL',
    layoutType: '2-2',
    columns: ['A', 'C', 'D', 'F'],
    aisles: [1],
    wingStartRow: 5,
    wingEndRow: 10,
    emergencyExitRows: [1, 2],
    cabinClasses: [
      { name: 'PREMIUM ECONOMY', startRow: 1, endRow: 2, seatColor: 'from-indigo-600 to-indigo-400 text-white border-indigo-700' },
      { name: 'ECONOMY', startRow: 3, endRow: 18, seatColor: 'from-emerald-600 to-emerald-400 text-white border-emerald-700' }
    ]
  },

  // --- WIDE BODY (2-4-2, 3-3-3, 3-4-3) ---
  '330': {
    code: '330',
    name: 'Airbus A330-300',
    bodyType: 'WIDE',
    layoutType: '2-4-2',
    columns: ['A', 'C', 'D', 'E', 'F', 'H', 'J', 'L'],
    aisles: [1, 5], // Aisle after C (index 1) and H (index 5)
    wingStartRow: 15,
    wingEndRow: 30,
    emergencyExitRows: [30, 44],
    cabinClasses: [
      { name: 'BUSINESS CLASS', startRow: 1, endRow: 8, seatColor: 'from-amber-500 to-yellow-400 text-black border-amber-600' },
      { name: 'PREMIUM ECONOMY', startRow: 9, endRow: 15, seatColor: 'from-indigo-600 to-indigo-400 text-white border-indigo-700' },
      { name: 'ECONOMY', startRow: 16, endRow: 50, seatColor: 'from-emerald-600 to-emerald-400 text-white border-emerald-700' }
    ]
  },
  '333': {
    code: '333',
    name: 'Airbus A330-300',
    bodyType: 'WIDE',
    layoutType: '2-4-2',
    columns: ['A', 'C', 'D', 'E', 'F', 'H', 'J', 'L'],
    aisles: [1, 5],
    wingStartRow: 15,
    wingEndRow: 30,
    emergencyExitRows: [30, 44],
    cabinClasses: [
      { name: 'BUSINESS CLASS', startRow: 1, endRow: 8, seatColor: 'from-amber-500 to-yellow-400 text-black border-amber-600' },
      { name: 'PREMIUM ECONOMY', startRow: 9, endRow: 15, seatColor: 'from-indigo-600 to-indigo-400 text-white border-indigo-700' },
      { name: 'ECONOMY', startRow: 16, endRow: 50, seatColor: 'from-emerald-600 to-emerald-400 text-white border-emerald-700' }
    ]
  },
  '350': {
    code: '350',
    name: 'Airbus A350-900',
    bodyType: 'WIDE',
    layoutType: '3-3-3',
    columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K'],
    aisles: [2, 5], // Aisle after C (index 2) and F (index 5)
    wingStartRow: 18,
    wingEndRow: 30,
    emergencyExitRows: [18, 30],
    cabinClasses: [
      { name: 'BUSINESS CLASS', startRow: 1, endRow: 10, seatColor: 'from-amber-500 to-yellow-400 text-black border-amber-600' },
      { name: 'PREMIUM ECONOMY', startRow: 11, endRow: 17, seatColor: 'from-indigo-600 to-indigo-400 text-white border-indigo-700' },
      { name: 'ECONOMY', startRow: 18, endRow: 55, seatColor: 'from-emerald-600 to-emerald-400 text-white border-emerald-700' }
    ]
  },
  '787': {
    code: '787',
    name: 'Boeing 787 Dreamliner',
    bodyType: 'WIDE',
    layoutType: '3-3-3',
    columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'],
    aisles: [2, 5],
    wingStartRow: 15,
    wingEndRow: 30,
    emergencyExitRows: [18, 32],
    cabinClasses: [
      { name: 'BUSINESS CLASS', startRow: 1, endRow: 8, seatColor: 'from-amber-500 to-yellow-400 text-black border-amber-600' },
      { name: 'PREMIUM ECONOMY', startRow: 9, endRow: 14, seatColor: 'from-indigo-600 to-indigo-400 text-white border-indigo-700' },
      { name: 'ECONOMY', startRow: 15, endRow: 45, seatColor: 'from-emerald-600 to-emerald-400 text-white border-emerald-700' }
    ]
  },
  '777': {
    code: '777',
    name: 'Boeing 777-300ER',
    bodyType: 'WIDE',
    layoutType: '3-4-3',
    columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'],
    aisles: [2, 6], // Aisle after C (index 2) and G (index 6)
    wingStartRow: 18,
    wingEndRow: 30,
    emergencyExitRows: [17, 31],
    cabinClasses: [
      { name: 'BUSINESS CLASS', startRow: 1, endRow: 12, seatColor: 'from-amber-500 to-yellow-400 text-black border-amber-600' },
      { name: 'PREMIUM ECONOMY', startRow: 13, endRow: 20, seatColor: 'from-indigo-600 to-indigo-400 text-white border-indigo-700' },
      { name: 'ECONOMY', startRow: 21, endRow: 60, seatColor: 'from-emerald-600 to-emerald-400 text-white border-emerald-700' }
    ]
  },
  '380': {
    code: '380',
    name: 'Airbus A380 Superjumbo',
    bodyType: 'WIDE',
    layoutType: '3-4-3',
    columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'],
    aisles: [2, 6],
    wingStartRow: 20,
    wingEndRow: 38,
    emergencyExitRows: [22, 54],
    cabinClasses: [
      { name: 'BUSINESS CLASS', startRow: 1, endRow: 15, seatColor: 'from-amber-500 to-yellow-400 text-black border-amber-600' },
      { name: 'PREMIUM ECONOMY', startRow: 16, endRow: 24, seatColor: 'from-indigo-600 to-indigo-400 text-white border-indigo-700' },
      { name: 'ECONOMY', startRow: 25, endRow: 88, seatColor: 'from-emerald-600 to-emerald-400 text-white border-emerald-700' }
    ]
  }
};

// Fallback layout when aircraft type is unknown
export const DEFAULT_LAYOUT_NARROW: AircraftLayoutConfig = AIRCRAFT_LAYOUTS['320'];
export const DEFAULT_LAYOUT_REGIONAL: AircraftLayoutConfig = AIRCRAFT_LAYOUTS['ATR'];
export const DEFAULT_LAYOUT_WIDE: AircraftLayoutConfig = AIRCRAFT_LAYOUTS['330'];

export function getAircraftLayout(code: string | undefined): AircraftLayoutConfig {
  if (!code) return DEFAULT_LAYOUT_NARROW;
  const upperCode = code.toUpperCase();
  
  // Try direct match
  if (AIRCRAFT_LAYOUTS[upperCode]) {
    return AIRCRAFT_LAYOUTS[upperCode];
  }
  
  // Try pattern matching
  if (upperCode.includes('319') || upperCode.includes('320') || upperCode.includes('32N') || upperCode.includes('737') || upperCode.includes('738') || upperCode.includes('739') || upperCode.includes('MAX')) {
    return AIRCRAFT_LAYOUTS['320'];
  }
  if (upperCode.includes('321') || upperCode.includes('32Q') || upperCode.includes('321NEO')) {
    return AIRCRAFT_LAYOUTS['321'];
  }
  if (upperCode.includes('ATR') || upperCode.includes('AT7') || upperCode.includes('AT4') || upperCode.includes('Q400') || upperCode.includes('EMB') || upperCode.includes('E17') || upperCode.includes('E19')) {
    return AIRCRAFT_LAYOUTS['ATR'];
  }
  if (upperCode.includes('330') || upperCode.includes('333') || upperCode.includes('332') || upperCode.includes('340')) {
    return AIRCRAFT_LAYOUTS['330'];
  }
  if (upperCode.includes('350') || upperCode.includes('359')) {
    return AIRCRAFT_LAYOUTS['350'];
  }
  if (upperCode.includes('787') || upperCode.includes('788') || upperCode.includes('789')) {
    return AIRCRAFT_LAYOUTS['787'];
  }
  if (upperCode.includes('777') || upperCode.includes('773') || upperCode.includes('772') || upperCode.includes('747')) {
    return AIRCRAFT_LAYOUTS['777'];
  }
  if (upperCode.includes('380') || upperCode.includes('A380')) {
    return AIRCRAFT_LAYOUTS['380'];
  }

  // Guess based on seat count or length
  return DEFAULT_LAYOUT_NARROW;
}
