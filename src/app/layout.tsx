import './globals.css'

import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CV Dashboard',
  description: 'CV Dashboard',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${roboto.className} antialiased`}>
        <main>{children}</main>
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  )
}
