import { Product } from './app-context'

export const PRODUCTS: Product[] = [
  // Women's Collection
  {
    id: '507f1f77bcf86cd799439011',
    name: 'Traditional Silk Saree',
    price: 4999,
    image: 'https://media.urbanwomania.com/wp-content/uploads/2023/11/Almond-Beige-Kanjivaram-Silk-Saree.webp',
    category: 'women',
    description: 'Elegant traditional silk saree with intricate zari work and beautiful patterns.',
    rating: 4.8,
    inStock: true,
  },
  {
    id: '507f1f77bcf86cd799439012',
    name: 'Contemporary Kurti',
    price: 2499,
    image: 'https://tse3.mm.bing.net/th/id/OIP.X1HcbPYF5kkPolhasqK6JwHaKX?rs=1&pid=ImgDetMain&o=7&rm=3',
    category: 'women',
    description: 'Modern kurti with traditional designs, perfect for casual and semi-formal occasions.',
    rating: 4.6,
    inStock: true,
  },
  {
    id: '507f1f77bcf86cd799439013',
    name: 'Silk Anarkali Dress',
    price: 3499,
    image: 'https://th.bing.com/th/id/OIP.Lzgo4fup29BnmNPor_g5MQHaKL?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    category: 'women',
    description: 'Stunning Anarkali dress with silk fabric and embroidered details.',
    rating: 4.7,
    inStock: true,
  },
  {
    id: '507f1f77bcf86cd799439014',
    name: 'Printed Cotton Dress',
    price: 1899,
    image: 'https://stylishlyme.com/wp-content/uploads/2015/09/how-to-dress-like-a-professional-woman.jpg',
    category: 'women',
    description: 'Comfortable cotton dress with beautiful traditional prints.',
    rating: 4.5,
    inStock: true,
  },

  // Men's Collection
  {
    id: '507f1f77bcf86cd799439015',
    name: 'Silk Kurta',
    price: 3299,
    image: 'https://cdn.exoticindia.com/images/products/original/textiles-2019/baa700.jpg',
    category: 'men',
    description: 'Traditional silk kurta with fine craftsmanship and elegant patterns.',
    rating: 4.7,
    inStock: true,
  },
  {
    id: '507f1f77bcf86cd799439016',
    name: 'Dhoti and Kurta Set',
    price: 2899,
    image: 'https://cdn.exoticindia.com/images/products/original/textiles-2019/bad482-cream.jpg',
    category: 'men',
    description: 'Traditional dhoti with kurta set, perfect for festive occasions.',
    rating: 4.6,
    inStock: true,
  },
  {
    id: '507f1f77bcf86cd799439017',
    name: 'Modern Casual Shirt',
    price: 1799,
    image: 'https://tse4.mm.bing.net/th/id/OIP.QO4QOUqCKwqCv1m7GsXwIQHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3',
    category: 'men',
    description: 'Contemporary style shirt with traditional textile patterns.',
    rating: 4.5,
    inStock: true,
  },
  {
    id: '507f1f77bcf86cd799439018',
    name: 'Silk Sherwani',
    price: 5999,
    image: 'https://i0.wp.com/www.theunstitchd.com/wp-content/uploads/2017/12/best-sherwani-for-men.jpg?fit=736%2C1104',
    category: 'men',
    description: 'Premium silk sherwani for weddings and special occasions.',
    rating: 4.9,
    inStock: true,
  },

  // Girls' Collection
  {
    id: '507f1f77bcf86cd799439019',
    name: 'Girls Lehenga Choli',
    price: 2299,
    image: 'https://th.bing.com/th/id/OIP.xgiJBSflpp1g2fz4iLDs-wHaJQ?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    category: 'girls',
    description: 'Colorful lehenga choli set with silk and embroidery work.',
    rating: 4.7,
    inStock: true,
  },
  {
    id: '507f1f77bcf86cd799439020',
    name: 'Girls Silk Dress',
    price: 1699,
    image: 'https://tse1.mm.bing.net/th/id/OIP.KAomHx3dLOLsZNSWnwfjcQHaLG?rs=1&pid=ImgDetMain&o=7&rm=3',
    category: 'girls',
    description: 'Elegant silk dress with traditional patterns for girls.',
    rating: 4.6,
    inStock: true,
  },
  {
    id: '507f1f77bcf86cd799439021',
    name: 'Girls Cotton Saree',
    price: 1499,
    image: 'https://th.bing.com/th/id/R.523ebfde1baaefc8f1da15764672673b?rik=L%2f7zsUQGDgwB6w&riu=http%3a%2f%2f5.imimg.com%2fdata5%2fSELLER%2fDefault%2f2023%2f5%2f304714720%2fTL%2fMI%2fJW%2f142530485%2fwhatsapp-image-2023-05-01-at-19-41-15.jpeg&ehk=iugpiYzBN38riPa3rW7CY48H30whwhiGLD0f6DEOH0E%3d&risl=&pid=ImgRaw&r=0',
    category: 'girls',
    description: 'Easy-to-wear cotton saree designed for young girls.',
    rating: 4.5,
    inStock: true,
  },
  {
    id: '507f1f77bcf86cd799439022',
    name: 'Girls Traditional Lehanga',
    price: 1299,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl7w0lkttkMKNv6CaSSnxnMyzJ1X1OYBCLwQ&s',
    category: 'girls',
    description: 'Traditional kurti with fun colors and designs.',
    rating: 4.6,
    inStock: true,
  },

  // Boys' Collection
  {
    id: '507f1f77bcf86cd799439023',
    name: 'Boys Silk Kurta',
    price: 1899,
    image: 'https://gunjfashion.com/cdn/shop/products/green-silk-kurta-pajama-for-boys.jpg?v=1661151717',
    category: 'boys',
    description: 'Comfortable silk kurta for boys with traditional design.',
    rating: 4.7,
    inStock: true,
  },
  {
    id: '507f1f77bcf86cd799439024',
    name: 'Boys Dhoti Set',
    price: 1699,
    image: 'https://assets0.mirraw.com/images/7494439/image_long.jpeg?1570987587',
    category: 'boys',
    description: 'Traditional dhoti with kurta set for young boys.',
    rating: 4.6,
    inStock: true,
  },
  {
    id: '507f1f77bcf86cd799439025',
    name: 'Boys Casual Wear',
    price: 999,
    image: 'https://i.ytimg.com/vi/5O-OC9ICJ2M/oardefault.jpg?sqp=-oaymwEYCJUDENAFSFqQAgHyq4qpAwcIARUAAIhC&rs=AOn4CLARK-_yUjMjozgmuQey1lvu3FARcg&usqp=CCk',
    category: 'boys',
    description: 'Modern casual wear with traditional textile patterns.',
    rating: 4.5,
    inStock: true,
  },
  {
    id: '507f1f77bcf86cd799439026',
    name: 'Boys Festival Outfit',
    price: 1599,
    image: 'https://m.media-amazon.com/images/I/41ZZ2UQbxsL._SY445_SX342_.jpg',
    category: 'boys',
    description: 'Special festival outfit with vibrant colors and designs.',
    rating: 4.7,
    inStock: true,
  },
]

