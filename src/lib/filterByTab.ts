export function filterByTab<T extends { cat: string }>(
  items: T[],
  tab: string,
  allLabel: string,
): T[] {
  if (tab === allLabel) return items;
  const t = tab.toLowerCase();
  return items.filter((i) => {
    const c = i.cat.toLowerCase();
    return c === t || t.includes(c) || c.includes(t) || t.split(/[\s&]+/).some((w) => w && c.includes(w));
  });
}
