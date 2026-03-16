

## Plan: Make "Try a demo" More Visible

The "Try a demo →" link exists in the code (line 93-98 of VehicleInfoScreen.tsx) but it's nearly invisible — it uses `text-xs text-muted-foreground` which blends into the dark instrument panel background.

### Fix

**`src/components/screens/VehicleInfoScreen.tsx`** — Replace the plain text link with a styled button that stands out:
- Change from a barely-visible muted text link to a small outlined pill/badge button
- Use `border border-primary/30 text-primary bg-primary/10 px-3 py-1.5 rounded-full font-semibold` styling to match the existing preset button aesthetic
- Keep the toggle behavior (show/hide demo presets)

This is a one-line styling change to make the existing element visible against the instrument panel.

