import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Layout, { ShowSidebar } from "@/components/lbh/Layout";
import { CardsGrid, ListCards } from "@/components/lbh/Cards";
import { BUSINESS_CARDS, BUSINESS_LIST } from "@/components/lbh/data";
import { filterByTab } from "@/lib/filterByTab";

export const Route = createFileRoute("/business")({ component: BusinessPage });

const TABS = ["All Business", "Trade & Commerce", "Market", "Investment", "Entrepreneurship", "Corporate News"];

function BusinessPage() {
  const [tab, setTab] = useState(TABS[0]);
  const cards = filterByTab(BUSINESS_CARDS, tab, TABS[0]);
  const list = filterByTab(BUSINESS_LIST, tab, TABS[0]);

  return (
    <Layout>
      <div className="section-banner">
        <div className="section-label">Section</div>
        <h2>Business</h2>
        <p>News, analysis and updates on Liberia's business landscape — from startups to enterprise.</p>
      </div>
      <div className="section-tabs">
        {TABS.map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div className="main-layout">
        <div>
          {tab === TABS[0] && (
            <>
              <div className="section-label-sm">Top Story</div>
              <div className="featured-story" style={{ marginBottom: "2rem" }}>
                <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80" alt="" />
                <div className="featured-story-body">
                  <div className="story-tags"><span className="tag-pill tag-feature">Top Story</span></div>
                  <h3>New Investment Incentive Act Opens Doors for Liberian Business Owners</h3>
                  <p>President Boakai's landmark legislation offers major tax breaks and regulatory relief for businesses operating in manufacturing, agribusiness, and the tech sector.</p>
                  <p style={{ fontSize: "12.5px", color: "var(--text-light)" }}>By James T. Worquea III · April 22, 2026 · 6 min read</p>
                  <a href="/stories" className="btn-read-green" style={{ marginTop: ".75rem" }}>Read Full Story →</a>
                </div>
              </div>
            </>
          )}
          <div className="section-label-sm">{tab === TABS[0] ? "Latest in Business" : tab}</div>
          {cards.length > 0 ? <CardsGrid items={cards} /> : <p style={{ color: "var(--text-light)" }}>No stories in this category yet.</p>}
          {list.length > 0 && (
            <>
              <div className="section-label-sm">More Business Stories</div>
              <ListCards items={list} />
            </>
          )}
        </div>
        <ShowSidebar title="Trending" items={[
          "How the Investment Act Changes Business Registration",
          "Top 10 Liberian Businesses to Watch in 2026",
          "SME Financing Options: A Complete 2026 Guide",
          "Freeport Trade Zone: What It Means for You",
        ]} />
      </div>
    </Layout>
  );
}
