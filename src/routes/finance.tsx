import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Layout, { ShowSidebar } from "@/components/lbh/Layout";
import { CardsGrid, ListCards } from "@/components/lbh/Cards";
import { FINANCE_CARDS, FINANCE_LIST } from "@/components/lbh/data";
import { filterByTab } from "@/lib/filterByTab";

export const Route = createFileRoute("/finance")({ component: FinancePage });

const TABS = ["All Finance", "Banking", "Microfinance", "Insurance", "Taxation", "Digital Finance"];

function FinancePage() {
  const [tab, setTab] = useState(TABS[0]);
  const cards = filterByTab(FINANCE_CARDS, tab, TABS[0]);
  const list = filterByTab(FINANCE_LIST, tab, TABS[0]);

  return (
    <Layout>
      <div className="section-banner">
        <div className="section-label">Section</div>
        <h2>Finance</h2>
        <p>Banking, monetary policy, investment and financial services news from across Liberia.</p>
      </div>
      <div className="section-tabs">
        {TABS.map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div className="main-layout">
        <div>
          <div className="section-label-sm">{tab === TABS[0] ? "Finance Headlines" : tab}</div>
          {cards.length > 0 ? <CardsGrid items={cards} /> : <p style={{ color: "var(--text-light)" }}>No stories in this category yet.</p>}
          {list.length > 0 && (
            <>
              <div className="section-label-sm">More Finance Stories</div>
              <ListCards items={list} />
            </>
          )}
        </div>
        <ShowSidebar title="Finance Tools" items={[
          "Liberia Business Loan Calculator",
          "USD/LRD Exchange Rate Tracker",
          "CBL Interest Rate History",
          "Liberia Tax Filing Guide 2026",
        ]} />
      </div>
    </Layout>
  );
}
