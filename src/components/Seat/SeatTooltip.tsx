import React from 'react';
import { SeatItem } from '../../types/seat';
import { ShieldAlert, Baby, Info } from 'lucide-react';

interface SeatTooltipProps {
  seat: SeatItem;
  passengerName?: string;
}

export const SeatTooltip: React.FC<SeatTooltipProps> = ({ seat, passengerName }) => {
  const isAvailable = seat.status === 'AVAILABLE';
  const isSelected = seat.status === 'SELECTED';
  const isOccupied = seat.status === 'OCCUPIED';
  const isBlocked = seat.status === 'BLOCKED';

  // Format category name
  const formatCategory = (cat: string) => {
    return cat.replace('_', ' ');
  };

  // Get status color tag
  const getStatusTag = () => {
    if (isBlocked) return <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Blocked</span>;
    if (isOccupied) return <span className="bg-gray-700 text-gray-400 border border-gray-600 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Occupied</span>;
    if (isSelected) return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Selected</span>;
    return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Available</span>;
  };

  return (
    <div className="w-56 p-3 bg-slate-900 border border-slate-700 text-slate-100 rounded-xl shadow-2xl z-50 text-left backdrop-blur-md">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-lg font-extrabold text-white tracking-tight">{seat.code}</span>
          <span className="text-[10px] text-slate-400 ml-2 block sm:inline">
            {seat.isWindow ? 'Window' : seat.isAisle ? 'Aisle' : 'Middle'} Seat
          </span>
        </div>
        <div>
          {getStatusTag()}
        </div>
      </div>

      <div className="space-y-1.5 text-xs border-t border-slate-800 pt-2">
        <div className="flex justify-between text-slate-400">
          <span>Category:</span>
          <span className="font-semibold text-slate-200 uppercase text-[10px] tracking-wider">{formatCategory(seat.category)}</span>
        </div>
        
        {isAvailable && (
          <div className="flex justify-between text-slate-400">
            <span>Price:</span>
            <span className="font-extrabold text-yellow-400 text-sm">
              {seat.currency} {seat.price.toFixed(2)}
            </span>
          </div>
        )}

        {passengerName && (
          <div className="flex justify-between text-slate-400">
            <span>Assigned to:</span>
            <span className="font-semibold text-blue-400">{passengerName}</span>
          </div>
        )}
      </div>

      {/* Warnings / Special Facilities */}
      {seat.category === 'EXIT_ROW' && (
        <div className="mt-2.5 p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-md text-[10px] text-amber-300 flex items-start gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>Must be 15+ years old and able to assist in emergency exit operations.</span>
        </div>
      )}

      {seat.bassinet && (
        <div className="mt-2.5 p-1.5 bg-blue-500/10 border border-blue-500/20 rounded-md text-[10px] text-blue-300 flex items-start gap-1">
          <Baby className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
          <span>Equipped with baby bassinet mount. Priority for passengers traveling with infants.</span>
        </div>
      )}

      {seat.category === 'EXTRA_LEGROOM' && (
        <div className="mt-2.5 p-1.5 bg-purple-500/10 border border-purple-500/20 rounded-md text-[10px] text-purple-300 flex items-start gap-1">
          <Info className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
          <span>Includes extra legroom for maximum flight comfort.</span>
        </div>
      )}
    </div>
  );
};
