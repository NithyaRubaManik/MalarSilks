'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Heart, ShoppingCart, Star, ChevronLeft, Loader2, ArrowRight } from 'lucide-react'
import { getProductById, PRODUCTS } from '@/lib/products'
import { useApp, Product } from '@/lib/app-context'
import { ProductCard } from '@/components/product-card'
import { cn } from '@/lib/utils'
import { CONFIG } from '@/lib/config'

export default function ProductPage() {
  const params = useParams()
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)



  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      const staticProd = getProductById(params.id as string)
      if (staticProd) {
        setProduct(staticProd)
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${CONFIG.API.BASE_URL}/api/products/${params.id}`)
        const data = await res.json()
        if (data.success) {
          setProduct({
            ...data.data,
            id: data.data.id || data.data._id,
            inStock: data.data.inStock ?? data.data.in_stock ?? true
          })
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 rounded-full border-4 border-gray-100 border-t-primary animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Requesting Private View...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
           <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <span className="text-4xl text-gray-200">?</span>
           </div>
           <div className="space-y-4">
              <h1 className="text-4xl font-serif font-bold text-foreground">Artifact Not Found</h1>
              <p className="text-muted-foreground italic font-medium">This piece appears to have moved to our private vault.</p>
           </div>
           <Link href="/shop" className="inline-block px-12 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-bold tracking-widest uppercase text-xs shadow-xl shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-1 transition-all">
             Return to Boutique
           </Link>
        </div>
      </div>
    )
  }

  const inWishlist = isInWishlist(product.id)
  const relatedProducts = PRODUCTS.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4)

  const handleAddToCart = () => {
    addToCart(product, quantity)
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
    <div className="min-h-screen bg-[#FAF9F7] pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-20 animate-in fade-in slide-in-from-left-4 duration-1000">
           <Link
             href="/shop"
             className="group inline-flex items-center gap-4 py-2"
           >
             <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                <ChevronLeft className="w-4 h-4 group-hover:text-white transition-colors" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-foreground transition-colors">Return to Collection</span>
           </Link>
        </div>

        {/* Product Masterpiece Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-32 items-center">
          
          {/* Immersive Image Display */}
          <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left-12 duration-1000">
            <div className="group relative aspect-4/5 md:aspect-square lg:aspect-4/5 bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-black/[0.05] ring-1 ring-black/[0.02]">
              <img
                src={CONFIG.IMAGES.getSecureImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
              />
              <div className="absolute inset-x-8 bottom-8 flex justify-between items-center z-10">
                 <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-gray-100 flex items-center gap-2 shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Available for private booking</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Curated Details */}
          <div className="lg:col-span-5 space-y-12 animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-0.5 bg-primary/20" />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">The Artisan&apos;s Reserve</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-[1.1]">
                   {product.name}
                </h1>
                
                {/* Rating Display */}
                <div className="flex items-center gap-6 py-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || 5)
                            ? 'fill-primary text-primary'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="w-px h-4 bg-gray-200" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Curation Rating {(product.rating || 5.0).toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                 <p className="text-sm font-medium text-muted-foreground italic leading-relaxed">
                   Reserved exclusively for the discerning collector. This particular weave represents a milestone in traditional textile artistry, combining heritage silk with contemporary grace.
                 </p>
                 <div className="pt-6 border-t border-gray-100">
                    <p className="text-3xl font-serif font-bold text-primary italic">₹{product.price.toLocaleString()}</p>
                 </div>
              </div>

              {/* Advanced Controls */}
              <div className="space-y-10 pt-10">
                 <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="space-y-3 flex-1 w-full sm:w-auto">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Artifact Quantity</span>
                       <div className="flex items-center justify-between bg-white border border-gray-100 p-2 rounded-2xl shadow-xl shadow-black/[0.02]">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 hover:text-primary rounded-xl transition-all"
                          >
                            −
                          </button>
                          <span className="text-lg font-serif font-bold italic">{quantity}</span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 hover:text-primary rounded-xl transition-all"
                          >
                            +
                          </button>
                       </div>
                    </div>
                    
                    <button
                      onClick={handleWishlist}
                      className={cn(
                        "w-16 h-[4.5rem] rounded-2xl flex items-center justify-center transition-all duration-500 ring-1",
                        inWishlist 
                          ? "bg-red-50 ring-red-100 text-red-500 shadow-xl shadow-red-500/10"
                          : "bg-white ring-gray-100 text-muted-foreground hover:ring-primary/20 hover:text-primary shadow-xl shadow-black/[0.02]"
                      )}
                    >
                      <Heart className={cn("w-6 h-6 transition-transform duration-500", inWishlist ? "fill-current scale-110" : "scale-100")} />
                    </button>
                 </div>

                 <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={cn(
                      "group w-full relative overflow-hidden py-8 rounded-[2rem] font-bold text-sm tracking-[0.3em] uppercase transition-all duration-700",
                      !product.inStock 
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : isAdded
                          ? "bg-green-600 text-white shadow-2xl shadow-green-500/20"
                          : "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1 active:translate-y-0"
                    )}
                 >
                    <div className="relative z-10 flex items-center justify-center gap-4">
                       {isAdded ? (
                          <>Successfully Reserved</>
                       ) : (
                          <><ShoppingCart className="w-5 h-5 opacity-60" /> Add to Collection</>
                       )}
                    </div>
                    {!isAdded && product.inStock && (
                       <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                    )}
                 </button>
              </div>
            </div>

            {/* Delivery Insights */}
            <div className="grid grid-cols-2 gap-8 pt-12 border-t border-gray-100">
               <div className="space-y-2">
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Standard Handover</span>
                  <p className="text-[10px] font-bold">4-7 Business Days</p>
               </div>
               <div className="space-y-2">
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Packaging</span>
                  <p className="text-[10px] font-bold">Luxury Gift Box Included</p>
               </div>
            </div>
          </div>
        </div>

        {/* Similar Curations Section */}
        {relatedProducts.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
               <div className="space-y-4">
                  <h2 className="text-4xl font-serif font-bold text-foreground italic">You may also indulge in</h2>
                  <div className="w-20 h-0.5 bg-primary/20" />
               </div>
               <Link href="/shop" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 hover:text-primary transition-colors flex items-center gap-3 group">
                  Explore full boutique <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
               </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
