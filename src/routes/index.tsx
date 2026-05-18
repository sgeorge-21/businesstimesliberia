import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Layout, { ShowSidebar } from "@/components/lbh/Layout";
import { CardsGrid } from "@/components/lbh/Cards";
import { HOME_CARDS, POPULAR, type Card } from "@/components/lbh/data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [dbCards, setDbCards] = useState<Card[]>([]);
  const [hero, setHero] = useState<any>(null);

  useEffect(() => {
    supabase.from("stories").select("*").eq("status", "published").order("published_at", { ascending: false }).limit(8).then(({ data }) => {
      if (!data) return;
      const heroRow = data.find((s) => s.featured && s.featured.startsWith("Yes – Homepage")) ?? null;
      setHero(heroRow);
      const others = data.filter((s) => s.id !== heroRow?.id).slice(0, 4);
      setDbCards(others.map((s) => ({
        title: s.title, cat: s.category, img: s.cover_url || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
        excerpt: s.summary || "", meta: `${s.author || "Staff"} · ${new Date(s.published_at || s.created_at).toLocaleDateString()}`,
      })));
    });
  }, []);

  const cards = [...dbCards, ...HOME_CARDS].slice(0, 4);

  return (
    <Layout>
      <div className="hero">
        <img src={hero?.cover_url || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=80"} className="hero-img" alt="Liberia" />
        <div className="hero-overlay">
          <div className="hero-tag">{hero?.category || "Economy Watch"}</div>
          <h1>{hero?.title || "Liberia's Economic Growth Targets for 2026: What Every Business Must Know"}</h1>
          <p className="hero-desc">{hero?.summary || "Finance Minister outlines key GDP projections and sweeping trade policy reforms set to reshape the business landscape across Monrovia and Liberia's counties."}</p>
          <div className="hero-meta">
            <span>By {hero?.author || "James T. Worquea III"}</span>
            <span>{hero ? new Date(hero.published_at || hero.created_at).toLocaleDateString() : "April 22, 2026"} · {hero?.read_minutes || 5} min read</span>
            <a href="#" className="btn-read">Read Full Story →</a>
          </div>
        </div>
      </div>
      <div className="main-layout">
        <div>
          <div className="section-label-sm">Latest Stories</div>
          <CardsGrid items={cards} />
        </div>
        <ShowSidebar title="Popular This Week" items={POPULAR} />
      </div>
    </Layout>
  );
}
