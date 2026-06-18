import React from 'react';
import { RowData } from '../../hooks/useAircraftLayout';
import { Passenger, SeatItem } from '../../types/seat';
import { AircraftLayoutConfig } from '../../types/aircraft';
import { SeatRow } from '../Seat/SeatRow';
import { Users } from 'lucide-react';

interface EconomyCabinProps {
  rows: RowData[];
  layout: AircraftLayoutConfig;
  selectedSeatsMap: Record<string, Passenger>;
  activePassengerId: string;
  onSelect: (seat: SeatItem) => void;
  theme?: 'light' | 'dark';
}

export const EconomyCabin: React.FC<EconomyCabinProps> = ({
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
        ? 'bg-emerald-500/[0.01] border-emerald-500/10' 
        : 'bg-emerald-500/[0.02] border-emerald-500/15'
    }`}>
      {/* Economy Header */}
      <div className={`w-full py-1.5 mb-4 border text-center rounded-none flex items-center justify-center gap-2 select-none ${
        isDark 
          ? 'bg-emerald-600/5 border-emerald-500/20 text-emerald-500' 
          : 'bg-emerald-50 border-emerald-400 text-emerald-800'
      }`}>
        <Users className="w-3.5 h-3.5" />
        <span className="text-[10px] font-black tracking-[0.25em] uppercase">ECONOMY CLASS</span>
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
