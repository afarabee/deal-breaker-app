

# Hammer-Smashing-Contract Loading Animation

Replace the current pulsing dot loader (lines 60-78) with a CSS-animated cartoon scene:

## Animation Design
- A **contract/document** element: a white/light rectangle with fake "text lines" (thin gray bars), slightly tilted
- A **cartoon hammer** that swings down repeatedly, hitting the contract
- On each "hit", the contract shakes/crunches slightly
- Pure CSS/Framer Motion — no external assets needed

## Implementation (`ReportScreen.tsx`, lines 60-78)

Replace the loading block with:
1. **Contract element**: A `div` styled as a paper document (white bg, rounded corners, 3-4 gray line bars inside, slight shadow). Applies a shake animation on each hammer strike.
2. **Hammer element**: Built from two divs (handle + head). Uses Framer Motion `rotate` animation looping: rests at -30°, swings to 15° (strike position), bounces back. ~0.8s cycle, infinite repeat.
3. **Impact sparks**: Small motion divs that flash briefly at the strike point on each cycle (scale 0→1→0, opacity 0→1→0).
4. **Text**: Keep "Analyzing your deal..." and subtitle but swap emoji to 🔨.

All built with divs + Tailwind + Framer Motion keyframes. No SVGs or images needed.

One file changed: `src/components/screens/ReportScreen.tsx`.

