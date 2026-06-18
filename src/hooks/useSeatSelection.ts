import { useState, useCallback, useMemo } from 'react';
import { Passenger, SeatItem } from '../types/seat';

export function useSeatSelection(initialPassengerCount = 1) {
  const [passengers, setPassengers] = useState<Passenger[]>(() => {
    return Array.from({ length: initialPassengerCount }, (_, i) => ({
      id: `p-${i + 1}`,
      name: `Passenger ${i + 1}`,
      type: 'ADULT',
      selectedSeat: null
    }));
  });

  const [activePassengerId, setActivePassengerId] = useState<string>(`p-1`);

  // Reset or change passenger count
  const setPassengerCount = useCallback((count: number) => {
    setPassengers(prev => {
      // Preserve existing if possible, otherwise create new
      const nextPassengers: Passenger[] = [];
      for (let i = 0; i < count; i++) {
        const id = `p-${i + 1}`;
        const existing = prev.find(p => p.id === id);
        if (existing) {
          nextPassengers.push(existing);
        } else {
          nextPassengers.push({
            id,
            name: `Passenger ${i + 1}`,
            type: 'ADULT',
            selectedSeat: null
          });
        }
      }
      return nextPassengers;
    });
    
    // Reset active passenger to first one
    setActivePassengerId(`p-1`);
  }, []);

  // Update a single passenger type
  const setPassengerType = useCallback((id: string, type: 'ADULT' | 'CHILD' | 'INFANT') => {
    setPassengers(prev => prev.map(p => p.id === id ? { ...p, type } : p));
  }, []);

  // Select a seat for the active passenger
  const selectSeat = useCallback((seat: SeatItem) => {
    if (seat.status === 'OCCUPIED' || seat.status === 'BLOCKED') {
      return; // Can't select unavailable seats
    }

    setPassengers(prev => {
      // Find if anyone already has this seat
      const isAlreadySelectedBySomeone = prev.find(p => p.selectedSeat === seat.code);
      
      // Map passengers
      const updated = prev.map(p => {
        // If this passenger is the one who has it, they are clicking it again -> DESELECT
        if (p.id === activePassengerId && p.selectedSeat === seat.code) {
          return { ...p, selectedSeat: null };
        }
        // If this passenger is the active one, they get the new seat
        if (p.id === activePassengerId) {
          return { ...p, selectedSeat: seat.code };
        }
        // If someone else had this seat, they lose it (since active passenger took it)
        if (p.selectedSeat === seat.code) {
          return { ...p, selectedSeat: null };
        }
        return p;
      });

      // Auto-advance logic:
      // If we just selected a seat, find the next passenger who DOES NOT have a seat
      const newlySelected = updated.find(p => p.id === activePassengerId)?.selectedSeat;
      if (newlySelected) {
        const nextUnassigned = updated.find(p => p.selectedSeat === null);
        if (nextUnassigned) {
          setTimeout(() => setActivePassengerId(nextUnassigned.id), 10);
        }
      }

      return updated;
    });
  }, [activePassengerId]);

  // Deselect a seat
  const deselectSeat = useCallback((seatCode: string) => {
    setPassengers(prev => prev.map(p => p.selectedSeat === seatCode ? { ...p, selectedSeat: null } : p));
  }, []);

  // Clear all selections
  const clearSelection = useCallback(() => {
    setPassengers(prev => prev.map(p => ({ ...p, selectedSeat: null })));
    setActivePassengerId(`p-1`);
  }, []);

  // Map of seat code to passenger object for easy lookup
  const selectedSeatsMap = useMemo(() => {
    const map: Record<string, Passenger> = {};
    passengers.forEach(p => {
      if (p.selectedSeat) {
        map[p.selectedSeat] = p;
      }
    });
    return map;
  }, [passengers]);

  const selectedSeatCodes = useMemo(() => {
    return passengers.map(p => p.selectedSeat).filter(Boolean) as string[];
  }, [passengers]);

  return {
    passengers,
    activePassengerId,
    setActivePassengerId,
    setPassengerCount,
    setPassengerType,
    selectSeat,
    deselectSeat,
    clearSelection,
    selectedSeatsMap,
    selectedSeatCodes
  };
}
