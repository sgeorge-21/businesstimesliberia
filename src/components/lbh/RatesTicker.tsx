import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Rate = { currency: string; buy_rate: number | null; sell_rate: number | null; fetched_at: string };

export function RatesTicker() {
  const [rates, setRates] = useState<Rate[]>([]);
  useEffect(() => {
    supabase
      .from("cbl_rates")
      .select("currency,buy_rate,sell_rate,fetched_at")
      .order("currency")
      .then(({ data }) => setRates((data as Rate[]) || []));
    const ch = supabase
      .channel("cbl_rates_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "cbl_rates" }, () => {
        supabase.from("cbl_rates").select("currency,buy_rate,sell_rate,fetched_at").order("currency").then(({ data }) => setRates((data as Rate[]) || []));
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  if (rates.length === 0) return null;

  return (
    <div className="rates-ticker" aria-label="CBL daily exchange rates">
      <span className="rates-ticker-label">CBL Rates (LRD)</span>
      <div className="rates-ticker-track">
        {[...rates, ...rates].map((r, i) => (
          <span key={i} className="rates-ticker-item">
            <strong>{r.currency}</strong>
            <span> Buy {r.buy_rate?.toFixed(2) ?? "—"}</span>
            <span> · Sell {r.sell_rate?.toFixed(2) ?? "—"}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function RatesWidget() {
  const [rates, setRates] = useState<Rate[]>([]);
  useEffect(() => {
    supabase.from("cbl_rates").select("currency,buy_rate,sell_rate,fetched_at").order("currency").then(({ data }) => setRates((data as Rate[]) || []));
  }, []);
  if (rates.length === 0) return null;
  const updated = rates[0]?.fetched_at ? new Date(rates[0].fetched_at).toLocaleString() : "";
  return (
    <div className="sidebar-box">
      <div className="sidebar-header gold">CBL Daily Rates</div>
      <div className="sidebar-body">
        <table className="rates-widget-table">
          <thead><tr><th>Currency</th><th>Buy</th><th>Sell</th></tr></thead>
          <tbody>
            {rates.map((r) => (
              <tr key={r.currency}><td><strong>{r.currency}</strong></td><td>{r.buy_rate?.toFixed(2) ?? "—"}</td><td>{r.sell_rate?.toFixed(2) ?? "—"}</td></tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: "var(--text-light)", marginTop: 8 }}>Source: Central Bank of Liberia · {updated}</div>
      </div>
    </div>
  );
}
