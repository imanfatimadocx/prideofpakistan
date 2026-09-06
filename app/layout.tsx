import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/app/components/admin/AuthProvider'

export const metadata: Metadata = {
  title: "Pride of Pakistan",
  description: "...",
  icons: {
    icon: "/icon-1.png",
    apple: "/icon-1.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}