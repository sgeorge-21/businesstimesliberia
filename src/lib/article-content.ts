import sanitizeHtml from "sanitize-html";

export type StoryImage = { url: string; caption: string };

export function parseStoryImages(value: unknown): StoryImage[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is StoryImage =>
    !!item && typeof item === "object" && typeof item.url === "string" && /^https:\/\//.test(item.url) && typeof item.caption === "string"
  ).slice(0, 3);
}

export function safeArticleHtml(body: string) {
  return sanitizeHtml(body, {
    allowedTags: ["p", "br", "strong", "em", "mark", "span", "h2", "h3", "ul", "ol", "li", "blockquote", "s"],
    allowedAttributes: { span: ["style"] },
    transformTags: {
      span: (_tag, attrs) => {
        const size = attrs.style?.match(/(?:^|;)\s*font-size:\s*(14|18|22)px\s*(?:;|$)/i)?.[1];
        return { tagName: "span", attribs: size ? { style: `font-size: ${size}px` } : {} };
      },
    },
  });
}