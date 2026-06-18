# SkyFlow: Airline-Grade Aircraft Seat Map Engine

SkyFlow is a high-fidelity, TypeScript-powered aircraft seat map rendering and passenger seat selection engine. It transitions a simple grid layout into an interactive airline booking experience modeled after major global carriers (Emirates, Qatar Airways, Saudi Arabian Airlines, Gulf Air).

---

## ✈️ Key Features

### 1. Multi-Aisle Layout Engine
Resolves layout structures and maps columns dynamically based on aircraft codes:
- **Regional (2-2)**: ATR 72, ATR 42, Embraer (e.g. aisle after column B).
- **Narrow-Body (3-3)**: Airbus A320, A321, Boeing 737 (e.g. aisle after column C).
- **Wide-Body (2-4-2)**: Airbus A330 (e.g. twin aisles after column C and column H).
- **Wide-Body (3-3-3)**: Boeing 787, Airbus A350 (e.g. twin aisles after column C and column F).
- **Wide-Body (3-4-3)**: Airbus A380, Boeing 777, 747 (e.g. twin aisles after column C and column G).

### 2. Physical Aircraft Visualization
- **Nose Cone**: Aerodynamic cockpit window frames and flight heading indicator.
- **Sweeping Wings**: Swept-back jet wings or straight regional wings. SVG scales and aligns next to wing row spans (e.g. Rows 11–18 for A320, Rows 15–30 for A330).
- **Windows**: Fuselage window panes adjacent to each row.
- **APU Tail Stabilizers**: Exhaust cone and tail stabilizer silhouettes.
- **Fuselage scaling**: Fuselage width scales matching body type (Narrow, Wide, Regional).

### 3. Light & Dark Themes
- Top-level theme toggle switch (Sun and Moon icons) in the header.
- Adapts all borders, text, facility compartments, and SVG seat fills dynamically.

### 4. Minimalist Terminal Design
- Sleek, straight-edged boxes (`rounded-none` or `rounded-sm`) instead of curvy panels.
- Thin borders and solid high-contrast panel dividing lines for a premium, clean layout.

### 5. Animated Flying Canvas
- **Drifting Clouds**: Vertical vector altitude lines drift down the background to simulate flying.
- **Spring Selections**: Framer Motion spring actions (`scale: 1.1, y: -2` on hover, `scale: 0.9` on tap) make seat clicks interactive.
- **Radial Glow**: Slow-pulsing radial glow in the center of the viewport.

### 6. Passenger Seating & Pricing Summary
- Multi-passenger sequential selection: assigning a seat auto-advances selection to the next passenger.
- Age classifications (Adult/Child/Infant).
- Cost breakdowns: base flight fare, seat selection fee, taxes, and checkout confirmations.

---

## 📂 Folder Structure

```
src/
  ├── components/
  │   ├── Aircraft/     # Shell, Nose, Tail, Wings, Windows
  │   ├── Cabin/        # Business, Premium Economy, Economy Cabins
  │   ├── Seat/         # Seat, SeatRow, SeatGroup, SeatTooltip
  │   ├── Legend/       # SeatLegend
  │   └── Sidebar/      # SeatSummary, FareSummary
  ├── hooks/
  │   ├── useAircraftLayout.ts  # Grid mapping and facility rows placement
  │   └── useSeatSelection.ts   # Multi-passenger selection assignments
  ├── config/
  │   └── aircraftLayouts.ts    # Seat grids and wing rows config
  ├── types/
  │   ├── aircraft.ts           # Layout interfaces
  │   └── seat.ts               # Seat selection models
  └── utils/
      └── seatHelpers.ts        # JSON loaders and occupancy hashes
```

---

## 🚀 Setup & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```

### 3. Compile Production Bundle
```bash
npm run build
```

### 4. Local Production Preview
```bash
npm run preview
```
