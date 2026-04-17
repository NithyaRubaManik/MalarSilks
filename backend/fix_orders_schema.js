const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: (process.env.NODE_ENV === 'production' || (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('onrender.com')))
        ? { rejectUnauthorized: false } 
        : false
});

const fixOrders = async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to PostgreSQL for schema fix...');

        // 1. Fix orders table
        console.log('Updating orders table structure...');
        
        // Add columns if they don't exist
        await client.query(`
            DO $$ 
            BEGIN 
                -- Add user_id if missing
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'user_id') THEN
                    ALTER TABLE orders ADD COLUMN user_id INTEGER;
                END IF;

                -- Add shipping_address if missing
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_address') THEN
                    ALTER TABLE orders ADD COLUMN shipping_address TEXT;
                END IF;

                -- Add payment_method if missing
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_method') THEN
                    ALTER TABLE orders ADD COLUMN payment_method VARCHAR(100);
                END IF;

                -- Add delivered_at if missing
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'delivered_at') THEN
                    ALTER TABLE orders ADD COLUMN delivered_at TIMESTAMP;
                END IF;

                -- Allow email to be NULL
                ALTER TABLE orders ALTER COLUMN email DROP NOT NULL;
                
            END $$;
        `);

        // 2. Create order_items table if not exist
        console.log('Creating order_items table if not exists...');
        await client.query(`
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
        `);

        console.log('Schema update complete.');
        client.release();
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('Error fixing orders schema:', error);
        process.exit(1);
    }
};

fixOrders();
