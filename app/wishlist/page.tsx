'use client'

import Link from 'next/link'
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { ProductCard } from '@/components/product-card'

export default function WishlistPage() {
  const { wishlist } = useApp()

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heart className="w-16 h-16 mx-auto text-muted mb-4" />
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              Your wishlist is empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Save your favorite items to your wishlist and come back to them later
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
            My Wishlist
          </h1>
          <p className="text-muted-foreground">
            {wishlist.length} item{wishlist.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="text-center pt-12 border-t border-gray-200">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
