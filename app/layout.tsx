import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ClientLayout } from '@/components/client-layout'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: '--font-sans' });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Malar Silks - Premium Textiles & Traditional Attires',
  description: 'Discover traditional and modern silk attires for women, men, girls and boys. Premium quality textiles and clothing at Malar Silks.',
}

export const viewport: Viewport = {
  themeColor: '#a87e49',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning={true}>
      <body className="font-sans antialiased bg-background text-foreground">
        <ClientLayout geistVars={`${geist.variable} ${geistMono.variable}`}>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
