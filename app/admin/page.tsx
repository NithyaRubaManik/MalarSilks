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
import { Plus, Edit, Trash2, Package, Users, ShoppingCart, BarChart3, LogOut, Upload, X, Mail, ShieldCheck, FileText, Image as ImageIcon } from 'lucide-react'
import { CONFIG } from '@/lib/config'

interface Post {
  _id: string
  title: string
  description: string
  imageUrl: string
  createdAt: string
  created_at?: string
}

interface GalleryEntry {
  id: string
  _id: string
  name: string
  email: string
  image: string
  comment: string
  is_approved: boolean
  createdAt: string
  created_at?: string
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
  created_at?: string
}

interface AdminUser {
  _id: string
  id?: string
  email: string
  createdAt: string
  created_at?: string
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
    localStorage.removeItem('adminToken')
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    })
    router.push('/auth/admin')
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch(CONFIG.API.ENDPOINTS.PRODUCTS)
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
      const res = await fetch(`${CONFIG.API.BASE_URL}/api/auth/users`)
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
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`${CONFIG.API.BASE_URL}/api/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
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
      const res = await fetch(CONFIG.API.ENDPOINTS.ORDERS)
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
      const res = await fetch(`${CONFIG.API.BASE_URL}/api/posts`)
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
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`${CONFIG.API.BASE_URL}/api/submissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setGalleryItems(data.data.map((item: any) => ({ ...item, id: item.id || item._id })))
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
    }
  }

  const handleToggleGalleryApproval = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`${CONFIG.API.BASE_URL}/api/submissions/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_approved: !currentStatus })
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: "Updated", description: !currentStatus ? "Entry approved!" : "Entry hidden." })
        fetchGallery()
      }
    } catch (error) {
      toast({ title: "Error", description: "Operation failed", variant: "destructive" })
    }
  }

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm('Are you sure you want to remove this gallery entry?')) return
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`${CONFIG.API.ENDPOINTS.USERS}/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
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
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`${CONFIG.API.BASE_URL}/api/admin/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
    if (email === 'malarsilkskarivalam@gmail.com') {
      toast({ title: "Restricted", description: "Cannot delete primary administrator", variant: "destructive" })
      return
    }

    if (!confirm('Are you sure you want to remove this admin?')) return

    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`${CONFIG.API.BASE_URL}/api/admin/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: "Success", description: "Admin removed" })
        fetchStaff()
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete admin", variant: "destructive" })
    }
  }

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to PERMANENTLY delete this order and its records?')) return
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`${CONFIG.API.BASE_URL}/api/orders/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: "Success", description: "Order deleted successfully" })
        fetchOrders()
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete order", variant: "destructive" })
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
      const token = localStorage.getItem('adminToken')
      const res = await fetch(CONFIG.API.ENDPOINTS.PRODUCTS, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
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
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`${CONFIG.API.ENDPOINTS.PRODUCTS}/${editingProductId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
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
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`${CONFIG.API.ENDPOINTS.PRODUCTS}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
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
    totalRevenue: orders.filter(o => o.status !== 'Cancelled').reduce((sum, order) => sum + (Number(order.totalPrice || order.total_price || 0)), 0),
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
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <ImageIcon className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalGallery}</p>
                      <p className="text-muted-foreground text-sm">Gallery Entries</p>
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
                      <div key={order.id || order._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{String(order.id || order._id || '').substring(0, 8).toUpperCase()}</p>
                          <p className="text-sm text-muted-foreground">{order.user?.name || 'Guest'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{(order.totalPrice || order.total_price || 0).toLocaleString()}</p>
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
                      <div key={order.id || order._id} className={`p-4 border rounded-xl hover:bg-accent/5 transition-colors relative overflow-hidden ${
                        order.status === 'Cancelled' ? 'opacity-60' : 
                        order.status === 'Delivered' ? 'bg-green-50 border-green-200' : 
                        ''
                      }`}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className={order.status === 'Cancelled' ? 'line-through decoration-gray-500 decoration-2' : ''}>
                            <p className="font-bold text-lg">{String(order.id || order._id || '').substring(0, 8).toUpperCase()}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.user?.name || 'Guest'} • {order.createdAt || (order as any).created_at ? new Date((order.createdAt || (order as any).created_at) as string).toLocaleDateString() : 'Recent'}
                            </p>
                            <p className="text-xs mt-1 italic text-muted-foreground">
                              {order.orderItems?.length || 0} items • {order.shippingAddress?.city || 'No City'}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                            <p className="font-bold text-primary">₹{(order.totalPrice || order.total_price || 0).toLocaleString()}</p>
                            <Badge 
                              className={
                                order.status === 'Delivered' ? 'bg-green-500 hover:bg-green-600 text-white' : 
                                order.status === 'Cancelled' ? 'bg-gray-400 hover:bg-gray-500 text-white' : 
                                'bg-red-500 hover:bg-red-600 text-white'
                              }
                            >
                              {order.status}
                            </Badge>
                            
                            <Select 
                              onValueChange={(val) => {
                                fetch(`${CONFIG.API.BASE_URL}/api/orders/${order.id || order._id}/status`, {
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

                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg h-8 w-8"
                              onClick={() => handleDeleteOrder(order.id || order._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
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
                            <p className="text-sm font-medium">
                              {user.createdAt || user.created_at ? new Date((user.createdAt || user.created_at) as string).toLocaleDateString() : 'Recent'}
                            </p>
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
                              Active Member • Added {admin.createdAt || admin.created_at ? new Date((admin.createdAt || admin.created_at) as string).toLocaleDateString() : 'Recent'}
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
                      <div key={item.id} className="group relative bg-accent/5 rounded-2xl overflow-hidden border hover:border-primary/30 transition-all flex flex-col">
                        <div className="aspect-[4/5] relative">
                          <img 
                            src={CONFIG.IMAGES.getSecureImageUrl(item.image)} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => e.currentTarget.src = '/placeholder.jpg'}
                          />
                          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-9 w-9 rounded-full shadow-xl"
                              onClick={() => handleDeleteGalleryItem(item.id)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                          <div className="absolute bottom-3 left-3">
                            <Badge variant={item.is_approved ? "default" : "secondary"} className={item.is_approved ? "bg-green-600" : "bg-orange-500"}>
                              {item.is_approved ? "Visible" : "Pending Approval"}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                               <p className="font-black text-foreground truncate">{item.name}</p>
                               <span className="text-[9px] font-bold text-muted-foreground">{item.createdAt || item.created_at ? new Date((item.createdAt || item.created_at) as string).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'New'}</span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mb-3 flex items-center gap-1">
                               <Mail className="w-3 h-3" /> {item.email}
                            </p>
                            
                             <div className="bg-white/50 border border-gray-100 p-3 rounded-xl italic text-xs text-muted-foreground line-clamp-3">
                                &quot;{item.comment || "No specific review shared."}&quot;
                             </div>
                          </div>

                          <div className="pt-4 flex gap-2">
                             <Button 
                                variant={item.is_approved ? "outline" : "default"}
                                size="sm"
                                className={`flex-1 font-bold ${!item.is_approved ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20" : ""}`}
                                onClick={() => handleToggleGalleryApproval(item.id, item.is_approved)}
                             >
                                {item.is_approved ? "Reject/Hide" : "Approve Submission"}
                             </Button>
                          </div>
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
