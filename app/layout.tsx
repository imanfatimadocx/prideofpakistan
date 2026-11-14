import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/app/components/admin/AuthProvider";
import EventBanners from "@/app/components/shared/EventBanners";
import AdSenseScript from "@/app/components/shared/AdSenseScript";
import { ADSENSE_CLIENT } from "@/app/lib/adsense";

export const metadata: Metadata = {
  metadataBase: new URL("https://prideofpakistan.com"),
  // Each page sets its own title; this adds " | Pride of Pakistan" after it.
  title: { default: "Pride of Pakistan", template: "%s | Pride of Pakistan" },
  description: "Showcasing the best of Pakistan to the world.",
  icons: {
    icon: "/icon-1.png",
    apple: "/icon-1.png",
  },
  // Link previews on Facebook, WhatsApp, LinkedIn and X
  openGraph: {
    title: "Pride of Pakistan",
    description: "Showcasing the best of Pakistan to the world.",
    url: "https://prideofpakistan.com",
    siteName: "Pride of Pakistan",
    images: [{ url: "/og-image-v2.png", width: 1200, height: 630, alt: "Pride of Pakistan" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image-v2.png"],
  },
  other: {
    "google-adsense-account": ADSENSE_CLIENT,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* AdSense loads on public pages only (not admin / dashboard / sign-in) */}
        <AdSenseScript />
        <AuthProvider>
          <EventBanners />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
