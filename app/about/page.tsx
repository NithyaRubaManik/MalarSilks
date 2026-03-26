import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, Users, Truck, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - Malar Silks',
  description: 'Learn about Malar Silks, your trusted destination for premium traditional and modern silk attires in Tamil Nadu.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-primary/10 to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              About Malar Silks
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Crafting timeless elegance since our establishment, Malar Silks has been your trusted destination
              for premium traditional and modern silk attires in Tamil Nadu.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded with a passion for preserving India's rich textile heritage, Malar Silks began as a small
                  family business in Karivalamvandanallur, Tamil Nadu. What started as a humble silk saree shop has
                  evolved into a comprehensive destination for traditional and contemporary ethnic wear.
                </p>
                <p>
                  Our journey spans generations, with each member of the Malar family bringing their unique expertise
                  and dedication to maintaining the highest standards of quality and craftsmanship. We take pride in
                  offering authentic silk garments that blend traditional techniques with modern sensibilities.
                </p>
                <p>
                  Located at 8/213, Rajapalayam Road, Karivalamvandanallur, Tamil Nadu 627753, we serve customers
                  across the region and beyond, ensuring that the beauty of Indian silk craftsmanship reaches every
                  corner of the world.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-linear-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-primary-foreground text-2xl font-serif font-bold">MS</span>
                  </div>
                  <p className="text-muted-foreground">Traditional Craftsmanship</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-12">Why Choose Malar Silks?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">Premium Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Only the finest silk fabrics sourced from trusted suppliers, ensuring durability and comfort.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">Expert Craftsmanship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Skilled artisans with generations of experience in traditional weaving and embroidery techniques.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Truck className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">Fast Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Quick and reliable delivery service across Tamil Nadu and surrounding regions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">Authentic Guarantee</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Every product comes with authenticity certification and satisfaction guarantee.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Our Collections */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-12">Our Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="aspect-square bg-linear-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👗</span>
              </div>
              <h3 className="font-serif font-bold text-lg mb-2">Women's Collection</h3>
              <p className="text-muted-foreground text-sm">Traditional sarees, kurtis, and modern fusion wear</p>
            </div>

            <div className="text-center">
              <div className="aspect-square bg-linear-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👔</span>
              </div>
              <h3 className="font-serif font-bold text-lg mb-2">Men's Collection</h3>
              <p className="text-muted-foreground text-sm">Kurtas, sherwanis, and dhoti sets</p>
            </div>

            <div className="text-center">
              <div className="aspect-square bg-linear-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👭</span>
              </div>
              <h3 className="font-serif font-bold text-lg mb-2">Girls' Collection</h3>
              <p className="text-muted-foreground text-sm">Lehengas, dresses, and traditional wear</p>
            </div>

            <div className="text-center">
              <div className="aspect-square bg-linear-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👬</span>
              </div>
              <h3 className="font-serif font-bold text-lg mb-2">Boys' Collection</h3>
              <p className="text-muted-foreground text-sm">Kurtas, dhoti sets, and festival outfits</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <Card className="bg-linear-to-r from-primary/5 to-secondary/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">Visit Us Today</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-serif font-bold text-lg mb-2">Address</h4>
                <p className="text-muted-foreground">
                  8/213, Rajapalayam Road<br />
                  Karivalamvandanallur<br />
                  Tamil Nadu 627753
                </p>
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg mb-2">Phone</h4>
                <p className="text-muted-foreground">094432 50387</p>
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg mb-2">Business Hours</h4>
                <p className="text-muted-foreground">
                  Monday - Sunday<br />
                  9:00 AM - 9:05 PM
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
