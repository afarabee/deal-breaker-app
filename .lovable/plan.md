

# Make "BREAKER" Emerald + Add Depth to Dark Backgrounds

## Changes

### 1. `src/components/DealHeader.tsx`
- Change "BREAKER" text from `text-brand` (rust orange) to `text-success` (vibrant emerald)

### 2. `src/index.css` — Add depth and visual richness
- Add a subtle radial gradient to the body background (dark charcoal-blue center fading to slightly darker edges)
- Add a subtle glow/vignette effect so it doesn't feel flat
- Give cards a subtle border glow or slight inner shadow for more distinction from the background

### 3. `src/pages/Index.tsx`
- Add a subtle background gradient or mesh-like effect to the main container (e.g., a faint cyan radial glow behind the content area)

### 4. `src/components/screens/VehicleInfoScreen.tsx` (and other screens)
- Increase card/surface contrast: bump up `bg-secondary` usage with slightly more visible borders
- Add subtle `shadow-lg` or glow effects to form containers

### 5. `tailwind.config.ts`
- No changes needed — brand color stays for potential other uses but won't be on the logo

### Summary of Visual Effect
- "BREAKER" glows emerald green instead of rust orange
- Background gets subtle radial gradient (faint cyan glow emanating from center)
- Cards/surfaces get more visible separation via subtle shadows and brighter borders
- Overall feel shifts from "flat dark" to "deep, layered dark with ambient glow"

