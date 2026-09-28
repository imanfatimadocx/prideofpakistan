import sanitizeHtml from "sanitize-html";

/**
 * Cleans HTML coming from the admin rich-text editor before it is stored.
 * Only formatting tags survive; scripts, styles, event handlers and
 * javascript: links are stripped.
 */
export function sanitizeRichHtml(html: string): string {
  return sanitizeHtml(html ?? "", {
    allowedTags: [
      "p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s",
      "ul", "ol", "li", "blockquote", "a", "hr",
    ],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const out: Record<string, string> = { href };
        if (/^https?:\/\//i.test(href)) {
          out.target = "_blank";
          out.rel = "noopener noreferrer";
        }
        return { tagName, attribs: out };
      },
    },
  }).trim();
}

/** Normalises a plain-text field (React escapes it when rendering). */
export function plainText(value: unknown, max = 2000): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}
