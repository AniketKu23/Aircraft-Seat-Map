import React from 'react';
import { Compass } from 'lucide-react';

interface AircraftNoseProps {
  bodyType: 'NARROW' | 'WIDE' | 'REGIONAL';
  theme?: 'light' | 'dark';
}

export const AircraftNose: React.FC<AircraftNoseProps> = ({ bodyType, theme = 'dark' }) => {
  const isDark = theme === 'dark';

  const getWidthClass = () => {
    switch (bodyType) {
      case 'WIDE':
        return 'w-[420px]';
      case 'REGIONAL':
        return 'w-[280px]';
      default: // NARROW
        return 'w-[340px]';
    }
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${getWidthClass()} transition-all duration-500`}>
      {/* Flight Direction Indicator */}
      <div className={`absolute top-[-30px] flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.25em] ${
        isDark ? 'text-slate-500 animate-pulse' : 'text-slate-400 animate-pulse'
      }`}>
        <Compass className="w-3.5 h-3.5" />
        <span>Flight Direction</span>
      </div>

      {/* SVG Aircraft Nose */}
      <svg
        viewBox="0 0 340 180"
        className="w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fuselage Nose Outline */}
        <path
          d="M 20 180 C 20 180 20 20 170 20 C 320 20 320 180 320 180"
          className={`transition-all duration-300 ${
            isDark ? 'fill-slate-900 stroke-slate-700' : 'fill-slate-100 stroke-slate-350'
          }`}
          strokeWidth="4"
        />

        {/* Cockpit Window Left */}
        <path
          d="M 50 110 C 65 80 110 70 155 70 L 155 95 C 120 95 75 100 50 110 Z"
          className="fill-slate-800 stroke-slate-600"
          strokeWidth="2.5"
        />

        {/* Cockpit Window Right */}
        <path
          d="M 290 110 C 275 80 230 70 185 70 L 185 95 C 220 95 265 100 290 110 Z"
          className="fill-slate-800 stroke-slate-600"
          strokeWidth="2.5"
        />

        {/* Cockpit Center Divider Nose-Strap */}
        <line
          x1="170"
          x2="170"
          y1="20"
          y2="70"
          className={isDark ? 'stroke-slate-700' : 'stroke-slate-350'}
          strokeWidth="3.5"
        />
        
        {/* Radome Nose Cone Line */}
        <path
          d="M 70 50 C 110 35 230 35 270 50"
          className={isDark ? 'stroke-slate-700/60' : 'stroke-slate-350/60'}
          strokeWidth="2"
          strokeDasharray="4 2"
        />
      </svg>

      {/* Front Galley Wall divider */}
      <div className={`w-[90%] h-1 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
    </div>
  );
};
