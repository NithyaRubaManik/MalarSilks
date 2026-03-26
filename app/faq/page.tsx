import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { HelpCircle, Phone, Mail, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ - Malar Silks',
  description: 'Frequently asked questions about Malar Silks products, services, and policies. Find answers to common questions.',
}

export default function FAQPage() {
  const faqCategories = [
    {
      title: 'Products & Quality',
      icon: '👗',
      questions: [
        {
          question: 'What types of silk products do you offer?',
          answer: 'We offer a wide range of silk products including traditional sarees, kurtis, anarkali dresses, sherwanis, lehenga choli sets, and children\'s ethnic wear. All our products are made from authentic silk fabrics with traditional craftsmanship.'
        },
        {
          question: 'How do I know if the silk is authentic?',
          answer: 'All our silk products come with authenticity certificates. You can also perform a simple burn test - genuine silk burns slowly and smells like burnt hair, while synthetic fabrics melt and smell chemical.'
        },
        {
          question: 'Do you offer custom sizing?',
          answer: 'Yes, we provide custom sizing services. You can visit our store for measurements, or we can guide you on how to take accurate measurements at home. Custom orders may take 2-4 weeks for completion.'
        },
        {
          question: 'How should I care for my silk garments?',
          answer: 'Silk garments should be dry cleaned or hand washed in cold water with mild detergent. Avoid direct sunlight for prolonged periods, and store in a cool, dry place. We recommend professional dry cleaning for best results.'
        }
      ]
    },
    {
      title: 'Ordering & Shipping',
      icon: '📦',
      questions: [
        {
          question: 'Do you ship outside Tamil Nadu?',
          answer: 'Yes, we ship across India and can arrange international shipping upon request. Shipping costs vary based on location and order value. Free shipping is available for orders above ₹5,000 within Tamil Nadu.'
        },
        {
          question: 'How long does shipping take?',
          answer: 'Within Tamil Nadu: 2-3 business days. Other states: 4-7 business days. International orders: 7-14 business days. You will receive tracking information once your order is shipped.'
        },
        {
          question: 'Can I track my order?',
          answer: 'Yes, you will receive an email with tracking information once your order is shipped. You can also contact us at any time for order status updates.'
        },
        {
          question: 'What if my order arrives damaged?',
          answer: 'Please contact us immediately at 094432 50387 or email hello@malarsilks.com with photos of the damaged item. We will arrange for a replacement or full refund at no cost to you.'
        }
      ]
    },
    {
      title: 'Returns & Exchanges',
      icon: '↩️',
      questions: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy. Items must be in original condition with tags attached and proof of purchase. Custom orders and worn items are not eligible for return.'
        },
        {
          question: 'Can I exchange for a different size?',
          answer: 'Yes, size exchanges are free. Simply bring the item back to our store or ship it to us within 30 days of purchase. We will exchange it for the correct size at no additional cost.'
        },
        {
          question: 'How long does a refund take?',
          answer: 'Refunds are processed within 5-7 business days after we receive your returned item. Cash refunds are available at our store location. Card refunds may take additional 3-5 business days to reflect in your account.'
        },
        {
          question: 'Do I have to pay for return shipping?',
          answer: 'Return shipping costs are the customer\'s responsibility unless the item was defective or we shipped the wrong item. In such cases, we will cover the return shipping costs.'
        }
      ]
    },
    {
      title: 'Alterations & Services',
      icon: '✂️',
      questions: [
        {
          question: 'Do you provide alteration services?',
          answer: 'Yes, we offer professional alteration services at our store. Our experienced tailors can hem, take in, or make other adjustments to ensure perfect fit. Alteration charges start from ₹200 depending on the complexity.'
        },
        {
          question: 'How long do alterations take?',
          answer: 'Simple alterations like hemming take 2-3 days. More complex alterations may take 5-7 days. We recommend planning ahead, especially for special occasions.'
        },
        {
          question: 'Can I bring garments from other stores for alterations?',
          answer: 'Yes, we welcome alteration work for garments purchased elsewhere. However, we cannot be responsible for damage to non-silk fabrics or pre-existing issues with the garment.'
        },
        {
          question: 'Do you offer gift wrapping services?',
          answer: 'Yes, we provide beautiful gift wrapping services for special occasions. Premium gift packaging is available for ₹100-300 depending on the size and complexity of wrapping.'
        }
      ]
    },
    {
      title: 'Store & Contact',
      icon: '🏪',
      questions: [
        {
          question: 'Where is your store located?',
          answer: 'Our store is located at 8/213, Rajapalayam Road, Karivalamvandanallur, Tamil Nadu 627753. We are easily accessible and have parking available for customers.'
        },
        {
          question: 'What are your business hours?',
          answer: 'We are open 7 days a week from 9:00 AM to 9:05 PM. This includes all holidays and festival seasons to serve our customers better.'
        },
        {
          question: 'Do you have a trial room?',
          answer: 'Yes, we have spacious, well-lit trial rooms for your convenience. You can try multiple items and get assistance from our staff for perfect fit and styling suggestions.'
        },
        {
          question: 'Can I bring my own fabric for stitching?',
          answer: 'Yes, we accept custom stitching orders. Bring your fabric along with measurements, and our tailors will create beautiful garments according to your specifications.'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-primary/10 to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find answers to common questions about our products, services, and policies.
              Can't find what you're looking for? Contact us directly.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="text-2xl font-serif flex items-center gap-3">
                  <span className="text-3xl">{category.icon}</span>
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                      <AccordionTrigger className="text-left font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="mt-16">
          <Card className="bg-linear-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-center flex items-center justify-center gap-2">
                <HelpCircle className="w-6 h-6 text-primary" />
                Still Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Can't find the answer you're looking for? Our friendly staff is here to help.
                  Contact us through any of the methods below.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Phone className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-serif font-bold mb-1">Call Us</h4>
                    <p className="text-muted-foreground">094432 50387</p>
                    <Badge variant="outline" className="mt-2">Available 9 AM - 9 PM</Badge>
                  </div>
                  <div className="text-center">
                    <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-serif font-bold mb-1">Email Us</h4>
                    <p className="text-muted-foreground">hello@malarsilks.com</p>
                    <Badge variant="outline" className="mt-2">24/7 Response</Badge>
                  </div>
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-serif font-bold mb-1">Visit Us</h4>
                    <p className="text-muted-foreground">8/213, Rajapalayam Road</p>
                    <Badge variant="outline" className="mt-2">Open Daily</Badge>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg mt-8">
                  <h4 className="font-serif font-bold text-blue-900 mb-2">💡 Pro Tips</h4>
                  <ul className="text-blue-800 text-sm space-y-1 text-left max-w-2xl mx-auto">
                    <li>• Bring reference photos when describing custom orders</li>
                    <li>• Note your order number for faster support</li>
                    <li>• Visit us during weekdays for personalized styling advice</li>
                    <li>• Follow us on social media for latest collections and offers</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
