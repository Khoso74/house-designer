import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI House Designer - Create Your Dream Home',
  description: 'Design your perfect house with AI-powered 3D visualization. Generate custom house layouts with modern or traditional styles.',
  keywords: 'house design, 3D visualization, AI design, architecture, home planning',
  authors: [{ name: 'AI House Designer' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}


