const { pool } = require('./backend/config/db');

async function checkColumns() {
    try {
        const res = await pool.query("SELECT * FROM gallery_entries LIMIT 1");
        if (res.rows.length > 0) {
            console.log('Row keys:', Object.keys(res.rows[0]));
        } else {
            console.log('No rows in table');
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

checkColumns();
