const { Pool } = require('pg'); 
require('dotenv').config(); 
const pool = new Pool({ connectionString: process.env.DATABASE_URL }); 
pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name", (err, res) => { 
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('--- TABLES IN PUBLIC SCHEMA ---');
    res.rows.forEach(r => console.log(` - ${r.table_name}`));
    console.log('------------------------------');
    pool.end(); 
});
