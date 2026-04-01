'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Sparkles, Star, Quote, Mail, Upload, Camera, Loader2 } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { CATEGORIES, getFeaturedProducts } from '@/lib/products'
import { useToast } from '@/hooks/use-toast'
import AIOutfitAdvisor from '@/components/ai-outfit-advisor'
import { CONFIG } from '@/lib/config'

export default function Home() {
  const { toast } = useToast()
  const router = useRouter()
  const [dbProducts, setDbProducts] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  
  const featuredProducts = useMemo(() => {
    const staticFeatured = getFeaturedProducts()
    // Mix with DB products that have high ratings (or just newest)
    return [...dbProducts, ...staticFeatured].slice(0, 8)
  }, [dbProducts])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [comment, setComment] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchDbProducts = async () => {
    try {
      const ping = await fetch(CONFIG.API.ENDPOINTS.PRODUCTS).catch(() => null);
      if (!ping) return;
      
      const res = await fetch(CONFIG.API.ENDPOINTS.PRODUCTS)
      const data = await res.json()
      if (data.success) {
        setDbProducts(data.data.map((p: any) => ({ 
          ...p, 
          id: p.id || p._id,
          inStock: p.inStock ?? p.in_stock ?? true
        })))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchPosts = async () => {
    try {
      const ping = await fetch(`${CONFIG.API.BASE_URL}/api/posts`).catch(() => null);
      if (!ping) return;

      const res = await fetch(`${CONFIG.API.BASE_URL}/api/posts`)
      const data = await res.json()
      if (data.success) {
        setPosts(data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchDbProducts()
    fetchPosts()
  }, [])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !file) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" })
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('comment', comment)
    formData.append('image', file)

    try {
      const res = await fetch(`${CONFIG.API.BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: "Success", description: "Your photo has been sent for admin approval!" })
        setName(''); setEmail(''); setComment(''); setFile(null)
        router.push('/gallery')
      }
    } catch (error) {
      toast({ title: "Error", description: "Upload failed", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Chennai",
      rating: 5,
      text: "Absolutely stunning sarees! The quality is exceptional and the customer service is outstanding. Will definitely shop again.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Rajesh Kumar",
      location: "Madurai",
      rating: 5,
      text: "Found the perfect kurta for my wedding. The fit was perfect and the fabric quality exceeded my expectations.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Meera Lakshmi",
      location: "Coimbatore",
      rating: 5,
      text: "Love the traditional designs with modern twists. My daughter looks beautiful in her new lehenga!",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ]

  const features = [
    {
      title: "Authentic Silk",
      description: "100% pure silk sourced from traditional weavers",
      icon: "🧵"
    },
    {
      title: "Custom Tailoring",
      description: "Professional alteration services available",
      icon: "✂️"
    },
    {
      title: "Free Shipping",
      description: "Free delivery on orders above ₹5,000",
      icon: "🚚"
    },
    {
      title: "30-Day Returns",
      description: "Hassle-free returns within 30 days",
      icon: "↩️"
    }
  ]

  return (
    <div className="w-full bg-[#FDFCFB]">
      {/* Hero Section - High Fashion Style */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Abstract Background Accents */}
        <div className="absolute top-0 right-0 w-[60%] h-full bg-[#FAF7F2] -skew-x-12 translate-x-32 z-0" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-10">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white shadow-xl shadow-primary/5 border border-primary/10 animate-in fade-in slide-in-from-left-4 duration-700">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Prestige Silk Collection 2024</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground leading-[1.05] tracking-tight">
                  Timeless <span className="italic text-primary">Grace</span> in Every <span className="text-primary font-light">Thread.</span>
                </h1>
                <p className="text-xl text-muted-foreground/80 leading-relaxed max-w-xl font-medium">
                  Experience the pinnacle of traditional craftsmanship. Our silks are woven with stories of heritage, designed for the modern connoisseur of luxury.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Link href="/shop" className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white font-black text-base uppercase tracking-wider rounded-2xl shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1 active:translate-y-0 transition-all duration-300">
                  Shop the Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#categories" className="inline-flex items-center justify-center px-10 py-5 border-2 border-gray-800 text-gray-800 font-black text-base uppercase tracking-wider rounded-2xl hover:bg-gray-800 hover:text-white transition-all duration-300">
                  Explore Categories
                </Link>
              </div>
              
              <div className="flex items-center gap-8 pt-10 border-t border-gray-100">
                <div>
                  <div className="text-3xl font-serif font-bold">12k+</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Happy Patrons</div>
                </div>
                <div className="w-px h-10 bg-gray-100" />
                <div>
                  <div className="text-3xl font-serif font-bold">100%</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Authentic Silk</div>
                </div>
              </div>
            </div>

            {/* Right Image Feature */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(168,126,73,0.3)] animate-in fade-in slide-in-from-right-8 duration-1000">
                <img
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop"
                  alt="Silk Saree Detail"
                  className="w-full h-auto object-cover hover:scale-110 transition-transform duration-[2000ms]"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-12 bg-white/90 backdrop-blur-md p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(180,83,9,0.15)] border border-amber-100 z-20 animate-bounce duration-[3000ms]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-5 shadow-lg shadow-amber-500/20">
                  <Star className="w-7 h-7 text-white fill-white" />
                </div>
                <p className="font-serif font-black text-xl text-gray-900 leading-tight">
                  Voted India's <br/> 
                  <span className="text-amber-600">Finest Silk</span> 2024
                </p>
                <div className="mt-3 flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar - Luxury Branding Style */}
      <section className="py-12 bg-white relative z-20 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl mb-4 group-hover:bg-primary/5 group-hover:-translate-y-1 transition-all">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-xs uppercase tracking-widest text-foreground mb-1">{feature.title}</h3>
                <p className="text-muted-foreground text-[10px] font-medium leading-relaxed max-w-[150px]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories - Editorial Layout */}
      <section id="categories" className="py-32 bg-[#FAF9F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 whitespace-normal break-words overflow-hidden">
            <div className="max-w-2xl">
              <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Collections</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground">
                The Essence of <br />Traditional Modernity
              </h2>
            </div>
            <p className="text-muted-foreground/80 font-medium max-w-sm mb-2">
              Our curated series explores the intersection of age-old weaving techniques and contemporary silhouettes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((category) => (
              <Link key={category.id} href={`/shop?category=${category.id}`} className="group block relative h-[500px] rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-2">
                  {/* Image */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                    <h3 className="text-3xl font-serif font-bold text-white mb-2 group-hover:translate-x-2 transition-transform">
                      {category.name}
                    </h3>
                    <p className="text-white/70 text-sm font-medium leading-relaxed group-hover:translate-x-2 transition-transform duration-500 delay-75">
                      {category.description}
                    </p>
                    <div className="mt-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/50 group-hover:text-primary transition-colors">
                      View Collection <div className="w-12 h-px bg-white/30 group-hover:bg-primary group-hover:w-16 transition-all" />
                    </div>
                  </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Polished Boutique Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-20 whitespace-normal break-words overflow-hidden">
            <div>
              <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Exclusive Favorites</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                Artisanal Masterpieces
              </h2>
            </div>
            <Link
              href="/shop"
              className="group hidden sm:flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-foreground hover:text-primary transition-all pb-1 border-b-2 border-gray-100 hover:border-primary"
            >
              See the Entire Boutique
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Outfit Advisor */}
      <AIOutfitAdvisor />

      {/* Testimonials - Editorial Quotes */}
      <section className="py-32 bg-primary/[0.02] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 whitespace-normal break-words overflow-hidden">
             <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 italic">
              "Elegance is the only beauty that <br className="hidden md:block"/> never fades."
            </h2>
            <p className="text-primary font-bold uppercase tracking-[0.3em] text-[10px]">What our patrons say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex flex-col group">
                <Quote className="w-12 h-12 text-primary opacity-10 mb-8 group-hover:opacity-30 transition-opacity" />
                <p className="text-xl font-serif text-foreground/80 leading-relaxed mb-10 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-14 h-14 rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground uppercase tracking-tight text-sm">{testimonial.name}</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      {posts.length > 0 && (
        <section className="py-32 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-20">
              <div>
                <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Our Journal</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                  Latest Updates & Details
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {posts.map((post) => (
                <div key={post.id || post._id} className="group cursor-pointer">
                  <div className="rounded-[2.5rem] overflow-hidden mb-8 h-80 relative">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <h3 className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground font-medium leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community Section - Re-styled as "Studio Feature" */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#FAF7F2] -skew-y-3 z-0 translate-y-20 scale-110" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] block">Malar Silks Studio</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight">
                Become Part of Our <br/> Heritage Story
              </h2>
              <p className="text-lg text-muted-foreground/80 leading-relaxed max-w-lg">
                Upload your most elegant Malar Silks look to join our community gallery. The most inspiring styles are featured in our physical boutiques and global lookbooks.
              </p>
              
              <div className="flex items-center gap-6 pt-6">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-[#FAF7F2] bg-gray-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary">+800 Community Members</div>
              </div>
            </div>

            <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl shadow-primary/10 border border-gray-100 scale-105">
               <form onSubmit={handleUpload} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Full Name</label>
                    <input 
                      suppressHydrationWarning
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="e.g. Ananya Rao" 
                      className="w-full bg-gray-50 border-transparent py-4 px-6 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-hidden"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Email Address</label>
                    <input 
                      suppressHydrationWarning
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="hello@style.com" 
                      className="w-full bg-gray-50 border-transparent py-4 px-6 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-hidden text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Review / Comment</label>
                  <textarea 
                    suppressHydrationWarning
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)} 
                    placeholder="Share your thoughts about our silks..." 
                    rows={3}
                    className="w-full bg-gray-50 border-transparent py-4 px-6 rounded-[2rem] focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-hidden text-sm font-semibold resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Share Your Look</label>
                  <label className="group block relative w-full h-[200px] border-2 border-dashed border-gray-100 rounded-[2rem] hover:border-primary/50 hover:bg-primary/[0.02] cursor-pointer transition-all duration-500 overflow-hidden">
                     <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <Camera className="w-10 h-10 text-primary/30 group-hover:scale-110 transition-transform mb-4" />
                        <p className="text-sm font-bold text-foreground mb-1">
                          {file ? file.name : "Select your Studio Photo"}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">JPG, PNG up to 10MB</p>
                     </div>
                     <input suppressHydrationWarning type="file" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  </label>
                </div>

                <button
                  suppressHydrationWarning
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-gradient-to-r from-red-600 to-red-700 text-white font-black text-sm uppercase tracking-[0.15em] rounded-2xl shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
                >
                  {loading ? <><Loader2 className="animate-spin w-5 h-5" /> Uploading...</> : <>Submit to Gallery <Sparkles className="w-5 h-5" /></>}
                </button>
              </form>
              
              <div className="mt-10 pt-10 border-t border-gray-50 flex justify-center">
                 <Link href="/gallery" className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:gap-5 transition-all">
                    Explore Modern Patrons <ArrowRight className="w-4 h-4" />
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Styled Newsletter - Editorial Finish */}
      <section className="py-32 bg-white flex justify-center items-center">
        <div className="max-w-4xl text-center space-y-12">
           <div className="w-20 h-20 rounded-[2rem] bg-primary/5 rotate-12 flex items-center justify-center mx-auto mb-10">
              <Mail className="w-8 h-8 text-primary -rotate-12" />
           </div>
           
           <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-serif font-bold tracking-tight">Privé Newsletter</h2>
              <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto italic">
                Get first access to limited edition weaves and boutique news.
              </p>
           </div>

           <div className="relative max-w-lg mx-auto flex gap-3">
              <input
                suppressHydrationWarning
                type="email"
                placeholder="Enter your email address..."
                className="flex-1 h-16 px-6 bg-gray-50 border-2 border-gray-200 hover:border-red-300 focus:border-red-500 focus:bg-white rounded-2xl outline-none text-sm font-medium transition-all"
              />
              <button suppressHydrationWarning className="h-16 px-8 bg-gradient-to-r from-red-600 to-red-700 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap">
                Join Now
              </button>
           </div>
        </div>
      </section>
    </div>
  )
}
