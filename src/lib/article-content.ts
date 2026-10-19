import sanitizeHtml from "sanitize-html";

/** position: "top" | "middle" | "end" | "after-N" (after paragraph N). Missing = end. */
export type StoryImage = { url: string; caption: string; position?: string };

export function parseStoryImages(value: unknown): StoryImage[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is StoryImage =>
    !!item && typeof item === "object" && typeof item.url === "string" && /^https:\/\//.test(item.url) && typeof item.caption === "string"
  ).slice(0, 3).map((i) => ({ url: i.url, caption: i.caption, position: typeof i.position === "string" ? i.position : "end" }));
}

export function safeArticleHtml(body: string) {
  return sanitizeHtml(body, {
    allowedTags: ["p", "br", "strong", "em", "mark", "span", "h2", "h3", "ul", "ol", "li", "blockquote", "s"],
    allowedAttributes: { span: ["style"] },
    transformTags: {
      span: (_tag, attrs) => {
        const size = attrs.style?.match(/(?:^|;)\s*font-size:\s*(14|18|22)px\s*(?:;|$)/i)?.[1];
        return { tagName: "span", attribs: size ? { style: `font-size: ${size}px` } : ({} as Record<string, string>) };
      },
    },
  });
}

const BLOCK = /^(p|h2|h3|ul|ol|blockquote)$/i;

/** Split sanitized HTML into top-level blocks (depth-aware so lists stay whole). */
export function splitHtmlBlocks(html: string): string[] {
  const blocks: string[] = [];
  const re = /<(\/?)([a-z0-9]+)[^>]*>/gi;
  let depth = 0, start = 0, m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (!BLOCK.test(m[2])) continue;
    if (!m[1]) { if (depth === 0) start = m.index; depth++; }
    else if (depth > 0 && --depth === 0) { blocks.push(html.slice(start, re.lastIndex)); }
  }
  return blocks.length ? blocks : [html];
}

/** Index of the block after which the image goes (0 = before first block). */
export function imageSlot(position: string | undefined, blockCount: number): number {
  if (position === "top") return 0;
  if (position === "middle") return Math.ceil(blockCount / 2);
  const n = position?.match(/^after-(\d+)$/)?.[1];
  if (n) return Math.min(Number(n), blockCount);
  return blockCount;
}
