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

// @desc    Seed admin if doesn't exist
// @route   GET /api/admin/seed
const seedAdmin = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM admins WHERE email = $1', ['malarsilkskarivalam@gmail.com']);
        if (result.rowCount > 0) {
            return res.status(400).json({ success: false, message: 'Admin already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Malarsilks@2026', salt);

        await pool.query('INSERT INTO admins (email, password) VALUES ($1, $2)', ['malarsilkskarivalam@gmail.com', hashedPassword]);

        res.status(201).json({ success: true, message: 'Admin seeded successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
