import React from 'react';
import { motion } from 'framer-motion';
import { Passenger, SeatItem } from '../../types/seat';
import { CreditCard, AlertCircle } from 'lucide-react';

interface FareSummaryProps {
  passengers: Passenger[];
  seats: SeatItem[];
  onConfirm: () => void;
  currency: string;
  theme?: 'light' | 'dark';
}

export const FareSummary: React.FC<FareSummaryProps> = ({
  passengers,
  seats,
  onConfirm,
  currency,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';

  const baseFlightFare = 249.00;
  const passengerCount = passengers.length;
  const totalBaseFare = baseFlightFare * passengerCount;

  const selectedSeatDetails = passengers
    .map(p => p.selectedSeat ? seats.find(s => s.code === p.selectedSeat) : null)
    .filter(Boolean) as SeatItem[];

  const totalSeatSelectionFee = selectedSeatDetails.reduce((sum, s) => sum + s.price, 0);
  const taxRate = 0.05;
  const taxesAndFees = (totalBaseFare + totalSeatSelectionFee) * taxRate;
  const grandTotal = totalBaseFare + totalSeatSelectionFee + taxesAndFees;

  const allSeatsAssigned = passengers.every(p => p.selectedSeat !== null);

  return (
    <div className={`w-full p-4 border rounded-sm select-none text-left transition-all duration-300 ${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
    }`}>
      <div className={`flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider border-b pb-2 ${
        isDark ? 'text-slate-400 border-slate-850' : 'text-slate-505 border-slate-150'
      }`}>
        <CreditCard className="w-4 h-4" />
        <span>Fare Breakdown</span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-slate-400">
          <span>Flight Base Fare ({passengerCount} Pax)</span>
          <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            {currency} {totalBaseFare.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-slate-400">
          <span>Seat Selection Fees</span>
          <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            {currency} {totalSeatSelectionFee.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-slate-400">
          <span>Taxes & Fees (5%)</span>
          <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            {currency} {taxesAndFees.toFixed(2)}
          </span>
        </div>

        <div className={`border-t my-2.5 ${isDark ? 'border-slate-800' : 'border-slate-150'}`} />

        <div className="flex justify-between items-baseline">
          <span className="font-bold text-xs">Total Fare</span>
          <span className={`text-xl font-black tracking-tight ${isDark ? 'text-yellow-400' : 'text-blue-600'}`}>
            {currency} {grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {!allSeatsAssigned && (
        <div className={`mt-4 p-2.5 border rounded-none text-[10px] flex items-start gap-1.5 ${
          isDark 
            ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' 
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>Select seats for all passengers to complete check-in.</span>
        </div>
      )}

      {/* Animated Confirm Button */}
      <motion.button
        type="button"
        disabled={!allSeatsAssigned}
        onClick={onConfirm}
        whileHover={allSeatsAssigned ? { scale: 1.015 } : {}}
        whileTap={allSeatsAssigned ? { scale: 0.98 } : {}}
        className={`w-full mt-4 py-2.5 rounded-none text-center text-xs font-black tracking-wider uppercase transition-all duration-300 ${
          allSeatsAssigned
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer'
            : 'bg-slate-850 text-slate-500 border border-slate-850 cursor-not-allowed'
        }`}
      >
        Confirm Flight Seats
      </motion.button>
    </div>
  );
};
