import { createFileRoute } from "@tanstack/react-router";
import Layout, { ShowSidebar } from "@/components/lbh/Layout";
import { FEATURED_STORIES } from "@/components/lbh/data";

export const Route = createFileRoute("/stories")({ component: StoriesPage });

function StoriesPage() {
  return (
    <Layout>
      <div className="section-banner">
        <div className="section-label">Section</div>
        <h2>Stories</h2>
        <p>In-depth features, profiles, and long-form journalism about the people and businesses shaping Liberia.</p>
      </div>
      <div className="section-tabs">
        {["All Stories", "Feature", "Profiles", "Opinion", "Investigative", "Community"].map((t, i) => (
          <button key={t} className={`tab-btn ${i === 0 ? "active" : ""}`}>{t}</button>
        ))}
      </div>
      <div className="main-layout">
        <div>
          <div className="section-label-sm">Featured Stories</div>
          {FEATURED_STORIES.map((s, i) => (
            <div className="featured-story" key={i}>
              <img src={s.img} alt={s.title} loading="lazy" />
              <div className="featured-story-body">
                <div className="story-tags">
                  <span className={`tag-pill ${s.pillClass}`}>{s.tags[0]}</span>
                  <span className="tag-pill tag-read">{s.tags[1]}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <p style={{ fontSize: "12.5px", color: "var(--text-light)" }}>{s.byline}</p>
                <a href="#" className="btn-read-green" style={{ marginTop: ".75rem" }}>Read Full Story</a>
              </div>
            </div>
          ))}
        </div>
        <ShowSidebar title="Top Stories" items={[
          "From Market Table to Million-Dollar Brand",
          "The Hidden Cost of Doing Business in Liberia",
          "Meet Liberia's Youngest Self-Made Millionaire",
          "How Women Are Leading Liberia's Economic Recovery",
        ]} />
      </div>
    </Layout>
  );
}
