// Content types. All site content is managed by administrators via the admin portal.
export type Card = {
  title: string;
  cat: string;
  img: string;
  excerpt: string;
  meta: string;
  slug?: string;
};
export type ListItem = { title: string; cat: string; img: string; meta: string };

export const POPULAR: string[] = [];
export const EPISODES: { num: number; title: string; date: string }[] = [];
