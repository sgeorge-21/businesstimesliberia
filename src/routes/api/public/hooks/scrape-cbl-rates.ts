import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Scrapes the CBL "Daily Exchange Rates" table (USD/LRD) and derives EUR & GBP
// from live USD cross rates. Called by pg_cron daily; safe to invoke manually.
export const Route = createFileRoute("/api/public/hooks/scrape-cbl-rates")({
  server: {
    handlers: {
      POST: async () => {
        try {
          const html = await fetch("https://www.cbl.org.lr/research/buying-selling-rates", {
            headers: { "user-agent": "Mozilla/5.0 (compatible; LBH/1.0)" },
          }).then((r) => r.text());

          const text = html
            .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ")
            .replace(/<[^>]+>/g, " ")
            .replace(/&[a-z]+;/gi, " ")
            .replace(/\s+/g, " ");

          // First row of the table is the most recent date.
          const m = text.match(
            /L\$\s*([0-9]+(?:\.[0-9]+)?)\s*\/\s*US\$\s*1\.00\s*L\$\s*([0-9]+(?:\.[0-9]+)?)\s*\/\s*US\$\s*1\.00/i,
          );
          if (!m) {
            return Response.json(
              { success: false, error: "Could not parse USD rate from CBL page" },
              { status: 502 },
            );
          }
          const usdBuy = parseFloat(m[1]);
          const usdSell = parseFloat(m[2]);

          const rows: { currency: string; buy: number; sell: number; source: string }[] = [
            { currency: "USD", buy: usdBuy, sell: usdSell, source: "cbl.org.lr" },
          ];

          try {
            const fx = (await fetch(
              "https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR,GBP",
            ).then((r) => r.json())) as { rates?: Record<string, number> };
            for (const cur of ["EUR", "GBP"] as const) {
              const per = fx.rates?.[cur];
              if (per && per > 0) {
                rows.push({
                  currency: cur,
                  buy: Number((usdBuy / per).toFixed(4)),
                  sell: Number((usdSell / per).toFixed(4)),
                  source: "cbl.org.lr + ECB cross",
                });
              }
            }
          } catch {
            // USD still updates even if cross rates are unavailable.
          }

          const fetched_at = new Date().toISOString();
          const results = await Promise.all(
            rows.map((r) =>
              supabaseAdmin.from("cbl_rates").upsert(
                {
                  currency: r.currency,
                  buy_rate: r.buy,
                  sell_rate: r.sell,
                  source: r.source,
                  fetched_at,
                },
                { onConflict: "currency" },
              ),
            ),
          );
          const errors = results.filter((r) => r.error).map((r) => r.error?.message);

          return Response.json({
            success: errors.length === 0,
            updated: rows.map((r) => r.currency),
            rates: rows,
            errors: errors.length ? errors : undefined,
          });
        } catch (e: any) {
          return Response.json({ success: false, error: e?.message || String(e) }, { status: 500 });
        }
      },
      GET: async () => new Response("Use POST to trigger CBL rate scrape", { status: 405 }),
    },
  },
});
