import React, { useState, useEffect, useMemo } from 'react';
import { Plane, ChevronRight, Settings, Info, RefreshCw, Layers } from 'lucide-react';

// Data files
import seatData from '../seatData.json';
import seatdata2 from '../seatdata2.json';
import req1 from '../req1.json.json';
import req2 from '../req2.json.json';

// Types
import { FlightSegment } from './types/aircraft';
import { SeatItem } from './types/seat';

// Configuration
import { getAircraftLayout } from './config/aircraftLayouts';

// Utilities
import { parseSeatData, extractFlightMetadata } from './utils/seatHelpers';

// Hooks
import { useSeatSelection } from './hooks/useSeatSelection';

// Components
import { AircraftShell } from './components/Aircraft/AircraftShell';
import { SeatLegend } from './components/Legend/SeatLegend';
import { SeatSummary } from './components/Sidebar/SeatSummary';
import { FareSummary } from './components/Sidebar/FareSummary';

const DATA_SOURCES = [
  { label: 'Air India Express (A320)', value: 'seatData', data: seatData },
  { label: 'req1: Gulf Air (A320neo & A321neo)', value: 'req1', data: req1 },
  { label: 'req2: Saudi Arabian (A330 & A321)', value: 'req2', data: req2 },
  { label: 'seatdata2: Multiple Flights', value: 'seatdata2', data: seatdata2 }
];

