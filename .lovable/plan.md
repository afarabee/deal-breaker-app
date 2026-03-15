

# DealBreaker — AI-Powered Car Deal Auditor

## Overview
A 4-screen stateless web app where users enter car deal details and receive an AI-powered forensic report scoring every line item, providing negotiation scripts, and calculating potential savings. Dark fintech aesthetic with aggressive, confident branding.

## Design System
- **Dark theme**: Near-black background (#0D0D0D), dark cards (#1A1A1A), subtle borders (#2A2A2A)
- **Brand red accent** (#E63946) for CTAs, warnings, and the BREAKER logo
- **Traffic light system**: Red (#E63946) for push back, Amber (#D4A017) for review, Green (#2D8B4E) for fair
- **Typography**: Archivo Black for headings/logo, DM Sans for body text
- **Animations**: Framer Motion for screen transitions, staggered card reveals, count-up score animation, input focus glows, and progress bar transitions
- **Mobile-first layout**: Max-width 420px centered on desktop, full-width on mobile

## Screen 1: Vehicle Info
- Logo header with animated 4-segment progress bar (segment 1 active)
- Section title "Your Vehicle" with subtitle
- Form fields: New/Used dropdown + Year input (side by side), Make dropdown + Model dropdown (filtered by make, side by side), Trim dropdown/input, Dealership State dropdown, optional Dealership Name text input
- Pre-populated dropdowns for all major US makes with model filtering
- "Analyze My Deal →" button disabled until Condition + Make + Model are filled

## Screen 2: Deal Numbers
- Progress bar advances to segment 2
- Fields: Selling Price ($), Trade-In Value + Trade Payoff (side by side, $), Down Payment ($), Interest Rate (% suffix) + Loan Term dropdown (side by side)
- Red warning callout box after rate/term: "Never negotiate on monthly payment..."
- Navigation: ← Back + Start Over (left), Next: Fees → (right)

## Screen 3: Fee Breakdown
- Progress bar advances to segment 3
- Two grouped cards:
  - **Standard Fees**: Doc/Admin Fee, Sales Tax, Registration/Title/License
  - **Dealer Add-Ons & F&I Products**: Anti-Theft/Etch, Extended Warranty, GAP Coverage, Maintenance Contract, dynamic custom fee rows with "+ Add Another Fee" button
- Navigation: ← Back + Start Over (left), "Break This Deal 🔥" (right)

## Screen 4: DealBreaker Report
- Loading state with pulsing animation and "Analyzing your deal..." text
- **Deal Score**: Large animated letter grade with color coding, issue/review count subtitle
- **Three-Lever Summary**: Price, Trade (equity calculation), Rate — each in a card with color-coded status
- **Line-by-Line Audit**: Stagger-animated cards with colored left borders, traffic light badges, AI explanations
- **Negotiation Scripts**: Red-tinted cards with italic copy-paste scripts (only for RED items)
- **Potential Savings**: Green gradient card with large bold savings amount
- Navigation: ← Edit Deal + Start Over (left), Share Report 📤 (right)

## Backend: Supabase Edge Function
- `analyze-deal` edge function that receives deal data as JSON
- Calls Claude API (claude-sonnet-4-20250514) with a forensic auditor system prompt
- Returns structured JSON: deal score, line item evaluations with status/explanation, negotiation scripts, potential savings, and lever analysis
- ANTHROPIC_API_KEY stored as a Supabase secret
- Proper CORS headers and error handling

## Key Interactions
- Smooth animated transitions between all 4 screens (slide/fade via Framer Motion)
- "Start Over" button on screens 2-4 resets all state and returns to screen 1
- Share Report button on screen 4 (copy/share functionality)
- All form state managed client-side (stateless, no database)
- No authentication, no data persistence

