import { createFileRoute } from "@tanstack/react-router";
import Firecrawl from "@mendable/firecrawl-js";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Scrapes the CBL daily exchange rates page and upserts into cbl_rates.
// Called by pg_cron daily; also safe to invoke manually from admin.
export const Route = createFileRoute("/api/public/hooks/scrape-cbl-rates")({
  server: {
    handlers: {
      POST: async () => {
        const apiKey = process.env.FIRECRAWL_API_KEY;
        if (!apiKey) {
          return Response.json({ success: false, error: "FIRECRAWL_API_KEY missing" }, { status: 500 });
        }
        try {
          const fc = new Firecrawl({ apiKey });
          // CBL publishes daily rates here. If page layout changes, this regex still picks up currency + numbers.
          const res = await fc.scrape("https://www.cbl.org.lr/", {
            formats: ["markdown"],
            onlyMainContent: true,
          });
          const md: string =
            (res as any).markdown ?? (res as any).data?.markdown ?? "";

          // Try to find a "Daily Exchange Rates" style table. Fallback regex per currency line.
          const wanted = ["USD", "EUR", "GBP"];
          const found: Record<string, { buy: number; sell: number }> = {};
          for (const cur of wanted) {
            // Match e.g. "USD  188.50  192.00" or "USD | 188.50 | 192.00"
            const re = new RegExp(
              `\\b${cur}\\b[^0-9\\n\\r]{0,40}([0-9]{2,4}(?:\\.[0-9]{1,4})?)[^0-9\\n\\r]{0,20}([0-9]{2,4}(?:\\.[0-9]{1,4})?)`,
              "i",
            );
            const m = md.match(re);
            if (m) {
              const buy = parseFloat(m[1]);
              const sell = parseFloat(m[2]);
              if (!Number.isNaN(buy) && !Number.isNaN(sell)) {
                found[cur] = { buy, sell };
              }
            }
          }

          const updates = Object.entries(found).map(([currency, v]) =>
            supabaseAdmin
              .from("cbl_rates")
              .upsert(
                {
                  currency,
                  buy_rate: v.buy,
                  sell_rate: v.sell,
                  source: "cbl.org.lr",
                  fetched_at: new Date().toISOString(),
                },
                { onConflict: "currency" },
              ),
          );
          const results = await Promise.all(updates);
          const errors = results.filter((r) => r.error).map((r) => r.error?.message);

          return Response.json({
            success: errors.length === 0,
            updated: Object.keys(found),
            found,
            errors: errors.length ? errors : undefined,
            // Useful for debugging when regex misses; keep small.
            preview: md.slice(0, 400),
          });
        } catch (e: any) {
          return Response.json({ success: false, error: e?.message || String(e) }, { status: 500 });
        }
      },
      GET: async () =>
        new Response("Use POST to trigger CBL rate scrape", { status: 405 }),
    },
  },
});
