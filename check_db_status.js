const { pool } = require('./backend/config/db');

async function checkDB() {
    try {
        const res = await pool.query('SELECT * FROM gallery_entries');
        res.rows.forEach(r => {
            console.log(`ID: ${r.id}, Name: ${r.name}, Approved: ${r.is_approved}`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit();
    }
}

checkDB();
