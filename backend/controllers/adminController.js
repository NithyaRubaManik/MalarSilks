const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Admin login
// @route   POST /api/admin/login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for admin
        const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
        const admin = result.rows[0];

        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        res.status(200).json({
            success: true,
            email: admin.email,
            token: generateToken(admin.id)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Seed admin if doesn't exist (also creates tables if needed)
// @route   GET /api/admin/seed
const seedAdmin = async (req, res) => {
    try {
        console.log('Seeding process started...');

        // 1. Create Tables if they don't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS gallery_entries (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                image TEXT NOT NULL,
                comment TEXT,
                is_approved BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price FLOAT NOT NULL,
                image TEXT NOT NULL,
                category VARCHAR(100) NOT NULL,
                description TEXT,
                in_stock BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                total_price FLOAT NOT NULL,
                status VARCHAR(50) DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                image_url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Tables verified/created.');

        // 2. Check for existing admin
        const result = await pool.query('SELECT * FROM admins WHERE email = $1', ['malarsilkskarivalam@gmail.com']);
        if (result.rowCount > 0) {
            return res.status(200).json({ success: true, message: 'Admin already exists and tables are set up!' });
        }

        // 3. Seed new admin
        const salt = await bcrypt.genSalt(10);
        const passwords = ['Malarsilks@2026'];
        const hashedPassword = await bcrypt.hash(passwords[0], salt);

        await pool.query('INSERT INTO admins (email, password) VALUES ($1, $2)', ['malarsilkskarivalam@gmail.com', hashedPassword]);

        console.log('Admin seeded.');

        res.status(201).json({ success: true, message: 'Tables created and Admin seeded successfully!' });
    } catch (error) {
        console.error('Seeding Error Details:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Unknown database error occurred during seeding.',
            error_details: error.stack 
        });
    }
};

// @desc    Get all admins
const getAdmins = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, email, created_at FROM admins');
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a new admin
const createAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
        if (result.rowCount > 0) {
            return res.status(400).json({ success: false, message: 'Admin already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = await pool.query(
            'INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING id, email', 
            [email, hashedPassword]
        );

        res.status(201).json({
            success: true,
            data: newAdmin.rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete an admin
const deleteAdmin = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM admins WHERE id = $1', [req.params.id]);
        const admin = result.rows[0];

        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        if (admin.email === 'malarsilkskarivalam@gmail.com') {
            return res.status(400).json({ success: false, message: 'Cannot delete primary admin' });
        }

        await pool.query('DELETE FROM admins WHERE id = $1', [req.params.id]);
        res.status(200).json({ success: true, message: 'Admin removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    loginAdmin,
    seedAdmin,
    getAdmins,
    createAdmin,
    deleteAdmin
};
