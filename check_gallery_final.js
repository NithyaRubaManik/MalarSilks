const { pool } = require('./backend/config/db');

async function checkAll() {
    try {
        const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        const tables = res.rows.map(r => r.table_name);
        console.log('Tables:', tables);
        if (tables.includes('gallery_entries')) {
            console.log('gallery_entries FOUND');
            const colRes = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'gallery_entries'");
            console.log('Columns:', colRes.rows.map(r => r.column_name));
        } else {
            console.log('gallery_entries NOT FOUND');
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

checkAll();
