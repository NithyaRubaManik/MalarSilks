const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: (process.env.NODE_ENV === 'production' || (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('onrender.com')))
        ? { rejectUnauthorized: false } 
        : false
});

const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('PostgreSQL Connected');
        client.release();
    } catch (error) {
        console.error(`PostgreSQL Connection Error: ${error.message}`);
        // For development, we don't necessarily want to exit if Postgres isn't running yet
        // but we'll show the error clearly.
    }
};

module.exports = { connectDB, pool };
