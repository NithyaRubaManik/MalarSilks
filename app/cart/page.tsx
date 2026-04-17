'use client'

import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, ShoppingBag } from 'lucide-react'
import { useApp } from '@/lib/app-context'

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, clearCart, isLoggedIn } = useApp()

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + tax

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50/20 to-amber-50/30 flex items-center justify-center px-4 pt-20">
        <div className="max-w-md w-full text-center">
          <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-100 border-4 border-red-50">
            <ShoppingBag className="w-16 h-16 text-red-300" />
          </div>
          <h1 className="text-4xl font-serif font-black text-gray-900 mb-4">Your bag is empty</h1>
          <p className="text-gray-500 font-medium mb-10 text-lg">
            Discover our premier silk collection and add your favourites.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Explore Collection
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50/20 to-amber-50/30 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <Link href="/shop" className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-bold text-sm mb-4 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900">
              Shopping <span className="text-red-700">Bag</span>
            </h1>
          </div>
          <div className="inline-flex items-center gap-3 bg-white border-2 border-red-100 px-6 py-3 rounded-2xl shadow-lg">
            <ShoppingCart className="w-5 h-5 text-red-600" />
            <span className="font-black text-gray-800 text-lg">{cart.length}</span>
            <span className="font-bold text-gray-500 text-sm">item{cart.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-5">
            {cart.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl p-6 shadow-xl shadow-gray-100/80 border border-gray-100 hover:border-red-100 hover:shadow-red-50/50 transition-all duration-500 flex flex-col sm:flex-row gap-6"
              >
                {/* Image */}
                <div className="relative shrink-0 w-full sm:w-36 h-44 sm:h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 shadow-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded-full inline-block mb-2">
                        {item.category}
                      </span>
                      <Link href={`/product/${item.id}`}>
                        <h3 className="font-serif text-xl font-bold text-gray-900 hover:text-red-700 transition-colors leading-snug">
                          {item.name}
                        </h3>
                      </Link>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-200"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Price</p>
                      <p className="text-2xl font-serif font-black text-red-700">
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-2xl p-1 shadow-inner">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-600 hover:text-red-700 hover:bg-red-50 shadow-sm hover:shadow-red-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-black"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-black text-gray-900 text-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-600 hover:text-red-700 hover:bg-red-50 shadow-sm hover:shadow-red-100 transition-all font-black"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Subtotal</p>
                      <p className="text-xl font-black text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear cart */}
            <div className="flex justify-end pt-2">
              <button
                onClick={clearCart}
                className="flex items-center gap-2 px-6 py-3 text-red-500 hover:text-white hover:bg-red-600 border-2 border-red-200 hover:border-red-600 rounded-xl font-bold text-sm transition-all duration-300"
              >
                <Trash2 className="w-4 h-4" />
                Clear Entire Bag
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden sticky top-28">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-700 to-red-800 p-6">
                <h2 className="font-black text-white text-xl uppercase tracking-wider">Order Summary</h2>
              </div>

              <div className="p-8 space-y-6">
                {/* Line items */}
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-gray-600">Bag Subtotal</span>
                    <span className="font-black text-gray-900">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-gray-600">GST (10%)</span>
                    <span className="font-black text-gray-900">₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-gray-600">Shipping</span>
                    <span className="font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg text-xs uppercase tracking-wider">
                      FREE
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-6 border-t-2 border-dashed border-gray-200">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Total Payable</p>
                      <p className="text-4xl font-serif font-black text-red-700">
                        ₹{total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                {isLoggedIn ? (
                  <Link
                    href="/checkout"
                    className="block w-full py-5 text-center bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white font-black text-sm uppercase tracking-[0.15em] rounded-2xl shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                  >
                    🛒 Proceed to Checkout
                  </Link>
                ) : (
                  <Link
                    href="/auth/login?redirect=/checkout"
                    className="block w-full py-5 text-center bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 text-white font-black text-sm uppercase tracking-[0.15em] rounded-2xl shadow-2xl shadow-gray-500/30 hover:shadow-gray-500/50 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                  >
                    🔒 Login to Checkout
                  </Link>
                )}

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                  {[
                    { icon: '🔒', label: 'Secure' },
                    { icon: '🚚', label: 'Free Ship' },
                    { icon: '↩️', label: 'Easy Returns' },
                  ].map(b => (
                    <div key={b.label} className="text-center">
                      <div className="text-xl mb-1">{b.icon}</div>
                      <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">{b.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
