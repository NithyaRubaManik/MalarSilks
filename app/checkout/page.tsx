'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, MapPin, CreditCard, Loader2, Truck, CheckCircle2, Package } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { useToast } from '@/hooks/use-toast'
import { CONFIG } from '@/lib/config'

const inputClass = "w-full px-4 py-4 bg-white border-2 border-gray-200 hover:border-red-300 focus:border-red-500 focus:outline-none rounded-2xl text-sm font-semibold text-gray-800 placeholder:text-gray-400 transition-all duration-300 shadow-sm focus:shadow-red-100/50"
const labelClass = "text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 block"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { cart, clearCart, user, isLoggedIn } = useApp()
  const [step, setStep] = useState<'address' | 'payment'>('address')
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !isLoggedIn) {
      toast({ 
        title: "Login Required", 
        description: "Please login to access checkout.",
        variant: "destructive"
      })
      router.push('/auth/login?redirect=/checkout')
    }
  }, [isClient, isLoggedIn, router, toast])

  const [address, setAddress] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  })

  const [paymentMethod, setPaymentMethod] = useState<'Online' | 'COD'>('COD')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isLoggedIn && user?.email) {
        setLoadingProfile(true)
        try {
          const res = await fetch(`${CONFIG.API.BASE_URL}/api/auth/profile/${user.email}`)
          const data = await res.json()
          if (data.success) {
            const u = data.data
            setAddress({
              fullName: u.name || '',
              email: u.email || '',
              phone: u.phone || '',
              street: u.address || '',
              city: u.city || '',
              state: '',
              zipCode: u.pincode || '',
              country: 'India',
            })
          }
        } catch { } finally {
          setLoadingProfile(false)
        }
      }
    }
    fetchUserProfile()
  }, [isLoggedIn, user])

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + tax

  if (!isClient || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50/20 to-amber-50/30 flex items-center justify-center pt-20">
        <Loader2 className="w-10 h-10 animate-spin text-red-500" />
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50/20 to-amber-50/30 flex items-center justify-center pt-20">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <Package className="w-12 h-12 text-red-300" />
          </div>
          <h1 className="text-3xl font-serif font-black text-gray-900">Your cart is empty</h1>
          <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-black shadow-xl shadow-red-500/30">
            <ChevronLeft className="w-4 h-4" /> Back to Shopping
          </Link>
        </div>
      </div>
    )
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (address.fullName && address.email && address.phone && address.street && address.city && address.zipCode) {
      setStep('payment')
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      if (!isLoggedIn || !user) {
        toast({ title: "Login Required", description: "Please login to place an order.", variant: "destructive" })
        router.push('/auth/login')
        return
      }

      const orderData = {
        user: user.id,
        orderItems: cart.map(item => ({
          name: item.name, qty: item.quantity,
          image: item.image, price: item.price, product: item.id
        })),
        shippingAddress: { address: address.street, city: address.city, pincode: address.zipCode, phone: address.phone },
        paymentMethod,
        totalPrice: total
      }

      const res = await fetch(CONFIG.API.ENDPOINTS.ORDERS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "🎉 Order Placed!",
          description: paymentMethod === 'COD'
            ? "Your order is confirmed. Keep cash ready for delivery."
            : "Your order has been placed successfully.",
        })
        clearCart()
        router.push('/order-confirmation')
      } else {
        throw new Error(data.message || "Failed to place order")
      }
    } catch (err: any) {
      toast({ title: "Order Failed", description: err.message, variant: "destructive" })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50/20 to-amber-50/30 pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <Link href="/cart" className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-bold text-sm mb-6 group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Bag
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900">
            Checkout
          </h1>

          {/* Progress Steps */}
          <div className="flex items-center gap-0 mt-8">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-l-2xl font-black text-sm uppercase tracking-wider transition-all ${
              step === 'address'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30'
                : 'bg-white border-2 border-green-500 text-green-700'
            }`}>
              {step === 'payment' ? <CheckCircle2 className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
              <span>1. Delivery</span>
            </div>
            <div className={`flex items-center gap-3 px-6 py-3 rounded-r-2xl font-black text-sm uppercase tracking-wider transition-all border-l-2 border-white ${
              step === 'payment'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30'
                : 'bg-white border-2 border-gray-200 text-gray-400'
            }`}>
              <CreditCard className="w-5 h-5" />
              <span>2. Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* MAIN FORM */}
          <div className="lg:col-span-7 space-y-6">

            {/* STEP 1: Address */}
            {step === 'address' && (
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/80 border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-black text-white text-xl">Delivery Address</h2>
                    <p className="text-red-200 text-sm">Where should we deliver your luxury silk?</p>
                  </div>
                </div>

                <form onSubmit={handleAddressSubmit} className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Full Name *</label>
                      <input type="text" required placeholder="John Doe" value={address.fullName}
                        onChange={e => setAddress({ ...address, fullName: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Email Address *</label>
                      <input type="email" required placeholder="john@example.com" value={address.email}
                        onChange={e => setAddress({ ...address, email: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number *</label>
                      <input type="tel" required placeholder="+91 98765 43210" value={address.phone}
                        onChange={e => setAddress({ ...address, phone: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Country</label>
                      <input type="text" value={address.country} disabled
                        className={`${inputClass} bg-gray-50 cursor-not-allowed opacity-70`} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Street Address *</label>
                      <input type="text" required placeholder="123 Silk Street, Apartment 4B" value={address.street}
                        onChange={e => setAddress({ ...address, street: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>City *</label>
                      <input type="text" required placeholder="Chennai" value={address.city}
                        onChange={e => setAddress({ ...address, city: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>State *</label>
                      <input type="text" required placeholder="Tamil Nadu" value={address.state}
                        onChange={e => setAddress({ ...address, state: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>PIN / Postal Code *</label>
                      <input type="text" required placeholder="600001" value={address.zipCode}
                        onChange={e => setAddress({ ...address, zipCode: e.target.value })} className={inputClass} />
                    </div>
                  </div>

                  <div className="flex justify-end mt-10">
                    <button
                      type="submit"
                      className="flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                    >
                      Continue to Payment →
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2: Payment */}
            {step === 'payment' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">

                {/* Delivery Summary */}
                <div className="bg-white rounded-2xl border-2 border-green-200 p-5 flex items-center justify-between shadow-md shadow-green-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-green-700 mb-0.5">Delivery Confirmed To</p>
                      <p className="font-bold text-gray-800 text-sm">{address.street}, {address.city}, {address.zipCode}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setStep('address')}
                    className="px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-700 rounded-xl text-sm font-bold transition-all border border-transparent hover:border-red-200">
                    Edit
                  </button>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/80 border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-black text-white text-xl">Select Payment Method</h2>
                      <p className="text-red-200 text-sm">Choose how you'd like to pay</p>
                    </div>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 gap-5">                      {/* COD */}
                      <label className={`relative flex flex-col gap-4 p-6 rounded-3xl cursor-pointer transition-all duration-300 border-3 ${
                        paymentMethod === 'COD'
                          ? 'border-red-500 bg-gradient-to-br from-red-50 to-orange-50 shadow-xl shadow-red-100'
                          : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50/30 shadow-md'
                      }`} style={{ borderWidth: paymentMethod === 'COD' ? '3px' : '2px' }}>
                        <input type="radio" name="payment" className="sr-only" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                        <div className="flex justify-between items-start">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                            paymentMethod === 'COD' ? 'bg-red-600 shadow-lg shadow-red-400/40' : 'bg-gray-100'
                          }`}>
                            💵
                          </div>
                          {paymentMethod === 'COD' && (
                            <CheckCircle2 className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-black text-gray-900 text-lg mb-1">Cash on Delivery</h4>
                          <p className="text-sm text-gray-500 leading-relaxed">Pay with cash or QR scan when your order arrives at your doorstep.</p>
                        </div>
                        {paymentMethod === 'COD' && (
                          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-b-3xl" />
                        )}
                      </label>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setStep('address')}
                        className="flex items-center gap-2 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-black text-sm uppercase tracking-wider transition-all border-2 border-gray-200 hover:border-gray-300"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="flex-1 flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white font-black text-sm uppercase tracking-[0.15em] rounded-2xl shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none"
                      >
                        {isProcessing ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                        ) : (
                          `✅ Confirm Order — ₹${total.toLocaleString()}`
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* ORDER SUMMARY SIDEBAR */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden sticky top-28">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5">
                <h2 className="font-black text-white text-lg uppercase tracking-wider">Your Order</h2>
              </div>

              {/* Items */}
              <div className="p-6 space-y-4 max-h-64 overflow-y-auto border-b border-gray-100">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mt-1">{item.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">× {item.quantity}</span>
                        <span className="font-black text-gray-900 text-sm">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm font-semibold text-gray-600">
                  <span>Subtotal</span><span className="text-gray-900 font-black">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-gray-600">
                  <span>GST (10%)</span><span className="text-gray-900 font-black">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-gray-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-black bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg text-xs uppercase tracking-wider">FREE</span>
                </div>
                <div className="pt-4 border-t-2 border-dashed border-gray-200 flex justify-between items-end">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-500">Total</span>
                  <span className="text-3xl font-serif font-black text-red-700">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="px-6 pb-6">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                  <p className="text-xs font-bold text-amber-700 leading-relaxed">
                    🔒 Your payment information is secured with 256-bit SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
