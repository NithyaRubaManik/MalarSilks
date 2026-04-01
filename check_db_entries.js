const { pool } = require('./backend/config/db');

async function checkDB() {
    try {
        const res = await pool.query('SELECT * FROM gallery_entries');
        console.log('Total entries:', res.rowCount);
        console.log('Entries:', JSON.stringify(res.rows, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit();
    }
}

checkDB();
