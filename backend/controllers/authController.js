const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

// @desc    Register a new user
// @route   POST /api/auth/signup
const signup = async (req, res) => {
    try {
        const { name, email, password, phone, address, city, pincode } = req.body;

        const checkResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (checkResult.rowCount > 0) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await pool.query(
            'INSERT INTO users (name, email, password, phone, address, city, pincode) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, role',
            [name, email, hashedPassword, phone, address, city, pincode]
        );

        const user = result.rows[0];

        res.status(201).json({
            success: true,
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                success: true,
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all registered users (for Admin)
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role, created_at AS "createdAt" FROM users ORDER BY created_at DESC');
        res.status(200).json({
            success: true,
            count: result.rowCount,
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user profile by email
const getUserProfile = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role, phone, address, city, pincode FROM users WHERE email = $1', [req.params.email]);
        if (result.rowCount > 0) {
            res.status(200).json({
                success: true,
                data: result.rows[0]
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const { id, name, phone, address, city, pincode, password } = req.body;

        let query = 'UPDATE users SET name = $1, phone = $2, address = $3, city = $4, pincode = $5';
        let values = [name, phone, address, city, pincode];
        
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            query += ', password = $6 WHERE id = $7 RETURNING *';
            values.push(hashedPassword, id);
        } else {
            query += ' WHERE id = $6 RETURNING *';
            values.push(id);
        }

        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            const updatedUser = result.rows[0];
            res.json({
                success: true,
                _id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                address: updatedUser.address,
                city: updatedUser.city,
                pincode: updatedUser.pincode
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    signup,
    login,
    getAllUsers,
    getUserProfile,
    updateUserProfile
};
