import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout, { ShowSidebar } from "@/components/lbh/Layout";
import { CardsGrid, ListCards } from "@/components/lbh/Cards";
import { ECONOMY_CARDS, ECONOMY_LIST } from "@/components/lbh/data";
import { filterByTab } from "@/lib/filterByTab";

export const Route = createFileRoute("/economy")({ component: EconomyPage });

const TABS = ["All Economy", "GDP & Growth", "Inflation", "Government Policy", "Agriculture", "Employment"];

function EconomyPage() {
  const [tab, setTab] = useState(TABS[0]);
  const cards = filterByTab(ECONOMY_CARDS, tab, TABS[0]);
  const list = filterByTab(ECONOMY_LIST, tab, TABS[0]);

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
              <div className="stat-cell"><div className="stat-label">GDP Growth (2026)</div><div className="stat-value">4.8%</div><div className="stat-change up">▲ 0.3% vs last year</div></div>
              <div className="stat-cell"><div className="stat-label">USD / LRD</div><div className="stat-value">191.4</div><div className="stat-change down">▼ 0.8 today</div></div>
              <div className="stat-cell"><div className="stat-label">National Budget</div><div className="stat-value">$713M</div><div className="stat-change up">▲ 8% vs FY2025</div></div>
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
