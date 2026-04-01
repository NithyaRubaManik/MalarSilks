const { pool } = require('./backend/config/db');

async function checkDB() {
    try {
        const res = await pool.query('SELECT * FROM gallery_entries LIMIT 1');
        if (res.rows.length > 0) {
            console.log('Columns:', Object.keys(res.rows[0]));
            console.log('Sample Row:', res.rows[0]);
        } else {
            console.log('No rows found');
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit();
    }
}

checkDB();
