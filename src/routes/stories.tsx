import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Layout, { ShowSidebar } from "@/components/lbh/Layout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/stories")({ component: StoriesPage });

type StoryRow = {
  id: string;
  slug: string | null;
  title: string;
  category: string;
  summary: string | null;
  cover_url: string | null;
  author: string | null;
  read_minutes: number | null;
  published_at: string | null;
  tags: string[] | null;
};

const TABS = ["All Stories", "Feature", "Profiles", "Opinion", "Investigative", "Community"];

function StoriesPage() {
  const [stories, setStories] = useState<StoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(TABS[0]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("stories")
        .select("id,slug,title,category,summary,cover_url,author,read_minutes,published_at,tags")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      setStories((data ?? []) as StoryRow[]);
      setLoading(false);
    })();
  }, []);

  const filtered = tab === TABS[0]
    ? stories
    : stories.filter((s) => {
        const t = tab.toLowerCase();
        const c = (s.category || "").toLowerCase();
        const tags = (s.tags || []).map((x) => x.toLowerCase());
        return c.includes(t) || t.includes(c) || tags.some((x) => x.includes(t) || t.includes(x));
      });

  return (
    <Layout>
      <div className="section-banner">
        <div className="section-label">Section</div>
        <h2>Stories</h2>
        <p>In-depth features, profiles, and long-form journalism about the people and businesses shaping Liberia.</p>
      </div>
      <div className="section-tabs">
        {TABS.map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div className="main-layout">
        <div>
          <div className="section-label-sm">{tab === TABS[0] ? "Featured Stories" : tab}</div>
          {loading && <p>Loading stories…</p>}
          {!loading && filtered.length === 0 && <p style={{ color: "var(--text-light)" }}>No stories in this category yet.</p>}
          {filtered.map((s) => (
            <div className="featured-story" key={s.id}>
              {s.cover_url && <img src={s.cover_url} alt={s.title} loading="lazy" />}
              <div className="featured-story-body">
                <div className="story-tags">
                  <span className="tag-pill tag-feature">{s.category}</span>
                  {s.read_minutes && <span className="tag-pill tag-read">{s.read_minutes} min read</span>}
                </div>
                <h3>{s.title}</h3>
                {s.summary && <p>{s.summary}</p>}
                <p style={{ fontSize: "12.5px", color: "var(--text-light)" }}>
                  By {s.author ?? "LBH Staff"}
                  {s.published_at && ` · ${new Date(s.published_at).toLocaleDateString()}`}
                </p>
                {s.slug && (
                  <Link to="/stories/$slug" params={{ slug: s.slug }} className="btn-read-green" style={{ marginTop: ".75rem" }}>
                    Read Full Story
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
        <ShowSidebar title="Top Stories" items={stories.slice(0, 4).map(s => s.title)} />
      </div>
    </Layout>
  );
}

