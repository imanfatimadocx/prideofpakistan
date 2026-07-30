'use client'
import { useState } from 'react'
import Link from 'next/link'

export interface VideoCard {
  video_id: number
  title: string
  thumb_url: string
  featured: string
  views: number
  video_embed_code: string
  category?: number
}

interface Props {
  videos: VideoCard[]
  comingSoon?: boolean
}

function getEmbedSrc(embedCode: string): string {
  if (!embedCode) return ''

  const code = embedCode.trim()

  // Already a full embed URL
  if (code.includes('youtube.com/embed/')) return code

  // Full watch URL
  const watchMatch = code.match(/youtube\.com\/watch\?v=([^&\s]+)/)
  if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}?rel=0`

  // youtu.be short URL
  const shortMatch = code.match(/youtu\.be\/([^?&\s]+)/)
  if (shortMatch?.[1]) return `https://www.youtube.com/embed/${shortMatch[1]}?rel=0`

  // Extract src from full iframe HTML
  const srcMatch = code.match(/src=["']([^"']+)["']/)
  if (srcMatch?.[1]) return srcMatch[1]

  // Plain 11-char YouTube video ID (what your DB contains)
  if (/^[a-zA-Z0-9_-]{11}$/.test(code)) {
    return `https://www.youtube.com/embed/${code}?rel=0`
  }

  return code
}

function getThumbnail(embedCode: string, existingThumb: string): string {
  if (existingThumb) return existingThumb

  const code = embedCode.trim()

  // Plain ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(code)) {
    return `https://img.youtube.com/vi/${code}/hqdefault.jpg`
  }

  const patterns = [
    /youtube\.com\/embed\/([^"?&/\s]+)/,
    /youtu\.be\/([^"?&/\s]+)/,
    /youtube\.com\/watch\?v=([^"?&/\s]+)/,
  ]
  for (const p of patterns) {
    const m = code.match(p)
    if (m?.[1]) return `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`
  }

  return ''
}

export default function PrideTVSection({ videos, comingSoon }: Props) {
  const [activeId, setActiveId] = useState<number | null>(
    videos.find((v) => v.featured === 'feature')?.video_id ?? videos[0]?.video_id ?? null
  )

  const activeVideo = videos.find((v) => v.video_id === activeId) ?? videos[0]

  if (comingSoon || videos.length === 0) {
    return (
      <section className="py-12 bg-green sm:py-16 lg:py-20" id="pride-tv">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 text-center">
          <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold-light mb-3 font-body">Pride TV</p>
          <h2 className="mb-4 text-2xl font-bold text-white font-display sm:text-3xl">Coming Soon</h2>
          <p className="text-sm text-white/60 font-body">Video content is being added. Check back soon.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-green sm:py-16 lg:py-20" id="pride-tv">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold-light mb-2 font-body">Pride TV</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[38px] font-bold text-white leading-tight">
              Watch Pakistan
            </h2>
            <div className="w-12 h-[3px] bg-gold mt-3 rounded" />
          </div>
          <Link
            href="/pride-tv"
            className="text-[13px] font-semibold text-gold-light no-underline hover:underline font-body whitespace-nowrap"
          >
            All Videos
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

          {/* Main player */}
          <div>
            <div className="relative w-full overflow-hidden bg-black aspect-video rounded-xl">
              <iframe
                key={activeId}
                src={getEmbedSrc(activeVideo?.video_embed_code ?? '')}
                title={activeVideo?.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            {activeVideo && (
              <div className="mt-3">
                <h3 className="text-base font-bold leading-snug text-white font-display sm:text-lg">
                  {activeVideo.title}
                </h3>
                {activeVideo.views > 0 && (
                  <p className="mt-1 text-xs text-white/40 font-body">
                    {activeVideo.views.toLocaleString()} views
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Playlist */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {videos.map((v) => (
              <button
                key={v.video_id}
                onClick={() => setActiveId(v.video_id)}
                className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-all ${
                  activeId === v.video_id
                    ? 'bg-white/15 border border-white/20'
                    : 'hover:bg-white/[.08] border border-transparent'
                }`}
              >
                {/* Thumb */}
                <div className="relative flex-shrink-0 w-24 overflow-hidden rounded-md h-14 bg-white/10">
                  {(v.thumb_url || v.video_embed_code) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getThumbnail(v.video_embed_code, v.thumb_url)}
                      alt={v.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10" />
                  )}
                  {activeId === v.video_id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green/60">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gold">
                        <div className="w-0 h-0 border-t-[4px] border-b-[4px] border-l-[7px] border-t-transparent border-b-transparent border-l-white ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold font-body leading-snug line-clamp-2 ${
                    activeId === v.video_id ? 'text-white' : 'text-white/65'
                  }`}>
                    {v.title}
                  </p>
                  {v.featured === 'feature' && (
                    <span className="text-[9px] font-bold text-gold font-body uppercase tracking-wide mt-1 block">
                      Featured
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}