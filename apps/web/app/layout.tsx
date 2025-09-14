import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mortgage Rate Negotiator',
  description: 'AI-powered mortgage rate negotiation platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
