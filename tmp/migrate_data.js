const { pool } = require('../backend/config/db');
const mongoose = require('mongoose');
const { Pool } = require('pg');
require('dotenv').config({ path: 'backend/.env' });
const dotEnv = require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;
const PASSWORDS = ['1234', 'Nithya@2006', 'malar_password'];

async function tryConnectPg(password) {
    const dbUrl = `postgresql://postgres:${password}@localhost:5432/demodb`;
    const tempPool = new Pool({ connectionString: dbUrl });
    try {
        const client = await tempPool.connect();
        console.log(`✅ Success! Connected to PostgreSQL with password: "${password}"`);
        client.release();
        return tempPool;
    } catch (err) {
        console.log(`❌ Failed with password: "${password}"`);
        await tempPool.end();
        return null;
    }
}

async function migrate() {
    console.log('--- Starting Migration with Password Attempts ---');

    let pool = null;
    for (const pw of PASSWORDS) {
        pool = await tryConnectPg(pw);
        if (pool) break;
    }

    if (!pool) {
        console.error('❌ Could not connect to PostgreSQL with any provided password.');
        console.log('Please ensure Port 5432 is free and the database "demodb" exists.');
        return;
    }

    // Create Tables if not exist
    try {
        console.log('Creating tables if they do not exist...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, name VARCHAR(255), price DECIMAL(10, 2), category VARCHAR(100), image TEXT, description TEXT, in_stock BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255) UNIQUE, password VARCHAR(255), phone VARCHAR(20), address TEXT, city VARCHAR(100), pincode VARCHAR(20), role VARCHAR(20) DEFAULT 'user', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS admins (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE, password VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS gallery_entries (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), image TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS orders (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), shipping_address TEXT, payment_method VARCHAR(50), total_price DECIMAL(10, 2), status VARCHAR(50) DEFAULT 'Pending', delivered_at TIMESTAMP, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS order_items (id SERIAL PRIMARY KEY, order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE, product_id INTEGER, name VARCHAR(255), qty INTEGER, image TEXT, price DECIMAL(10, 2));
            CREATE TABLE IF NOT EXISTS posts (id SERIAL PRIMARY KEY, title VARCHAR(255), description TEXT, image_url TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
        `);
        console.log('✅ Tables are ready.');
    } catch (err) {
        console.error('❌ Error creating tables:', err.message);
        await pool.end();
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        await pool.end();
        return;
    }

    // Define Minimal Schemes
    const Product = mongoose.model('ProductMigration', new mongoose.Schema({}), 'products');
    const User = mongoose.model('UserMigration', new mongoose.Schema({}), 'users');
    const Admin = mongoose.model('AdminMigration', new mongoose.Schema({}), 'admins');
    const Gallery = mongoose.model('GalleryMigration', new mongoose.Schema({}), 'galleryentries');

    try {
        // Products
        const products = await Product.find({});
        for (const p of products) {
            await pool.query(
                'INSERT INTO products (name, price, category, image, description) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
                [p._doc.name, p._doc.price, p._doc.category, p._doc.image, p._doc.description]
            );
        }
        // Users
        const users = await User.find({});
        for (const u of users) {
            await pool.query(
                'INSERT INTO users (name, email, password, phone, address, city, pincode) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING',
                [u._doc.name, u._doc.email, u._doc.password, u._doc.phone, u._doc.address, u._doc.city, u._doc.pincode]
            );
        }
        // Admins
        const admins = await Admin.find({});
        for (const a of admins) {
            await pool.query(
                'INSERT INTO admins (email, password) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                [a._doc.email, a._doc.password]
            );
        }

        console.log('✅ Migration data transferred successfully!');
    } catch (err) {
        console.error('❌ Data Transfer Error:', err.message);
    }

    await mongoose.disconnect();
    await pool.end();
    console.log('--- Migration Finished ---');
}

migrate();
