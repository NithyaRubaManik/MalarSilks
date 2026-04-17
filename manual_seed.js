const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Malarsilks',
  password: '1234',
  port: 5432,
});

const CATEGORIES = [
  { id: 'women', name: 'Women', description: 'Traditional and modern silk sarees and attires', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop' },
  { id: 'men', name: 'Men', description: 'Elegant silk kurtas, dhotis, and formal wear', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  { id: 'girls', name: 'Girls', description: 'Colorful lehengas and ethnic wear for girls', image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop' },
  { id: 'boys', name: 'Boys', description: 'Stylish traditional kurtas and sets for boys', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
];

const PRODUCTS = [
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
  {
    name: 'Girls Lehenga Choli',
    price: 2299,
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=500&fit=crop',
    categoryId: 'girls',
    description: 'Colorful lehenga choli set with silk and embroidery work.',
    isFeatured: true,
  },
  {
    name: 'Boys Silk Kurta',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    categoryId: 'boys',
    description: 'Comfortable silk kurta for boys with traditional design.',
    isFeatured: true,
  },
];

async function seed() {
  try {
    await client.connect();
    console.log('Clearing data...');
    await client.query('DELETE FROM "OrderItem";');
    await client.query('DELETE FROM "Order";');
    await client.query('DELETE FROM "Product";');
    await client.query('DELETE FROM "Category";');

    console.log('Seeding Categories...');
    for (const c of CATEGORIES) {
      await client.query('INSERT INTO "Category" (id, name, description, image, "updatedAt") VALUES ($1, $2, $3, $4, NOW());', [c.id, c.name, c.description, c.image]);
    }

    console.log('Seeding Products...');
    for (const p of PRODUCTS) {
      await client.query('INSERT INTO "Product" (id, name, price, image, "categoryId", description, "isFeatured", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW());', [Math.random().toString(36).substring(7), p.name, p.price, p.image, p.categoryId, p.description, p.isFeatured]);
    }

    console.log('Seeding finished.');
    await client.end();
  } catch (err) {
    console.error('Seed Error:', err.message);
    process.exit(1);
  }
}

seed();
