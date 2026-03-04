

# Three Targeted Fixes

### 1. Sort negotiation scripts by savings impact (`ReportScreen.tsx`)
- Cross-reference each `negotiationScript.item` against `report.lineItems` to find the matching line item's `amount`
- Sort scripts descending by that amount before rendering
- Scripts without a matching line item go to the bottom

### 2. Change dealership placeholder (`VehicleInfoScreen.tsx`, line 148)
- Change `"e.g. Ford of Murfreesboro"` → `"e.g. Ford of Franklin"`

### 3. Fix caution tape emoji visibility (`DealNumbersScreen.tsx`, lines 99-101)
- Change the text container from `bg-warning` (bright yellow) to a lighter tint like `bg-warning/20` or `bg-yellow-50` so the yellow emojis (⚠️, 🔑) stand out against a pale background instead of blending into saturated yellow

