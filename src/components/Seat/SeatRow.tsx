import React from 'react';
import { RowData } from '../../hooks/useAircraftLayout';
import { Passenger, SeatItem } from '../../types/seat';
import { AircraftLayoutConfig } from '../../types/aircraft';
import { SeatGroup } from './SeatGroup';
import { Coffee, ShieldAlert, ArrowLeftRight, LogOut } from 'lucide-react';
import { AircraftWindow } from '../Aircraft/AircraftWindow';

interface SeatRowProps {
  rowData: RowData;
  layout: AircraftLayoutConfig;
  selectedSeatsMap: Record<string, Passenger>;
  activePassengerId: string;
  onSelect: (seat: SeatItem) => void;
  theme?: 'light' | 'dark';
}

export const SeatRow: React.FC<SeatRowProps> = ({
  rowData,
  layout,
  selectedSeatsMap,
  activePassengerId,
  onSelect,
  theme = 'dark'
}) => {
  const { rowNo, isExitRow, seats, facility, cabinClass } = rowData;
  const isDark = theme === 'dark';

  // Split seats by aisles
  const seatGroups = React.useMemo(() => {
    const groups: (SeatItem | null)[][] = [];
    let startIdx = 0;
    
    layout.aisles.forEach(aisleIdx => {
      groups.push(seats.slice(startIdx, aisleIdx + 1));
      startIdx = aisleIdx + 1;
    });
    groups.push(seats.slice(startIdx));
    
    return groups;
  }, [seats, layout]);

  // Is business class row
  const isBusiness = cabinClass?.name === 'BUSINESS CLASS';

  // 1. Render Facility Row (Galley / Lavatory)
  if (facility) {
    const isGalley = facility === 'GALLEY';
    
    return (
      <div className="w-full my-4 flex flex-col items-center select-none">
        {/* Cabin Partition Divider */}
        <div className={`w-full h-[1px] mb-3 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

        <div className="w-full px-6 flex items-center justify-between gap-4">
          {/* Left Facility */}
          <div className={`flex-1 p-2 border rounded-none flex items-center justify-center gap-2 text-xs font-bold tracking-wider uppercase ${
            isDark 
              ? 'bg-slate-800/80 border-slate-700 text-slate-300' 
              : 'bg-slate-100 border-slate-250 text-slate-700'
          }`}>
            {isGalley ? (
              <>
                <Coffee className="w-3.5 h-3.5 text-amber-500" />
                <span>GALLEY</span>
              </>
            ) : (
              <>
                <span className="font-extrabold text-sky-500 text-[10px] leading-none">WC</span>
                <span>LAVATORY</span>
              </>
            )}
          </div>

          {/* Aisle Passage */}
          <div className={`w-12 text-center text-[9px] font-black uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            AISLE
          </div>

          {/* Right Facility */}
          <div className={`flex-1 p-2 border rounded-none flex items-center justify-center gap-2 text-xs font-bold tracking-wider uppercase ${
            isDark 
              ? 'bg-slate-800/80 border-slate-700 text-slate-300' 
              : 'bg-slate-100 border-slate-250 text-slate-700'
          }`}>
            {isGalley ? (
              <>
                <Coffee className="w-3.5 h-3.5 text-amber-500" />
                <span>GALLEY</span>
              </>
            ) : (
              <>
                <span className="font-extrabold text-sky-500 text-[10px] leading-none">WC</span>
                <span>LAVATORY</span>
              </>
            )}
          </div>
        </div>

        {/* Cabin Partition Divider */}
        <div className={`w-full h-[1px] mt-3 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
      </div>
    );
  }

  // 2. Render Seat Row
  return (
    <div className="relative w-full py-1.5 flex flex-col items-center group">
      
      {/* Exit Door Indicators on Fuselage Sides */}
      {isExitRow && (
        <div className="absolute left-[-22px] right-[-22px] top-1/2 -translate-y-1/2 flex justify-between pointer-events-none select-none z-10">
          <div className="flex items-center gap-0.5 bg-orange-600 text-white text-[8px] font-black px-1 py-0.5 rounded-none shadow-sm">
            <LogOut className="w-2 h-2 rotate-180" />
            <span>EXIT</span>
          </div>
          
          <div className="flex items-center gap-0.5 bg-orange-600 text-white text-[8px] font-black px-1 py-0.5 rounded-none shadow-sm">
            <span>EXIT</span>
            <LogOut className="w-2 h-2" />
          </div>
        </div>
      )}

      {/* Row Wrapper */}
      <div className={`flex items-center justify-center w-full px-6 ${
        isExitRow 
          ? isDark 
            ? 'bg-orange-500/[0.03] py-2 border-y border-dashed border-orange-500/30' 
            : 'bg-orange-500/[0.03] py-2 border-y border-dashed border-orange-500/25'
          : ''
      }`}>
        
        {/* Fuselage Window Left */}
        <AircraftWindow />

        {/* Left Row Number */}
        <div className={`w-7 text-left text-[11px] font-extrabold select-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {rowNo}
        </div>

        {/* Seats and Aisles Grid */}
        <div className="flex items-center justify-center gap-4">
          {seatGroups.map((group, gIdx) => {
            const isLastGroup = gIdx === seatGroups.length - 1;
            
            return (
              <React.Fragment key={`group-${gIdx}`}>
                <SeatGroup
                  seats={group}
                  selectedSeatsMap={selectedSeatsMap}
                  activePassengerId={activePassengerId}
                  onSelect={onSelect}
                  isBusiness={isBusiness}
                  theme={theme}
                />
                
                {/* Render Aisle passage */}
                {!isLastGroup && (
                  <div className="w-8 flex items-center justify-center pointer-events-none select-none">
                    {/* In exit rows, draw aisle directional arrows */}
                    {isExitRow ? (
                      <ArrowLeftRight className="w-3.5 h-3.5 text-orange-500 opacity-60 animate-pulse" />
                    ) : (
                      <span className={`text-[10px] font-black opacity-30 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{rowNo}</span>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Row Number */}
        <div className={`w-7 text-right text-[11px] font-extrabold select-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {rowNo}
        </div>

        {/* Fuselage Window Right */}
        <AircraftWindow />
      </div>

      {/* Emergency Exit Row Warnings */}
      {isExitRow && (
        <div className="w-full flex justify-center mt-0.5">
          <div className="text-[8px] text-orange-600 font-black tracking-wider uppercase flex items-center gap-1">
            <ShieldAlert className="w-2.5 h-2.5 animate-bounce" />
            <span>Emergency Exit Row</span>
          </div>
        </div>
      )}
    </div>
  );
};
