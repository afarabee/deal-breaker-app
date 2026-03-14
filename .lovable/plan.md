

## Plan: Fix Logo Background Transparency

The logo PNG files likely have opaque backgrounds (white for dark-mode logo, black for light-mode logo) instead of transparent ones. Since we can't edit the PNGs directly, we'll use CSS `mix-blend-mode` to visually eliminate the mismatched backgrounds.

**Changes in `src/components/DealHeader.tsx`:**
- Add `mix-blend-mode: multiply` to the light-mode logo (removes white background on light bg)
- Add `mix-blend-mode: screen` to the dark-mode logo (removes black background on dark bg)

```tsx
<img src={logoDark} alt="DealBreaker" className="h-24 hidden dark:block mix-blend-screen" />
<img src={logoLight} alt="DealBreaker" className="h-24 dark:hidden mix-blend-multiply" />
```

Single file, two classes added.

