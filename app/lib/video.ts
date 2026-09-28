// Shared helpers for YouTube / Vimeo links.
// Accepts a watch URL, share link, Shorts link, embed URL, a bare YouTube ID,
// or a full <iframe> embed code, and normalises it.

export interface ParsedVideo {
  provider: "youtube" | "vimeo";
  id: string;
  /** Privacy-friendly embed URL, safe to put in an <iframe src> */
  embedUrl: string;
  /** Canonical URL to store in the database */
  watchUrl: string;
  thumbnail: string | null;
}

const YT_ID = /^[a-zA-Z0-9_-]{11}$/;

export function parseVideoUrl(raw: string | null | undefined): ParsedVideo | null {
  if (!raw) return null;
  let input = raw.trim();
  if (!input) return null;

  // Pasted <iframe ... src="..."> embed code
  const src = input.match(/src=["']([^"']+)["']/i);
  if (src?.[1]) input = src[1];

  if (YT_ID.test(input)) return youtube(input);

  let url: URL;
  try {
    url = new URL(input.startsWith("http") ? input : `https://${input}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, "");

  if (host === "youtu.be") {
    const id = url.pathname.split("/")[1];
    return id && YT_ID.test(id) ? youtube(id) : null;
  }

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const v = url.searchParams.get("v");
    if (v && YT_ID.test(v)) return youtube(v);
    const m = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/);
    return m ? youtube(m[1]) : null;
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const m = url.pathname.match(/(?:^|\/)(\d{6,12})(?:\/|$)/);
    if (!m) return null;
    return {
      provider: "vimeo",
      id: m[1],
      embedUrl: `https://player.vimeo.com/video/${m[1]}?dnt=1`,
      watchUrl: `https://vimeo.com/${m[1]}`,
      thumbnail: null,
    };
  }

  return null;
}

function youtube(id: string): ParsedVideo {
  return {
    provider: "youtube",
    id,
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`,
    watchUrl: `https://www.youtube.com/watch?v=${id}`,
    thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
  };
}
