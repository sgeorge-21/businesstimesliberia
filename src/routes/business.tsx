import { createFileRoute, Link } from "@tanstack/react-router";
import Layout, { ShowSidebar } from "@/components/lbh/Layout";
import { CardsGrid, ListCards } from "@/components/lbh/Cards";
import { BUSINESS_CARDS, BUSINESS_LIST } from "@/components/lbh/data";

export const Route = createFileRoute("/business")({ component: BusinessPage });

function BusinessPage() {
  return (
    <Layout>
      <div className="section-banner">
        <div className="section-label">Section</div>
        <h2>Business</h2>
        <p>News, analysis and updates on Liberia's business landscape — from startups to enterprise.</p>
      </div>
      <div className="section-tabs">
        {[
          "All Business",
          "Trade & Commerce",
          "Market",
          "Investment",
          "Entrepreneurship",
          "Corporate News",
        ].map((t, i) => (
          <button key={t} className={`tab-btn ${i === 0 ? "active" : ""}`}>{t}</button>
        ))}
      </div>
      <div className="main-layout">
        <div>
          <div className="section-label-sm">Top Story</div>
          <div className="featured-story" style={{ marginBottom: "2rem" }}>
            <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80" alt="Investment" />
            <div className="featured-story-body">
              <div className="story-tags"><span className="tag-pill tag-feature">Top Story</span></div>
              <h3>New Investment Incentive Act Opens Doors for Liberian Business Owners</h3>
              <p>President Boakai's landmark legislation offers major tax breaks and regulatory relief for businesses operating in manufacturing, agribusiness, and the tech sector.</p>
              <p style={{ fontSize: "12.5px", color: "var(--text-light)" }}>By James T. Worquea III · April 22, 2026 · 6 min read</p>
              <Link to="/story/sample-investment-act" className="btn-read-green" style={{ marginTop: ".75rem" }}>Read Full Story →</Link>
            </div>
          </div>
          <div className="section-label-sm">Latest in Business</div>
          <CardsGrid items={BUSINESS_CARDS} />
          <div className="section-label-sm">More Business Stories</div>
          <ListCards items={BUSINESS_LIST} />
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
