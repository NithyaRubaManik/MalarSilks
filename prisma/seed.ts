import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const CATEGORIES = [
  { id: 'women', name: 'Women', description: 'Traditional and modern silk sarees and attires', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop' },
  { id: 'men', name: 'Men', description: 'Elegant silk kurtas, dhotis, and formal wear', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  { id: 'girls', name: 'Girls', description: 'Colorful lehengas and ethnic wear for girls', image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop' },
  { id: 'boys', name: 'Boys', description: 'Stylish traditional kurtas and sets for boys', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
]

const PRODUCTS = [
  // Women's Collection
  {
    name: 'Traditional Silk Saree',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=500&fit=crop',
    categoryId: 'women',
    description: 'Elegant traditional silk saree with intricate zari work and beautiful patterns.',
    isFeatured: true,
  },
  {
    name: 'Silk Anarkali Dress',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=500&fit=crop',
    categoryId: 'women',
    description: 'Stunning Anarkali dress with silk fabric and embroidered details.',
    isFeatured: true,
  },
  // Men's Collection
  {
    name: 'Silk Kurta',
    price: 3299,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    categoryId: 'men',
    description: 'Traditional silk kurta with fine craftsmanship and elegant patterns.',
    isFeatured: true,
  },
  {
    name: 'Silk Sherwani',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    categoryId: 'men',
    description: 'Premium silk sherwani for weddings and special occasions.',
    isFeatured: true,
  },
  // Girls' Collection
  {
    name: 'Girls Lehenga Choli',
    price: 2299,
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=500&fit=crop',
    categoryId: 'girls',
    description: 'Colorful lehenga choli set with silk and embroidery work.',
    isFeatured: true,
  },
  // Boys' Collection
  {
    name: 'Boys Silk Kurta',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    categoryId: 'boys',
    description: 'Comfortable silk kurta for boys with traditional design.',
    isFeatured: true,
  },
]

async function main() {
  console.log('Start seeding...')

  // Clear existing data
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.customer.deleteMany({})

  // Seed Categories
  for (const category of CATEGORIES) {
    await prisma.category.create({
      data: category,
    })
  }

  // Seed Products
  for (const product of PRODUCTS) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
