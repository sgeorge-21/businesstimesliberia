import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout, { ShowSidebar } from "@/components/lbh/Layout";
import { CardsGrid } from "@/components/lbh/Cards";
import { usePublishedStories, matchesTab, toCard } from "@/lib/useStories";

export const Route = createFileRoute("/economy")({ component: EconomyPage });

const TABS = ["All Economy", "GDP & Growth", "Inflation", "Government Policy", "Agriculture", "Employment"];

type Rate = { currency: string; buy_rate: number | null; sell_rate: number | null; fetched_at: string };
type Indicator = { key: string; label: string; value: string; unit: string | null; source: string | null; as_of: string | null };

function EconomyPage() {
  const [tab, setTab] = useState(TABS[0]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const { stories, loading } = usePublishedStories("econom");
  const filteredStories = tab === TABS[0] ? stories : stories.filter((s) => matchesTab(s, tab));
  const cards = filteredStories.map(toCard);

  useEffect(() => {
    const loadRates = () => supabase
      .from("cbl_rates")
      .select("currency,buy_rate,sell_rate,fetched_at")
      .order("currency")
      .then(({ data }) => setRates((data as Rate[]) || []));
    const loadIndicators = () => supabase
      .from("economic_indicators")
      .select("key,label,value,unit,source,as_of")
      .then(({ data }) => setIndicators((data as Indicator[]) || []));
    loadRates();
    loadIndicators();
    const ch = supabase
      .channel("economy_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "cbl_rates" }, loadRates)
      .on("postgres_changes", { event: "*", schema: "public", table: "economic_indicators" }, loadIndicators)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const ind = (key: string) => indicators.find((i) => i.key === key);

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
              {(() => { const i = ind("national_budget"); return (
                <div className="stat-cell">
                  <div className="stat-label">{i?.label ?? "National Budget"}</div>
                  <div className="stat-value">{i ? `${i.value}${i.unit ? " " + i.unit : ""}` : "—"}</div>
                  <div className="stat-change">Source: {i?.source ?? "—"}{i?.as_of ? ` · ${new Date(i.as_of).toLocaleDateString()}` : ""}</div>
                </div>
              ); })()}
              {(() => { const i = ind("gdp"); return (
                <div className="stat-cell">
                  <div className="stat-label">{i?.label ?? "GDP"}</div>
                  <div className="stat-value">{i ? `${i.value}${i.unit ? " " + i.unit : ""}` : "—"}</div>
                  <div className="stat-change">Source: {i?.source ?? "—"}{i?.as_of ? ` · ${new Date(i.as_of).toLocaleDateString()}` : ""}</div>
                </div>
              ); })()}
            </div>
          )}
          <div className="section-label-sm">{tab === TABS[0] ? "Economy Headlines" : tab}</div>
          {loading && <p style={{ color: "var(--text-light)" }}>Loading stories…</p>}
          {!loading && (cards.length > 0
            ? <CardsGrid items={cards} />
            : <p style={{ color: "var(--text-light)" }}>No stories published in this category yet.</p>)}
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
