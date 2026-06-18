import { useMemo } from 'react';
import { AircraftLayoutConfig, CabinClassConfig } from '../types/aircraft';
import { SeatItem } from '../types/seat';
import { getAircraftLayout } from '../config/aircraftLayouts';

export interface RowData {
  rowNo: number;
  isExitRow: boolean;
  cabinClass?: CabinClassConfig;
  seats: (SeatItem | null)[]; // mapped to layout.columns
  facility?: 'LAVATORY' | 'GALLEY' | 'CREW' | 'STORAGE' | 'DOOR' | null;
}

export function useAircraftLayout(aircraftCode: string | undefined, seats: SeatItem[]) {
  const layout = useMemo(() => getAircraftLayout(aircraftCode), [aircraftCode]);

  // Determine row list
  const rowDetails = useMemo(() => {
    if (seats.length === 0) return { rows: [], maxRow: 0, minRow: 0 };
    
    const rowNumbers = Array.from(new Set(seats.map(s => s.rowNo))).sort((a, b) => a - b);
    const minRow = Math.min(...rowNumbers);
    const maxRow = Math.max(...rowNumbers);
    
    // We want to reconstruct all rows, including missing rows (e.g. row 13)
    const allRows: number[] = [];
    for (let r = minRow; r <= maxRow; r++) {
      // Check if this row exists in seats, OR is a facility row, or we just render it if it's within range
      // If there are seats in the range, let's include it
      const hasSeats = seats.some(s => s.rowNo === r);
      if (hasSeats) {
        allRows.push(r);
      }
    }
    
    return {
      rows: allRows,
      maxRow,
      minRow
    };
  }, [seats]);

  const cabinRows = useMemo((): RowData[] => {
    const { rows } = rowDetails;
    if (rows.length === 0) return [];

    const mappedRows: RowData[] = [];

    // 1. Generate front facility row (Row 0 - Nose area)
    mappedRows.push({
      rowNo: 0,
      isExitRow: false,
      seats: layout.columns.map(() => null),
      facility: 'GALLEY' // Nose area default facility
    });

    // 2. Map seat rows
    rows.forEach(r => {
      // Find all seats in this row
      const seatsInRow = seats.filter(s => s.rowNo === r);
      const isExitRow = layout.emergencyExitRows.includes(r);
      const cabinClass = layout.cabinClasses.find(c => r >= c.startRow && r <= c.endRow);

      // Map columns
      const rowSeats = layout.columns.map(col => {
        const found = seatsInRow.find(s => s.letter === col);
        return found || null;
      });

      // Check if the entire row is empty (which shouldn't happen, but just in case)
      const isEmpty = rowSeats.every(s => s === null);

      if (!isEmpty) {
        mappedRows.push({
          rowNo: r,
          isExitRow,
          cabinClass,
          seats: rowSeats
        });

        // Insert mid-cabin facility if we transition from Business to Economy or before/after exit rows
        // For A330 / Widebodies, we insert a galley/lavatory buffer
        const nextRow = r + 1;
        const currentClass = cabinClass?.name;
        const nextClass = layout.cabinClasses.find(c => nextRow >= c.startRow && nextRow <= c.endRow)?.name;
        
        if (currentClass && nextClass && currentClass !== nextClass) {
          mappedRows.push({
            rowNo: -r, // negative row number for unique key
            isExitRow: false,
            seats: layout.columns.map(() => null),
            facility: 'LAVATORY' // divider lavatory
          });
        }
      }
    });

    // 3. Generate rear facility row (behind last seat row)
    const lastRowNo = rows[rows.length - 1];
    mappedRows.push({
      rowNo: lastRowNo + 1,
      isExitRow: false,
      seats: layout.columns.map(() => null),
      facility: 'GALLEY' // tail area facility
    });

    return mappedRows;
  }, [rowDetails, seats, layout]);

  // Determine wing position details (percentage off top of cabin)
  const wingPercentage = useMemo(() => {
    const { rows } = rowDetails;
    if (rows.length === 0) return { top: 0, height: 0 };

    const firstRow = rows[0];
    const lastRow = rows[rows.length - 1];
    const totalRows = lastRow - firstRow + 1;

    // Wing spans rows
    const startRow = Math.max(firstRow, layout.wingStartRow);
    const endRow = Math.min(lastRow, layout.wingEndRow);

    const topOffset = ((startRow - firstRow) / totalRows) * 100;
    const heightPercentage = ((endRow - startRow + 1) / totalRows) * 100;

    return {
      top: Math.max(5, topOffset),
      height: Math.max(10, heightPercentage)
    };
  }, [rowDetails, layout]);

  return {
    layout,
    cabinRows,
    wingPercentage,
    minRow: rowDetails.minRow,
    maxRow: rowDetails.maxRow,
    totalSeatsCount: seats.length
  };
}
