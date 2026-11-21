"use client";

import { useEffect, useRef } from "react";
import type { PublicAd, SlotPayload } from "@/app/lib/ads";

/** Counts a view once, when at least half of the ad has been on screen. */
function useViewBeacon(adIds: number[]) {
  const ref = useRef<HTMLDivElement>(null);
  const key = adIds.join(",");
  useEffect(() => {
    const el = ref.current;
    if (!el || !key) return;
    let sent = false;
    const send = () => {
      if (sent) return;
      sent = true;
      const body = JSON.stringify({ ids: key.split(",").map(Number) });
      if (navigator.sendBeacon) navigator.sendBeacon("/api/ads/view", body);
      else fetch("/api/ads/view", { method: "POST", body, keepalive: true }).catch(() => {});
    };
    if (!("IntersectionObserver" in window)) {
      send();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          send();
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [key]);
  return ref;
}

function Label({ text }: { text: string }) {
  return (
    <p className="mb-1.5 text-[10px] font-semibold tracking-[.14em] uppercase text-ink-muted font-body">{text}</p>
  );
}

function AdLink({ ad, className, children }: { ad: PublicAd; className?: string; children: React.ReactNode }) {
  if (!ad.hasLink) return <div className={className}>{children}</div>;
  return (
    <a
      href={`/api/ads/click/${ad.id}`}
      target="_blank"
      rel="sponsored noopener"
      title={`Visit ${ad.advertiser}`}
      className={`block no-underline ${className ?? ""}`}
    >
      {children}
    </a>
  );
}

function Banner({ ad, label }: { ad: PublicAd; label: string }) {
  const ref = useViewBeacon([ad.id]);
  const desktop = ad.desktop || ad.square || "";
  return (
    <div ref={ref}>
      <Label text={label} />
      <AdLink ad={ad} className="overflow-hidden border rounded-xl border-border bg-white">
        <picture>
          {ad.mobile && <source media="(max-width: 640px)" srcSet={ad.mobile} />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={desktop} alt={ad.alt} loading="lazy" className="block w-full h-auto" />
        </picture>
      </AdLink>
    </div>
  );
}

function Showcase({ ads, label }: { ads: PublicAd[]; label: string }) {
  const ref = useViewBeacon(ads.map((a) => a.id));
  return (
    <div ref={ref}>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-[11px] font-bold tracking-[.16em] uppercase text-slate mb-2 font-body">{label}</p>
          <h2 className="text-2xl font-bold font-display sm:text-3xl text-green">Our Partners</h2>
        </div>
        <a href="/advertise" className="text-sm font-semibold no-underline text-leaf-dark font-body hover:underline">
          Advertise with us →
        </a>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-6">
        {ads.map((ad) => (
          <AdLink key={ad.id} ad={ad} className="group">
            <div className="w-full overflow-hidden bg-white rounded-lg" style={{ aspectRatio: "1/1" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ad.square || ad.desktop}
                alt={ad.alt}
                loading="lazy"
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="mt-2 text-[11px] sm:text-xs font-bold leading-snug text-ink-dark font-display group-hover:text-green line-clamp-2">
              {ad.advertiser}
            </p>
          </AdLink>
        ))}
      </div>
    </div>
  );
}

/**
 * Renders one sponsor ad space from a payload decided on the server (or fetched for the footer).
 * Renders nothing when the space is empty, so there are no blank gaps.
 */
export default function AdView({
  payload,
  kind,
  className = "",
}: {
  payload: SlotPayload;
  kind: "banner" | "showcase";
  className?: string;
}) {
  if (payload.show === "none" || !payload.ads.length) return null;
  return (
    <div className={className}>
      {kind === "showcase" ? (
        <Showcase ads={payload.ads} label={payload.label} />
      ) : (
        <Banner ad={payload.ads[0]} label={payload.label} />
      )}
    </div>
  );
}
