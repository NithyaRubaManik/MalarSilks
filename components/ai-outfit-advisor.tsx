'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Cloud, Sun, CloudRain, Wind, Thermometer, MapPin, RefreshCw,
  Sparkles, ArrowRight, Brain, Star, ShoppingCart, LocateFixed,
  CloudSnow, Droplets, Eye, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react'
import { PRODUCTS } from '@/lib/products'
import { useApp } from '@/lib/app-context'
import { useToast } from '@/hooks/use-toast'

interface WeatherData {
  city: string
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  weatherCode: number
  description: string
  icon: string
}

interface OutfitRecommendation {
  products: typeof PRODUCTS
  occasion: string
  styleAdvice: string
  fabricTips: string
  colors: string[]
  warnings: string[]
  confidence: number
}

// Open-Meteo WMO weather codes to descriptions
function getWeatherInfo(code: number): { description: string; icon: string } {
  if (code === 0) return { description: 'Clear Sky', icon: '☀️' }
  if (code <= 3) return { description: 'Partly Cloudy', icon: '⛅' }
  if (code <= 9) return { description: 'Foggy', icon: '🌫️' }
  if (code <= 29) return { description: 'Drizzle', icon: '🌦️' }
  if (code <= 39) return { description: 'Drizzle', icon: '🌧️' }
  if (code <= 49) return { description: 'Freezing Drizzle', icon: '🌨️' }
  if (code <= 59) return { description: 'Drizzle', icon: '🌦️' }
  if (code <= 69) return { description: 'Rain', icon: '🌧️' }
  if (code <= 79) return { description: 'Snow', icon: '❄️' }
  if (code <= 84) return { description: 'Rain Showers', icon: '🌦️' }
  if (code <= 94) return { description: 'Thunderstorm', icon: '⛈️' }
  return { description: 'Stormy', icon: '🌩️' }
}

