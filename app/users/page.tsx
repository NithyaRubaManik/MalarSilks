'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Mail, User as UserIcon, Calendar, ArrowRight, Loader2 } from 'lucide-react'
import { CONFIG } from '@/lib/config'

interface UserData {
  _id: string
  name: string
  email: string
  image: string
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(CONFIG.API.ENDPOINTS.USERS)
        const data = await res.json()
        if (data.success) {
          setUsers(data.data)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">Loading users...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Our Community</h1>
          <p className="text-muted-foreground">Discover the people who make Malar Silks special.</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold">
          {users.length} Registered Users
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border-2 border-dashed">
          <UserIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No users found</h3>
          <p className="text-muted-foreground">Be the first to join the Malar Silks community!</p>
          <Link href="/" className="inline-block mt-6 text-primary font-medium hover:underline">
            Go back to upload →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user) => (
            <Card key={user._id} className="group overflow-hidden rounded-2xl border-none shadow-soft hover:shadow-md transition-all">
              <div className="aspect-square relative overflow-hidden bg-muted">
                <img
                  src={CONFIG.IMAGES.getSecureImageUrl(user.image)}
                  alt={user.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground truncate">{user.name}</h3>
                  <Link 
                    href={`/users/${user._id}`}
                    className="p-2 bg-primary/5 text-primary rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> {user.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
