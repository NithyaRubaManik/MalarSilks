const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '1234',
  port: 5432,
});

async function listDbs() {
  try {
    await client.connect();
    const res = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false;');
    console.log('Databases:', res.rows.map(r => r.datname));
    await client.end();
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err.message);
  }
}

listDbs();
