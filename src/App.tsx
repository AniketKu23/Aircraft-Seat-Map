import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, ChevronRight, Settings, Info, RefreshCw, Layers, Sun, Moon } from 'lucide-react';

// Data files
import req1 from '../req1.json';
import req2 from '../req2.json';

// Types
import { FlightSegment } from './types/aircraft';
import { SeatItem } from './types/seat';

// Configuration
import { getAircraftLayout } from './config/aircraftLayouts';

// Utilities
import { parseSeatData, extractFlightMetadata, extractPassengers } from './utils/seatHelpers';

// Hooks
import { useSeatSelection } from './hooks/useSeatSelection';

// Components
import { AircraftShell } from './components/Aircraft/AircraftShell';
import { SeatLegend } from './components/Legend/SeatLegend';
import { SeatSummary } from './components/Sidebar/SeatSummary';
import { FareSummary } from './components/Sidebar/FareSummary';

const DATA_SOURCES = [
  { label: 'req1: Gulf Air (A320neo & A321neo)', value: 'req1', data: req1 },
  { label: 'req2: Saudi Arabian (A330 & A321)', value: 'req2', data: req2 }
];

const App: React.FC = () => {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const isDark = theme === 'dark';

  // Data Loading State
  const [selectedSourceValue, setSelectedSourceValue] = useState<string>('req1');
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);

  // Get active source data
  const activeSource = useMemo(() => {
    return DATA_SOURCES.find(s => s.value === selectedSourceValue) || DATA_SOURCES[0];
  }, [selectedSourceValue]);

  // Extract flight segments
  const segments = useMemo((): FlightSegment[] => {
    return extractFlightMetadata(activeSource.data);
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

  // Normalize Seat Data for Active Segment
  const normalizedSeats = useMemo((): SeatItem[] => {
    if (!activeSegment) return [];
    return parseSeatData(activeSource.data, activeSegment.ref);
  }, [activeSource, activeSegment]);

  // Get aircraft layout config
  const activeLayout = useMemo(() => {
    return getAircraftLayout(activeSegment?.aircraftCode);
  }, [activeSegment]);

  // Selection Hooks
  const {
    passengers,
    setPassengers,
    activePassengerId,
    setActivePassengerId,
    selectSeat,
    deselectSeat,
    clearSelection,
    selectedSeatsMap,
    selectedSeatCodes
  } = useSeatSelection();

  // Dynamically sync passengers from API response when the data source changes
  useEffect(() => {
    if (activeSource?.data) {
      const extracted = extractPassengers(activeSource.data);
      setPassengers(extracted);
    }
  }, [activeSource, setPassengers]);

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
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 font-sans selection:bg-blue-500/30 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* BACKGROUND FLIGHT VECTOR ANIMATION */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {/* Radial Pulse Glow */}
        <div className={`absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full filter blur-[120px] animate-radial-pulse ${
          isDark ? 'bg-blue-500/[0.03]' : 'bg-blue-500/[0.02]'
        }`} />

        {/* Altitude Drifting Vector lines */}
        <div className={`absolute left-[5%] top-0 h-[10px] w-[1px] animate-drift-slow ${isDark ? 'bg-slate-800/15' : 'bg-slate-300/40'}`} style={{ animationDelay: '0s' }} />
        <div className={`absolute left-[15%] top-0 h-[30px] w-[1px] animate-drift-fast ${isDark ? 'bg-slate-800/15' : 'bg-slate-300/40'}`} style={{ animationDelay: '5s' }} />
        <div className={`absolute left-[40%] top-0 h-[15px] w-[1px] animate-drift-slow ${isDark ? 'bg-slate-800/15' : 'bg-slate-300/40'}`} style={{ animationDelay: '10s' }} />
        <div className={`absolute right-[20%] top-0 h-[40px] w-[1px] animate-drift-fast ${isDark ? 'bg-slate-800/15' : 'bg-slate-300/40'}`} style={{ animationDelay: '2s' }} />
        <div className={`absolute right-[8%] top-0 h-[20px] w-[1px] animate-drift-slow ${isDark ? 'bg-slate-800/15' : 'bg-slate-300/40'}`} style={{ animationDelay: '8s' }} />
        <div className={`absolute right-[35%] top-0 h-[25px] w-[1px] animate-drift-fast ${isDark ? 'bg-slate-800/15' : 'bg-slate-300/40'}`} style={{ animationDelay: '12s' }} />
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 border-b transition-all duration-300 backdrop-blur-md ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-none shadow">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className={`text-xs font-black tracking-wider uppercase ${isDark ? 'text-white' : 'text-slate-950'}`}>SKYFLOW</span>
              <span className={`text-[9px] block font-bold tracking-widest uppercase leading-none ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Seat Selector</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <motion.button
              type="button"
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className={`p-2 border rounded-none cursor-pointer transition-colors ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:text-yellow-300' 
                  : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-800'
              }`}
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </motion.button>
            <span className={`text-[10px] font-mono border px-2 py-0.5 rounded-none ${
              isDark ? 'text-slate-400 bg-slate-950 border-slate-800' : 'text-slate-600 bg-slate-100 border-slate-300'
            }`}>
              v1.2.0-TS
            </span>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        
        {/* Control Panel (Minimalist sharp styling) */}
        <section className={`border p-4 rounded-none shadow-sm mb-6 text-left transition-colors duration-300 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex items-center gap-2 mb-3.5 text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Settings className="w-4 h-4" />
            <span>Control Center Panel</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Data Source Select */}
            <div className="flex flex-col">
              <label className={`text-[9px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-slate-450' : 'text-slate-500'}`}>Data Source File</label>
              <select
                value={selectedSourceValue}
                onChange={(e) => setSelectedSourceValue(e.target.value)}
                className={`w-full border text-xs rounded-none px-2.5 py-2 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-slate-200' 
                    : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                {DATA_SOURCES.map((source) => (
                  <option key={source.value} value={source.value}>
                    {source.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Flight Segment Tabs */}
            <div className="flex flex-col">
              <label className={`text-[9px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-slate-450' : 'text-slate-500'}`}>Select Segment</label>
              {segments.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {segments.map((seg, idx) => (
                    <motion.button
                      key={seg.ref}
                      onClick={() => {
                        setActiveSegmentIndex(idx);
                        clearSelection();
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`text-[9px] font-black uppercase px-2.5 py-2.5 rounded-none border transition-all duration-300 cursor-pointer ${
                        idx === activeSegmentIndex
                          ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                          : isDark
                            ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                            : 'bg-slate-50 border-slate-300 text-slate-500 hover:text-slate-750 hover:border-slate-450'
                      }`}
                    >
                      {seg.origin} ➡️ {seg.destination} ({seg.carrier}{seg.flightNumber})
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic py-2">No segments found</div>
              )}
            </div>

            {/* 3. Extracted Passengers */}
            <div className="flex flex-col">
              <label className={`text-[9px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-slate-450' : 'text-slate-500'}`}>Extracted Passengers</label>
              <div className="flex flex-wrap gap-1 py-1">
                {passengers.map((p) => (
                  <span
                    key={p.id}
                    className={`text-[9px] font-bold px-2 py-1.5 rounded-none border transition-colors ${
                      p.id === activePassengerId
                        ? 'bg-blue-600 border-blue-500 text-white font-extrabold shadow-sm'
                        : isDark
                          ? 'bg-slate-950 border-slate-800 text-slate-400'
                          : 'bg-slate-50 border-slate-250 text-slate-650'
                    }`}
                  >
                    {p.name} ({p.type})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Flight Information Header Banner */}
        {activeSegment && (
          <section className={`border p-5 rounded-none shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4 text-left transition-colors duration-300 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 border rounded-none flex items-center justify-center ${
                isDark ? 'bg-slate-950 border-slate-800 text-blue-400' : 'bg-slate-50 border-slate-250 text-blue-600'
              }`}>
                <Plane className="w-5 h-5 rotate-90" />
              </div>
              <div>
                <h1 className="text-md font-black tracking-tight leading-none mb-1.5">
                  {activeLayout.name} ({activeSegment.aircraftCode})
                </h1>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-slate-400">
                  <span className="font-bold text-blue-500 uppercase">
                    {activeSegment.carrier} Flight {activeSegment.flightNumber}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="flex items-center gap-1 font-bold">
                    <span className={`px-1.5 py-0.2 rounded-none border ${isDark ? 'bg-slate-950 border-slate-805 text-white' : 'bg-slate-100 border-slate-250 text-slate-750'}`}>{activeSegment.origin}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className={`px-1.5 py-0.2 rounded-none border ${isDark ? 'bg-slate-950 border-slate-805 text-white' : 'bg-slate-100 border-slate-250 text-slate-750'}`}>{activeSegment.destination}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <div className="text-center md:text-right">
                <span className={`text-[8px] font-black uppercase tracking-wider block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Layout</span>
                <span className="text-xs font-black uppercase">{activeLayout.layoutType}</span>
              </div>
              <div className={`h-6 w-[1px] ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
              <div className="text-center md:text-right">
                <span className={`text-[8px] font-black uppercase tracking-wider block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Capacity</span>
                <span className="text-xs font-black">{normalizedSeats.length} Seats</span>
              </div>
              <div className={`h-6 w-[1px] ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
              <div className="text-center md:text-right">
                <span className={`text-[8px] font-black uppercase tracking-wider block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Selected</span>
                <span className="text-xs font-black text-blue-500">{selectedSeatCodes.length} / {passengers.length}</span>
              </div>
            </div>
          </section>
        )}

        {/* Dashboard Split Layout */}
        <section className="flex flex-col lg:flex-row items-start gap-6 relative">
          
          {/* LEFT PANEL: Aircraft Seat Map */}
          <div className={`flex-1 w-full border rounded-none shadow-sm overflow-hidden flex flex-col items-center transition-colors duration-300 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            
            {/* Viewport Header */}
            <div className={`w-full px-5 py-3 border-b flex justify-between items-center select-none ${
              isDark ? 'bg-slate-850/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-[9px] font-black tracking-widest uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Interactive Seat Map</span>
              <motion.button
                type="button"
                onClick={clearSelection}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-[9px] font-black uppercase tracking-wider text-slate-450 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </motion.button>
            </div>

            {/* Fuselage Map Tube */}
            <div className={`w-full max-h-[800px] overflow-y-auto px-4 py-8 flex justify-center transition-colors duration-300 ${
              isDark ? 'bg-gradient-to-b from-slate-950 to-slate-900' : 'bg-slate-50'
            }`}>
              {normalizedSeats.length > 0 ? (
                <AircraftShell
                  aircraftCode={activeSegment?.aircraftCode}
                  seats={normalizedSeats}
                  selectedSeatsMap={selectedSeatsMap}
                  activePassengerId={activePassengerId}
                  onSelect={selectSeat}
                  theme={theme}
                />
              ) : (
                <div className="py-24 text-center text-slate-500 italic text-xs">
                  Loading seat map data...
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Legend & Sidebar summaries */}
          <div className="w-full lg:w-[360px] shrink-0 space-y-5 lg:sticky lg:top-20">
            {/* Legend */}
            <SeatLegend theme={theme} />

            {/* Selected Seats summary */}
            <SeatSummary
              passengers={passengers}
              activePassengerId={activePassengerId}
              setActivePassengerId={setActivePassengerId}
              onDeselect={deselectSeat}
              seats={normalizedSeats}
              theme={theme}
            />

            {/* Fare Calculation */}
            <FareSummary
              passengers={passengers}
              seats={normalizedSeats}
              onConfirm={handleBookingConfirm}
              currency={normalizedSeats[0]?.currency || 'AED'}
              theme={theme}
            />

            {/* Floating Mini-Map / Quick Section Navigator */}
            <div className={`p-4 border rounded-none shadow-sm text-left select-none transition-colors duration-300 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className={`flex items-center gap-1.5 mb-3 text-[9px] font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Layers className="w-3.5 h-3.5" />
                <span>Cabin Navigation</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <motion.button
                  onClick={() => scrollToSection('BUSINESS CLASS')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`py-1.5 text-[9px] font-black uppercase border rounded-none text-center cursor-pointer transition-all duration-300 ${
                    isDark
                      ? 'text-amber-500 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20'
                      : 'text-amber-700 bg-amber-50 border-amber-350 hover:bg-amber-100'
                  }`}
                >
                  Business
                </motion.button>
                <motion.button
                  onClick={() => scrollToSection('PREMIUM ECONOMY')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`py-1.5 text-[9px] font-black uppercase border rounded-none text-center cursor-pointer transition-all duration-300 ${
                    isDark
                      ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20'
                      : 'text-indigo-800 bg-indigo-50 border-indigo-350 hover:bg-indigo-100'
                  }`}
                >
                  Premium
                </motion.button>
                <motion.button
                  onClick={() => scrollToSection('ECONOMY CLASS')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`py-1.5 text-[9px] font-black uppercase border rounded-none text-center cursor-pointer transition-all duration-300 ${
                    isDark
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'
                      : 'text-emerald-805 bg-emerald-50 border-emerald-350 hover:bg-emerald-100'
                  }`}
                >
                  Economy
                </motion.button>
              </div>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
};

export default App;
