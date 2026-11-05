import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/app/components/admin/AuthProvider";
import EventBanners from "@/app/components/shared/EventBanners";
import AdSenseScript from "@/app/components/shared/AdSenseScript";
import { ADSENSE_CLIENT } from "@/app/lib/adsense";

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
