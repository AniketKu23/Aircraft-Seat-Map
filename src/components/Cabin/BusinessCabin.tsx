import React from 'react';
import { RowData } from '../../hooks/useAircraftLayout';
import { Passenger, SeatItem } from '../../types/seat';
import { AircraftLayoutConfig } from '../../types/aircraft';
import { SeatRow } from '../Seat/SeatRow';
import { Gem } from 'lucide-react';

interface BusinessCabinProps {
  rows: RowData[];
  layout: AircraftLayoutConfig;
  selectedSeatsMap: Record<string, Passenger>;
  activePassengerId: string;
  onSelect: (seat: SeatItem) => void;
  theme?: 'light' | 'dark';
}

export const BusinessCabin: React.FC<BusinessCabinProps> = ({
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
    <div id="BUSINESS CLASS" className={`relative my-4 p-4 border rounded-none transition-all duration-300 ${
      isDark 
        ? 'bg-amber-500/[0.01] border-amber-500/20' 
        : 'bg-amber-500/[0.02] border-amber-500/25'
    }`}>
      {/* Premium Header */}
      <div className={`w-full py-1.5 mb-4 border text-center rounded-none flex items-center justify-center gap-2 select-none ${
        isDark 
          ? 'bg-amber-600/10 border-amber-500/30 text-amber-500' 
          : 'bg-amber-50 border-amber-400 text-amber-800'
      }`}>
        <Gem className="w-3.5 h-3.5" />
        <span className="text-[10px] font-black tracking-[0.25em] uppercase">BUSINESS CLASS</span>
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