// THE AI RECOMMENDATION ENGINE
function generateRecommendation(weather: WeatherData): OutfitRecommendation {
  const { temperature: temp, humidity, windSpeed, weatherCode } = weather

  const isRaining = weatherCode >= 29 && weatherCode <= 84
  const isStormy = weatherCode >= 85
  const isClear = weatherCode <= 3
  const isHot = temp >= 32
  const isWarm = temp >= 25 && temp < 32
  const isMild = temp >= 18 && temp < 25
  const isCool = temp >= 10 && temp < 18
  const isCold = temp < 10
  const isHumid = humidity >= 70

  let occasion = ''
  let styleAdvice = ''
  let fabricTips = ''
  let colors: string[] = []
  let warnings: string[] = []
  let productIds: string[] = []

  // ─── VERY HOT (≥32°C) ───
  if (isHot) {
    occasion = 'Light Casual & Breezy Outdoor'
    styleAdvice = `At ${temp}°C it's blazing hot! Go for the lightest, most breathable silks and cotton blends. Opt for loose, flowy silhouettes that don't cling to the body. Light-coloured fabrics will reflect sunlight and keep you cooler.`
    fabricTips = '✅ Light cotton-silk blends, georgette, chiffon  ❌ Avoid heavy silk, brocade, velvet, dark colours'
    colors = ['Ivory', 'Pastel Yellow', 'Light Pink', 'Mint Green', 'Sky Blue', 'Off-White']
    productIds = ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439014', '507f1f77bcf86cd799439021', '507f1f77bcf86cd799439025']
    if (isHumid) warnings.push('💧 High humidity — choose moisture-wicking fabrics and avoid sitting sarees near body.')
    if (isClear) warnings.push('☀️ Carry a dupatta or light stole for sun protection.')
  }
  // ─── WARM (25–32°C) ───
  else if (isWarm) {
    occasion = 'Casual, Festive & Semi-Formal'
    styleAdvice = `${temp}°C is warm and pleasant — the perfect weather to flaunt our pure silk sarees and kurtas. Light silks and cotton blends will look stunning and feel comfortable all day.`
    fabricTips = '✅ Pure silk sarees, light kurtas, cotton kurtis  💡 Georgette and chiffon are great choices too'
    colors = ['Golden Yellow', 'Coral', 'Mauve', 'Peacock Blue', 'Mango Orange', 'Rose Pink']
    productIds = ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012', '507f1f77bcf86cd799439015', '507f1f77bcf86cd799439019']
    if (isRaining) warnings.push('🌧️ Rain alert — avoid pure silk as it water-stains easily. Prefer georgette/synthetic silk.')
  }
  // ─── MILD (18–25°C) ───
  else if (isMild) {
    occasion = 'Formal, Wedding & All-Occasion'
    styleAdvice = `${temp}°C is the ideal temperature for Indian traditional wear! This is perfect weather for our premium silk sarees, sherwanis, and heavy embroidered outfits. You'll be comfortable and look absolutely regal.`
    fabricTips = '✅ Pure Kanjivaram silk, brocade, silk sherwanis, heavy embroidery — all perfect!'
    colors = ['Royal Blue', 'Deep Red', 'Emerald Green', 'Gold', 'Burgundy', 'Deep Purple']
    productIds = ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439013', '507f1f77bcf86cd799439018', '507f1f77bcf86cd799439019']
    if (windSpeed > 25) warnings.push('💨 Windy conditions — secure your dupatta or pallu with pins to avoid accidents.')
  }
  // ─── COOL (10–18°C) ───
  else if (isCool) {
    occasion = 'Layered Look & Evening Elegance'
    styleAdvice = `It's ${temp}°C — a bit cool! Perfect for layered outfits. Pair silks with a light shawl or jacket. Heavier fabrics like brocade and raw silk are ideal and will keep you warm and stylish.`
    fabricTips = '✅ Raw silk, brocade, silk with shawl/stole, heavier kurta sets  💡 Layer with a silk dupatta for warmth'
    colors = ['Deep Wine', 'Forest Green', 'Navy Blue', 'Chocolate Brown', 'Mustard', 'Rust Orange']
    productIds = ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439016', '507f1f77bcf86cd799439018', '507f1f77bcf86cd799439019']
    if (isRaining) warnings.push('🌧️ Rain + cool weather — wear darker colours that don\'t show rain spots easily.')
  }
  // ─── COLD (<10°C) ───
  else {
    occasion = 'Warm Layers & Winter Festive'
    styleAdvice = `At ${temp}°C it's quite cold! Choose heavier silk fabrics and always layer up. A silk shawl or brocade jacket over your outfit will look luxurious and keep you warm. Festival season calls for rich, deep jewel tones!`
    fabricTips = '✅ Brocade, heavy silk, velvet-blend, sherwanis with inner lining  ✅ Pair with silk/wool stole'
    colors = ['Deep Maroon', 'Black & Gold', 'Cobalt Blue', 'Plum', 'Teal', 'Dark Emerald']
    productIds = ['507f1f77bcf86cd799439018', '507f1f77bcf86cd799439016', '507f1f77bcf86cd799439015', '507f1f77bcf86cd799439013']
    warnings.push('🧥 Layer your silk with warm innerwear for comfort without compromising the look.')
    warnings.push('❄️ Very cold weather may affect silk\'s drape — steam before wearing.')
  }

  // Extra weather-specific warnings
  if (isStormy) warnings.push('⛈️ Stormy weather! Consider postponing outdoor events. If needed, choose sturdy, pinned draping styles.')
  if (windSpeed > 30) warnings.push('💨 Strong winds expected. Use dupatta pins and avoid loose, flowing drapes for outdoor settings.')
  if (isHumid && isWarm) warnings.push('🔻 High humidity makes silk prone to water damage — avoid cream-coloured pure silks outdoors.')

  const products = PRODUCTS.filter(p => productIds.includes(p.id)).slice(0, 3)

  const confidence = isMild ? 96 : isWarm ? 92 : isHot ? 88 : isCool ? 90 : 85

  return { products, occasion, styleAdvice, fabricTips, colors, warnings, confidence }
}

