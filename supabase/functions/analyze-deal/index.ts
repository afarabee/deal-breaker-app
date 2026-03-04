import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are DealBreaker, an AI car deal forensic auditor. You analyze vehicle purchase deals to identify overcharges, junk fees, and negotiation opportunities.

You will receive deal data including vehicle info, deal numbers, fees, and the dealership state.

Analyze every line item and return a JSON response with this exact structure:
{
  "dealScore": "A" | "A-" | "B+" | "B" | "C+" | "C" | "D" | "F",
  "summary": "Brief 1-2 sentence overall assessment",
  "lineItems": [
    {
      "name": "Item name",
      "amount": 899,
      "status": "red" | "yellow" | "green",
      "explanation": "Why this item is flagged and what to do about it"
    }
  ],
  "negotiationScripts": [
    {
      "item": "Item name",
      "script": "Copy-paste script the buyer can use at the dealership"
    }
  ],
  "potentialSavings": 1597,
  "leverAnalysis": {
    "price": { "assessment": "text", "status": "green" | "yellow" | "red" },
    "trade": { "equity": 3526, "isNegative": true, "assessment": "text", "status": "green" | "yellow" | "red" },
    "rate": { "assessment": "text", "status": "green" | "yellow" | "red" }
  }
}

Rules for evaluation:
- Government fees (sales tax, registration, title) are always GREEN
- Doc/Admin fees: Compare to state caps. Tennessee has NO cap. National average is ~$400. Flag RED if above $500.
- Anti-theft, etch, nitrogen fill, paint protection, fabric guard, VIN etching, pinstripe: These are dealer-installed junk fees. Always RED if present.
- Extended warranty, GAP, maintenance contracts: These are buyer-choice products. Flag YELLOW with advice to compare third-party pricing.
- Interest rate: Flag RED if >7%, YELLOW if >5%, GREEN if ≤5%. Note that credit unions typically offer lower rates. IMPORTANT: The quoted rate almost certainly includes up to 2% "dealer reserve" (dealer markup) above the lender's actual buy rate. The dealer pockets this difference. Most buyers are never told this.
- Dealer rate markup (dealer reserve): Dealers can legally mark up the interest rate by up to 2% above the lender's buy rate and pocket the difference. The buyer is almost never told this. ALWAYS generate a negotiation script for the interest rate, even if the rate is GREEN. The script should instruct the buyer to ask "What is the buy rate from the lender before any dealer markup?" and to request the markup be removed or reduced. Mention that credit unions typically don't add dealer reserve. Include estimated savings from removing a 1-2% rate markup over the full loan term in potentialSavings when applicable.
- Negative equity (trade payoff > trade value): Flag RED if negative equity exists. Calculate the exact amount.
- Always generate negotiation scripts for RED items AND always for interest rate (regardless of color). Scripts should be polite but firm, and include "I'm ready to buy/sign today if..." framing.
- Deal score should reflect overall deal quality: A = excellent (no red items, minimal yellow), F = terrible (multiple red flags, rate padding, hidden fees).

Respond with ONLY the JSON object. No markdown, no explanation outside the JSON.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const dealData = await req.json();
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: `Analyze this car deal:\n\n${JSON.stringify(dealData, null, 2)}`,
          },
        ],
        system: SYSTEM_PROMPT,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.content?.[0]?.text;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from Claude's response
    const parsed = JSON.parse(content);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-deal error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
