'use client'

import { Suspense, useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Filter, X, Search, Sparkles, ChevronDown } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { cn } from '@/lib/utils'
import { PRODUCTS, CATEGORIES } from '@/lib/products'
import type { Product } from '@/lib/app-context'
import { CONFIG } from '@/lib/config'

function ShopContent() {
  const searchParams = useSearchParams()
  const [dbProducts, setDbProducts] = useState<Product[]>([])
  const categoryParam = searchParams?.get('category') ?? null
  const searchParam = searchParams?.get('search') ?? null

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000])
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating'>('newest')
  const [showFilters, setShowFilters] = useState(false)

  const fetchDbProducts = async () => {
    try {
      const res = await fetch(CONFIG.API.ENDPOINTS.PRODUCTS)
      const data = await res.json()
      if (data.success) {
        const mapped = data.data.map((p: any) => ({ ...p, id: p._id || p.id }))
        setDbProducts(mapped)
      }
    } catch (error) {
      console.error('Error fetching db products:', error)
    }
  }

  useEffect(() => {
    fetchDbProducts()
    if (categoryParam) setSelectedCategory(categoryParam)
    if (searchParam) setSearchQuery(searchParam)
  }, [categoryParam, searchParam])

  const allProducts = useMemo(() => [...PRODUCTS, ...dbProducts], [dbProducts])

  const filteredProducts = useMemo(() => {
    let filtered = allProducts
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }
    if (selectedCategory) filtered = filtered.filter(p => p.category === selectedCategory)
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    let sorted = [...filtered]
    switch (sortBy) {
      case 'price-low': sorted.sort((a, b) => a.price - b.price); break
      case 'price-high': sorted.sort((a, b) => b.price - a.price); break
      case 'rating': sorted.sort((a, b) => b.rating - a.rating); break
    }
    return sorted
  }, [allProducts, selectedCategory, searchQuery, priceRange, sortBy])

  const priceMin = 0
  const priceMax = allProducts.length > 0 ? Math.max(...allProducts.map(p => p.price)) : 50000

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50/30 to-amber-50/20 pt-20 pb-20">

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-800 via-red-700 to-red-900 mb-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-300 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <span className="inline-flex items-center gap-2 text-amber-400 text-[11px] font-black uppercase tracking-[0.4em] mb-4">
            <Sparkles className="w-3 h-3" /> The Malar Collection
          </span>
          <h1 className="text-5xl md:text-6xl font-serif font-black text-white mb-4">
            Our <span className="text-amber-400">Shop</span>
          </h1>
          <p className="text-red-200 text-lg font-medium max-w-xl">
            {filteredProducts.length} premium artifacts curated for the discerning collector
          </p>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40L1440 40L1440 20C1200 0 960 40 720 20C480 0 240 40 0 20V40Z" fill="#fef7ee"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* SEARCH & SORT BAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
            <input
              type="text"
              placeholder="Search for silk sarees, kurtas..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 hover:border-red-300 focus:border-red-500 rounded-2xl text-sm font-medium focus:outline-none shadow-sm focus:shadow-red-100 transition-all duration-300"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="appearance-none w-full md:w-52 pl-4 pr-10 py-4 bg-white border-2 border-gray-200 hover:border-red-300 focus:border-red-500 rounded-2xl text-sm font-bold focus:outline-none cursor-pointer shadow-sm transition-all duration-300"
            >
              <option value="newest">🆕 Newest First</option>
              <option value="price-low">💰 Price: Low to High</option>
              <option value="price-high">💎 Price: High to Low</option>
              <option value="rating">⭐ Top Rated</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-red-500/30"
          >
            <Filter className="w-4 h-4" />
            Filters {showFilters ? '▲' : '▼'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* ─── SIDEBAR FILTERS ─── */}
          <aside className={cn(
            "md:col-span-1 transition-all duration-500",
            showFilters ? "block" : "hidden md:block"
          )}>
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/80 border border-gray-100 sticky top-28 overflow-hidden">
              {/* Filter Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-white/80" />
                  <h2 className="font-black text-white uppercase tracking-wider text-sm">Filters</h2>
                </div>
                <button
                  onClick={() => { setSelectedCategory(null); setPriceRange([priceMin, priceMax]); setSortBy('newest'); setSearchQuery('') }}
                  className="text-red-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Reset All
                </button>
              </div>

              <div className="p-6 space-y-8">

                {/* Category Filter */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.25em] text-gray-500 mb-4">Category</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                        selectedCategory === null
                          ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/20"
                          : "bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200"
                      )}
                    >
                      All Products
                      <span className={cn(
                        "text-xs font-black px-2 py-0.5 rounded-full",
                        selectedCategory === null ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                      )}>
                        {allProducts.length}
                      </span>
                    </button>
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                          selectedCategory === cat.id
                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/20"
                            : "bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200"
                        )}
                      >
                        {cat.name}
                        <span className={cn(
                          "text-xs font-black px-2 py-0.5 rounded-full",
                          selectedCategory === cat.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                        )}>
                          {allProducts.filter(p => p.category === cat.id).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-gray-200" />

                {/* Price Filter */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.25em] text-gray-500 mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-xl text-sm font-black text-red-700">
                        ₹{priceRange[0].toLocaleString()}
                      </span>
                      <span className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-xl text-sm font-black text-red-700">
                        ₹{priceRange[1].toLocaleString()}
                      </span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full">
                      <div
                        className="absolute h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                        style={{
                          left: `${(priceRange[0] / priceMax) * 100}%`,
                          right: `${100 - (priceRange[1] / priceMax) * 100}%`
                        }}
                      />
                    </div>
                    <input
                      type="range"
                      min={priceMin}
                      max={priceMax}
                      value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                      className="w-full accent-red-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ─── PRODUCT GRID ─── */}
          <div className="md:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, i) => (
                  <div
                    key={product.id}
                    style={{ animationDelay: `${i * 60}ms` }}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-red-300" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-800 mb-3">No products found</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                  Try adjusting your search or filters to discover our collection.
                </p>
                <button
                  onClick={() => { setSelectedCategory(null); setSearchQuery(''); setPriceRange([0, priceMax]) }}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-black rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all hover:-translate-y-0.5"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50/30 to-amber-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto" />
          <p className="text-red-700 font-black uppercase tracking-widest text-xs">Loading Collection...</p>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}
