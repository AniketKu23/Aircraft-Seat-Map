export type SeatStatus = 'AVAILABLE' | 'SELECTED' | 'OCCUPIED' | 'BLOCKED';

export type SeatCategory = 
  | 'STANDARD' 
  | 'PREMIUM' 
  | 'EXIT_ROW' 
  | 'EXTRA_LEGROOM' 
  | 'PREFERRED' 
  | 'BUSINESS' 
  | 'CREW';

export interface SeatItem {
  id: string; // CD (e.g. "12A")
  code: string; // CD (e.g. "12A")
  rowNo: number;
  letter: string;
  price: number;
  currency: string;
  originalPrice: number;
  status: SeatStatus;
  category: SeatCategory;
  description: string;
  segmentRef: string;
  isWindow: boolean;
  isAisle: boolean;
  isMiddle: boolean;
  bassinet?: boolean;
}

export interface Passenger {
  id: string; // e.g. "p1", "p2"
  name: string; // e.g. "Passenger 1"
  type: 'ADULT' | 'CHILD' | 'INFANT';
  selectedSeat: string | null; // Seat CD or null
}