const App: React.FC = () => {
  // 1. Data Loading State
  const [selectedSourceValue, setSelectedSourceValue] = useState<string>('req2'); // Default to rich req2
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);
  const [passengerCountInput, setPassengerCountInput] = useState<number>(2); // Default to 2 passengers for multi-seat tests

  // Get active source data
  const activeSource = useMemo(() => {
    return DATA_SOURCES.find(s => s.value === selectedSourceValue) || DATA_SOURCES[1];
  }, [selectedSourceValue]);

  // Extract flight segments
  const segments = useMemo((): FlightSegment[] => {
    return extractFlightMetadata(activeSource.data, activeSource.value);
  }, [activeSource]);

  // Active segment
  const activeSegment = useMemo((): FlightSegment | null => {
    if (segments.length === 0) return null;
    return segments[activeSegmentIndex] || segments[0];
  }, [segments, activeSegmentIndex]);

  // Reset active segment when source changes
  useEffect(() => {
    setActiveSegmentIndex(0);
  }, [selectedSourceValue]);

  // 2. Normalize Seat Data for Active Segment
  const normalizedSeats = useMemo((): SeatItem[] => {
    if (!activeSegment) return [];
    return parseSeatData(activeSource.data, activeSegment.ref);
  }, [activeSource, activeSegment]);

  // Get aircraft layout config
  const activeLayout = useMemo(() => {
    return getAircraftLayout(activeSegment?.aircraftCode);
  }, [activeSegment]);

  // 3. Selection Hooks
  const {
    passengers,
    activePassengerId,
    setActivePassengerId,
    setPassengerCount,
    setPassengerType,
    selectSeat,
    deselectSeat,
    clearSelection,
    selectedSeatsMap,
    selectedSeatCodes
  } = useSeatSelection(passengerCountInput);

  // Sync passenger count from input changes
  useEffect(() => {
    setPassengerCount(passengerCountInput);
  }, [passengerCountInput, setPassengerCount]);

  // Handle booking confirm
  const handleBookingConfirm = () => {
    const assignments = passengers.map(p => `${p.name} (${p.type}): Seat ${p.selectedSeat || 'Unassigned'}`).join('\n');
    alert(`🎉 Booking Confirmation!:\n\nFlight: ${activeSegment?.carrier}${activeSegment?.flightNumber}\nRoute: ${activeSegment?.origin} ➡️ ${activeSegment?.destination}\nAircraft: ${activeLayout.name}\n\nSelected Seat Assignments:\n${assignments}`);
  };

  // Quick scroll navigation
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-black text-white tracking-wider uppercase">SKYFLOW</span>
              <span className="text-[10px] text-slate-400 block font-bold tracking-widest uppercase leading-none">Seat Map Engine</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800 font-mono">
              v1.2.0 (React 19)
            </span>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Settings and Config Control Bar */}
        <section className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl mb-8">
          <div className="flex items-center gap-2 mb-4 text-slate-300 text-xs font-bold uppercase tracking-wider">
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Control Center Panel (Demo & Testing)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Data Source Select */}
            <div className="flex flex-col text-left">
              <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1.5">JSON Data Source</label>
              <select
                value={selectedSourceValue}
                onChange={(e) => setSelectedSourceValue(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-750 text-xs text-slate-200 rounded-xl px-3 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DATA_SOURCES.map((source) => (
                  <option key={source.value} value={source.value}>
                    {source.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Flight Segment Tabs Selector */}
            <div className="flex flex-col text-left">
              <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1.5">Select Flight Segment</label>
              {segments.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {segments.map((seg, idx) => (
                    <button
                      key={seg.ref}
                      onClick={() => {
                        setActiveSegmentIndex(idx);
                        clearSelection();
                      }}
                      className={`text-[10px] font-extrabold uppercase px-3 py-2 rounded-xl border transition-all duration-300 ${
                        idx === activeSegmentIndex
                          ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/15'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {seg.origin} ➡️ {seg.destination} ({seg.carrier}{seg.flightNumber})
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic py-2">No segments found</div>
              )}
            </div>

            {/* 3. Passengers Count Config */}
            <div className="flex flex-col text-left">
              <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1.5">Passenger Count</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={passengerCountInput}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 1 && val <= 6) {
                      setPassengerCountInput(val);
                    }
                  }}
                  className="w-20 bg-slate-950 border border-slate-800 text-center text-xs text-slate-200 rounded-xl px-2 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-snug">
                  Multi-seat Sequential selection test (Max 6)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Aircraft Information Header Banner */}
        {activeSegment && (
          <section className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
            <div className="flex items-center gap-4">
              <div className="bg-slate-950 p-3.5 border border-slate-800 rounded-2xl flex items-center justify-center text-yellow-400">
                <Plane className="w-6 h-6 rotate-90" />
              </div>
              <div>
                <h1 className="text-lg font-black text-white tracking-tight leading-snug">
                  {activeLayout.name} ({activeSegment.aircraftCode})
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-400">
                  <span className="font-bold text-slate-300 uppercase tracking-wide">
                    {activeSegment.carrier} Flight {activeSegment.flightNumber}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1">
                    <span className="font-extrabold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{activeSegment.origin}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span className="font-extrabold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{activeSegment.destination}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="text-center md:text-right">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Cabin Layout</span>
                <span className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">{activeLayout.layoutType}</span>
              </div>
              <div className="h-8 w-[1px] bg-slate-800" />
              <div className="text-center md:text-right">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Total Seats in Segment</span>
                <span className="text-sm font-extrabold text-slate-200">{normalizedSeats.length} Seats</span>
              </div>
              <div className="h-8 w-[1px] bg-slate-800" />
              <div className="text-center md:text-right">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Selected</span>
                <span className="text-sm font-extrabold text-blue-400">{selectedSeatCodes.length} / {passengerCountInput}</span>
              </div>
            </div>
          </section>
        )}

        {/* Dashboard Split Grid */}
        <section className="flex flex-col lg:flex-row items-start gap-8">
          
          {/* LEFT PANEL: Scrollable Aircraft Fuselage Structure */}
          <div className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col items-center">
            
            {/* Visual Header */}
            <div className="w-full px-6 py-4 bg-slate-850 border-b border-slate-800 flex justify-between items-center select-none">
              <span className="text-xs font-black tracking-widest text-slate-300 uppercase">Interactive Seat Map Viewport</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearSelection}
                  className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Clear Map</span>
                </button>
              </div>
            </div>

            {/* Fuselage scroll track container */}
            <div className="w-full max-h-[850px] overflow-y-auto px-4 py-8 bg-gradient-to-b from-slate-950 to-slate-900 flex justify-center scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950">
              
              {normalizedSeats.length > 0 ? (
                <AircraftShell
                  aircraftCode={activeSegment?.aircraftCode}
                  seats={normalizedSeats}
                  selectedSeatsMap={selectedSeatsMap}
                  activePassengerId={activePassengerId}
                  onSelect={selectSeat}
                />
              ) : (
                <div className="py-24 text-center text-slate-500 italic text-sm">
                  Loading seat map data segment...
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Legend & Sidebar summaries */}
          <div className="w-full lg:w-[380px] shrink-0 space-y-6 lg:sticky lg:top-20">
            {/* Legend card */}
            <SeatLegend />

            {/* Selected Seats summary card */}
            <SeatSummary
              passengers={passengers}
              activePassengerId={activePassengerId}
              setActivePassengerId={setActivePassengerId}
              setPassengerType={setPassengerType}
              onDeselect={deselectSeat}
              seats={normalizedSeats}
            />

            {/* Fare Calculation & Checkout card */}
            <FareSummary
              passengers={passengers}
              seats={normalizedSeats}
              onConfirm={handleBookingConfirm}
              currency={normalizedSeats[0]?.currency || 'AED'}
            />

            {/* Floating Mini-Map / Quick Section Navigator */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-md text-left select-none">
              <div className="flex items-center gap-1.5 mb-3 text-slate-350 text-[10px] font-extrabold uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Quick Cabin Section Navigator</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => scrollToSection('BUSINESS CLASS')}
                  className="py-2 px-1 text-[10px] font-black uppercase text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center hover:bg-amber-500/20 transition-all cursor-pointer"
                >
                  Business
                </button>
                <button
                  onClick={() => scrollToSection('PREMIUM ECONOMY')}
                  className="py-2 px-1 text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-center hover:bg-indigo-500/20 transition-all cursor-pointer"
                >
                  Premium
                </button>
                <button
                  onClick={() => scrollToSection('ECONOMY CLASS')}
                  className="py-2 px-1 text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center hover:bg-emerald-500/20 transition-all cursor-pointer"
                >
                  Economy
                </button>
              </div>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
};

export default App;
