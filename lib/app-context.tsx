'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: 'women' | 'men' | 'girls' | 'boys'
  description: string
  rating: number
  inStock: boolean
}

export interface CartItem extends Product {
  quantity: number
}

interface AppContextType {
  // Cart
  cart: CartItem[]
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  
  // Wishlist
  wishlist: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  
  // Auth
  isLoggedIn: boolean
  user: { id: string; email: string; name: string; role?: string } | null
  login: (userData: { id: string; email: string; name: string; role: string }) => void
  logout: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('malar-cart')
      const savedWishlist = localStorage.getItem('malar-wishlist')
      const savedUser = localStorage.getItem('malar-user')

      if (savedCart) setCart(JSON.parse(savedCart))
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsLoggedIn(true)
      }
    } catch (error) {
      // Clear corrupted localStorage data
      localStorage.removeItem('malar-cart')
      localStorage.removeItem('malar-wishlist')
      localStorage.removeItem('malar-user')
    }
  }, [])

  // Save cart to localStorage and notify listeners
  useEffect(() => {
    localStorage.setItem('malar-cart', JSON.stringify(cart))
    // Dispatch custom event for cart updates
    window.dispatchEvent(new Event('cartUpdated'))
  }, [cart])

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('malar-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prevCart, { ...product, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
      )
    }
  }

  const clearCart = () => {
    setCart([])
  }

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (!prev.find((item) => item.id === product.id)) {
        return [...prev, product]
      }
      return prev
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId))
  }

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId)
  }

  const login = (userData: { id: string; email: string; name: string; role: string }) => {
    setUser(userData)
    setIsLoggedIn(true)
    localStorage.setItem('malar-user', JSON.stringify(userData))
    // For compatibility with Navbar/other parts using different keys
    localStorage.setItem('userAuth', JSON.stringify(userData))
    localStorage.setItem('userRole', userData.role)
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUser(null)
    localStorage.removeItem('malar-user')
    localStorage.removeItem('malar-cart')
    localStorage.removeItem('userAuth')
    localStorage.removeItem('userRole')
    localStorage.removeItem('adminAuth')
    setCart([])
  }

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isLoggedIn,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
