

## Plan: Add Faint Green Outer Glow to Form Fields

### Changes

**1. `src/index.css` — New utility classes**

```css
.field-glow {
  box-shadow: 0 0 6px hsl(142 71% 45% / 0.08), 0 1px 3px hsl(142 71% 45% / 0.05);
  transition: box-shadow 0.2s ease;
}
.field-glow:hover {
  box-shadow: 0 0 10px hsl(142 71% 45% / 0.12), 0 2px 4px hsl(142 71% 45% / 0.08);
}
.field-label {
  text-shadow: 0 0 8px hsl(142 71% 45% / 0.15);
}
.card-glow {
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.06), 0 0 12px hsl(142 71% 45% / 0.05);
}
```

**2. `src/components/screens/VehicleInfoScreen.tsx`**
- Add `field-glow` class to all `<select>` elements and input wrappers (exterior glow only)
- Add `field-label` class to all `<label>` elements

**3. `src/components/screens/FeeBreakdownScreen.tsx`**
- Same treatment: `field-glow` on inputs/selects, `field-label` on labels
- Section header containers get enhanced `card-glow`

All shadows are exterior-only — no inset shadows. Very faint green tint works in both themes.

