import React from 'react';
import { RowData } from '../../hooks/useAircraftLayout';
import { Passenger, SeatItem } from '../../types/seat';
import { AircraftLayoutConfig } from '../../types/aircraft';
import { SeatRow } from '../Seat/SeatRow';
import { Award } from 'lucide-react';

interface PremiumEconomyCabinProps {
  rows: RowData[];
  layout: AircraftLayoutConfig;
  selectedSeatsMap: Record<string, Passenger>;
  activePassengerId: string;
  onSelect: (seat: SeatItem) => void;
  theme?: 'light' | 'dark';
}

export const PremiumEconomyCabin: React.FC<PremiumEconomyCabinProps> = ({
  rows,
  layout,
  selectedSeatsMap,
  activePassengerId,
  onSelect,
  theme = 'dark'
}) => {
  if (rows.length === 0) return null;
  const isDark = theme === 'dark';

  return (
    <div className={`relative my-4 p-4 border rounded-none transition-all duration-300 ${
      isDark 
        ? 'bg-indigo-500/[0.01] border-indigo-500/20' 
        : 'bg-indigo-500/[0.02] border-indigo-500/25'
    }`}>
      {/* Premium Economy Header */}
      <div className={`w-full py-1.5 mb-4 border text-center rounded-none flex items-center justify-center gap-2 select-none ${
        isDark 
          ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400' 
          : 'bg-indigo-50 border-indigo-400 text-indigo-800'
      }`}>
        <Award className="w-3.5 h-3.5" />
        <span className="text-[10px] font-black tracking-[0.25em] uppercase">PREMIUM ECONOMY</span>
      </div>

      {/* Rows */}
      <div className="space-y-1">
        {rows.map((row, idx) => (
          <SeatRow
            key={row.rowNo < 0 ? `divider-${idx}` : `row-${row.rowNo}`}
            rowData={row}
            layout={layout}
            selectedSeatsMap={selectedSeatsMap}
            activePassengerId={activePassengerId}
            onSelect={onSelect}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
};
