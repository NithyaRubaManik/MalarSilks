'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle2, Package, ArrowRight, Home, ShoppingBag } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function OrderConfirmationPage() {
  useEffect(() => {
    // Celebration confetti!
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-2xl shadow-primary/10 border border-gray-100 text-center relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -mr-32 -mb-32 blur-3xl" />

          {/* Icon */}
          <div className="relative mb-12 flex justify-center">
            <div className="w-32 h-32 rounded-full bg-green-50 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-4 border-green-100 border-dashed animate-[spin_10s_linear_infinite]" />
              <CheckCircle2 className="w-16 h-16 text-green-500 relative z-10" />
            </div>
          </div>

          {/* Text Content */}
          <div className="relative z-10 space-y-4 mb-12">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground tracking-tight">
              Order Confirmed
            </h1>
            <p className="text-xl text-muted-foreground font-medium">
              Thank you for choosing Malar Silks. Your luxury attire is being prepared.
            </p>
          </div>

          {/* Order Info */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div className="bg-gray-50 rounded-3xl p-6 text-left border border-gray-100 transition-hover duration-300 hover:shadow-md">
              <Package className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-foreground mb-1">Status</h3>
              <p className="text-sm text-muted-foreground">Processing with care</p>
            </div>
            <div className="bg-gray-50 rounded-3xl p-6 text-left border border-gray-100 transition-hover duration-300 hover:shadow-md">
              <ShoppingBag className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-foreground mb-1">Delivery</h3>
              <p className="text-sm text-muted-foreground">Estimated 3-5 business days</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/profile"
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-bold text-lg hover:from-red-700 hover:to-red-800 shadow-xl shadow-red-500/20 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Track Order
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/"
              className="px-8 py-4 bg-white text-foreground border-2 border-gray-100 rounded-2xl font-bold text-lg hover:border-primary/20 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
          
          <p className="mt-12 text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-40">
            A confirmation email has been sent to your registered address.
          </p>
        </div>
      </div>
    </div>
  )
}
