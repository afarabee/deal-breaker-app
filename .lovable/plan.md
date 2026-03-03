

# Complete Redesign — Light Theme with Playful, Emoji-Rich UI

The reference mockup is a **fundamentally different aesthetic** from the current dark-tech theme. It's a **light, white, playful** design with bright colors, emojis, white input fields, yellow caution-tape warning, and a colorful report screen. This is a full visual overhaul.

## What the reference shows

- **Light/white background** — not dark
- **White input fields** with light gray borders and pencil ✏️ icons
- **Colorful preset buttons** — green "A Deal", amber "C Deal", red "F Deal" with checkmark/exclamation icons
- **Yellow caution-tape warning** — bold black text on bright yellow, hazard stripes
- **Emojis everywhere** — section headings, labels, buttons
- **Green CTA buttons** with rounded styling
- **Report screen** — pink/red background for bad grades, large emoji, colorful metric cards (green/amber/red backgrounds), blue negotiation scripts section
- **"Massive amount" savings callout** in a big green rounded card with upward arrow emoji
- **Edit Deal / Start Over / Share buttons** as clean outlined buttons at the bottom

## Files to change

### 1. `src/index.css` — Full light theme
- Swap ALL CSS variables to light mode:
  - `--background`: white (`0 0% 100%`)
  - `--foreground`: dark gray (`220 20% 15%`)
  - `--card`: white or very light gray
  - `--secondary`: light gray (`220 15% 96%`) for field backgrounds
  - `--muted-foreground`: medium gray for labels
  - `--border`: light gray borders
  - `--primary`: keep cyan or shift to a vivid blue
  - `--success`: vibrant green
  - `--destructive`: true red
  - `--warning`: bright yellow
- Remove the dark ambient glow animation and body::after pseudo-element
- Remove dark `card-glow` effect, replace with subtle light shadow
- Remove dark radial gradient backgrounds on body

### 2. `src/components/DealHeader.tsx`
- Add emoji to logo (🥊 or similar)
- Update progress bar inactive color to light gray
- Keep "DEAL" dark, "BREAKER" green

### 3. `src/components/screens/VehicleInfoScreen.tsx`
- Add emojis to headings: "Your Vehicle 🚗🔑"
- Restyle preset buttons: colored pill backgrounds (green for A, amber for C, red for F) with icons (✅, ⚠️, 🚩)
- Add "Condition 🚗" emoji labels
- Add pencil ✏️ icons inside input fields (right-aligned)
- Change input styling to white bg with light borders
- Add subtitle text below CTA: "You get clean pewter gray." style helper text
- Update select/input classes to match light theme

### 4. `src/components/screens/DealNumbersScreen.tsx`
- Add emoji to heading: "Your Deal Numbers 💵💰"
- Replace warning callout with yellow "caution tape" style: bright yellow background, black text, hazard icon, bold text "Never negotiate on monthly payment! 🔑 Always negotiate separately!"
- Update all input fields to white bg with light borders and pencil icons
- Restyle navigation buttons for light theme

### 5. `src/components/screens/FeeBreakdownScreen.tsx`
- Add emojis: "Fee Breakdown 💼", "STANDARD FEES 📋💰", "DEALER ADD-ONS & F&I PRODUCTS 🔧👀"
- Add pencil icons to inputs
- Add 🔥 to "Break This Deal" button
- Add helper text below CTA: "Break your pewter deal."
- White field backgrounds, light borders

### 6. `src/components/screens/ReportScreen.tsx` — Major restyle
- Change heading to "Audit Results"
- Add large emoji next to grade (😢 for F, 😊 for A, etc.)
- Add pink/red background tint for bad grades behind the score section
- Restyle three-lever cards with colored backgrounds (green card for good, amber for review, red with colored borders)
- Add emoji labels to lever cards (🏷️ PRICE, 🔄 TRADE, 📊 RATE)
- Restyle line-by-line audit items with "Review" and "Push Back" as small colored buttons/pills
- Restyle negotiation scripts section with blue/light-blue background
- Savings callout: big green rounded card with "Massive amount" text, upward arrow ⬆️ emoji, money 💰 emoji
- Bottom buttons: "Edit Deal", "Start Over", "Share 🔗" as outlined buttons in a row

### 7. `tailwind.config.ts`
- Update brand color to match new palette
- Remove any dark-theme-specific config

### 8. `src/components/ui/button.tsx`
- Update button variants for light theme (outline borders, hover states)

This is a substantial visual overhaul touching ~8 files but preserving all existing logic, types, and data flow. No backend changes needed.

