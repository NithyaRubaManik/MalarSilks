const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: (process.env.NODE_ENV === 'production' || (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('onrender.com')))
        ? { rejectUnauthorized: false } 
        : false
});

const secureAdmin = async () => {
    try {
        console.log('Connecting to PostgreSQL for safety cleanup...');
        const client = await pool.connect();
        
        const newEmail = 'malarsilkskarivalam@gmail.com';
        const newPass = 'Malarsilks@2026';
        const oldEmail = 'admin@malarsilks.com';

        // 1. Clear ALL admins from the 'admins' table first To ensure full safety
        console.log('Clearing old admin accounts from "admins" table...');
        await client.query('DELETE FROM admins');

        // 2. Add the NEW strong admin
        console.log(`Adding strong admin: ${newEmail}...`);
        const hashedPassword = await bcrypt.hash(newPass, 10);
        await client.query('INSERT INTO admins (email, password) VALUES ($1, $2)', [newEmail, hashedPassword]);

        // 3. Clear admin roles from 'users' table too for complete safety
        console.log('Cleaning up admin accounts in the "users" table...');
        await client.query('DELETE FROM users WHERE role = $1 OR email = $2', ['admin', oldEmail]);

        // 4. Optionally add the new admin to 'users' table with admin role if needed by frontend
        console.log('Adding new admin to "users" table for system consistency...');
        await client.query(`
            INSERT INTO users (name, email, password, role, city) 
            VALUES ($1, $2, $3, $4, $5)
        `, ['Secure Admin', newEmail, hashedPassword, 'admin', 'Karivalam']);

        console.log('--- SAFETY REPORT ---');
        console.log(`NEW ADMIN: ${newEmail}`);
        console.log(`OLD ADMIN (${oldEmail}): REMOVED from all tables.`);
        console.log('All other admin accounts: DELETED.');
        
        client.release();
        console.log('Safety setup complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error during safety setup:', error);
        process.exit(1);
    }
};

secureAdmin();
