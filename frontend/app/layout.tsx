import type { Metadata, Viewport } from 'next'
import { Share_Tech_Mono, Inter } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
})

export const metadata: Metadata = {
  title: 'NODE://7 - Access Terminal',
  description: 'Simulated darkweb agent terminal experience',
}

export const viewport: Viewport = {
  themeColor: '#0a0515',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_inter.variable} ${_shareTechMono.variable}`}>
      <body className="font-sans antialiased overflow-hidden">{children}</body>
    </html>
  )
}
