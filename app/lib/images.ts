/** Turns stored image values (Cloudinary URL, /path, or legacy filename) into a usable src. */
export function resolveImage(img: string | null | undefined): string | null {
  if (!img || img.trim() === "") return null;
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return img;
  if (img.startsWith("uploads/")) return `/${img}`;
  return `/uploads/${img}`;
}

/** Adds https:// to bare domains so external links work. */
export function externalUrl(url: string | null | undefined): string | null {
  if (!url || !url.trim()) return null;
  const u = url.trim();
  return /^https?:\/\//i.test(u) ? u : `https://${u}`;
}
