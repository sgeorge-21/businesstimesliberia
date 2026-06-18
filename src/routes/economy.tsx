import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout, { ShowSidebar } from "@/components/lbh/Layout";
import { CardsGrid, ListCards } from "@/components/lbh/Cards";
import { ECONOMY_CARDS, ECONOMY_LIST } from "@/components/lbh/data";
import { filterByTab } from "@/lib/filterByTab";

export const Route = createFileRoute("/economy")({ component: EconomyPage });

const TABS = ["All Economy", "GDP & Growth", "Inflation", "Government Policy", "Agriculture", "Employment"];

type Rate = { currency: string; buy_rate: number | null; sell_rate: number | null; fetched_at: string };
type Indicator = { key: string; label: string; value: string; unit: string | null; source: string | null; as_of: string | null };

function EconomyPage() {
  const [tab, setTab] = useState(TABS[0]);
  const [rates, setRates] = useState<Rate[]>([]);
  const cards = filterByTab(ECONOMY_CARDS, tab, TABS[0]);
  const list = filterByTab(ECONOMY_LIST, tab, TABS[0]);

  useEffect(() => {
    const load = () => supabase
      .from("cbl_rates")
      .select("currency,buy_rate,sell_rate,fetched_at")
      .order("currency")
      .then(({ data }) => setRates((data as Rate[]) || []));
    load();
    const ch = supabase
      .channel("economy_cbl_rates")
      .on("postgres_changes", { event: "*", schema: "public", table: "cbl_rates" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const fmt = (cur: string) => {
    const r = rates.find((x) => x.currency === cur);
    if (!r || (r.buy_rate == null && r.sell_rate == null)) return "—";
    const buy = r.buy_rate ?? 0, sell = r.sell_rate ?? 0;
    return ((buy + sell) / 2).toFixed(2);
  };
  const updated = rates[0]?.fetched_at ? new Date(rates[0].fetched_at).toLocaleDateString() : "—";

  return (
    <Layout>
      <div className="section-banner">
        <div className="section-label">Section</div>
        <h2>Economy</h2>
        <p>Tracking Liberia's economic performance — GDP, inflation, trade, and government policy.</p>
      </div>
      <div className="section-tabs">
        {TABS.map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div className="main-layout">
        <div>
          {tab === TABS[0] && (
            <div className="stats-row">
              <div className="stat-cell"><div className="stat-label">USD / LRD (mid)</div><div className="stat-value">{fmt("USD")}</div><div className="stat-change">Source: CBL · {updated}</div></div>
              <div className="stat-cell"><div className="stat-label">EUR / LRD (mid)</div><div className="stat-value">{fmt("EUR")}</div><div className="stat-change">Source: CBL · {updated}</div></div>
              <div className="stat-cell"><div className="stat-label">GBP / LRD (mid)</div><div className="stat-value">{fmt("GBP")}</div><div className="stat-change">Source: CBL · {updated}</div></div>
            </div>
          )}
          <div className="section-label-sm">{tab === TABS[0] ? "Economy Headlines" : tab}</div>
          {cards.length > 0 ? <CardsGrid items={cards} /> : <p style={{ color: "var(--text-light)" }}>No stories in this category yet.</p>}
          {list.length > 0 && (
            <>
              <div className="section-label-sm">More Economy Stories</div>
              <ListCards items={list} />
            </>
          )}
        </div>
        <ShowSidebar title="Economy Data" items={[
          "Liberia GDP: 2020–2026 Trend Report",
          "2026 National Budget Breakdown",
          "Inflation & Consumer Price Index Data",
          "Liberia's Top Export Commodities 2026",
        ]} />
      </div>
    </Layout>
  );
}
