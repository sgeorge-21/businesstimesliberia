import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Layout, { ShowSidebar } from "@/components/lbh/Layout";
import { CardsGrid } from "@/components/lbh/Cards";
import { usePublishedStories, matchesTab, toCard } from "@/lib/useStories";

export const Route = createFileRoute("/finance")({ component: FinancePage });

const TABS = ["All Finance", "Banking", "Microfinance", "Insurance", "Taxation", "Digital Finance"];

function FinancePage() {
  const [tab, setTab] = useState(TABS[0]);
  const { stories, loading } = usePublishedStories("financ");
  const filtered = tab === TABS[0] ? stories : stories.filter((s) => matchesTab(s, tab));
  const cards = filtered.map(toCard);

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
          {loading && <p style={{ color: "var(--text-light)" }}>Loading stories…</p>}
          {!loading && (cards.length > 0
            ? <CardsGrid items={cards} />
            : <p style={{ color: "var(--text-light)" }}>No stories published in this category yet.</p>)}
        </div>
        <ShowSidebar title="Trending" items={[]} />
      </div>
    </Layout>
  );
}
