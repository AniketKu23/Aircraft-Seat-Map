import React from 'react';
import { Info } from 'lucide-react';

interface SeatLegendProps {
  theme?: 'light' | 'dark';
}

export const SeatLegend: React.FC<SeatLegendProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';

  const items = [
    { label: 'Available', bg: isDark ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-emerald-50 border-emerald-300 text-emerald-700' },
    { label: 'Selected', bg: 'bg-blue-600 text-white border-blue-800 font-bold' },
    { label: 'Occupied', bg: isDark ? 'bg-slate-850 border-slate-700 text-slate-500' : 'bg-slate-200 border-slate-300 text-slate-400' },
    { label: 'Blocked', bg: isDark ? 'bg-red-500/10 border-red-500/30 text-red-500 font-black' : 'bg-red-50 border-red-300 text-red-600 font-black', sub: 'X' },
    { label: 'Business Class', bg: isDark ? 'bg-amber-500/15 border-amber-500/40 text-amber-500' : 'bg-amber-50 border-amber-400 text-amber-700' },
    { label: 'Extra Legroom', bg: isDark ? 'bg-purple-500/15 border-purple-500/40 text-purple-400' : 'bg-purple-50 border-purple-400 text-purple-700' },
    { label: 'Exit Row', bg: isDark ? 'bg-orange-500/15 border-orange-500/40 text-orange-400' : 'bg-orange-50 border-orange-400 text-orange-700' },
    { label: 'Preferred', bg: isDark ? 'bg-teal-500/15 border-teal-500/40 text-teal-400' : 'bg-teal-50 border-teal-400 text-teal-700' },
  ];

  return (
    <div className={`w-full p-4 border rounded-sm select-none sticky top-0 z-40 transition-all duration-300 ${
      isDark 
        ? 'bg-slate-900/90 border-slate-800 text-slate-100 backdrop-blur-md' 
        : 'bg-white/90 border-slate-200 text-slate-800 backdrop-blur-md shadow-sm'
    }`}>
      <div className={`flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        <Info className="w-3.5 h-3.5" />
        <span>Seat Legend</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {/* Miniature Flat Seat */}
            <div className={`w-5.5 h-5.5 rounded-none border flex items-center justify-center text-[10px] font-black ${item.bg}`}>
              {item.sub || ''}
            </div>
            <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
