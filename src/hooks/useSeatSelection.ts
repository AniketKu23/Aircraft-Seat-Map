import { useState, useCallback, useMemo, useEffect } from 'react';
import { Passenger, SeatItem } from '../types/seat';

export function useSeatSelection() {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [activePassengerId, setActivePassengerId] = useState<string>('');

  // Auto-sync activePassengerId when passengers list changes
  useEffect(() => {
    if (passengers.length > 0) {
      // If activePassengerId is not in the current list, default to the first one
      if (!passengers.some(p => p.id === activePassengerId)) {
        setActivePassengerId(passengers[0].id);
      }
    } else {
      setActivePassengerId('');
    }
  }, [passengers, activePassengerId]);

  // Select a seat for the active passenger
  const selectSeat = useCallback((seat: SeatItem) => {
    if (seat.status === 'OCCUPIED' || seat.status === 'BLOCKED') {
      return; // Can't select unavailable seats
    }

    setPassengers(prev => {
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
    if (passengers.length > 0) {
      setActivePassengerId(passengers[0].id);
    }
  }, [passengers]);

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
    setPassengers,
    activePassengerId,
    setActivePassengerId,
    selectSeat,
    deselectSeat,
    clearSelection,
    selectedSeatsMap,
    selectedSeatCodes
  };
}
