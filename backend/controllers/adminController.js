const Admin = require('../models/Admin');

// @desc    Admin login
// @route   POST /api/admin/login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for admin
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await admin.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        res.status(200).json({
            success: true,
            email: admin.email,
            token: "fake-jwt-token-for-now" // In real app, generate real JWT here
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Seed admin if doesn't exist (for development/demo)
// @route   GET /api/admin/seed
const seedAdmin = async (req, res) => {
    try {
        const adminExists = await Admin.findOne({ email: 'admin@malarsilks.com' });
        if (adminExists) {
            return res.status(400).json({ success: false, message: 'Admin already exists' });
        }

        await Admin.create({
            email: 'admin@malarsilks.com',
            password: 'admin123'
        });

        res.status(201).json({ success: true, message: 'Admin seeded successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all admins
// @route   GET /api/admin/all
const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({}, '-password'); // Don't return passwords
        res.status(200).json({ success: true, data: admins });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a new admin
// @route   POST /api/admin/create
const createAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ success: false, message: 'Admin already exists' });
        }

        const admin = await Admin.create({
            email,
            password
        });

        res.status(201).json({
            success: true,
            data: {
                id: admin._id,
                email: admin.email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete an admin
// @route   DELETE /api/admin/:id
const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        // Prevent deleting the main admin for safety
        if (admin.email === 'admin@malarsilks.com') {
            return res.status(400).json({ success: false, message: 'Cannot delete the primary administrator' });
        }

        await admin.deleteOne();
        res.status(200).json({ success: true, message: 'Admin removed successfully' });
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
