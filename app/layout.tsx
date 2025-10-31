import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TraeChat - AI对话助手',
  description: '基于Next.js 15和AI模型的智能对话助手',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-gray-50 text-gray-900">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}