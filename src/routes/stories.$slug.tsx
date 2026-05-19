import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Layout from "@/components/lbh/Layout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/stories/$slug")({ component: StoryPage });

type Story = {
  id: string;
  title: string;
  category: string;
  summary: string | null;
  body: string | null;
  author: string | null;
  read_minutes: number | null;
  cover_url: string | null;
  tags: string[] | null;
  published_at: string | null;
};

function StoryPage() {
  const { slug } = Route.useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("stories")
        .select("id,title,category,summary,body,author,read_minutes,cover_url,tags,published_at")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (cancelled) return;
      if (!data) setMissing(true);
      else setStory(data as Story);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  return (
    <Layout>
      <article className="full-width" style={{ maxWidth: 820, padding: "2.5rem 1.25rem" }}>
        <Link to="/stories" style={{ color: "var(--green-mid)", fontSize: 13, textDecoration: "none" }}>← All stories</Link>
        {loading && <p style={{ marginTop: "2rem" }}>Loading…</p>}
        {missing && (
          <div style={{ marginTop: "2rem" }}>
            <h1 style={{ fontFamily: "'Playfair Display',serif" }}>Story not found</h1>
            <p>The story you're looking for may have been moved or unpublished.</p>
          </div>
        )}
        {story && (
          <>
            <div className="story-tags" style={{ marginTop: "1rem" }}>
              <span className="tag-pill tag-feature">{story.category}</span>
              {story.read_minutes && <span className="tag-pill tag-read">{story.read_minutes} min read</span>}
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", margin: ".75rem 0", lineHeight: 1.15 }}>
              {story.title}
            </h1>
            {story.summary && (
              <p style={{ fontSize: "1.1rem", color: "var(--text-mid)", lineHeight: 1.55 }}>{story.summary}</p>
            )}
            <p style={{ fontSize: 13, color: "var(--text-light)", margin: "1rem 0 1.5rem" }}>
              By {story.author ?? "LBH Staff"}
              {story.published_at && ` · ${new Date(story.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}`}
            </p>
            {story.cover_url && (
              <img src={story.cover_url} alt={story.title} style={{ width: "100%", borderRadius: 6, marginBottom: "2rem" }} loading="lazy" />
            )}
            <div style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "var(--text-dark)", whiteSpace: "pre-wrap" }}>
              {story.body}
            </div>
            {story.tags && story.tags.length > 0 && (
              <div style={{ marginTop: "2.5rem", display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                {story.tags.map((t) => (
                  <span key={t} className="tag-pill tag-read">{t}</span>
                ))}
              </div>
            )}
          </>
        )}
      </article>
    </Layout>
  );
}