// Weather condition icon component
function WeatherIcon({ code, size = 'md' }: { code: number, size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'lg' ? 'text-7xl' : size === 'md' ? 'text-4xl' : 'text-xl'
  const { icon } = getWeatherInfo(code)
  return <span className={s}>{icon}</span>
}

export default function AIOutfitAdvisor() {
  const { addToCart } = useApp()
  const { toast } = useToast()

  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null)
  const [loading, setLoading] = useState(false)
  const [cityInput, setCityInput] = useState('')
  const [error, setError] = useState('')
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())
  const [step, setStep] = useState<'idle' | 'locating' | 'fetching' | 'done'>('idle')

  const fetchWeatherByCoords = async (lat: number, lon: number, cityName?: string) => {
    setStep('fetching')
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
      )
      const data = await res.json()
      const cur = data.current
      const { description } = getWeatherInfo(cur.weather_code)

      const wd: WeatherData = {
        city: cityName || `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
        temperature: Math.round(cur.temperature_2m),
        feelsLike: Math.round(cur.apparent_temperature),
        humidity: cur.relative_humidity_2m,
        windSpeed: Math.round(cur.wind_speed_10m),
        weatherCode: cur.weather_code,
        description,
        icon: getWeatherInfo(cur.weather_code).icon
      }

      setWeather(wd)
      setRecommendation(generateRecommendation(wd))
      setStep('done')
    } catch (e) {
      setError('Failed to fetch weather. Check your connection.')
      setStep('idle')
    } finally {
      setLoading(false)
    }
  }

  const fetchByCity = async () => {
    if (!cityInput.trim()) return
    setLoading(true)
    setError('')
    setStep('fetching')
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityInput.trim())}&count=1&language=en&format=json`
      )
      const geoData = await geoRes.json()
      if (!geoData.results?.length) {
        setError('City not found. Try another name.')
        setStep('idle')
        setLoading(false)
        return
      }
      const { latitude, longitude, name, country } = geoData.results[0]
      await fetchWeatherByCoords(latitude, longitude, `${name}, ${country}`)
    } catch {
      setError('Failed to find that city.')
      setStep('idle')
      setLoading(false)
    }
  }

  const fetchByLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser.')
      return
    }
    setLoading(true)
    setError('')
    setStep('locating')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        // Reverse geocode using Open-Meteo geocoding
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const data = await res.json()
          const city = data.address?.city || data.address?.town || data.address?.village || 'Your Location'
          await fetchWeatherByCoords(latitude, longitude, `${city}, ${data.address?.country || ''}`)
        } catch {
          await fetchWeatherByCoords(latitude, longitude)
        }
      },
      () => {
        setError('Location access denied. Please enter your city manually.')
        setStep('idle')
        setLoading(false)
      }
    )
  }

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    addToCart(product, 1)
    setAddedIds(prev => new Set([...prev, product.id]))
    toast({ title: '✅ Added to Bag!', description: `${product.name} has been added.` })
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(product.id); return n }), 2500)
  }

  const bgForTemp = (temp: number) => {
    if (temp >= 35) return 'from-orange-600 to-red-600'
    if (temp >= 28) return 'from-amber-500 to-orange-500'
    if (temp >= 20) return 'from-green-500 to-teal-500'
    if (temp >= 12) return 'from-blue-500 to-indigo-500'
    return 'from-indigo-600 to-purple-600'
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-red-600/20 border border-red-500/30 rounded-full mb-6">
            <Brain className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="text-red-400 text-[11px] font-black uppercase tracking-[0.3em]">AI-Powered Feature</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-5">
            Weather-Based <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-400">Outfit Advisor</span>
          </h2>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Our AI analyses your local weather conditions and recommends the most suitable Malar Silks outfits — so you always look and feel perfect.
          </p>
        </div>

        {/* Input Panel */}
        <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 mb-8 shadow-2xl">
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-5 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" /> Enter your city or use GPS
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                suppressHydrationWarning
                type="text"
                value={cityInput}
                onChange={e => setCityInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchByCity()}
                placeholder="e.g. Chennai, Mumbai, Delhi, Coimbatore..."
                className="w-full pl-5 pr-12 py-4 bg-gray-900/80 border-2 border-gray-600 hover:border-amber-500/50 focus:border-amber-500 rounded-2xl text-white placeholder:text-gray-500 outline-none transition-all font-medium"
              />
              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>

            <button
              suppressHydrationWarning
              onClick={fetchByCity}
              disabled={loading || !cityInput.trim()}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-black text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading && step === 'fetching' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Get Advice
            </button>

            <button
              suppressHydrationWarning
              onClick={fetchByLocation}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl border border-gray-600 hover:border-gray-500 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading && step === 'locating' ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4 text-amber-400" />}
              <span className="hidden sm:inline">My Location</span>
            </button>
          </div>

          {/* Status messages */}
          {step === 'locating' && (
            <p className="mt-4 text-amber-400 text-sm font-semibold flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Getting your GPS location...
            </p>
          )}
          {step === 'fetching' && (
            <p className="mt-4 text-blue-400 text-sm font-semibold flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Fetching live weather data...
            </p>
          )}
          {error && (
            <p className="mt-4 text-red-400 text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </p>
          )}
        </div>

        {/* Results Panel */}
        {weather && recommendation && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">

            {/* Weather Card */}
            <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${bgForTemp(weather.temperature)} p-8 shadow-2xl`}>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32 blur-2xl" />
              </div>
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <WeatherIcon code={weather.weatherCode} size="lg" />
                  <div>
                    <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {weather.city}
                    </p>
                    <div className="text-7xl font-black text-white leading-none">{weather.temperature}°C</div>
                    <p className="text-white/80 font-semibold text-lg">{weather.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: <Thermometer className="w-5 h-5" />, label: 'Feels', value: `${weather.feelsLike}°C` },
                    { icon: <Droplets className="w-5 h-5" />, label: 'Humidity', value: `${weather.humidity}%` },
                    { icon: <Wind className="w-5 h-5" />, label: 'Wind', value: `${weather.windSpeed} km/h` },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
                      <div className="text-white/70 flex justify-center mb-1">{stat.icon}</div>
                      <div className="text-white font-black text-lg">{stat.value}</div>
                      <div className="text-white/60 text-[10px] font-bold uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { setWeather(null); setRecommendation(null); setStep('idle') }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-bold transition-all"
                >
                  <RefreshCw className="w-4 h-4" /> Change City
                </button>
              </div>
            </div>

            {/* AI Advice Card */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-start justify-between gap-4 mb-7">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-amber-400 text-[11px] font-black uppercase tracking-[0.3em]">AI Analysis</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    Best for: <span className="text-amber-400">{recommendation.occasion}</span>
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-3xl font-black text-white">{recommendation.confidence}%</div>
                  <div className="text-gray-500 text-[10px] font-bold uppercase">Match Score</div>
                </div>
              </div>

              <p className="text-gray-300 font-medium leading-relaxed mb-6 text-base">{recommendation.styleAdvice}</p>

              <div className="bg-gray-900/50 rounded-2xl p-5 mb-6">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Fabric Guidance</p>
                <p className="text-gray-300 text-sm font-medium leading-relaxed">{recommendation.fabricTips}</p>
              </div>

              {/* Colour Palette */}
              <div className="mb-6">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">Recommended Colours for Today</p>
                <div className="flex flex-wrap gap-2">
                  {recommendation.colors.map(color => (
                    <span key={color} className="px-4 py-2 bg-gray-700/80 border border-gray-600 text-gray-200 text-xs font-bold rounded-full">
                      🎨 {color}
                    </span>
                  ))}
                </div>
              </div>

              {/* Warnings */}
              {recommendation.warnings.length > 0 && (
                <div className="space-y-2">
                  {recommendation.warnings.map((w, i) => (
                    <div key={i} className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                      <p className="text-amber-300 text-sm font-medium leading-relaxed">{w}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Recommendations */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-black text-white">
                  Handpicked for <span className="text-red-400">{weather.temperature}°C Weather</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {recommendation.products.map((product, i) => (
                  <div
                    key={product.id}
                    className="group bg-gray-800/60 border border-gray-700/50 hover:border-red-500/40 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-500/10"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="relative h-52 overflow-hidden bg-gray-900">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-400 px-3 py-1.5 rounded-full shadow-lg">
                        <Star className="w-3 h-3 text-gray-900 fill-gray-900" />
                        <span className="text-gray-900 text-[11px] font-black">{product.rating}</span>
                      </div>
                      <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest bg-red-600 text-white px-2.5 py-1.5 rounded-full">
                        {product.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <Link href={`/product/${product.id}`}>
                        <h4 className="font-serif font-bold text-white text-base hover:text-amber-400 transition-colors leading-snug mb-4">
                          {product.name}
                        </h4>
                      </Link>

                      <div className="flex items-center justify-between gap-3">
                        <div className="text-2xl font-black text-amber-400">
                          ₹{product.price.toLocaleString()}
                        </div>
                        <button
                          suppressHydrationWarning
                          onClick={() => handleAddToCart(product)}
                          disabled={addedIds.has(product.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 ${
                            addedIds.has(product.id)
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5'
                          }`}
                        >
                          {addedIds.has(product.id) ? (
                            <><CheckCircle2 className="w-4 h-4" /> Added</>
                          ) : (
                            <><ShoppingCart className="w-4 h-4" /> Add</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-1 transition-all duration-300"
                >
                  View Full Collection <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {step === 'idle' && !weather && (
          <div className="text-center py-20 border-2 border-dashed border-gray-700/50 rounded-3xl">
            <div className="text-8xl mb-6">🌤️</div>
            <h3 className="text-2xl font-serif font-black text-white mb-3">Enter Your City to Begin</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto">
              Our AI will fetch live weather and recommend the perfect Malar Silks outfit for you.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
