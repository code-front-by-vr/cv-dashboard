import { Roboto } from 'next/font/google'

import type { Metadata } from 'next'
import './globals.css'

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
      </body>
    </html>
  )
}