export const CATEGORIES = [
  {
    name: 'Women',
    id: 'women',
    description: 'Traditional and modern silk sarees and attires',
    image: 'https://cdn.uconnectlabs.com/wp-content/uploads/sites/3/2021/04/business-formal-outfit.jpg'
  },
  {
    name: 'Men',
    id: 'men',
    description: 'Elegant formal and casual silk menswear',
    image: 'https://thevou.com/wp-content/uploads/2025/06/two-piece-Business-Professional-suit.jpg'
  },
  {
    name: 'Girls',
    id: 'girls',
    description: 'Colorful traditional lehengas and ethnic wear',
    image: 'https://img.freepik.com/premium-photo/cute-little-girls-picture-ai-generated_1003721-473.jpg'
  },
  {
    name: 'Boys',
    id: 'boys',
    description: 'Stylish traditional kurtas and festival sets',
    image: 'https://static.vecteezy.com/system/resources/thumbnails/033/334/060/small_2x/cute-boy-wearing-blank-empty-white-t-shirt-mockup-for-design-template-ai-generated-free-photo.jpg'
  },
]

export const getProductsByCategory = (category?: string) => {
  if (!category) return PRODUCTS
  return PRODUCTS.filter(p => p.category === category)
}

export const getProductById = (id: string) => {
  return PRODUCTS.find(p => p.id === id)
}

export const getFeaturedProducts = () => {
  return PRODUCTS.filter(p => p.rating >= 4.7).slice(0, 8)
}
