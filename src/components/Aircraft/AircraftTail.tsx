import React from 'react';

interface AircraftTailProps {
  bodyType: 'NARROW' | 'WIDE' | 'REGIONAL';
  theme?: 'light' | 'dark';
}

export const AircraftTail: React.FC<AircraftTailProps> = ({ bodyType, theme = 'dark' }) => {
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
      {/* SVG Aircraft Tail */}
      <svg
        viewBox="0 0 340 180"
        className="w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stabilizers behind fuselage */}
        {/* Left Horizontal Stabilizer */}
        <path
          d="M 20 20 L -60 120 L 50 120 L 70 60 Z"
          className={isDark ? 'fill-slate-800 stroke-slate-700' : 'fill-slate-200 stroke-slate-300'}
          strokeWidth="3"
        />

        {/* Right Horizontal Stabilizer */}
        <path
          d="M 320 20 L 400 120 L 290 120 L 270 60 Z"
          className={isDark ? 'fill-slate-800 stroke-slate-700' : 'fill-slate-200 stroke-slate-300'}
          strokeWidth="3"
        />

        {/* Fuselage Rear Taper Outline */}
        <path
          d="M 20 0 C 20 0 25 80 150 150 C 158 155 182 155 190 150 C 315 80 320 0 320 0"
          className={`transition-all duration-300 ${
            isDark ? 'fill-slate-900 stroke-slate-700' : 'fill-slate-100 stroke-slate-350'
          }`}
          strokeWidth="4"
        />

        {/* APU Exhaust cone at tail tip */}
        <rect
          x="162"
          y="150"
          width="16"
          height="16"
          rx="0" /* Minimalist square APU exhaust */
          className={isDark ? 'fill-slate-950 stroke-slate-800' : 'fill-slate-300 stroke-slate-400'}
          strokeWidth="2"
        />
        
        {/* Vertical Stabilizer Fin Outline */}
        <path
          d="M 167 40 L 170 145 L 173 145 L 173 40 Z"
          className={isDark ? 'fill-slate-750 stroke-slate-650' : 'fill-slate-250 stroke-slate-350'}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};
