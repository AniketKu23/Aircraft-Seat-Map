# Aircraft Seat Map Visual Design Documentation

This document explains the technical, architectural, and visual logic governing the generation of the aircraft fuselage, wings, cabin boundaries, emergency exits, and seat pricing states in the SkyFlow engine.

---

## 1. Aircraft Body Logic (Fuselage Generation)

The visual aircraft body is rendered dynamically rather than as a hardcoded rectangular grid. The shape changes to match the physical properties of the aircraft type:

### A. Fuselage Width Scaling
We classify aircraft into three main fuselage body types:
- **Wide Body** (e.g., Airbus A330, A350, Boeing 787): Width is set to `w-[420px]`. This fits double-aisle grids (e.g. 2-4-2, 3-3-3) with legible row sizes.
- **Narrow Body** (e.g., Airbus A320, A321, Boeing 737): Width is set to `w-[340px]`. This fits single-aisle 3-3 configurations.
- **Regional** (e.g., ATR 72, ATR 42, Embraer): Width is set to `w-[280px]`. This fits compact single-aisle 2-2 configurations.

### B. Nose & Tail Silhouettes
- **Nose Cone (`AircraftNose.tsx`)**: Curved SVG pathways model the aerodynamic front section. Cockpit window shapes slant outward. Sizing scales relative to the fuselage width. A direction indicator points forward (UP).
- **Tail Stabilizers (`AircraftTail.tsx`)**: Fuselage tapers inward at the rear. Stabilizer tailplanes sweep outward. Includes an Auxiliary Power Unit (APU) exhaust outlet centered at the rear tip.

### C. Cabin Length & Spacing
The total length of the aircraft is dynamically derived:
$$\text{Fuselage Height} = (\text{Total Seat Rows} \times \text{Row Height}) + \text{Spacers} + \text{Facility Block Heights}$$
Rows are arranged vertically. Windows (`AircraftWindow.tsx`) are repeated dynamically alongside each active seat row to complete the fuselage wall appearance.

### D. Comparative Examples
- **Airbus A320 vs. ATR 72**: The A320 is a narrow-body jet carrying 3-3 seats, requiring a 340px wide fuselage and swept-back wings. The ATR 72 is a regional turboprop carrying 2-2 seats, requiring a 280px wide fuselage and straight horizontal wings. Additionally, ATR 72 boarding doors are located at the *rear* of the aircraft, which is reflected in our tail-galley facility placement.
- **Boeing 787 vs. Airbus A320**: The 787 is a wide-body long-haul jet with ~45 rows of 3-3-3 seating, resulting in a much wider (420px) and longer fuselage scroll track compared to the shorter, narrower A320 (~30 rows of 3-3).

---

## 2. Wing Position Logic

Wings are positioned absolutely along the sides of the fuselage. They are aligned with specific seat row indexes to match real-world aircraft profiles.

### A. Placement Rules
- **Airbus A320**: Rows 11 to 18
- **Boeing 737**: Rows 10 to 18
- **ATR 72**: Rows 5 to 10
- **Airbus A350**: Rows 18 to 30
- **Boeing 787**: Rows 15 to 30

### B. Vertical Offset Calculations
The `useAircraftLayout.ts` hook calculates the top offset and height span of the wings in the DOM relative to the total rows:
$$\text{Top Offset } \% = \left( \frac{\text{Wing Start Row} - \text{First Row}}{\text{Last Row} - \text{First Row} + 1} \right) \times 100$$
$$\text{Height Span } \% = \left( \frac{\text{Wing End Row} - \text{Wing Start Row} + 1}{\text{Last Row} - \text{First Row} + 1} \right) \times 100$$
This positions the swept wings exactly next to the corresponding seat rows, adjusting automatically if rows are added or removed.

---

## 3. Emergency Exit Logic

Emergency exit rows are critical for passenger safety. FAA and EASA regulations mandate exit row spacing to be extended for evacuation clearance.

### A. Identification and Positioning
Exit rows are defined in our configuration (`aircraftLayouts.ts`) for each aircraft type. Since the API response provides the seats, but does not explicitly mark exit rows in a boolean flag, we cross-reference the seats' row numbers with the layout configurations:
- **A320**: Rows 12 and 14 (Row 13 skipped by airlines for superstition).
- **A321**: Rows 11, 12, and 26.
- **A330**: Rows 30 and 44.

### B. Visual indicators
When a row is identified as an exit row:
- We render **flashing EXIT tags** and exit door icons extending outwards from the left and right sides of the fuselage walls.
- We draw **directional exit arrows** in the center aisle path.
- We display a safety warning label below the row: `Emergency Exit Row`.
- Exit rows are mapped to `EXIT_ROW` categories, which show a safety eligibility tooltip ("Must be 15+ years old and able to assist in emergency...").

---

## 4. Cabin Segmentation Logic

Cabins are divided into Business Class, Premium Economy, and Economy Class to match premium airline booking layouts.

### A. Derivation of Segments
The segments are **Configuration-Driven**:
1. We define the row boundaries for each class in `aircraftLayouts.ts`:
   - e.g. A320: Rows 1–3 (Business), Rows 4–8 (Premium Economy), Rows 9–32 (Economy).
2. The `useAircraftLayout.ts` hook parses the seats list, groups seats into rows, and categorizes each row into its respective class based on these boundaries.
3. Divider facility cards (Lavatories and Galleys) are automatically inserted at the transition boundaries where classes change.

---

## 5. Seat Category & Pricing Logic

Seats are styled according to their pricing category to help users distinguish free and paid options quickly.

### A. Category Classifications
- **Free Seat** (Green): Seats with price = 0.
- **Chargeable Seat** (Orange/Gold): Standard seats with price > 0.
- **Selected Seat** (Blue): Active seat selected by the current passenger.
- **Occupied / Blocked Seat** (Grey): Seats already booked or reserved.

### B. Advanced seat Categories (Tooltip Detail)
We also analyze specific seat types for the hover tooltip details:
- **Business**: Rows within the configured Business Class span.
- **Exit Row**: Rows matching the configured emergency exits (extra legroom).
- **Extra Legroom**: Row 1 (bulkhead) and exit rows (higher price tier).
- **Preferred**: First 5 rows of the Economy class cabin (closer to the front).
- **Blocked**: Deterministically flagged via a hash function for demo occupancy mapping.
