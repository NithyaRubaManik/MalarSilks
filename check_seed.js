const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Malarsilks',
  password: '1234',
  port: 5432,
});

async function checkCounts() {
  try {
    await client.connect();
    const tables = ['Category', 'Product', 'Customer', 'Order', 'OrderItem'];
    for (const table of tables) {
      const res = await client.query(`SELECT COUNT(*) FROM "${table}";`);
      console.log(`${table} count: ${res.rows[0].count}`);
    }
    await client.end();
  } catch (err) {
    console.error('Error checking counts:', err.message);
  }
}

checkCounts();
