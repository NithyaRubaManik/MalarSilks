const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Malarsilks',
  password: '1234',
  port: 5432,
});

async function listTables() {
  try {
    await client.connect();
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';");
    console.log('Tables in Malarsilks:', res.rows.map(r => r.table_name));
    await client.end();
  } catch (err) {
    console.error('Error connecting to Malarsilks:', err.message);
  }
}

listTables();
