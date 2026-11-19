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

/**
 * Cleans stored HTML right before it is displayed on a public page.
 *
 * Used for every field shown with dangerouslySetInnerHTML (profiles,
 * businesses, products, forum posts, videos, legal pages), including
 * content submitted by visitors and content imported from the old site.
 * Keeps normal formatting, links, images, tables and YouTube embeds;
 * removes scripts, event handlers (onerror=, onclick=…), javascript: links,
 * forms, styles and any other way to run code in a visitor's browser.
 */
export function sanitizeForDisplay(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "div", "span", "h1", "h2", "h3", "h4", "h5", "h6",
      "strong", "b", "em", "i", "u", "s", "strike", "sub", "sup", "small",
      "ul", "ol", "li", "blockquote", "pre", "code", "hr", "a", "img",
      "figure", "figcaption", "table", "thead", "tbody", "tfoot", "tr", "th",
      "td", "caption", "iframe",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel", "title"],
      img: ["src", "alt", "title", "width", "height"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
      iframe: ["src", "width", "height", "allow", "allowfullscreen", "title"],
      "*": ["style"],
    },
    // Only harmless layout styles survive inside style="…"
    allowedStyles: {
      "*": {
        "text-align": [/^(left|right|center|justify)$/],
        "font-weight": [/^(normal|bold|[1-9]00)$/],
        "font-style": [/^(normal|italic)$/],
        "text-decoration": [/^(none|underline|line-through)$/],
      },
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    // Embedded videos only from YouTube
    allowedIframeHostnames: ["www.youtube.com", "youtube.com", "www.youtube-nocookie.com"],
    transformTags: {
      a: (tagName, attribs) => {
        const out: Record<string, string> = { href: attribs.href ?? "" };
        if (attribs.title) out.title = attribs.title;
        if (/^https?:\/\//i.test(out.href)) {
          out.target = "_blank";
          out.rel = "noopener noreferrer";
        }
        return { tagName, attribs: out };
      },
    },
  });
}

/** Removes every HTML tag, for plain-text fields typed by visitors. */
export function stripTags(value: unknown, max = 5000): string {
  if (typeof value !== "string") return "";
  const once = (v: string) =>
    sanitizeHtml(v, { allowedTags: [], allowedAttributes: {} })
      // sanitize-html escapes characters like & and <; turn them back into
      // plain characters ("Khan & Sons"). &amp; last so nothing decodes twice.
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&");
  // Repeat until nothing changes, so encoded tags (&lt;img…&gt;) that decode
  // into real tags are removed too.
  let text = value;
  for (let i = 0; i < 5; i++) {
    const next = once(text);
    if (next === text) break;
    text = next;
  }
  return text.trim().slice(0, max);
}
