import React from 'react';
import { motion } from 'framer-motion';
import { Passenger, SeatItem } from '../../types/seat';
import { Users, X } from 'lucide-react';

interface SeatSummaryProps {
  passengers: Passenger[];
  activePassengerId: string;
  setActivePassengerId: (id: string) => void;
  setPassengerType: (id: string, type: 'ADULT' | 'CHILD' | 'INFANT') => void;
  onDeselect: (seatCode: string) => void;
  seats: SeatItem[];
  theme?: 'light' | 'dark';
}

export const SeatSummary: React.FC<SeatSummaryProps> = ({
  passengers,
  activePassengerId,
  setActivePassengerId,
  setPassengerType,
  onDeselect,
  seats,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';

  return (
    <div className={`w-full p-4 border rounded-sm select-none text-left transition-all duration-300 ${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
    }`}>
      <div className={`flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        <Users className="w-4 h-4" />
        <span>Selected Seats</span>
      </div>

      <div className="space-y-2.5">
        {passengers.map((p, index) => {
          const seatDetail = p.selectedSeat ? seats.find(s => s.code === p.selectedSeat) : null;
          const isActive = p.id === activePassengerId;

          return (
            <motion.div
              key={p.id}
              onClick={() => setActivePassengerId(p.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`p-3 rounded-none border transition-all duration-300 cursor-pointer ${
                isActive
                  ? isDark
                    ? 'bg-blue-600/10 border-blue-500'
                    : 'bg-blue-50 border-blue-500'
                  : isDark
                    ? 'bg-slate-850 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${p.selectedSeat ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                  <span className={`font-black text-xs uppercase ${isDark ? 'text-slate-100' : 'text-slate-750'}`}>{p.name}</span>
                  {isActive && (
                    <span className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-none uppercase tracking-wider">
                      Selected
                    </span>
                  )}
                </div>

                <select
                  value={p.type}
                  onChange={(e) => {
                    e.stopPropagation();
                    setPassengerType(p.id, e.target.value as any);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={`border text-[9px] rounded-none px-1.5 py-0.5 font-bold uppercase focus:outline-none ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-slate-200' 
                      : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  <option value="ADULT">Adult</option>
                  <option value="CHILD">Child</option>
                  <option value="INFANT">Infant</option>
                </select>
              </div>

              {p.selectedSeat && seatDetail ? (
                <div className={`flex items-center justify-between p-2 border rounded-none text-xs ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-none">
                      {p.selectedSeat}
                    </span>
                    <div>
                      <div className="text-[9px] text-slate-450 font-bold uppercase tracking-wider">
                        {seatDetail.category.replace('_', ' ')}
                      </div>
                      <div className="text-blue-500 font-extrabold text-[11px]">
                        {seatDetail.currency} {seatDetail.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeselect(p.selectedSeat!);
                    }}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              ) : (
                <div className={`text-[11px] italic py-2 text-center border border-dashed rounded-none ${
                  isDark ? 'border-slate-800 text-slate-500 bg-slate-900/20' : 'border-slate-300 text-slate-400 bg-slate-50/50'
                }`}>
                  Select a seat on map
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
