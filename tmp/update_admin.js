const { pool } = require('./backend/config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: 'backend/.env' });

async function updateAdmin() {
    try {
        const email = 'malarsilkskarivalam@gmail.com';
        const password = 'Malarsilks@2006';
        
        console.log(`Setting up Admin: ${email}`);
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Check if admin exists
        const check = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
        
        if (check.rowCount > 0) {
            await pool.query('UPDATE admins SET password = $1 WHERE email = $2', [hashedPassword, email]);
            console.log('✅ Admin password updated successfully.');
        } else {
            // Delete old one if it exists to keep it clean
            await pool.query('DELETE FROM admins WHERE email = $1', ['admin@malarsilks.com']);
            
            await pool.query('INSERT INTO admins (email, password) VALUES ($1, $2)', [email, hashedPassword]);
            console.log('✅ Admin account created successfully.');
        }
        
    } catch (err) {
        console.error('❌ Error updating admin:', err.message);
    } finally {
        await pool.end();
    }
}

updateAdmin();
