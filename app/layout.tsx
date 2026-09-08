import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/app/components/admin/AuthProvider";
import EventBanners from "@/app/components/shared/EventBanners";

export const metadata: Metadata = {
  title: "Pride of Pakistan",
  description: "Showcasing the best of Pakistan to the world.",
  icons: {
    icon: "/icon-1.png",
    apple: "/icon-1.png",
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
        <AuthProvider>
          <EventBanners />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
