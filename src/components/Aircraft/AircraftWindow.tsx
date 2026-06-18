import React from 'react';

export const AircraftWindow: React.FC = () => {
  return (
    <div className="w-2.5 h-4 mx-1.5 flex items-center justify-center pointer-events-none select-none">
      {/* Outer Window Frame */}
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
          className="fill-slate-800 stroke-slate-600"
          strokeWidth="10"
        />
        {/* Inner Glass / Shade */}
        <rect
          x="22"
          y="22"
          width="56"
          height="116"
          rx="28"
          className="fill-slate-950 stroke-slate-900"
          strokeWidth="6"
        />
      </svg>
    </div>
  );
};
