

# Apply OG Image Color Scheme

## Overview
Shift the entire color palette from the current red-accent dark theme to a cyan/teal-accent "dark tech" theme inspired by the OG image. The core changes are:

- **Background**: From pure black (#0D0D0D) to a deep charcoal-blue
- **Primary accent**: From aggressive red (#E63946) to **Electric Cyan** (#00D4FF) — used for interactive glows, progress bar, input focus, ring
- **CTA/Success**: **Vibrant Emerald** (#00C853) — primary buttons, success states
- **Brand identifier**: **Rust Orange** (#C45A2C) — the "BREAKER" text in the logo, alert callouts, and the "Start Over" button text
- **Cards**: Slightly blue-tinted dark slate
- **Warning stays amber**, success becomes the vibrant emerald, destructive uses rust orange

## Files to Change

### 1. `src/index.css` — CSS custom properties
Remap all CSS variables:
- `--background`: Deep charcoal-blue (~210 20% 8%)
- `--card`: Deep slate-black (~215 18% 12%)
- `--primary`: Electric Cyan (~190 100% 50%)
- `--destructive`: Rust Orange (~18 65% 47%)
- `--success`: Vibrant Emerald (~150 100% 39%)
- `--warning`: Keep amber (~43 75% 46%)
- `--border`: Slightly blue-tinted (~215 15% 18%)
- `--input` / `--input-border`: Blue-tinted dark (~215 15% 20%)
- `--ring`: Electric Cyan
- `--muted-foreground`: Silver-gray (~210 10% 55%)
- Input glow changes from red to cyan

### 2. `src/components/DealHeader.tsx`
- "BREAKER" text: Change from `text-primary` to a new rust-orange class
- Progress bar active color: Change from red HSL to cyan HSL

### 3. `src/components/screens/VehicleInfoScreen.tsx`
- Preset dot colors stay semantic (green/amber/red) — no changes needed
- "Analyze My Deal" button will automatically pick up new primary (cyan) — may want to use the emerald/success variant for CTA instead

### 4. `src/components/screens/DealNumbersScreen.tsx`
- Warning callout: Change from `border-primary/30 bg-primary/10` to use rust-orange (destructive)
- "Start Over" text: Uses `text-primary` which will become cyan — change to `text-destructive` for rust-orange

### 5. `src/components/screens/FeeBreakdownScreen.tsx`
- "Start Over" text: Same change to `text-destructive`

### 6. `src/components/screens/ReportScreen.tsx`
- Loading pulsing dot: `bg-primary` will become cyan — fine
- "Push Back" status uses `text-primary` → should use `text-destructive` (rust orange) for red items
- Negotiation scripts section header and cards: Change from `text-primary` / `bg-primary` to destructive
- Potential savings gradient: Update to use vibrant emerald shades
- "Start Over" text: Change to `text-destructive`

### 7. `tailwind.config.ts`
- Add `brand` color (rust orange) to the extended colors for the logo and specific branding uses

### 8. `src/components/ui/button.tsx`
- Primary button variant will automatically become cyan — consider whether the main CTA buttons should use a `success` variant (emerald green "Start Here" style from OG image) instead. Will add a `success` button variant.

## Color Mapping Summary

```text
Role                 Old Color         New Color (HSL approx)
─────────────────────────────────────────────────────────
Background           #0D0D0D (black)   #121A24 (charcoal-blue)
Card/Panel           #1A1A1A           #1A2332 (slate-blue)
Primary/Interactive  #E63946 (red)     #00D4FF (electric cyan)
CTA Buttons          red               #00C853 (emerald green)
Brand/Logo "BREAKER" red               #C45A2C (rust orange)
Alerts/Push Back     red               #C45A2C (rust orange)
Success/Fair         #2D8B4E           #00C853 (vibrant emerald)
Warning/Review       #D4A017           #D4A017 (unchanged)
Borders              #2A2A2A           #1E2A3A (blue-tinted)
Muted text           #888888           #8899AA (silver-blue)
```

