const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: (process.env.NODE_ENV === 'production' || (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('onrender.com')))
        ? { rejectUnauthorized: false } 
        : false
});

const fixAdminTable = async () => {
    try {
        console.log('Connecting to PostgreSQL...');
        const client = await pool.connect();
        console.log('Connected.');

        // 1. Create admins table
        console.log('Creating admins table if not exists...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 2. Check if admin@malarsilks.com exists
        const checkResult = await client.query('SELECT * FROM admins WHERE email = $1', ['admin@malarsilks.com']);
        
        if (checkResult.rowCount === 0) {
            console.log('Adding malarsilkskarivalam@gmail.com...');
            const hashedPassword = await bcrypt.hash('Malarsilks@2026', 10);
            await client.query('INSERT INTO admins (email, password) VALUES ($1, $2)', ['malarsilkskarivalam@gmail.com', hashedPassword]);
            console.log('Admin added successfully with password: Malarsilks@2026');
        } else {
            console.log('Admin malarsilkskarivalam@gmail.com already exists.');
            // Optionally update password to ensure it's known
            const hashedPassword = await bcrypt.hash('Malarsilks@2026', 10);
            await client.query('UPDATE admins SET password = $1 WHERE email = $2', [hashedPassword, 'malarsilkskarivalam@gmail.com']);
            console.log('Admin password reset to: Malarsilks@2026');
        }

        // 3. Verify other tables (as in seed function)
        console.log('Verifying other tables...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS gallery_entries (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                image TEXT NOT NULL,
                comment TEXT,
                is_approved BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price FLOAT NOT NULL,
                image TEXT NOT NULL,
                category VARCHAR(100) NOT NULL,
                description TEXT,
                in_stock BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER,
                email VARCHAR(255),
                shipping_address TEXT,
                payment_method VARCHAR(100),
                total_price FLOAT NOT NULL,
                status VARCHAR(50) DEFAULT 'Pending',
                delivered_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                product_id INTEGER,
                name VARCHAR(255) NOT NULL,
                qty INTEGER NOT NULL,
                image TEXT NOT NULL,
                price FLOAT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                image_url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        client.release();
        console.log('Database fix completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing database:', error);
        process.exit(1);
    }
};

fixAdminTable();
