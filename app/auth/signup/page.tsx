'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Lock, Check } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { CONFIG } from '@/lib/config'

export default function SignupPage() {
  const router = useRouter()
  const { login } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole')
      if (userRole === 'user') router.push('/')
      if (userRole === 'admin') router.push('/admin')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (!termsAccepted) {
      setError('Please agree to the Terms & Conditions')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(CONFIG.API.ENDPOINTS.AUTH.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, address, city, pincode }),
      })

      const data = await res.json()

      if (data.success) {
        login({
          id: data._id,
          email: data.email,
          name: data.name,
          role: data.role || 'user'
        })
        localStorage.setItem('userEmail', data.email)
        router.push('/')
      } else {
        setError(data.message || 'Signup failed')
        setIsLoading(false)
      }
    } catch (err: any) {
      setError('Connection refused. Is the server running?')
      setIsLoading(false)
    }
  }

  const passwordStrength = password.length > 0 ? {
    score: password.length >= 12 ? 3 : password.length >= 8 ? 2 : 1,
    label: password.length >= 12 ? 'Strong' : password.length >= 8 ? 'Medium' : 'Weak'
  } : null

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-2xl mx-auto mb-4">
            MS
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Malar Silks</h1>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-gray-200 rounded-lg shadow-soft p-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
            Create Account
          </h2>
          <p className="text-muted-foreground mb-8">
            Join us to start shopping and enjoy exclusive benefits
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
                placeholder="Street Address, Apartment, Suite, etc."
                rows={3}
              />
            </div>

            {/* City & Pincode */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="Chennai"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="600001"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="••••••••"
                  required
                />
              </div>
              {passwordStrength && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        passwordStrength.score === 1
                          ? 'w-1/3 bg-red-500'
                          : passwordStrength.score === 2
                            ? 'w-2/3 bg-yellow-500'
                            : 'w-full bg-green-500'
                      }`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="••••••••"
                  required
                />
              </div>
              {confirmPassword && password === confirmPassword && (
                <p className="mt-2 flex items-center gap-2 text-xs text-green-600">
                  <Check className="w-4 h-4" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                className="mt-1 rounded"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span className="text-xs text-muted-foreground">
                I agree to the{' '}
                <Link href="#" className="text-primary hover:underline">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link href="#" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-lg font-bold bg-linear-to-r from-amber-500 via-orange-500 to-red-500 text-white hover:from-amber-600 hover:via-orange-600 hover:to-red-600 shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 rounded-xl disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-muted-foreground text-sm mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center text-sm">
            <div className="text-2xl mb-2">🎁</div>
            <p className="text-muted-foreground">Exclusive Offers</p>
          </div>
          <div className="text-center text-sm">
            <div className="text-2xl mb-2">🚚</div>
            <p className="text-muted-foreground">Free Shipping</p>
          </div>
          <div className="text-center text-sm">
            <div className="text-2xl mb-2">❤️</div>
            <p className="text-muted-foreground">Wishlists</p>
          </div>
        </div>
      </div>
    </div>
  )
}
