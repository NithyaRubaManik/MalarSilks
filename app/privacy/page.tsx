import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Privacy Policy - Malar Silks',
  description: 'Learn about how Malar Silks collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-primary/10 to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Last Updated: March 6, 2026</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This Privacy Policy describes how Malar Silks ("we," "us," or "our") collects, uses, and protects
                your personal information when you visit our website or make purchases from our store.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">Information We Collect</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-serif font-bold text-lg mb-2">Personal Information</h4>
                  <p className="text-muted-foreground">
                    When you make a purchase or contact us, we may collect: your name, email address, phone number,
                    shipping address, billing address, and payment information.
                  </p>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg mb-2">Usage Information</h4>
                  <p className="text-muted-foreground">
                    We automatically collect information about your visit to our website, including IP address,
                    browser type, pages visited, and time spent on our site.
                  </p>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg mb-2">Communication Data</h4>
                  <p className="text-muted-foreground">
                    When you contact us via phone, email, or our contact form, we may keep records of our
                    communications to better serve you.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Process and fulfill your orders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Provide customer service and support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Send you important updates about your orders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Improve our products and services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Send marketing communications (with your consent)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Comply with legal obligations</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">Information Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your
                information only in the following circumstances:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>With service providers who help us operate our business (payment processors, shipping companies)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>When required by law or to protect our rights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>With your explicit consent</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. This includes secure payment processing and
                encrypted data storage. However, no method of transmission over the internet is 100% secure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">You have the right to:</p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Access the personal information we hold about you</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Correct inaccurate or incomplete information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Request deletion of your personal information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Opt out of marketing communications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Data portability</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our website may use cookies to enhance your browsing experience. Cookies help us understand
                how you use our site and allow us to provide personalized content. You can control cookie
                settings through your browser preferences.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Malar Silks</strong><br />
                    8/213, Rajapalayam Road<br />
                    Karivalamvandanallur, Tamil Nadu 627753
                  </div>
                  <div>
                    <strong>Phone:</strong> 094432 50387<br />
                    <strong>Email:</strong> hello@malarsilks.com
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by
                posting the new policy on this page and updating the "Last Updated" date. We encourage you
                to review this policy periodically.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
