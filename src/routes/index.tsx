import { createFileRoute, Link } from "@tanstack/react-router";
import Layout, { ShowSidebar } from "@/components/lbh/Layout";
import { CardsGrid } from "@/components/lbh/Cards";
import { usePublishedStories, toCard } from "@/lib/useStories";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "The Liberian Business Hour — Liberia Business News & Radio" },
      { name: "description", content: "Liberia's weekly business radio program and news desk: business, economy, finance, CBL rates and in-depth stories from Monrovia." },
      { property: "og:title", content: "The Liberian Business Hour" },
      { property: "og:description", content: "Liberia's weekly business radio program and news desk — business, economy, finance and CBL exchange rates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Home() {
  const { stories, loading } = usePublishedStories();

  const hero = stories.find((s) => s.featured?.startsWith("Yes – Homepage")) ?? stories[0] ?? null;
  const cards = stories.filter((s) => s.id !== hero?.id).slice(0, 4).map(toCard);

  return (
    <Layout>
      {hero ? (
        <div className="hero">
          <img
            src={hero.cover_url || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=80"}
            className="hero-img"
            alt={hero.title}
          />
          <div className="hero-overlay">
            <div className="hero-tag">{hero.category}</div>
            <h1>{hero.title}</h1>
            {hero.summary && <p className="hero-desc">{hero.summary}</p>}
            <div className="hero-meta">
              <span>By {hero.author || "LBH Staff"}</span>
              <span>
                {new Date(hero.published_at || hero.created_at || Date.now()).toLocaleDateString()}
                {hero.read_minutes ? ` · ${hero.read_minutes} min read` : ""}
              </span>
              {hero.slug && (
                <Link to="/stories/$slug" params={{ slug: hero.slug }} className="btn-read">Read Full Story →</Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="section-banner">
          <div className="section-label">The Liberian Business Hour</div>
          <h1 style={{ fontSize: "1.9rem", margin: ".4rem 0" }}>Liberia's Business News Desk</h1>
          <p>{loading ? "Loading the latest stories…" : "No stories have been published yet. Newly published articles will appear here."}</p>
        </div>
      )}

      <div className="main-layout">
        <div>
          <div className="section-label-sm">Latest Stories</div>
          {loading && <p style={{ color: "var(--text-light)" }}>Loading stories…</p>}
          {!loading && (cards.length > 0
            ? <CardsGrid items={cards} />
            : <p style={{ color: "var(--text-light)" }}>No stories published yet.</p>)}

          <div className="mv-section">
            <div className="section-label-sm">Mission &amp; Vision</div>
            <div className="mv-grid">
              <div className="mv-card">
                <h3>Our Mission</h3>
                <p>
                  To inform, educate, and empower Liberia's business community with accurate, timely and
                  independent reporting on business, the economy and finance — giving entrepreneurs,
                  investors and workers the knowledge they need to make better decisions.
                </p>
              </div>
              <div className="mv-card">
                <h3>Our Vision</h3>
                <p>
                  To be Liberia's most trusted business media platform — a voice that champions
                  transparency, celebrates Liberian enterprise, and helps build a stronger, more
                  prosperous national economy.
                </p>
              </div>
            </div>
          </div>
        </div>
        <ShowSidebar title="Popular This Week" items={[]} />
      </div>
    </Layout>
  );
}
