import React from 'react';

interface AircraftWingProps {
  side: 'left' | 'right';
  bodyType: 'NARROW' | 'WIDE' | 'REGIONAL';
  theme?: 'light' | 'dark';
}

export const AircraftWing: React.FC<AircraftWingProps> = ({ side, bodyType, theme = 'dark' }) => {
  const isLeft = side === 'left';
  const isDark = theme === 'dark';
  
  const getWingWidth = () => {
    switch (bodyType) {
      case 'WIDE':
        return 'w-[240px] sm:w-[280px]';
      case 'REGIONAL':
        return 'w-[100px] sm:w-[130px]';
      default: // NARROW
        return 'w-[150px] sm:w-[185px]';
    }
  };

  return (
    <div className={`relative h-full ${getWingWidth()} select-none transition-all duration-500`}>
      {/* SVG Wing Shape */}
      <svg
        viewBox="0 0 200 500"
        className="w-full h-full drop-shadow-md"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: isLeft ? 'none' : 'scaleX(-1)' }}
      >
        {/* Main Wing Body */}
        <path
          d="M 200 40 
             L 10 380 
             C 0 395 10 405 25 400 
             L 200 160 
             Z"
          className={`transition-all duration-300 ${
            isDark ? 'fill-slate-800/95 stroke-slate-700' : 'fill-slate-100/95 stroke-slate-350'
          }`}
          strokeWidth="3.5"
        />

        {/* Engine Nacelle */}
        {bodyType !== 'REGIONAL' && (
          <path
            d="M 120 180 
               C 115 150 125 120 135 120
               C 145 120 155 150 150 180
               C 145 230 125 230 120 180 Z"
            className={isDark ? 'fill-slate-900 stroke-slate-650' : 'fill-slate-200 stroke-slate-350'}
            strokeWidth="2.5"
          />
        )}
        
        {/* Engine Spinner Cone */}
        {bodyType !== 'REGIONAL' && (
          <ellipse
            cx="135"
            cy="120"
            rx="10"
            ry="4"
            className={isDark ? 'fill-slate-950 stroke-slate-700' : 'fill-slate-300 stroke-slate-400'}
            strokeWidth="1.5"
          />
        )}

        {/* Wing Panel Rib Details */}
        <line
          x1="180"
          x2="55"
          y1="180"
          y2="300"
          className={isDark ? 'stroke-slate-750/30' : 'stroke-slate-250/50'}
          strokeWidth="1.5"
        />
        <line
          x1="190"
          x2="105"
          y1="120"
          y2="200"
          className={isDark ? 'stroke-slate-750/30' : 'stroke-slate-250/50'}
          strokeWidth="1.5"
        />

        {/* Navigation lights */}
        <circle
          cx="12"
          cy="382"
          r="6"
          className={isLeft ? "fill-red-500 animate-ping" : "fill-emerald-500 animate-ping"}
        />
        <circle
          cx="12"
          cy="382"
          r="4"
          className={isLeft ? "fill-red-500" : "fill-emerald-500"}
        />
      </svg>
    </div>
  );
};
