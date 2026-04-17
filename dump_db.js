const { pool } = require('./backend/config/db');
const fs = require('fs');

async function dump() {
    try {
        const res = await pool.query('SELECT * FROM gallery_entries');
        fs.writeFileSync('db_dump.json', JSON.stringify(res.rows, null, 2));
        console.log('Dumped', res.rowCount, 'entries');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
dump();
