'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Package, Users, ShoppingCart, BarChart3, LogOut, Upload, X, Mail, ShieldCheck, FileText } from 'lucide-react'

interface Post {
  _id: string
  title: string
  description: string
  imageUrl: string
  createdAt: string
}

interface GalleryEntry {
  _id: string
  name: string
  email: string
  image: string
  createdAt: string
}

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  rating: number
  inStock: boolean
}

interface RegisteredUser {
  _id: string
  id?: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  pincode?: string
  createdAt: string
}

interface AdminUser {
  _id: string
  id?: string
  email: string
  createdAt: string
}

export default function AdminPage() {
  const { toast } = useToast()
  const router = useRouter()
  
  // Auth & UI State
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [editingProductId, setEditingProductId] = useState<string | null>(null)

  // Data State
  const [products, setProducts] = useState<Product[]>([])
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([])
  const [staffList, setStaffList] = useState<AdminUser[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [galleryItems, setGalleryItems] = useState<GalleryEntry[]>([])
  
  // Form State
  const [newAdmin, setNewAdmin] = useState({ email: '', password: '' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [newPost, setNewPost] = useState({ title: '', description: '' })
  const [showAddPostForm, setShowAddPostForm] = useState(false)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: '',
    description: '',
    rating: 5.0,
    inStock: true,
  })

  useEffect(() => {
    // Check if admin is authenticated
    const adminAuth = localStorage.getItem('adminAuth')
    const userRole = localStorage.getItem('userRole')

    if (adminAuth === 'true' && userRole === 'admin') {
      setIsAuthenticated(true)
    } else {
      // If not an admin, send them to admin login
      toast({
        title: "Access Denied",
        description: "Admin privileges required to access this page.",
        variant: "destructive"
      })
      router.push('/auth/admin')
    }
    setIsLoading(false)
  }, [router, toast])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    })
    router.push('/auth/admin')
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products')
      const data = await res.json()
      if (data.success) {
        setProducts(data.data.map((p: any) => ({ ...p, id: p._id || p.id })))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchRegisteredUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/users')
      const data = await res.json()
      if (data.success) {
        setRegisteredUsers(data.data.map((u: any) => ({ ...u, id: u._id || u.id })))
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchStaff = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/all')
      const data = await res.json()
      if (data.success) {
        setStaffList(data.data.map((s: any) => ({ ...s, id: s._id || s.id })))
      }
    } catch (error) {
      console.error('Error fetching staff:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders')
      const data = await res.json()
      if (data.success) {
        setOrders(data.data.map((o: any) => ({ ...o, id: o._id || o.id })))
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts')
      const data = await res.json()
      if (data.success) {
        setPosts(data.data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const fetchGallery = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users')
      const data = await res.json()
      if (data.success) {
        setGalleryItems(data.data)
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
    }
  }

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm('Are you sure you want to remove this gallery entry?')) return
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast({ title: "Success", description: "Gallery entry removed" })
        fetchGallery()
      }
    } catch (error) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" })
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/api/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin)
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: "Success", description: "New admin added successfully" })
        setNewAdmin({ email: '', password: '' })
        fetchStaff()
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create admin", variant: "destructive" })
    }
  }

  const handleDeleteAdmin = async (id: string, email: string) => {
    if (email === 'admin@malarsilks.com') {
      toast({ title: "Restricted", description: "Cannot delete primary administrator", variant: "destructive" })
      return
    }

    if (!confirm('Are you sure you want to remove this admin?')) return

    try {
      const res = await fetch(`http://localhost:5000/api/admin/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast({ title: "Success", description: "Admin removed" })
        fetchStaff()
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete admin", variant: "destructive" })
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchRegisteredUsers()
    fetchStaff()
    fetchOrders()
    fetchPosts()
    fetchGallery()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category || !selectedFile) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and upload an image.",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData()
    formData.append('name', newProduct.name)
    formData.append('price', String(newProduct.price))
    formData.append('category', newProduct.category)
    formData.append('description', newProduct.description || '')
    formData.append('image', selectedFile)

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: "Success", description: "Product saved successfully!" })
        fetchProducts()
        setShowAddForm(false)
        setNewProduct({ name: '', price: 0, category: '', description: '' })
        setSelectedFile(null)
        setImagePreview('')
      }
    } catch (error) {
      toast({ title: "Error", description: "Could not save product", variant: "destructive" })
    }
  }

  const handleUpdateProduct = async () => {
    if (!editingProductId || !newProduct.name || !newProduct.price || !newProduct.category) {
      toast({ title: "Error", description: "Required fields missing", variant: "destructive" })
      return
    }

    const formData = new FormData()
    formData.append('name', newProduct.name)
    formData.append('price', String(newProduct.price))
    formData.append('category', newProduct.category)
    formData.append('description', newProduct.description || '')
    formData.append('inStock', String(newProduct.inStock))
    if (selectedFile) formData.append('image', selectedFile)

    try {
      const res = await fetch(`http://localhost:5000/api/products/${editingProductId}`, {
        method: 'PUT',
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: "Success", description: "Product updated!" })
        fetchProducts()
        setEditingProductId(null)
        setShowAddForm(false)
        setNewProduct({ name: '', price: 0, category: '', description: '', inStock: true })
        setSelectedFile(null)
        setImagePreview('')
      }
    } catch (error) {
      toast({ title: "Error", description: "Update failed", variant: "destructive" })
    }
  }

  const startEditProduct = (product: Product) => {
    setEditingProductId(product.id)
    setNewProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      inStock: product.inStock
    })
    setImagePreview(product.image)
    setShowAddForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: "Deleted", description: "Product removed successfully" })
        fetchProducts()
      }
    } catch (error) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Error", description: "Image size must be less than 5MB", variant: "destructive" })
        return
      }
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setImagePreview('')
    setNewProduct({...newProduct, image: ''})
  }

  // Real stats for dashboard
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.filter(o => o.status !== 'Cancelled').reduce((sum, order) => sum + (order.totalPrice || 0), 0),
    totalCustomers: registeredUsers.length,
    totalStaff: staffList.length,
    totalGallery: galleryItems.length,
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-linear-to-r from-primary/10 to-secondary/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your Malar Silks store</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                Admin Panel
              </Badge>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 border-b pb-0">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Package className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalProducts}</p>
                      <p className="text-muted-foreground text-sm">Total Products</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <ShoppingCart className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalOrders}</p>
                      <p className="text-muted-foreground text-sm">Total Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <BarChart3 className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                      <p className="text-muted-foreground text-sm">Total Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Users className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                      <p className="text-muted-foreground text-sm">Total Customers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalStaff}</p>
                      <p className="text-muted-foreground text-sm">Admin Staff</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <p className="text-center py-4 text-muted-foreground">No recent orders.</p>
                  ) : (
                    orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                          <p className="text-sm text-muted-foreground">{order.user?.name || 'Guest'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{order.totalPrice.toLocaleString()}</p>
                          <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            {/* Top Action Bar */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Product Management</h2>
              <Button 
                className="flex items-center gap-2" 
                size="lg"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus className="w-5 h-5" />
                Add New Product
              </Button>
            </div>

            {/* Add/Edit Product Form */}
            {showAddForm && (
            <Card className={editingProductId ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {editingProductId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {editingProductId ? 'Edit Product' : 'Add New Product'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                      placeholder="Enter price"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="women">Women</SelectItem>
                        <SelectItem value="men">Men</SelectItem>
                        <SelectItem value="girls">Girls</SelectItem>
                        <SelectItem value="boys">Boys</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Status</Label>
                    <Select 
                      value={newProduct.inStock ? 'true' : 'false'} 
                      onValueChange={(value) => setNewProduct({...newProduct, inStock: value === 'true'})}
                    >
                      <SelectTrigger id="stock">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">In Stock</SelectItem>
                        <SelectItem value="false">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="image">Product Image</Label>
                    <div className="mt-2 space-y-3">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label htmlFor="image" className="cursor-pointer flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Click to upload image</p>
                            <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        </label>
                      </div>
                      
                      {imagePreview && (
                        <div className="relative inline-block w-full">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full max-w-xs h-32 object-cover rounded-lg mx-auto"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={clearImage}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Enter product description"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button 
                    onClick={editingProductId ? handleUpdateProduct : handleAddProduct} 
                    size="lg" 
                    className="flex-1 shadow-primary/20 hover:shadow-primary/40"
                  >
                    {editingProductId ? 'Update Product' : 'Save Product to Database'}
                  </Button>
                  {editingProductId && (
                    <Button 
                      variant="outline" 
                      size="lg" 
                      onClick={() => {
                        setEditingProductId(null)
                        setShowAddForm(false)
                        setNewProduct({ name: '', price: 0, category: '', description: '', inStock: true })
                        setImagePreview('')
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            )}

            {/* Products List */}
            <Card>
              <CardHeader>
                <CardTitle>Product Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.jpg'
                          }}
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">₹{product.price} • {product.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={product.inStock ? 'default' : 'secondary'}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startEditProduct(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground">
                      No orders placed yet.
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="p-4 border rounded-xl hover:bg-accent/5 transition-colors">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <p className="font-bold text-lg">{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.user?.name || 'Guest'} • {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs mt-1 italic text-muted-foreground">
                              {order.orderItems.length} items • {order.shippingAddress.city}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                            <p className="font-bold text-primary">₹{order.totalPrice.toLocaleString()}</p>
                            <Badge 
                              variant={
                                order.status === 'Delivered' ? 'default' : 
                                order.status === 'Pending' ? 'secondary' : 
                                order.status === 'Cancelled' ? 'destructive' : 'outline'
                              }
                            >
                              {order.status}
                            </Badge>
                            
                            <Select 
                              onValueChange={(val) => {
                                fetch(`http://localhost:5000/api/orders/${order._id}/status`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ status: val })
                                }).then(res => res.json()).then(data => {
                                  if (data.success) {
                                    toast({ title: "Updated", description: "Order status changed" })
                                    fetchOrders()
                                  }
                                })
                              }}
                              defaultValue={order.status}
                            >
                              <SelectTrigger className="w-[130px] h-8">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Processing">Processing</SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Customer Directory</span>
                  <Badge variant="outline">{registeredUsers.length} Customers</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {registeredUsers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                      No customers found in database.
                    </div>
                  ) : (
                    registeredUsers.map((user) => (
                      <div key={user.id} className="p-6 border rounded-2xl hover:bg-accent/5 transition-colors shadow-soft">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-bold">{user.name}</p>
                              {user.name.toLowerCase().includes('admin') && <Badge>Staff</Badge>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm text-muted-foreground">
                              <p className="flex items-center gap-2">
                                <Mail className="w-4 h-4" /> {user.email}
                              </p>
                              {user.phone && (
                                <p className="flex items-center gap-2">
                                  📞 {user.phone}
                                </p>
                              )}
                              {user.address && (
                                <p className="flex items-center gap-2 md:col-span-2">
                                  🏠 {user.address}, {user.city} - {user.pincode}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex flex-col justify-end">
                            <p className="text-xs text-muted-foreground">Registered on</p>
                            <p className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add New Admin Form */}
              <Card className="lg:col-span-1 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle>Add New Admin</CardTitle>
                  <CardDescription>Grant store access to a new team member</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateAdmin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email Address</Label>
                      <Input 
                        id="admin-email"
                        type="email" 
                        placeholder="admin@example.com"
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                        required
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Initial Password</Label>
                      <Input 
                        id="admin-password"
                        type="password"
                        placeholder="••••••••"
                        value={newAdmin.password}
                        onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                        required
                        minLength={6}
                        className="bg-background"
                      />
                    </div>
                    <Button type="submit" className="w-full shadow-lg shadow-primary/20">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Team Member
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Staff List */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Administrative Staff</CardTitle>
                  <CardDescription>Active users with management privileges</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {staffList.map((admin) => (
                      <div key={admin.id} className="flex items-center justify-between p-4 border rounded-2xl hover:bg-accent/5 transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-bold text-lg">
                            {admin.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{admin.email}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              Active Member • Added {new Date(admin.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {admin.email === 'admin@malarsilks.com' ? (
                            <Badge variant="outline" className="text-primary border-primary">Owner</Badge>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                              onClick={() => handleDeleteAdmin(admin._id, admin.email)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Manage Posts</h2>
              <Button 
                className="flex items-center gap-2" 
                size="lg"
                onClick={() => setShowAddPostForm(!showAddPostForm)}
              >
                <Plus className="w-5 h-5" />
                Add New Post
              </Button>
            </div>

            {/* Add Post Form */}
            {showAddPostForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create New Post
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="post-title">Post Title *</Label>
                      <Input
                        id="post-title"
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                        placeholder="Enter post title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="post-image">Post Image *</Label>
                      <div className="mt-2 space-y-3">
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                          <input
                            id="post-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label htmlFor="post-image" className="cursor-pointer flex flex-col items-center gap-2">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Click to upload post image</p>
                              <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                            </div>
                          </label>
                        </div>
                        {imagePreview && (
                          <div className="relative inline-block">
                            <img
                              src={imagePreview}
                              alt="Post Preview"
                              className="w-full max-w-sm h-48 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={clearImage}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="post-desc">Description *</Label>
                      <Textarea
                        id="post-desc"
                        value={newPost.description}
                        onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                        placeholder="Enter post description"
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <Button 
                      onClick={async () => {
                        if (!newPost.title || !newPost.description || !selectedFile) {
                          toast({ title: "Error", description: "Please fill in all fields and provide an image.", variant: "destructive" });
                          return;
                        }
                        const formData = new FormData();
                        formData.append('title', newPost.title);
                        formData.append('description', newPost.description);
                        formData.append('image', selectedFile);

                        try {
                          const res = await fetch('http://localhost:5000/api/posts', {
                            method: 'POST',
                            body: formData
                          });
                          const data = await res.json();
                          if (data.success) {
                            toast({ title: "Success", description: "Post added successfully!" });
                            fetchPosts();
                            setShowAddPostForm(false);
                            setNewPost({ title: '', description: '' });
                            clearImage();
                          }
                        } catch (err) {
                          toast({ title: "Error", description: "Failed to add post", variant: "destructive" });
                        }
                      }} 
                      size="lg" 
                    >
                      Publish Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts List */}
            <Card>
              <CardHeader>
                <CardTitle>All Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.length === 0 ? (
                    <p className="text-center py-4 text-muted-foreground">No posts created yet.</p>
                  ) : (
                    posts.map(post => (
                      <div key={post._id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-xl hover:bg-accent/5">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className="w-full md:w-32 h-32 object-cover rounded-lg" 
                          onError={(e) => e.currentTarget.src = '/placeholder.jpg'}
                        />
                        <div className="flex-1 space-y-2">
                          <h3 className="text-lg font-bold">{post.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>
                          <p className="text-xs text-muted-foreground border-t pt-2 w-max">
                            Created: {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={async () => {
                              if (!confirm('Are you sure you want to delete this post?')) return;
                              try {
                                const res = await fetch(`http://localhost:5000/api/posts/${post._id}`, { method: 'DELETE' });
                                if (res.ok) {
                                  toast({ title: 'Deleted', description: 'Post deleted successfully' });
                                  fetchPosts();
                                }
                              } catch(e) {
                                toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
                              }
                            }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gallery Management</h2>
              <Badge variant="outline">{galleryItems.length} Submissions</Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Community Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryItems.length === 0 ? (
                    <p className="col-span-full text-center py-10 text-muted-foreground border-2 border-dashed rounded-xl">
                      No gallery submissions yet.
                    </p>
                  ) : (
                    galleryItems.map((item) => (
                      <div key={item._id} className="group relative bg-accent/5 rounded-2xl overflow-hidden border hover:border-primary/30 transition-all">
                        <div className="aspect-square relative">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => e.currentTarget.src = '/placeholder.jpg'}
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8 rounded-full shadow-lg"
                              onClick={() => handleDeleteGalleryItem(item._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 space-y-1">
                          <p className="font-bold text-foreground truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.email}</p>
                          <p className="text-[10px] text-muted-foreground pt-2 border-t mt-2">
                            Submitted: {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
