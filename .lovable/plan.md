

# Fix Contrast + Add Animated Background Glow

## 1. `src/index.css` — Contrast fixes + animated glow

**Contrast (CSS variable bumps):**
- `--muted-foreground`: `210 10% 55%` → `210 15% 70%`
- `--border`: `215 15% 18%` → `215 15% 25%`
- `--input-border`: `215 15% 20%` → `215 15% 28%`
- `--secondary`: `215 20% 16%` → `215 20% 18%`
- `--card`: `215 25% 12%` → `215 25% 14%`
- `.card-glow` border opacity: `0.08` → `0.15`

**Animated background glow:**
- Add `body::after` pseudo-element with a large blurred radial gradient (cyan/emerald, ~3-5% opacity)
- Animate with `@keyframes ambient-drift` over ~20s, slowly shifting `background-position`
- `pointer-events: none`, `position: fixed`, `z-index: 0` so it's purely decorative

Single file change — all contrast improvements propagate automatically via Tailwind utilities, animation is pure CSS with zero JS overhead.

