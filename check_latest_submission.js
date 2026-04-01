const { pool } = require('./backend/config/db');

async function checkLatest() {
    try {
        const res = await pool.query('SELECT * FROM gallery_entries ORDER BY created_at DESC LIMIT 1');
        console.log('Latest Entry:', JSON.stringify(res.rows[0], null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit();
    }
}

checkLatest();
