import { createFileRoute, Link } from "@tanstack/react-router";
import Layout from "@/components/lbh/Layout";
import Comments from "@/components/lbh/Comments";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/stories/$slug")({
  loader: async ({ params }) => {
    const cols = "id,title,category,summary,body,author,read_minutes,cover_url,tags,published_at";
    const query = supabase.from("stories").select(cols).eq("status", "published");
    const { data } = UUID_RE.test(params.slug)
      ? await query.eq("id", params.slug).maybeSingle()
      : await query.eq("slug", params.slug).maybeSingle();
    return { story: (data as Story | null) ?? null };
  },
  component: StoryPage,
  head: ({ params, loaderData }) => {
    const story = loaderData?.story;
    const title = story ? `${story.title} — The Liberian Business Hour` : "Story — The Liberian Business Hour";
    const description = story?.summary || "Read the full story from The Liberian Business Hour news desk.";
    const url = `https://businesstimesliberia.lovable.app/stories/${params.slug}`;
    const imageMeta = story?.cover_url
      ? [
          { property: "og:image", content: story.cover_url },
          { name: "twitter:image", content: story.cover_url },
          { property: "og:image:alt", content: story.title },
          { name: "twitter:image:alt", content: story.title },
        ]
      : [];
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: story?.title || title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:title", content: story?.title || title },
        { name: "twitter:description", content: description },
        { name: "twitter:card", content: "summary_large_image" },
        ...imageMeta,
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: story ? [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: story.title,
          description,
          image: story.cover_url ? [story.cover_url] : undefined,
          datePublished: story.published_at || undefined,
          author: { "@type": "Person", name: story.author || "LBH Staff" },
          publisher: { "@type": "Organization", name: "The Liberian Business Hour" },
          mainEntityOfPage: url,
        }),
      }] : [],
    };
  },
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
  const { story } = Route.useLoaderData();

  return (
    <Layout>
      <article className="full-width" style={{ maxWidth: 820, padding: "2.5rem 1.25rem" }}>
        <Link to="/stories" style={{ color: "var(--green-mid)", fontSize: 13, textDecoration: "none" }}>← All stories</Link>
        {!story && (
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
            <Comments storyId={story.id} />
          </>
        )}
      </article>
    </Layout>
  );
}
