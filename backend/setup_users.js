const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Malarsilks',
  password: '1234',
  port: 5432,
});

async function setupUsers() {
  try {
    await client.connect();
    
    console.log('Creating users table if not exists...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        pincode VARCHAR(10),
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('Inserting admin and user...');
    
    const adminPassword = await bcrypt.hash('Malarsilks@2026', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    // Clean existing test data to avoid unique constraint errors
    await client.query('DELETE FROM users WHERE email IN ($1, $2)', ['malarsilkskarivalam@gmail.com', 'user@example.com']);

    // Insert Admin
    await client.query(`
      INSERT INTO users (name, email, password, role, city) 
      VALUES ($1, $2, $3, $4, $5)
    `, ['Admin User', 'malarsilkskarivalam@gmail.com', adminPassword, 'admin', 'Chennai']);

    // Insert Regular User
    await client.query(`
      INSERT INTO users (name, email, password, role, city) 
      VALUES ($1, $2, $3, $4, $5)
    `, ['Test User', 'user@example.com', userPassword, 'user', 'Bangalore']);

    console.log('Admin and User added successfully!');
    console.log('Admin: malarsilkskarivalam@gmail.com / Malarsilks@2026');
    console.log('User: user@example.com / user123');
    
    await client.end();
  } catch (err) {
    console.error('Setup Error:', err.message);
    process.exit(1);
  }
}

setupUsers();
