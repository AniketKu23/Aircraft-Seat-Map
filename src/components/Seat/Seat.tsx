import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SeatItem, Passenger } from '../../types/seat';
import { SeatTooltip } from './SeatTooltip';
import { Baby, ShieldAlert } from 'lucide-react';

interface SeatProps {
  seat: SeatItem;
  selectedBy?: Passenger;
  isActiveSelection: boolean;
  onSelect: (seat: SeatItem) => void;
  theme?: 'light' | 'dark';
}

export const Seat: React.FC<SeatProps> = ({
  seat,
  selectedBy,
  isActiveSelection,
  onSelect,
  theme = 'dark'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDark = theme === 'dark';

  const isAvailable = seat.status === 'AVAILABLE';
  const isSelected = !!selectedBy;
  const isOccupied = seat.status === 'OCCUPIED';
  const isBlocked = seat.status === 'BLOCKED';

  // Determine colors based on category, status, and theme
  const getSeatColors = () => {
    if (isBlocked) {
      return {
        base: isDark ? 'fill-slate-800 stroke-red-650' : 'fill-red-50 stroke-red-400',
        armrest: isDark ? 'fill-slate-700 stroke-red-650' : 'fill-red-50 stroke-red-300',
        backrest: isDark ? 'fill-slate-700 stroke-red-650' : 'fill-red-50 stroke-red-300',
        text: 'text-red-500 font-bold',
      };
    }
    if (isOccupied) {
      return {
        base: isDark ? 'fill-slate-800 stroke-slate-700' : 'fill-slate-100 stroke-slate-300',
        armrest: isDark ? 'fill-slate-750 stroke-slate-700' : 'fill-slate-50 stroke-slate-250',
        backrest: isDark ? 'fill-slate-750 stroke-slate-700' : 'fill-slate-50 stroke-slate-250',
        text: isDark ? 'text-slate-600' : 'text-slate-400',
      };
    }
    if (isSelected) {
      return {
        base: 'fill-blue-600 stroke-blue-800',
        armrest: 'fill-blue-700 stroke-blue-800',
        backrest: 'fill-blue-700 stroke-blue-800',
        text: 'text-white font-black',
      };
    }

    // Colors by Category
    switch (seat.category) {
      case 'BUSINESS':
        return {
          base: isDark ? 'fill-amber-500/10 stroke-amber-500' : 'fill-amber-50 stroke-amber-450',
          armrest: isDark ? 'fill-amber-500/15 stroke-amber-500' : 'fill-amber-50/50 stroke-amber-400',
          backrest: isDark ? 'fill-amber-500/15 stroke-amber-500' : 'fill-amber-50/50 stroke-amber-400',
          text: isDark ? 'text-amber-400 font-bold' : 'text-amber-700 font-extrabold',
        };
      case 'EXIT_ROW':
        return {
          base: isDark ? 'fill-orange-500/10 stroke-orange-500' : 'fill-orange-50 stroke-orange-450',
          armrest: isDark ? 'fill-orange-500/15 stroke-orange-500' : 'fill-orange-50/50 stroke-orange-400',
          backrest: isDark ? 'fill-orange-500/15 stroke-orange-500' : 'fill-orange-50/50 stroke-orange-400',
          text: isDark ? 'text-orange-400 font-bold' : 'text-orange-700 font-extrabold',
        };
      case 'EXTRA_LEGROOM':
        return {
          base: isDark ? 'fill-purple-500/10 stroke-purple-500' : 'fill-purple-50 stroke-purple-450',
          armrest: isDark ? 'fill-purple-500/15 stroke-purple-500' : 'fill-purple-50/50 stroke-purple-400',
          backrest: isDark ? 'fill-purple-500/15 stroke-purple-500' : 'fill-purple-50/50 stroke-purple-400',
          text: isDark ? 'text-purple-400 font-bold' : 'text-purple-750 font-extrabold',
        };
      case 'PREFERRED':
        return {
          base: isDark ? 'fill-teal-500/10 stroke-teal-500' : 'fill-teal-50 stroke-teal-450',
          armrest: isDark ? 'fill-teal-500/15 stroke-teal-500' : 'fill-teal-50/50 stroke-teal-400',
          backrest: isDark ? 'fill-teal-500/15 stroke-teal-500' : 'fill-teal-50/50 stroke-teal-400',
          text: isDark ? 'text-teal-400 font-bold' : 'text-teal-750 font-extrabold',
        };
      default: // STANDARD
        return {
          base: isDark ? 'fill-emerald-500/10 stroke-emerald-500' : 'fill-emerald-50 stroke-emerald-450',
          armrest: isDark ? 'fill-emerald-500/15 stroke-emerald-500' : 'fill-emerald-50/50 stroke-emerald-400',
          backrest: isDark ? 'fill-emerald-500/15 stroke-emerald-500' : 'fill-emerald-50/50 stroke-emerald-400',
          text: isDark ? 'text-emerald-455 font-bold' : 'text-emerald-700 font-extrabold',
        };
    }
  };

  const colors = getSeatColors();

  const isBusiness = seat.category === 'BUSINESS';
  const sizeClass = isBusiness ? 'w-11 h-11' : 'w-8.5 h-8.5';

  return (
    <div
      className="relative flex justify-center items-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.button
        type="button"
        disabled={isOccupied || isBlocked}
        onClick={() => onSelect(seat)}
        whileHover={isOccupied || isBlocked ? {} : { scale: 1.1, y: -2 }}
        whileTap={isOccupied || isBlocked ? {} : { scale: 0.9, rotate: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 15 }}
        className={`focus:outline-none relative transition-all duration-300 ${sizeClass} ${
          isActiveSelection 
            ? 'ring-2 ring-blue-500 ring-offset-2' 
            : ''
        } ${isOccupied || isBlocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
      >
        {/* Seat SVG shape */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
        >
          {/* Backrest */}
          <rect
            x="15"
            y="10"
            width="70"
            height="18"
            rx="2" /* Minimalist straighter edges */
            className={`${colors.backrest} stroke-[6]`}
          />
          {/* Left Armrest */}
          <rect
            x="5"
            y="25"
            width="12"
            height="55"
            rx="2"
            className={`${colors.armrest} stroke-[6]`}
          />
          {/* Right Armrest */}
          <rect
            x="83"
            y="25"
            width="12"
            height="55"
            rx="2"
            className={`${colors.armrest} stroke-[6]`}
          />
          {/* Cushion Base */}
          <rect
            x="18"
            y="30"
            width="64"
            height="58"
            rx="3"
            className={`${colors.base} stroke-[6]`}
          />
          <path
            d="M 23 72 L 77 72"
            className={`${colors.base} stroke-current opacity-15 stroke-[3]`}
          />
        </svg>

        {/* Seat label */}
        <div className="absolute inset-0 flex items-center justify-center pt-2">
          <span className={`text-[10px] leading-none ${colors.text}`}>
            {isSelected ? selectedBy.name.split(' ')[1] : seat.letter}
          </span>
        </div>

        {/* Bassinet indicator */}
        {seat.bassinet && !isSelected && (
          <div className="absolute bottom-0.5 right-0.5 bg-blue-500 text-white rounded-full p-0.5 scale-65">
            <Baby className="w-2.5 h-2.5" />
          </div>
        )}

        {/* Exit indicator */}
        {seat.category === 'EXIT_ROW' && !isSelected && (
          <div className="absolute bottom-0.5 right-0.5 bg-orange-500 text-white rounded-full p-0.5 scale-65">
            <ShieldAlert className="w-2.5 h-2.5" />
          </div>
        )}

        {/* Blocked line cross */}
        {isBlocked && (
          <div className="absolute inset-0 flex items-center justify-center pt-2 opacity-50">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="3.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        )}
      </motion.button>

      {/* Seat Hover Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-full mb-2.5 z-50 pointer-events-none"
          >
            <SeatTooltip seat={seat} passengerName={selectedBy?.name} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
