import React from 'react';
import { useAircraftLayout } from '../../hooks/useAircraftLayout';
import { Passenger, SeatItem } from '../../types/seat';
import { AircraftNose } from './AircraftNose';
import { AircraftTail } from './AircraftTail';
import { AircraftWing } from './AircraftWing';
import { BusinessCabin } from '../Cabin/BusinessCabin';
import { PremiumEconomyCabin } from '../Cabin/PremiumEconomyCabin';
import { EconomyCabin } from '../Cabin/EconomyCabin';

interface AircraftShellProps {
  aircraftCode: string | undefined;
  seats: SeatItem[];
  selectedSeatsMap: Record<string, Passenger>;
  activePassengerId: string;
  onSelect: (seat: SeatItem) => void;
}

export const AircraftShell: React.FC<AircraftShellProps> = ({
  aircraftCode,
  seats,
  selectedSeatsMap,
  activePassengerId,
  onSelect
}) => {
  const {
    layout,
    cabinRows,
    wingPercentage,
    maxRow
  } = useAircraftLayout(aircraftCode, seats);

  const bodyType = layout.bodyType;

  // Sizing helper based on aircraft body type for the fuselage tube
  const getFuselageWidthClass = () => {
    switch (bodyType) {
      case 'WIDE':
        return 'w-[420px]';
      case 'REGIONAL':
        return 'w-[280px]';
      default: // NARROW
        return 'w-[340px]';
    }
  };

  // Partition rows
  const frontFacilities = cabinRows.filter(r => r.rowNo === 0);
  const businessRows = cabinRows.filter(r => r.rowNo > 0 && r.cabinClass?.name === 'BUSINESS CLASS');
  const premiumRows = cabinRows.filter(r => r.rowNo > 0 && r.cabinClass?.name === 'PREMIUM ECONOMY');
  const economyRows = cabinRows.filter(r => r.rowNo > 0 && r.cabinClass?.name === 'ECONOMY');
  const rearFacilities = cabinRows.filter(r => r.rowNo > maxRow);

  // Divider rows (negative row numbers) between cabins
  const dividers = cabinRows.filter(r => r.rowNo < 0);

  return (
    <div className="relative flex flex-col items-center py-10 w-full select-none overflow-x-visible">
      {/* 1. Aircraft Nose */}
      <AircraftNose bodyType={bodyType} />

      {/* 2. Fuselage Tube containing Cabin Sections */}
      <div className={`relative ${getFuselageWidthClass()} bg-slate-900 border-x-4 border-slate-700/80 flex flex-col items-center py-4 shadow-2xl transition-all duration-500`}>
        
        {/* Dynamic Wings Placement */}
        {/* Left Wing */}
        <div
          style={{
            top: `${wingPercentage.top}%`,
            height: `${wingPercentage.height}%`,
          }}
          className="absolute left-0 -translate-x-full pointer-events-none select-none z-0"
        >
          <AircraftWing side="left" bodyType={bodyType} />
        </div>

        {/* Right Wing */}
        <div
          style={{
            top: `${wingPercentage.top}%`,
            height: `${wingPercentage.height}%`,
          }}
          className="absolute right-0 translate-x-full pointer-events-none select-none z-0"
        >
          <AircraftWing side="right" bodyType={bodyType} />
        </div>

        {/* Fuselage Inner Cabin track */}
        <div className="w-full h-full relative z-10 flex flex-col">
          {/* Front Facilities */}
          {frontFacilities.map((r, i) => (
            <div key={`front-fac-${i}`} className="w-full">
              {/* Renders facility row */}
              {r.seats.map((_, idx) => null)} {/* Spacers */}
              {/* Render facility content directly */}
              <div className="w-full px-6 flex items-center justify-between gap-4 py-2">
                <div className="flex-1 p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-center gap-2 text-slate-300">
                  <span className="font-bold text-amber-500 text-[10px] border border-amber-500/30 px-1 py-0.5 rounded leading-none">FD</span>
                  <span className="text-[10px] font-extrabold tracking-wider">FLIGHT DECK</span>
                </div>
                <div className="w-12 text-center text-[9px] text-slate-500 font-extrabold tracking-wider">AISLE</div>
                <div className="flex-1 p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-center gap-2 text-slate-300">
                  <span className="font-bold text-sky-400 text-[10px] border border-sky-400/30 px-1 py-0.5 rounded leading-none">WC</span>
                  <span className="text-[10px] font-extrabold tracking-wider">LAVATORY</span>
                </div>
              </div>
            </div>
          ))}

          {/* Business Class Cabin */}
          <BusinessCabin
            rows={businessRows}
            layout={layout}
            selectedSeatsMap={selectedSeatsMap}
            activePassengerId={activePassengerId}
            onSelect={onSelect}
          />

          {/* Render dividers if transition happens directly between Business and Premium */}
          {dividers.filter(d => Math.abs(d.rowNo) <= (businessRows[businessRows.length - 1]?.rowNo || 0)).map((r, i) => (
            <div key={`div-bp-${i}`} className="w-full px-6 py-2 flex items-center justify-between gap-4 text-slate-500 text-[10px] font-bold uppercase border-y border-dashed border-slate-800">
              <div className="flex-1 text-center py-1 bg-slate-850 rounded">Lavatory</div>
              <div className="w-12 text-center text-[9px] text-slate-600">Divider</div>
              <div className="flex-1 text-center py-1 bg-slate-850 rounded">Galley</div>
            </div>
          ))}

          {/* Premium Economy Cabin */}
          <PremiumEconomyCabin
            rows={premiumRows}
            layout={layout}
            selectedSeatsMap={selectedSeatsMap}
            activePassengerId={activePassengerId}
            onSelect={onSelect}
          />

          {/* Render dividers between Premium and Economy */}
          {dividers.filter(d => {
            const rowVal = Math.abs(d.rowNo);
            const busMax = businessRows[businessRows.length - 1]?.rowNo || 0;
            const premMax = premiumRows[premiumRows.length - 1]?.rowNo || 0;
            return rowVal > busMax && rowVal <= premMax;
          }).map((r, i) => (
            <div key={`div-pe-${i}`} className="w-full px-6 py-2 flex items-center justify-between gap-4 text-slate-500 text-[10px] font-bold uppercase border-y border-dashed border-slate-800">
              <div className="flex-1 text-center py-1 bg-slate-850 rounded">Lavatory</div>
              <div className="w-12 text-center text-[9px] text-slate-600">Divider</div>
              <div className="flex-1 text-center py-1 bg-slate-850 rounded">Galley</div>
            </div>
          ))}

          {/* Economy Cabin */}
          <EconomyCabin
            rows={economyRows}
            layout={layout}
            selectedSeatsMap={selectedSeatsMap}
            activePassengerId={activePassengerId}
            onSelect={onSelect}
          />

          {/* Rear Facilities */}
          {rearFacilities.map((r, i) => (
            <div key={`rear-fac-${i}`} className="w-full">
              <div className="w-full px-6 flex items-center justify-between gap-4 py-3 border-t border-slate-850 mt-2">
                <div className="flex-1 p-2.5 bg-slate-850 border border-slate-750 rounded-xl flex items-center justify-center gap-1.5 text-slate-400">
                  <span className="font-extrabold text-[10px]">WC</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">LAVATORY</span>
                </div>
                <div className="w-12 text-center text-[9px] text-slate-500 font-extrabold tracking-wider">AISLE</div>
                <div className="flex-1 p-2.5 bg-slate-850 border border-slate-750 rounded-xl flex items-center justify-center gap-1.5 text-slate-400">
                  <span className="font-extrabold text-[10px]">WC</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">LAVATORY</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Aircraft Tail */}
      <AircraftTail bodyType={bodyType} />
    </div>
  );
};
