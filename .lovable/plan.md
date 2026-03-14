

## Plan: Increase Logo Size

Update `src/components/DealHeader.tsx` — change both logo `<img>` tags from `h-10` to `h-16` (or similar) to make the logo more prominent in the header.

**Changes:**
- Line 46: `className="h-10 hidden dark:block"` → `className="h-16 hidden dark:block"`
- Line 47: `className="h-10 dark:hidden"` → `className="h-16 dark:hidden"`

Single file, two-line change.

