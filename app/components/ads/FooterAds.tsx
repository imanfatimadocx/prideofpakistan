"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { SlotPayload } from "@/app/lib/ads";
import { isAdFreePath } from "@/app/components/shared/AdSenseScript";
import AdView from "./AdView";

/**
 * The two ad spaces above the footer (sponsor showcase + banner).
 * Loaded in the browser because the footer is also used inside client pages.
 */
export default function FooterAds() {
  const pathname = usePathname();
  const [data, setData] = useState<{ showcase: SlotPayload; banner: SlotPayload } | null>(null);
  const adFree = isAdFreePath(pathname);

  useEffect(() => {
    if (adFree) return;
    let cancelled = false;
    fetch("/api/ads/slot?slots=footer_showcase,footer_banner", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!cancelled && json) setData({ showcase: json.footer_showcase, banner: json.footer_banner });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pathname, adFree]);

  if (adFree || !data) return null;
  const hasShowcase = data.showcase?.show !== "none";
  const hasBanner = data.banner?.show !== "none";
  if (!hasShowcase && !hasBanner) return null;

  return (
    <div className="border-t bg-mint border-sage/60">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-12 space-y-10">
        {hasShowcase && <AdView payload={data.showcase} kind="showcase" />}
        {hasBanner && <AdView payload={data.banner} kind="banner" />}
      </div>
    </div>
  );
}
