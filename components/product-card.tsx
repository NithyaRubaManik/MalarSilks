'use client'

import Link from 'next/link'
import { Heart, ShoppingCart, Star, CheckCircle2, Eye } from 'lucide-react'
import { Product, useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'
import { CONFIG } from '@/lib/config'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp()
  const [isAdded, setIsAdded] = useState(false)
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    addToCart(product, 1)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(192,57,43,0.15)] border border-gray-100 hover:border-red-100">
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={CONFIG.IMAGES.getSecureImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Quick action buttons — always visible on hover */}
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
          <button
            suppressHydrationWarning
            onClick={handleWishlist}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-xl transition-all duration-300",
              inWishlist
                ? "bg-red-500 text-white"
                : "bg-white/95 text-gray-800 hover:bg-red-500 hover:text-white"
            )}
            aria-label="Toggle wishlist"
          >
            <Heart className={cn("w-4 h-4", inWishlist && "fill-current")} />
            {inWishlist ? 'Saved' : 'Save'}
          </button>

          <Link
            href={`/product/${product.id}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/95 hover:bg-white text-gray-800 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-xl transition-all duration-300"
          >
            <Eye className="w-4 h-4" />
            View
          </Link>
        </div>

        {/* Stock badge */}
        {!product.inStock && (
          <div className="absolute top-3 left-3 bg-gray-900/90 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
            Sold Out
          </div>
        )}

        {/* Rating pill – top right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-[11px] font-black text-gray-700">{(product.rating || 5.0).toFixed(1)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category Tag */}
        <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full mb-3">
          {product.category}
        </span>

        <Link href={`/product/${product.id}`}>
          <h3 className="font-serif text-lg font-bold text-gray-900 line-clamp-2 hover:text-red-700 transition-colors leading-snug mb-4">
            {product.name}
          </h3>
        </Link>

        {/* Price and CTA */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-2xl font-serif font-black text-red-700">
              ₹{(product.price ?? 0).toLocaleString()}
            </p>
          </div>

          <button
            suppressHydrationWarning
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdded}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95",
              isAdded
                ? "bg-emerald-500 text-white shadow-emerald-400/30"
                : product.inStock
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-500/30 hover:from-red-500 hover:to-red-600 hover:shadow-red-500/40 hover:-translate-y-0.5"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
            )}
            aria-label="Add to cart"
          >
            {isAdded ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
            {isAdded ? 'Added!' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}
