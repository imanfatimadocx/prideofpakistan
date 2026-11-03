import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/app/components/admin/AuthProvider";
import EventBanners from "@/app/components/shared/EventBanners";

// Google AdSense publisher ID (also in public/ads.txt)
const ADSENSE_CLIENT = "ca-pub-9598615284449312";

export const metadata: Metadata = {
  title: "Pride of Pakistan",
  description: "Showcasing the best of Pakistan to the world.",
  icons: {
    icon: "/icon-1.png",
    apple: "/icon-1.png",
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
      <head>
        {/* Google AdSense. A plain <script> (not next/script) because AdSense
            rejects the extra data-nscript attribute next/script adds. */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <AuthProvider>
          <EventBanners />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
