'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Mail, Calendar, User as UserIcon, Loader2 } from 'lucide-react'
import { CONFIG } from '@/lib/config'

interface UserData {
  _id: string
  name: string
  email: string
  image: string
  createdAt: string
}

export default function UserDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${CONFIG.API.ENDPOINTS.USERS}/${id}`)
        const data = await res.json()
        if (data.success) {
          setUser(data.data)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchUser()
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold">User not found</h2>
        <Button onClick={() => router.push('/users')} className="mt-4">
          Back to Users
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-8 hover:bg-primary/5 text-primary"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
          <img
            src={CONFIG.IMAGES.getSecureImageUrl(user.image)}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-8 py-4">
          <div>
            <h1 className="text-4xl font-extrabold text-foreground mb-2">{user.name}</h1>
            <p className="text-primary font-medium">Malar Silks Brand Enthusiast</p>
          </div>

          <Card className="p-6 space-y-4 bg-card/50 backdrop-blur-sm border-none shadow-soft">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Email</p>
                <p className="text-lg font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Member Since</p>
                <p className="text-lg font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          <div className="p-6 rounded-3xl bg-linear-to-br from-primary/5 to-secondary/5 border border-primary/10">
            <h4 className="font-bold mb-2">Style Philosophy</h4>
            <p className="text-muted-foreground italic">
              "Elegance is not about being noticed, it's about being remembered. Malar Silks helps me express my cultural identity with a modern flair."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
