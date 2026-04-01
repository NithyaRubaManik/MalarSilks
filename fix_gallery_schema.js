const { pool } = require('./backend/config/db');

async function fixSchema() {
    try {
        console.log('Synchronizing gallery_entries schema...');
        
        // Check for comment column
        const commentCheck = await pool.query("SELECT 1 FROM information_schema.columns WHERE table_name='gallery_entries' AND column_name='comment'");
        if (commentCheck.rowCount === 0) {
            console.log('Adding comment column...');
            await pool.query("ALTER TABLE gallery_entries ADD COLUMN comment TEXT DEFAULT ''");
        }
        
        // Check for is_approved column
        const approvedCheck = await pool.query("SELECT 1 FROM information_schema.columns WHERE table_name='gallery_entries' AND column_name='is_approved'");
        if (approvedCheck.rowCount === 0) {
            console.log('Adding is_approved column...');
            await pool.query("ALTER TABLE gallery_entries ADD COLUMN is_approved BOOLEAN DEFAULT FALSE");
            // Set existing items to approved so they don't disappear
            await pool.query("UPDATE gallery_entries SET is_approved = TRUE");
        }

        console.log('Schema synchronized successfully.');
    } catch (e) {
        console.error('Error synchronizing schema:', e.message);
    } finally {
        process.exit();
    }
}

fixSchema();
