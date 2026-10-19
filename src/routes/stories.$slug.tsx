import { createFileRoute, Link } from "@tanstack/react-router";
import Layout from "@/components/lbh/Layout";
import Comments from "@/components/lbh/Comments";
import { CardsGrid } from "@/components/lbh/Cards";
import { usePublishedStories, toCard } from "@/lib/useStories";
import { supabase } from "@/integrations/supabase/client";
import { imageSlot, parseStoryImages, safeArticleHtml, splitHtmlBlocks, type StoryImage } from "@/lib/article-content";

function Figure({ image, alt }: { image: StoryImage; alt: string }) {
  return <figure className="article-figure">
    <img src={image.url} alt={image.caption || alt} loading="lazy" />
    {image.caption && <figcaption>{image.caption}</figcaption>}
  </figure>;
}

function StoryBody({ story }: { story: Story }) {
  const body = story.body?.trim() || "";
  const isHtml = body.startsWith("<");
  const blocks = !body ? [] : isHtml ? splitHtmlBlocks(safeArticleHtml(body)) : body.split(/\n\s*\n/);
  const images = parseStoryImages(story.story_images);
  const at = (slot: number) => images.filter((im) => imageSlot(im.position, blocks.length) === slot)
    .map((im, i) => <Figure key={`${slot}-${i}`} image={im} alt={`${story.title} — photo`} />);
  return <>
    {at(0)}
    {blocks.map((b, i) => <div key={i}>
      {isHtml
        ? <div className="article-body" dangerouslySetInnerHTML={{ __html: b }} />
        : <div className="article-body article-plain">{b}</div>}
      {at(i + 1)}
    </div>)}
  </>;
}

function Recommended({ currentId, category }: { currentId: string; category: string }) {
  const { stories } = usePublishedStories();
  const others = stories.filter((s) => s.id !== currentId);
  const picks = [...others.filter((s) => s.category === category), ...others.filter((s) => s.category !== category)].slice(0, 3);
  if (!picks.length) return null;
  return <section style={{ marginTop: "3rem" }} aria-label="Recommended stories">
    <div className="section-label-sm">Recommended Stories</div>
    <CardsGrid items={picks.map(toCard)} />
  </section>;
}

export const Route = createFileRoute("/stories/$slug")({
  loader: async ({ params }) => {
    const cols = "id,title,category,summary,body,author,read_minutes,cover_url,cover_caption,story_images,tags,published_at";
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
    const imageMeta = story?.cover_url && story.cover_url.startsWith("https://")
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
  cover_caption: string | null;
  story_images: unknown;
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
            {story.cover_url && <figure className="article-figure">
              <img src={story.cover_url} alt={story.cover_caption || story.title} loading="lazy" />
              {story.cover_caption && <figcaption>{story.cover_caption}</figcaption>}
            </figure>}
            <StoryBody story={story} />
            {story.tags && story.tags.length > 0 && (
              <div style={{ marginTop: "2.5rem", display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                {story.tags.map((t) => (
                  <span key={t} className="tag-pill tag-read">{t}</span>
                ))}
              </div>
            )}
            <Comments storyId={story.id} />
            <Recommended currentId={story.id} category={story.category} />
          </>
        )}
      </article>
    </Layout>
  );
}
