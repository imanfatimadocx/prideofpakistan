"use client";
import { useState } from "react";

interface Video {
  video_id: number;
  title: string;
  thumb_url: string;
  featured: string;
  views: number;
  video_embed_code: string;
  category: number;
}

function getEmbedSrc(embedCode: string): string {
  if (!embedCode) return "";
  const code = embedCode.trim();
  if (code.includes("youtube.com/embed/")) return code;
  const watchMatch = code.match(/youtube\.com\/watch\?v=([^&\s]+)/);
  if (watchMatch?.[1])
    return `https://www.youtube.com/embed/${watchMatch[1]}?rel=0`;
  const shortMatch = code.match(/youtu\.be\/([^?&\s]+)/);
  if (shortMatch?.[1])
    return `https://www.youtube.com/embed/${shortMatch[1]}?rel=0`;
  const srcMatch = code.match(/src=["']([^"']+)["']/);
  if (srcMatch?.[1]) return srcMatch[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(code))
    return `https://www.youtube.com/embed/${code}?rel=0`;
  return code;
}

function getThumbnail(embedCode: string, existingThumb: string): string {
  if (existingThumb) return existingThumb;
  const code = embedCode.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(code))
    return `https://img.youtube.com/vi/${code}/hqdefault.jpg`;
  const patterns = [
    /youtube\.com\/embed\/([^"?&/\s]+)/,
    /youtu\.be\/([^"?&/\s]+)/,
    /youtube\.com\/watch\?v=([^"?&/\s]+)/,
  ];
  for (const p of patterns) {
    const m = code.match(p);
    if (m?.[1]) return `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`;
  }
  return "";
}

export default function PrideTVPageClient({
  videos: allVideos,
  categories = [],
  initialCategory = null,
}: {
  videos: Video[];
  categories?: { id: number; name: string }[];
  initialCategory?: number | null;
}) {
  const [category, setCategory] = useState<number | null>(initialCategory);
  const videos =
    category === null
      ? allVideos
      : allVideos.filter((v) => v.category === category);

  const [activeId, setActiveId] = useState<number | null>(
    videos.find((v) => v.featured === "feature")?.video_id ??
      videos[0]?.video_id ??
      null,
  );

  const activeVideo = videos.find((v) => v.video_id === activeId) ?? videos[0];

  function chooseCategory(id: number | null) {
    setCategory(id);
    const list =
      id === null ? allVideos : allVideos.filter((v) => v.category === id);
    setActiveId(
      list.find((v) => v.featured === "feature")?.video_id ??
        list[0]?.video_id ??
        null,
    );
    const url = new URL(window.location.href);
    if (id === null) url.searchParams.delete("category");
    else url.searchParams.set("category", String(id));
    window.history.replaceState(null, "", url.toString());
  }

  if (allVideos.length === 0) {
    return (
      <div className="bg-cream">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-16">
          <div className="py-16 text-center bg-white border border-border rounded-2xl">
            <h2 className="mb-2 text-2xl font-bold text-green font-display">Coming Soon</h2>
            <p className="text-sm text-ink-mid font-body">
              Video content is being added. Check back soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream">
      {/* Active player */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pt-10 pb-6">

        {categories.length > 0 && (
          <div className="flex gap-2 pb-1 mb-6 -mx-1 overflow-x-auto">
            {[{ id: null as number | null, name: "All Videos" }, ...categories].map(
              (c) => (
                <button
                  key={c.id ?? "all"}
                  onClick={() => chooseCategory(c.id)}
                  className={`flex-shrink-0 mx-1 px-4 py-1.5 rounded-full text-xs font-semibold font-body transition-colors border ${
                    category === c.id
                      ? "bg-leaf text-white border-leaf"
                      : "bg-white text-green border-border hover:bg-mint"
                  }`}
                >
                  {c.name}
                </button>
              ),
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Main player */}
          <div>
            <div className="relative w-full overflow-hidden bg-black shadow-lg aspect-video rounded-xl">
              {activeVideo && (
                <iframe
                  key={activeId}
                  src={getEmbedSrc(activeVideo.video_embed_code)}
                  title={activeVideo.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
            {activeVideo && (
              <div className="mt-4">
                <h2 className="text-lg font-bold leading-snug text-green sm:text-xl font-display">
                  {activeVideo.title}
                </h2>
                {activeVideo.views > 0 && (
                  <p className="mt-1 text-xs text-ink-mid font-body">
                    {activeVideo.views.toLocaleString()} views
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Playlist sidebar */}
          <div className="overflow-hidden bg-white border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border bg-mint">
              <p className="text-xs font-bold tracking-wide uppercase text-green font-body">
                Up Next - {videos.length} videos
              </p>
            </div>
            <div className="overflow-y-auto max-h-[480px] divide-y divide-border">
              {videos.map((v) => (
                <button
                  key={v.video_id}
                  onClick={() => setActiveId(v.video_id)}
                  className={`w-full flex items-start gap-3 p-3 text-left transition-all ${
                    activeId === v.video_id
                      ? "bg-mint"
                      : "hover:bg-mint/60"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0 w-24 overflow-hidden rounded-lg h-14 bg-mint">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getThumbnail(v.video_embed_code, v.thumb_url)}
                      alt={v.title}
                      className="object-cover w-full h-full"
                    />
                    {activeId === v.video_id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-green/60">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-leaf">
                          <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[8px] border-t-transparent border-b-transparent border-l-white ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-semibold font-body leading-snug line-clamp-2 ${
                        activeId === v.video_id ? "text-green" : "text-ink-dark"
                      }`}
                    >
                      {v.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {v.featured === "feature" && (
                        <span className="text-[9px] font-bold text-leaf-dark font-body uppercase tracking-wide">
                          Featured
                        </span>
                      )}
                      {v.views > 0 && (
                        <span className="text-[10px] text-ink-mid font-body">
                          {v.views.toLocaleString()} views
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* All videos grid below */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pb-16">
        <div className="pt-10 mt-4 border-t border-border">
          <h2 className="mb-6 text-xl font-bold text-green font-display">
            {category === null
              ? "All Videos"
              : (categories.find((c) => c.id === category)?.name ?? "Videos")}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {videos.map((v) => (
              <button
                key={v.video_id}
                onClick={() => {
                  setActiveId(v.video_id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-left group"
              >
                <div className="relative w-full mb-2 overflow-hidden rounded-lg aspect-video bg-mint">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getThumbnail(v.video_embed_code, v.thumb_url)}
                    alt={v.title}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center transition-colors bg-black/0 group-hover:bg-black/30">
                    <div className="flex items-center justify-center w-10 h-10 transition-opacity rounded-full opacity-0 bg-white/90 group-hover:opacity-100">
                      <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-green ml-1" />
                    </div>
                  </div>
                  {activeId === v.video_id && (
                    <div className="absolute top-2 left-2 bg-sage text-green text-[9px] font-bold px-2 py-0.5 rounded font-body uppercase">
                      Playing
                    </div>
                  )}
                  {v.featured === "feature" && activeId !== v.video_id && (
                    <div className="absolute top-2 left-2 bg-green text-white text-[9px] font-bold px-2 py-0.5 rounded font-body uppercase">
                      Featured
                    </div>
                  )}
                </div>
                <p className="text-xs font-semibold leading-snug transition-colors text-ink-dark font-body line-clamp-2 group-hover:text-leaf-dark">
                  {v.title}
                </p>
                {v.views > 0 && (
                  <p className="text-[10px] text-ink-mid font-body mt-0.5">
                    {v.views.toLocaleString()} views
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
