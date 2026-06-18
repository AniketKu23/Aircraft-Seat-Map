import React from 'react';
import { SeatItem, Passenger } from '../../types/seat';
import { Seat } from './Seat';

interface SeatGroupProps {
  seats: (SeatItem | null)[];
  selectedSeatsMap: Record<string, Passenger>;
  activePassengerId: string;
  onSelect: (seat: SeatItem) => void;
  isBusiness: boolean;
  theme?: 'light' | 'dark';
}

export const SeatGroup: React.FC<SeatGroupProps> = ({
  seats,
  selectedSeatsMap,
  activePassengerId,
  onSelect,
  isBusiness,
  theme = 'dark'
}) => {
  const sizeClass = isBusiness ? 'w-11 h-11' : 'w-8.5 h-8.5';

  return (
    <div className="flex items-center gap-1">
      {seats.map((seat, idx) => {
        if (!seat) {
          return (
            <div
              key={`empty-${idx}`}
              className={`${sizeClass} rounded-none border border-transparent`}
            />
          );
        }

        const selectedBy = selectedSeatsMap[seat.code];
        const isActiveSelection = selectedBy?.id === activePassengerId;

        return (
          <Seat
            key={seat.code}
            seat={seat}
            selectedBy={selectedBy}
            isActiveSelection={isActiveSelection}
            onSelect={onSelect}
            theme={theme}
          />
        );
      })}
    </div>
  );
};
