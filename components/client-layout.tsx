'use client'

import { AppProvider } from '@/lib/app-context'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { VoiceAssistant } from '@/components/voice-assistant'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { usePathname } from 'next/navigation'

export function ClientLayout({ children, geistVars }: { children: React.ReactNode, geistVars: string }) {
  const pathname = usePathname()
  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AppProvider>
        {!pathname.startsWith('/admin') && <Navbar />}
        <main className="min-h-[calc(100vh-64px-320px)]">
          {children}
        </main>
        {!pathname.startsWith('/admin') && <Footer />}
      </AppProvider>
      <VoiceAssistant />
      <Toaster />
    </ThemeProvider>
  )
}
