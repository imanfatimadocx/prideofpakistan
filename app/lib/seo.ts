import type { Metadata } from "next";
import { stripTags } from "@/app/lib/sanitize";

/** The site-wide share image (also set in the root layout). */
export const DEFAULT_SHARE_IMAGE = "/og-image-v2.png";

/** Turns stored image values ("abc.jpg", "uploads/abc.jpg", "/media/…", "https://…") into a usable URL. */
export function resolveImagePath(img: string | null | undefined): string | null {
  if (!img || img.trim() === "") return null;
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return img;
  if (img.startsWith("uploads/")) return `/${img}`;
  return `/uploads/${img}`;
}

/** Removes a trailing "| Pride of Pakistan" (older saved SEO titles include it). */
export function cleanTitle(t: string | null | undefined): string {
  return stripTags(t ?? "", 300)
    .replace(/\s*[|\-\u2013\u2014]\s*pride\s*of\s*pakistan\s*$/i, "")
    .replace(/\s*[|\-\u2013\u2014]\s*prideofpakistan(\.com)?\s*$/i, "")
    .trim();
}

/** Plain-text summary for search results and link previews (max ~160 characters). */
export function summary(...candidates: (string | null | undefined)[]): string | undefined {
  for (const c of candidates) {
    const text = stripTags(c ?? "", 2000).replace(/\s+/g, " ").trim();
    if (text) return text.length > 160 ? `${text.slice(0, 157).trimEnd()}…` : text;
  }
  return undefined;
}

/**
 * Metadata for a page: its own title (the root layout adds " | Pride of Pakistan"),
 * description, canonical address and link-preview card.
 */
export function pageMeta({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description?: string;
  path: string;
  image?: string | null;
}): Metadata {
  const images = [image || DEFAULT_SHARE_IMAGE];
  const name = cleanTitle(title) || "Pride of Pakistan";
  const fullTitle = `${name} | Pride of Pakistan`;
  return {
    title: name,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: "Pride of Pakistan",
      images,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
  };
}
