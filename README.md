# DealBreaker

**AI-powered car deal analyzer that breaks down every line of your deal sheet and tells you what's fair, what's inflated, and what to push back on.**

**[Try it free](https://deal-breaker-app.lovable.app/)**

DealBreaker takes the numbers from a dealership offer and runs them through Claude AI to evaluate every line item. You get back a color-coded report card -- green for fair, yellow for negotiable, red for rip-off -- with plain-English explanations and suggested next steps for each item.

## The Problem

Dealerships have a structural information advantage. The finance manager has seen thousands of deals. The average buyer has seen maybe five. Deal sheets are dense by design -- jargon-heavy line items, fees that sound official but may be pure markup, and monthly payments that don't always match the deal math.

Tools like TrueCar and Edmunds help with sticker price, but they stop there. Nobody analyzes the full deal: the financing terms, the fee breakdown, the add-ons, the trade-in math, and whether the quoted monthly payment actually adds up.

DealBreaker fills that gap.

## Features

- **AI Deal Analysis** -- Claude evaluates every line item (price, fees, financing, add-ons, trade-in) against market benchmarks and returns a color-coded report card
- **Line-by-Line Report Card** -- Each item gets a green/yellow/red rating, a plain-English assessment, and a suggested action
- **Monthly Payment Validation** -- Flags payments that are suspiciously high OR low compared to the deal math, catching both overcharges and teaser rates
- **Side-by-Side Comparison** -- Analyze two deals and compare them across price, financing, fees, add-ons, and trade equity
- **Pre-Engagement Checklist** -- Guides buyers through questions to ask before sitting down at the dealership
- **Deal History** -- Saves past analyses to localStorage for revisiting and comparing over time
- **Demo Presets** -- Try an A Deal, C Deal, or F Deal to see how the analysis works without needing a deal sheet
- **Feedback Loop** -- Built-in feedback form that routes directly to the developer's task board

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Supabase Edge Functions
- **AI:** Claude API (claude-sonnet-4-20250514)
- **Build Tools:** Vite, Bun
- **UI Components:** shadcn/ui
- **Deployment:** Lovable

## How It Works

1. Walk through a short wizard: vehicle info, deal numbers, fees, and add-ons
2. The app sends the full deal context to a Supabase Edge Function
3. The Edge Function calls the Claude API with a structured prompt that includes explicit verification rules
4. Claude evaluates each line item, calculates expected monthly payments, compares them to quoted payments, and flags discrepancies
5. Results come back as a color-coded report card with ratings, assessments, and actionable suggestions

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (package manager and runtime)
- A [Supabase](https://supabase.com/) project with Edge Functions enabled
- A [Claude API key](https://console.anthropic.com/) from Anthropic

### Installation

```bash
# Clone the repo
git clone https://github.com/afarabee/deal-breaker-app.git
cd deal-breaker-app

# Install dependencies
bun install

# Set up environment variables
# Copy .env and add your Supabase URL, Supabase anon key, and any other required config
cp .env .env.local

# Start the dev server
bun run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

The Claude API key is configured in the Supabase Edge Function, not in the frontend.

## Project Structure

```
deal-breaker-app/
├── public/              # Static assets
├── src/                 # React application source
├── supabase/            # Supabase Edge Functions and config
├── .env                 # Environment variables
├── components.json      # shadcn/ui configuration
├── package.json         # Dependencies and scripts
└── vite.config.ts       # Vite configuration
```

## Development Approach

Built iteratively across four rounds using Claude Code for architecture and implementation, with Lovable for initial scaffolding:

- **Round 1:** Core wizard flow, form validation, AI analysis engine
- **Round 2:** Comparison view, deal history, localStorage persistence
- **Round 3:** UX polish, smarter navigation, state management improvements
- **Round 4:** Payment validation (high AND low), comparison tooltips, demo presets, feedback form

## Feedback

Found a bug or have an idea? Use the feedback button in the app header. It goes straight to the task board.

## Author

**Aimee Farabee**
- Portfolio: [ai-with-aims.studio](https://ai-with-aims.studio)
- GitHub: [@afarabee](https://github.com/afarabee)
- LinkedIn: [Aimee Farabee](https://www.linkedin.com/in/aimee-farabee/)

## License

This project is for portfolio and demonstration purposes.
