import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, feedback, category } = await req.json();

    if (!feedback || !feedback.trim()) {
      return new Response(
        JSON.stringify({ error: "Feedback is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build description with optional contact info
    const parts: string[] = [];
    if (name) parts.push(`From: ${name}`);
    if (email) parts.push(`Email: ${email}`);
    parts.push(`Category: ${category || "General"}`);
    parts.push(`\n${feedback}`);
    const description = parts.join("\n");

    const title = `[DealBreaker ${category || "General"}] ${feedback.slice(0, 80)}${feedback.length > 80 ? "..." : ""}`;

    // Insert into Chief of Staff Supabase cos_ideas table
    const COS_SUPABASE_URL = Deno.env.get("COS_SUPABASE_URL");
    const COS_SUPABASE_KEY = Deno.env.get("COS_SUPABASE_KEY");

    let cosInserted = false;
    if (COS_SUPABASE_URL && COS_SUPABASE_KEY) {
      try {
        const cosClient = createClient(COS_SUPABASE_URL, COS_SUPABASE_KEY);
        const { error: cosError } = await cosClient.from("cos_ideas").insert({
          title,
          description,
          status: "New",
          category_id: "fec0d3b9-7a5b-4ab5-a526-b21b17cb09e8",
        });
        if (cosError) {
          console.error("CoS insert error:", cosError);
        } else {
          cosInserted = true;
        }
      } catch (cosErr) {
        console.error("CoS connection error:", cosErr);
      }
    }

    // Send email notification via Resend
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    let emailSent = false;
    if (RESEND_API_KEY) {
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "DealBreaker <onboarding@resend.dev>",
            to: ["aimee.farabee@gmail.com"],
            subject: title,
            text: description,
          }),
        });
        if (emailRes.ok) {
          emailSent = true;
        } else {
          console.error("Resend error:", await emailRes.text());
        }
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
      }
    }

    return new Response(
      JSON.stringify({ success: true, cosInserted, emailSent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("submit-feedback error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
