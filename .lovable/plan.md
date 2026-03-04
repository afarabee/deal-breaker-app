

# Dealer Rate Markup — Tooltip + Negotiation Script

## 1. Persistent tooltip on Interest Rate field (`DealNumbersScreen.tsx`)
Add a small info callout directly below the Interest Rate input — always visible, not hidden behind hover. Light blue/info-tinted box with text like:

> 💡 **Did you know?** Dealers can legally add up to 2% to your lender's rate and keep the difference. Always ask for the "buy rate."

## 2. Update AI system prompt (`supabase/functions/analyze-deal/index.ts`)
Add a new rule block after line 44:

- **Dealer rate markup (dealer reserve):** Dealers can legally mark up the interest rate by up to 2% above the lender's buy rate and pocket the difference. The buyer is almost never told this. **ALWAYS generate a negotiation script for the interest rate**, even if the rate is GREEN. The script should instruct the buyer to ask "What is the buy rate from the lender before any dealer markup?" and to request the markup be removed. Mention that credit unions typically don't add dealer reserve.
- Update `potentialSavings` to include estimated savings from removing a 1-2% rate markup over the loan term when applicable.

Two files changed, no structural or type changes needed.

