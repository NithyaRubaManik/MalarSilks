const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: (process.env.NODE_ENV === 'production' || (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('onrender.com')))
        ? { rejectUnauthorized: false } 
        : false
});

const checkOrdersSchema = async () => {
    try {
        const client = await pool.connect();
        
        console.log('--- COLUMNS IN orders TABLE ---');
        const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'orders'");
        res.rows.forEach(r => console.log(` - ${r.column_name} (${r.data_type})`));
        
        if (res.rowCount === 0) {
            console.log('Table "orders" not found.');
        }

        console.log('\n--- TABLES IN PUBLIC SCHEMA ---');
        const tablesRes = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
        tablesRes.rows.forEach(r => console.log(` - ${r.table_name}`));

        client.release();
        await pool.end();
    } catch (error) {
        console.error('Error checking schema:', error);
    }
};

checkOrdersSchema();
