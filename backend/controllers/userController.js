const { pool } = require('../config/db');

// @desc    Register a new gallery entry (User with image & comment)
// @route   POST /api/upload
const registerUser = async (req, res) => {
    try {
        const { name, email, comment } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        const imageUrl = req.file.path;

        const result = await pool.query(
            'INSERT INTO gallery_entries (name, email, image, comment, is_approved) VALUES ($1, $2, $3, $4, FALSE) RETURNING *',
            [name, email, imageUrl, comment || '']
        );

        res.status(201).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all APPROVED gallery users (FOR PUBLIC DISPLAY)
// @route   GET /api/users
const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT *, created_at AS "createdAt" FROM gallery_entries WHERE is_approved = TRUE ORDER BY created_at DESC');

        res.status(200).json({
            success: true,
            count: result.rowCount,
            data: result.rows
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get ALL submissions (FOR ADMIN)
const getAllSubmissions = async (req, res) => {
    try {
        const result = await pool.query('SELECT *, created_at AS "createdAt" FROM gallery_entries ORDER BY created_at DESC');
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Approve/Reject gallery entry (FOR ADMIN)
const updateGalleryStatus = async (req, res) => {
    try {
        const { is_approved } = req.body;
        const result = await pool.query('UPDATE gallery_entries SET is_approved = $1 WHERE id = $2 RETURNING *', [is_approved, req.params.id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Entry not found' });
        }

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get single gallery user
// @route   GET /api/users/:id
const getUser = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM gallery_entries WHERE id = $1', [req.params.id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete gallery user
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM gallery_entries WHERE id = $1 RETURNING *', [req.params.id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Gallery entry deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    getUsers,
    getUser,
    deleteUser,
    getAllSubmissions,
    updateGalleryStatus
};
