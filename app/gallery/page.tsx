'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Upload, User, Mail, Camera, Loader2, Image as ImageIcon, ArrowRight, Sparkles } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { CONFIG } from '@/lib/config'

interface UserData {
  id: string
  _id: string
  name: string
  email: string
  image: string
  comment: string
  createdAt: string
}

export default function GalleryPage() {
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [comment, setComment] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)

  const getFullImageUrl = (path: string) => CONFIG.IMAGES.getSecureImageUrl(path)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${CONFIG.API.BASE_URL}/api/users`)
      const data = await res.json()
      if (data.success) setUsers(data.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setFetching(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !file) {
      toast({ title: 'Error', description: 'Please fill all fields and select an image.', variant: 'destructive' })
      return
    }
    setLoading(true)
    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('comment', comment)
    formData.append('image', file)
    try {
      const res = await fetch(`${CONFIG.API.BASE_URL}/api/upload`, { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        toast({ title: 'Uploaded!', description: 'Your photo has been sent for admin approval.' })
        setName(''); setEmail(''); setComment(''); setFile(null); setPreview(null)
        fetchUsers()
      } else throw new Error(data.message || 'Upload failed')
    } catch (error: any) {
      toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50/20 to-amber-50/30 pt-20 pb-20">

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-800 via-red-700 to-red-900 mb-14">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-300 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <span className="inline-flex items-center gap-2 text-amber-400 text-[11px] font-black uppercase tracking-[0.4em] mb-4">
            <Sparkles className="w-3 h-3" /> Malar Silks Studio
          </span>
          <h1 className="text-5xl md:text-6xl font-serif font-black text-white mb-4">
            The <span className="text-amber-400 italic">Lookbook</span>
          </h1>
          <p className="text-red-200 text-lg font-medium max-w-xl">
            Stories told through silk, shared by our community of modern patrons.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40L1440 40L1440 20C1200 0 960 40 720 20C480 0 240 40 0 20V40Z" fill="#fef7ee" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Upload Section */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
                <h2 className="font-black text-white text-xl">Join the Collection</h2>
                <p className="text-red-200 text-sm mt-1">Share your style with the community</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                    <User className="w-3 h-3" /> Full Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Rao"
                    className="w-full bg-gray-50 border-2 border-gray-200 hover:border-red-300 focus:border-red-500 py-4 px-5 rounded-2xl focus:bg-white transition-all outline-none text-sm font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@example.com"
                    className="w-full bg-gray-50 border-2 border-gray-200 hover:border-red-300 focus:border-red-500 py-4 px-5 rounded-2xl focus:bg-white transition-all outline-none text-sm font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                    Review / Comment
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about our silks..."
                    rows={3}
                    className="w-full bg-gray-50 border-2 border-gray-200 hover:border-red-300 focus:border-red-500 py-4 px-5 rounded-2xl focus:bg-white transition-all outline-none text-sm font-semibold resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Your Photo</label>
                  <label className="group/drop relative block w-full h-44 border-2 border-dashed border-gray-200 hover:border-red-400 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden bg-gray-50 hover:bg-red-50/30">
                    {preview ? (
                      <div className="absolute inset-0">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/drop:scale-110" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
                          <Camera className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-gray-700 mb-1">Click to Select Photo</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">JPG, PNG — Max 5MB</p>
                        </div>
                      </div>
                    )}
                    <input type="file" onChange={handleFileChange} className="sr-only" accept="image/*" />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-gradient-to-r from-red-600 to-red-700 text-white font-black text-sm uppercase tracking-[0.15em] rounded-2xl shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Uploading...</>
                  ) : (
                    <> Submit Entry <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="lg:col-span-8 space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-serif font-black text-gray-900">Latest Inspirations</h3>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-red-600 mt-2">
                  {users.length} Community Submissions
                </p>
              </div>
              <Link
                href="/shop"
                className="hidden md:flex items-center gap-2 px-5 py-3 bg-white border-2 border-red-200 hover:border-red-500 text-red-700 font-black text-sm rounded-xl transition-all hover:bg-red-50"
              >
                Shop Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {fetching ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-6">
                <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 animate-pulse">Loading Gallery...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200 space-y-6">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-10 h-10 text-red-300" />
                </div>
                <div>
                  <h4 className="text-2xl font-serif font-black text-gray-800 mb-3">Gallery is Empty</h4>
                  <p className="text-gray-500 italic font-medium max-w-xs mx-auto">Be the first to share your style with the Malar Silks community!</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {users.map((user, index) => (
                  <div
                    key={user.id || user._id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-100/80 border border-gray-100 hover:border-red-100 hover:-translate-y-1 transition-all duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-red-50 to-orange-50">
                      <img
                        src={getFullImageUrl(user.image)}
                        alt={user.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <p className="text-white font-serif font-bold text-xl">{user.name}</p>
                          <div className="flex items-center gap-2 text-white/70 text-xs font-bold mt-1">
                            <Mail className="w-3 h-3" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded-full">
                          Community Member
                        </span>
                        <h4 className="font-serif font-bold text-gray-900 text-lg mt-2">{user.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                          {user.createdAt ? new Date(user.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Recently Added'}
                        </p>
                      </div>
                     <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-700 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-black/[0.02] hover:bg-red-50 transition-all hover:-translate-y-0.5"
                        >
                          View
                        </button>
                        <Link
                          href="/shop"
                          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all hover:-translate-y-0.5"
                        >
                          Shop <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Image Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedUser(null)} />
          <div className="relative w-full max-w-5xl h-full max-h-[90vh] bg-white rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-500">
            {/* Modal Image */}
            <div className="flex-1 bg-black relative">
              <img
                src={getFullImageUrl(selectedUser.image)}
                alt={selectedUser.name}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-6 left-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all md:hidden"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="w-full md:w-80 lg:w-96 bg-white p-8 md:p-10 flex flex-col justify-between border-l border-gray-100">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 px-3 py-1 bg-red-50 rounded-full">Community Entry</span>
                   <button onClick={() => setSelectedUser(null)} className="hidden md:block w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                      <X className="w-5 h-5 text-gray-400" />
                   </button>
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-serif font-black text-gray-900 leading-tight">{selectedUser.name}</h2>
                  <div className="space-y-2">
                     <p className="flex items-center gap-3 text-sm font-bold text-gray-500">
                        <Mail className="w-4 h-4 text-red-300" /> {selectedUser.email}
                     </p>
                     <p className="flex items-center gap-3 text-sm font-bold text-gray-500">
                        <ImageIcon className="w-4 h-4 text-red-300" /> Malar Silks Patrons
                     </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-orange-50/50 border border-orange-100 italic font-medium text-gray-600 text-sm leading-relaxed">
                  &quot;{selectedUser.comment || "No specific review shared, but the style speaks for itself!"}&quot;
                </div>
              </div>

              <div className="pt-8 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Shared on {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Recent Date'}
                  </p>
                 <Link
                    href="/shop"
                    className="w-full py-5 bg-gradient-to-r from-red-600 to-red-700 text-white font-black text-sm uppercase tracking-[0.15em] rounded-2xl shadow-xl shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3"
                  >
                    View in Shop <ArrowRight className="w-4 h-4" />
                  </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { X, ChevronLeft } from 'lucide-react'
