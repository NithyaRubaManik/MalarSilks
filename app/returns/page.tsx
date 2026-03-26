import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, Truck, Shield, Phone, Mail, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Returns & Exchanges - Malar Silks',
  description: 'Learn about our returns and exchanges policy at Malar Silks. We want you to be completely satisfied with your purchase.',
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
        <div className="bg-linear-to-r from-primary/10 to-secondary/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Returns & Exchanges
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your satisfaction is our priority. Learn about our hassle-free returns and exchanges policy.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Return Policy Overview */}
        <div className="mb-16">
          <Card className="bg-linear-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-8">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                  30-Day Return Policy
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  We offer a 30-day return policy on all our products. If you're not completely satisfied,
                  you can return your purchase for a full refund or exchange.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Return Conditions */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-12">
            Return Conditions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-6 h-6" />
                  Eligible for Return
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Items in original condition and packaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Tags and labels still attached</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Within 30 days of purchase</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Valid proof of purchase</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Items not worn or washed</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-6 h-6" />
                  Not Eligible for Return
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                    <span>Items damaged due to wear and tear</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                    <span>Custom or made-to-order items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                    <span>Items washed or altered</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                    <span>More than 30 days from purchase</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                    <span>Without original packaging</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How to Return */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-12">
            How to Return or Exchange
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-serif font-bold text-xl mb-4">Contact Us</h3>
                <p className="text-muted-foreground">
                  Call us at 094432 50387 or email hello@malarsilks.com to initiate your return request.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-serif font-bold text-xl mb-4">Pack & Ship</h3>
                <p className="text-muted-foreground">
                  Pack the item securely in its original packaging and ship it to our store address.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-serif font-bold text-xl mb-4">Refund/Exchange</h3>
                <p className="text-muted-foreground">
                  Once received, we'll process your refund or send your exchange within 5-7 business days.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Exchange Information */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Exchange Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-serif font-bold text-lg mb-4">Size Exchanges</h4>
                  <p className="text-muted-foreground mb-4">
                    If you need a different size, we can exchange your item for the correct size at no additional cost.
                    Simply bring the item back to our store or ship it to us.
                  </p>
                  <Badge variant="secondary" className="text-green-700 bg-green-100">
                    Free Exchange
                  </Badge>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg mb-4">Style Exchanges</h4>
                  <p className="text-muted-foreground mb-4">
                    Want a different style or color? Exchange for any item of equal or lesser value.
                    Pay the difference for higher-priced items.
                  </p>
                  <Badge variant="secondary" className="text-blue-700 bg-blue-100">
                    Price Difference Applies
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipping & Processing */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-6 h-6 text-primary" />
                  Return Shipping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Return shipping costs are the responsibility of the customer, except in cases of defective items
                    or our shipping error.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Free Return Shipping:</strong> Available for defective items or wrong items shipped by us.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary" />
                  Processing Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Return Processing</span>
                      <span className="font-medium">2-3 business days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Refund Processing</span>
                      <span className="font-medium">5-7 business days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Exchange Processing</span>
                      <span className="font-medium">3-5 business days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Refund Methods */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Refund Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">₹</span>
                  </div>
                  <h4 className="font-serif font-bold mb-2">Cash Refund</h4>
                  <p className="text-muted-foreground text-sm">
                    Instant cash refund available at our store location.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">💳</span>
                  </div>
                  <h4 className="font-serif font-bold mb-2">Card Refund</h4>
                  <p className="text-muted-foreground text-sm">
                    Refund processed to original payment method within 5-7 days.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">🏪</span>
                  </div>
                  <h4 className="font-serif font-bold mb-2">Store Credit</h4>
                  <p className="text-muted-foreground text-sm">
                    Store credit valid for 6 months on future purchases.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="bg-linear-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-center">Need Help with Your Return?</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <Phone className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-serif font-bold mb-1">Call Us</h4>
                <p className="text-muted-foreground">094432 50387</p>
              </div>
              <div>
                <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-serif font-bold mb-1">Email Us</h4>
                <p className="text-muted-foreground">hello@malarsilks.com</p>
              </div>
              <div>
                <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-serif font-bold mb-1">Visit Us</h4>
                <p className="text-muted-foreground">8/213, Rajapalayam Road</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Pro Tip:</strong> Keep your order number and proof of purchase handy when contacting us about returns.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
