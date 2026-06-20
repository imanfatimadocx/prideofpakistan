import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pride of Pakistan — Celebrating Our Nation',
  description: 'Celebrating the people, places, businesses, and culture that make Pakistan extraordinary.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}