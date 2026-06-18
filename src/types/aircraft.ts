export interface FlightSegment {
  ref: string;
  carrier: string;
  flightNumber: string;
  aircraftCode: string;
  origin: string;
  destination: string;
  departureTime?: string;
  departureDate?: string;
  arrivalTime?: string;
  arrivalDate?: string;
}

export interface CabinClassConfig {
  name: string; // "BUSINESS CLASS" | "PREMIUM ECONOMY" | "ECONOMY"
  startRow: number;
  endRow: number;
  seatColor: string; // Custom tailwind classes or hex colors
}

export interface AircraftLayoutConfig {
  code: string; // e.g. "320", "32N", "321", "32Q", "330", "350", "380", "737", "777", "787", "ATR"
  name: string; // e.g. "Airbus A320neo", "Boeing 787-9 Dreamliner", "ATR 72"
  bodyType: 'NARROW' | 'WIDE' | 'REGIONAL';
  layoutType: '2-2' | '3-3' | '2-4-2' | '3-3-3' | '3-4-3';
  columns: string[]; // e.g. ['A', 'B', 'C', 'D', 'E', 'F']
  aisles: number[]; // 0-indexed indices after which an aisle is rendered (e.g. for 3-3, after index 2 -> column C)
  wingStartRow: number;
  wingEndRow: number;
  emergencyExitRows: number[];
  cabinClasses: CabinClassConfig[];
}
