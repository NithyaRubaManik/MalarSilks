const { pool } = require('./backend/config/db');

async function checkColumns() {
    try {
        const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'gallery_entries'");
        console.log('Columns in gallery_entries:', res.rows.map(r => r.column_name));
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit();
    }
}

checkColumns();
