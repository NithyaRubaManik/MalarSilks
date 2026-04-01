'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { User, Package, MapPin, Phone, Mail, Loader2, ChevronRight, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { CONFIG } from '@/lib/config'

interface Order {
  id: string
  _id: string
  totalPrice: number
  status: string
  createdAt: string
  orderItems: any[]
}

export default function ProfilePage() {
  const { user, isLoggedIn, login } = useApp()
  const router = useRouter()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    password: ''
  })


  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/auth/login')
      return
    }

    const fetchData = async () => {
      try {
        // Fetch full profile details
        const profileRes = await fetch(`${CONFIG.API.BASE_URL}/api/auth/profile/${user?.email}`)
        const profileData = await profileRes.json()
        
        if (profileData.success) {
          setFormData({
            name: profileData.data.name || '',
            phone: profileData.data.phone || '',
            address: profileData.data.address || '',
            city: profileData.data.city || '',
            pincode: profileData.data.pincode || '',
            password: ''
          })
          
          // Add ID to user if missing (for the put request)
          if (!user?.id && profileData.data._id) {
             login({
               ...user!,
               id: profileData.data._id
             } as any)
          }
        }

        // Fetch orders
        const ordersRes = await fetch(`${CONFIG.API.BASE_URL}/api/orders/myorders/${profileData.data._id}`)
        const ordersData = await ordersRes.json()
        if (ordersData.success) {
          setOrders(ordersData.data.map((o: any) => ({ ...o, id: o.id || o._id })))
        }
      } catch (error) {
        console.error("Error fetching profile data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isLoggedIn, user?.email, router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)

    try {
      const res = await fetch(`${CONFIG.API.BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user?.id,
          ...formData
        }),
      })

      const data = await res.json()

      if (data.success) {
        login({
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role
        })
        toast({
          title: "Profile Updated",
          description: "Your information has been successfully updated.",
        })
      } else {
        toast({
          title: "Update Failed",
          description: data.message,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating your profile.",
        variant: "destructive"
      })
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 capitalize">
              {user?.name || 'My Profile'}
            </h1>
            <p className="text-slate-500 font-medium">{user?.email}</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white p-1 rounded-xl border shadow-sm">
            <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="w-4 h-4 mr-2" /> Profile Info
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Package className="w-4 h-4 mr-2" /> My Orders ({orders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border shadow-sm overflow-hidden bg-white">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your shipping address and contact details.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="name"
                          className="pl-10"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="phone"
                          className="pl-10"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Shipping Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                          id="address"
                          className="pl-10"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={updating} 
                    className="w-full md:w-auto h-12 px-10 text-lg font-bold bg-linear-to-r from-amber-500 via-orange-500 to-red-500 text-white hover:from-amber-600 hover:via-orange-600 hover:to-red-600 shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 rounded-xl"
                  >
                    {updating ? 'Saving Changes...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-4">
              {orders.length === 0 ? (
                <Card className="text-center py-16 bg-white border shadow-sm">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-slate-300" />
                  </div>
                  <CardTitle className="mb-2 font-serif text-2xl">No orders yet</CardTitle>
                  <CardDescription className="mb-6">You haven't placed any orders yet. Start shopping!</CardDescription>
                  <Link href="/shop">
                    <Button>Start Shopping</Button>
                  </Link>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order._id} className="border shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b pb-4">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Order ID</p>
                          <p className="font-mono text-sm text-slate-700">#{String(order.id || order._id || '').substring(0, 8)}...</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</p>
                          <p className="font-medium text-slate-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total</p>
                          <p className="text-xl font-bold text-primary">₹{order.totalPrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border bg-slate-50">
                              <img 
                                src={CONFIG.IMAGES.getSecureImageUrl(item.image)} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{item.name}</h4>
                              <p className="text-sm text-slate-500 font-medium">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
