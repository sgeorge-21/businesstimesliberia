import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Card } from "@/components/lbh/data";

export type StoryRow = {
  id: string;
  slug: string | null;
  title: string;
  category: string;
  summary: string | null;
  cover_url: string | null;
  author: string | null;
  read_minutes: number | null;
  published_at: string | null;
  created_at: string | null;
  tags: string[] | null;
  featured: string | null;
};

const FALLBACK_IMG = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80";

export function toCard(s: StoryRow): Card {
  return {
    title: s.title,
    cat: s.category,
    img: s.cover_url || FALLBACK_IMG,
    excerpt: s.summary || "",
    meta: `${s.author || "LBH Staff"} · ${new Date(s.published_at || s.created_at || Date.now()).toLocaleDateString()}`,
    slug: s.slug || undefined,
  };
}

/** Fetch published stories, optionally limited to a section (business/economy/finance). */
export function usePublishedStories(section?: string) {
  const [stories, setStories] = useState<StoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("stories")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        const rows = ((data ?? []) as unknown as StoryRow[]).filter((s) => {
          if (!section) return true;
          const hay = `${s.category ?? ""} ${(s.tags ?? []).join(" ")}`.toLowerCase();
          return hay.includes(section.toLowerCase());
        });
        setStories(rows);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [section]);

  return { stories, loading };
}

export function matchesTab(s: StoryRow, tab: string) {
  const t = tab.toLowerCase().replace(/^all\s+/, "").trim();
  if (!t) return true;
  const words = t.split(/[&\s]+/).filter((w) => w.length > 2);
  const hay = `${s.category ?? ""} ${(s.tags ?? []).join(" ")}`.toLowerCase();
  return words.some((w) => hay.includes(w));
}
