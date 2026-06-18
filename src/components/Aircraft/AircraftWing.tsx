import React from 'react';

interface AircraftWingProps {
  side: 'left' | 'right';
  bodyType: 'NARROW' | 'WIDE' | 'REGIONAL';
}

export const AircraftWing: React.FC<AircraftWingProps> = ({ side, bodyType }) => {
  const isLeft = side === 'left';
  
  // Wingspan widths based on body type
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
        className="w-full h-full drop-shadow-lg"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: isLeft ? 'none' : 'scaleX(-1)' }}
      >
        {/* Main Wing Body */}
        {/* Starts top-right (fuselage wall), sweeps down and left */}
        <path
          d="M 200 40 
             L 10 380 
             C 0 395 10 405 25 400 
             L 200 160 
             Z"
          className="fill-slate-800/95 stroke-slate-700"
          strokeWidth="3.5"
        />

        {/* Engine Nacelle Overlay */}
        {/* Draw an engine mounted on the wing for Jet liners (Narrow/Wide body) */}
        {bodyType !== 'REGIONAL' && (
          <path
            d="M 120 180 
               C 115 150 125 120 135 120
               C 145 120 155 150 150 180
               C 145 230 125 230 120 180 Z"
            className="fill-slate-900 stroke-slate-600"
            strokeWidth="2.5"
          />
        )}
        
        {/* Engine Spinner Cone / Inlet */}
        {bodyType !== 'REGIONAL' && (
          <ellipse
            cx="135"
            cy="120"
            rx="10"
            ry="4"
            className="fill-slate-950 stroke-slate-700"
            strokeWidth="1.5"
          />
        )}

        {/* Wing Panel Rib Details */}
        <line
          x1="180"
          x2="55"
          y1="180"
          y2="300"
          className="stroke-slate-750/50"
          strokeWidth="2"
        />
        <line
          x1="190"
          x2="105"
          y1="120"
          y2="200"
          className="stroke-slate-750/50"
          strokeWidth="2"
        />

        {/* Red/Green Navigation lights on Wingtip (Left wing gets Red, Right gets Green) */}
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
