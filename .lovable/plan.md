

## Plan: Dashboard / Instrument Cluster Car Theme

Transform the app's aesthetic to evoke a car dashboard — think digital gauges, instrument panel styling, and cockpit vibes — while keeping the existing layout and functionality intact.

### Changes

**1. `index.html` — Add "Orbitron" font**
Add Google Font `Orbitron` (a digital/futuristic monospace-ish font used in car instrument clusters) alongside the existing fonts.

**2. `tailwind.config.ts` — Add `instrument` font family**
Add `font-instrument: ['Orbitron', 'sans-serif']` to the font families for use on gauge-like elements (scores, numbers, labels).

**3. `src/index.css` — Dashboard-themed styling**
- Add subtle gauge/dial-inspired CSS patterns:
  - `.gauge-ring` — circular gradient border mimicking a speedometer bezel
  - `.instrument-panel` — dark recessed panel look with inner shadow, faint grid pattern
  - `.readout` — digital LCD-style readout styling (Orbitron font, slight glow)
  - `.dial-tick` — small tick mark styling for progress indicators
- Update dark mode card variables slightly: deeper blacks, add a subtle blue-tinted ambient glow reminiscent of dashboard backlighting
- Add a subtle carbon-fiber-like background texture using CSS repeating gradients on the body

**4. `src/components/DealHeader.tsx` — Speedometer-style progress**
Replace the 5-dot progress bar with a semi-circular gauge/arc indicator:
- SVG arc with tick marks at each step
- Animated needle or lit segment showing current step
- Step labels below: "Vehicle → Briefing → Numbers → Fees → Report"

**5. `src/components/CurrencyInput.tsx` — Digital readout styling**
- Apply `font-instrument` (Orbitron) to the input value display
- Add a faint green/amber glow behind the text to mimic an LCD readout
- Keep the `$` prefix and pencil icon but style them with the instrument aesthetic

**6. `src/components/screens/ReportScreen.tsx` — Gauge-style deal score**
- Replace the plain letter grade with a speedometer/tachometer gauge visualization:
  - SVG semi-circle with red→yellow→green gradient
  - Animated needle pointing to the score position
  - Grade letter displayed in the center with Orbitron font
- Style the line-item audit cards with instrument panel borders (subtle inner shadows, recessed look)

**7. `src/components/screens/VehicleInfoScreen.tsx`, `DealNumbersScreen.tsx`, `FeeBreakdownScreen.tsx` — Panel styling**
- Wrap each screen's main card in the `instrument-panel` class
- Apply `readout` class to numeric display values
- Style section headers with small tick-mark decorations

### What stays the same
- All functionality, routing, voice entry, comparison view
- Color system (success green, warning yellow, destructive red) — these map naturally to dashboard indicator lights
- Logo and branding
- Layout structure (max-420px mobile-first)

### Technical notes
- All changes are CSS/styling + minor component JSX updates
- No new dependencies needed — gauge visualizations use inline SVG
- Orbitron is a free Google Font, loaded the same way as existing fonts

