import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Terms & Conditions - Malar Silks',
  description: 'Read the terms and conditions for shopping at Malar Silks. Understand our policies and your rights.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-primary/10 to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Terms & Conditions
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Please read these terms and conditions carefully before using our services.
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
                Welcome to Malar Silks. These terms and conditions outline the rules and regulations for the use of
                our website and services. By accessing this website or making purchases from our store, you accept
                these terms and conditions in full.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">1. Definitions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>"Company"</strong> refers to Malar Silks</li>
                <li><strong>"Customer" or "You"</strong> refers to the individual accessing our services</li>
                <li><strong>"Products"</strong> refers to silk garments and related items offered for sale</li>
                <li><strong>"Services"</strong> refers to alteration, custom orders, and other services provided</li>
                <li><strong>"Website"</strong> refers to our online presence and e-commerce platform</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">2. Products and Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We offer authentic silk garments including sarees, kurtis, dresses, and traditional wear for
                  men, women, and children. All products are described accurately, and we strive to display
                  colors as accurately as possible.
                </p>
                <p className="text-muted-foreground">
                  Custom orders and alterations are available upon request. All custom work requires advance
                  payment and may have different terms based on complexity and materials required.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">3. Pricing and Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  All prices are listed in Indian Rupees (INR) and are subject to change without notice.
                  The price displayed at the time of purchase will be the final price.
                </p>
                <p className="text-muted-foreground">
                  We accept cash, credit/debit cards, UPI, and other standard payment methods.
                  Payment must be completed before order processing begins.
                </p>
                <p className="text-muted-foreground">
                  For custom orders, 50% advance payment is required. The remaining balance must be paid
                  before delivery.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">4. Orders and Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Orders are processed within 1-2 business days. Delivery times vary by location:
                  2-3 days within Tamil Nadu, 4-7 days for other states, and 7-14 days for international orders.
                </p>
                <p className="text-muted-foreground">
                  We are not responsible for delays caused by shipping carriers or unforeseen circumstances.
                  Risk of loss passes to the customer upon delivery to the carrier.
                </p>
                <p className="text-muted-foreground">
                  Additional charges may apply for expedited shipping or special handling.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">5. Returns and Exchanges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We offer a 30-day return policy for unused items in original condition with tags attached.
                  Custom orders and altered garments are not eligible for return.
                </p>
                <p className="text-muted-foreground">
                  Size exchanges are free within 30 days. Return shipping costs are the customer's responsibility
                  unless the item was defective or we shipped the wrong item.
                </p>
                <p className="text-muted-foreground">
                  Refunds are processed within 5-7 business days after receiving the returned item.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">6. Product Care and Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Silk garments require special care. We recommend professional dry cleaning for best results.
                  Hand washing in cold water with mild detergent is acceptable for some items.
                </p>
                <p className="text-muted-foreground">
                  We are not responsible for damage caused by improper care, wear and tear, or accidents.
                  Color fading may occur over time due to exposure to sunlight and washing.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">7. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All content on our website, including images, text, logos, and designs, are protected by
                copyright and intellectual property laws. You may not reproduce, distribute, or use our
                content without written permission.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">8. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Malar Silks shall not be liable for any indirect, incidental, special, or consequential
                damages arising from the use of our products or services. Our total liability shall not
                exceed the amount paid for the product or service in question.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">9. Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your privacy is important to us. Please review our Privacy Policy, which also governs
                your use of our services, to understand our practices.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">10. Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                These terms and conditions are governed by and construed in accordance with the laws
                of India. Any disputes shall be subject to the exclusive jurisdiction of the courts
                in Tamil Nadu.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">11. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms and conditions at any time. Changes will be
                effective immediately upon posting on our website. Your continued use of our services
                constitutes acceptance of the modified terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">12. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Malar Silks</strong><br />
                    8/213, Rajapalayam Road<br />
                    Karivalamvandanallur, Tamil Nadu 627753
                  </div>
                  <div>
                    <strong>Phone:</strong> 094432 50387<br />
                    <strong>Email:</strong> hello@malarsilks.com<br />
                    <strong>Business Hours:</strong> 9 AM - 9 PM (Daily)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                By using our services or making a purchase, you acknowledge that you have read,
                understood, and agree to be bound by these terms and conditions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
