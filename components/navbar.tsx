'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Heart, Search, Menu, X, User, LogOut, Package, Gem } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { cart, wishlist, user, isLoggedIn, logout } = useApp()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/outfit-advisor', label: '🤖 AI Advisor', highlight: true },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.10)] border-b border-gray-100"
          : "bg-white/95 backdrop-blur-lg border-b border-gray-100"
      )}
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 transition-all duration-300 group-hover:-rotate-6">
              <Gem className="w-5 h-5 text-white" />
            </div>
            <div className="leading-none">
              <span className="block text-xl font-black text-gray-900 tracking-tight group-hover:text-red-700 transition-colors">
                MALAR
              </span>
              <span className="block text-[9px] font-black uppercase tracking-[0.35em] text-amber-600">
                Silks
              </span>
            </div>
          </Link>

          {/* Nav Links — Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, highlight }: any) => (
              highlight ? (
                <Link
                  key={href}
                  href={href}
                  className="relative px-4 py-2 text-sm font-black text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 hover:border-amber-400 transition-all duration-200"
                >
                  {label}
                </Link>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className="relative px-4 py-2 text-sm font-bold text-gray-700 hover:text-red-700 rounded-xl hover:bg-red-50 transition-all duration-200 group"
                >
                  {label}
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                </Link>
              )
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search form — desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center">
              <div className="relative flex items-center">
                <input
                  suppressHydrationWarning
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search silks..."
                  className="w-44 pl-4 pr-10 py-2 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white focus:w-56 transition-all duration-300"
                />
                <button suppressHydrationWarning type="submit" className="absolute right-2 text-gray-400 hover:text-red-600 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-200"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-black text-sm shadow-lg shadow-red-500/30 hover:from-red-500 hover:to-red-600 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all duration-300"
              aria-label="Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline uppercase tracking-wider text-xs">Cart</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 bg-white text-red-700 text-[10px] font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              {isLoggedIn ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-black shadow-md">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-500 text-gray-700 hover:text-red-700 font-bold text-sm transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}

              {/* User dropdown */}
              {isUserMenuOpen && isLoggedIn && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50">
                  <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-amber-50 border-b border-gray-100">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">Welcome back</p>
                    <p className="font-bold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-xl text-sm font-semibold text-gray-700 hover:text-red-700 transition-colors"
                    >
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-xl text-sm font-semibold text-gray-700 hover:text-red-700 transition-colors"
                    >
                      <Package className="w-4 h-4" /> My Orders
                    </Link>
                    <button
                      onClick={() => { logout(); setIsUserMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-xl text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  suppressHydrationWarning
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search silks..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 text-sm"
                />
                <button suppressHydrationWarning type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-3 text-sm font-bold text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                {label}
              </Link>
            ))}

            {!isLoggedIn && (
              <div className="pt-4 flex gap-3">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 py-3 text-center bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-black text-sm shadow-lg"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 py-3 text-center border-2 border-red-600 text-red-700 rounded-xl font-black text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
