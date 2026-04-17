const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const check = async () => {
    try {
        const client = await pool.connect();
        
        const tables = ['orders', 'Order', 'order_items', 'OrderItem'];
        for (const tableName of tables) {
            console.log(`\nColumns in "${tableName}":`);
            try {
                // For case-sensitive names, we need to handle it. 
                // Let's use pg_attribute to be more certain.
                const res = await client.query(`
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = $1 
                `, [tableName]);
                
                if (res.rowCount === 0) {
                    console.log(`Table "${tableName}" not found via information_schema.`);
                } else {
                    res.rows.forEach(r => console.log(` - ${r.column_name} (${r.data_type})`));
                }
            } catch (err) {
                console.log(`Error querying table "${tableName}":`, err.message);
            }
        }

        client.release();
        await pool.end();
    } catch (error) {
        console.error('Error checking schema:', error);
    }
};

check();
