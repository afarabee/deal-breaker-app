

# Full Color Overhaul — Kill All Orange, Teal-Tinted Dark UI

Looking at the reference image and the current codebase, here's what's still wrong:

**The burnt orange problem**: `--destructive` is `hsl(18, 65%, 47%)` — that's the burnt orange. It's used everywhere: "Start Over" links, warning callouts, "Push Back" badges, negotiation script cards, F Deal dot, and the `brand` color in Tailwind. That all needs to go.

**Fields are lifeless gray**: Inputs use `bg-secondary` which is a flat dark gray. The reference shows fields with a subtle teal/navy tint and more colorful borders.

## Changes

### 1. `src/index.css` — Overhaul CSS variables
- **`--destructive`**: `18 65% 47%` → `0 72% 51%` (true red, no orange)
- **`--warning`**: `43 75% 46%` → `45 93% 58%` (brighter amber-gold, not muddy)
- **`--secondary`** (field backgrounds): `215 20% 18%` → `200 30% 15%` (teal-tinted dark, not gray)
- **`--card`**: `215 25% 14%` → `200 28% 12%` (slight teal tint)
- **`--muted`**: `215 20% 16%` → `200 25% 14%` (teal-tinted)
- **`--background`**: `210 30% 8%` → `205 35% 7%` (deeper navy)
- **`--border`**: add slight teal hue shift
- **`--input-border`**: shift to `200 20% 30%` (teal-ish)
- **`--input`**: shift to match new secondary

### 2. `tailwind.config.ts` — Remove/update brand color
- Change `brand` from `hsl(18, 65%, 47%)` to match primary or remove entirely

### 3. `src/components/screens/ReportScreen.tsx` — Negotiation scripts
- Change negotiation script cards from `bg-destructive/10 border-destructive/20` to use primary (cyan) tinting instead — these are helpful scripts, not errors
- Keep `text-destructive` only for genuinely bad items (red status pills)

### 4. `src/components/screens/DealNumbersScreen.tsx` — Warning callout
- Restyle the warning callout to use `warning` color (amber) instead of `destructive` (was orange, now red) — it's advice, not an error

### 5. `src/components/screens/VehicleInfoScreen.tsx`
- Change F Deal dot from `bg-destructive` to `bg-red-500` (explicit, no ambiguity)

**Result**: A cohesive dark navy-teal palette with cyan and emerald accents. Zero orange anywhere. Fields have a subtle teal warmth. Red is only used for genuinely bad things.

