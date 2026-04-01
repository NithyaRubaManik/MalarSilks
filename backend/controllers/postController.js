const { pool } = require('../config/db');

// @desc    Add a new post
// @route   POST /api/posts
const addPost = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image for the post' });
        }

        const imageUrl = req.file.path; // Cloudinary URL

        const result = await pool.query(
            'INSERT INTO posts (title, description, image_url) VALUES ($1, $2, $3) RETURNING *',
            [title, description, imageUrl]
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

// @desc    Get all posts
// @route   GET /api/posts
const getPosts = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, title, description, image_url as "imageUrl", created_at as "createdAt" FROM posts ORDER BY created_at DESC');

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

// @desc    Delete post
// @route   DELETE /api/posts/:id
const deletePost = async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [req.params.id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addPost,
    getPosts,
    deletePost
};
