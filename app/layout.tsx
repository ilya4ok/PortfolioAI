import type { Metadata } from 'next'
import { Geist, Geist_Mono, Syne } from 'next/font/google'
import './globals.css'
import PageTransition from '@/components/PageTransition'
import { LangProvider } from '@/components/LangProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://myaiway.com'),
  title: 'MyAIWay — AI Automation for Your Business',
  description:
    'I help small and medium businesses save time and cut costs with AI automation. No code — just working solutions in under a week.',
  keywords: ['AI automation', 'no-code', 'business automation', 'AI consultant'],
  openGraph: {
    title: 'MyAIWay — AI Automation for Your Business',
    description:
      'I help small and medium businesses save time and cut costs with AI automation.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <LangProvider>
          <PageTransition>{children}</PageTransition>
        </LangProvider>
      </body>
    </html>
  )
}
