import React from 'react';

interface AircraftWindowProps {
  theme?: 'light' | 'dark';
}

export const AircraftWindow: React.FC<AircraftWindowProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';

  return (
    <div className="w-2.5 h-4 mx-1.5 flex items-center justify-center pointer-events-none select-none">
      <svg
        viewBox="0 0 100 160"
        className="w-full h-full opacity-60 hover:opacity-100 transition-opacity duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Frame */}
        <rect
          x="5"
          y="5"
          width="90"
          height="150"
          rx="45"
          className={isDark ? 'fill-slate-800 stroke-slate-600' : 'fill-slate-200 stroke-slate-300'}
          strokeWidth="10"
        />
        {/* Inner Glass */}
        <rect
          x="22"
          y="22"
          width="56"
          height="116"
          rx="28"
          className={isDark ? 'fill-slate-950 stroke-slate-900' : 'fill-slate-350 stroke-slate-450'}
          strokeWidth="6"
        />
      </svg>
    </div>
  );
};
