"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { ADSENSE_CLIENT } from "@/app/lib/adsense";

// Pages where ads must never load: admin, member dashboard and sign-in screens.
// AdSense policy forbids ads on screens without publisher content, and clicks
// from the site's own staff count as invalid activity.
const NO_ADS_PREFIXES = ["/admin", "/dashboard", "/login", "/register"];

export function isAdFreePath(pathname: string | null): boolean {
  if (!pathname) return true;
  return NO_ADS_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

export default function AdSenseScript() {
  const pathname = usePathname();
  if (isAdFreePath(pathname)) {
    // If the visitor came from a public page, Auto ads may already be on the
    // page from that visit. Hide any of them while on an ad-free page.
    return (
      <style>{`ins.adsbygoogle, .google-auto-placed, .adsbygoogle-noablate,
        iframe[id^="aswift_"], div[id^="google_ads_iframe"] { display: none !important; }`}</style>
    );
  }

  return (
    <Script
      id="adsense"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
