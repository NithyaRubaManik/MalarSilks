const GalleryEntry = require('../models/GalleryEntry');
const path = require('path');

// @desc    Register a new gallery entry (User with image)
// @route   POST /api/upload
const registerUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        const imagePath = `/uploads/${req.file.filename}`;

        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}`;

        const entry = await GalleryEntry.create({
            name,
            email,
            image: imagePath
        });

        res.status(201).json({
            success: true,
            data: {
                ...entry._doc,
                image: entry.image.startsWith('http') ? entry.image : `${baseUrl}${entry.image}`
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all gallery users
// @route   GET /api/users
const getUsers = async (req, res) => {
    try {
        const users = await GalleryEntry.find().sort({ createdAt: -1 });
        
        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}`;

        const formattedUsers = users.map(user => ({
            ...user._doc,
            image: user.image.startsWith('http') ? user.image : `${baseUrl}${user.image}`
        }));

        res.status(200).json({
            success: true,
            count: users.length,
            data: formattedUsers
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single gallery user
// @route   GET /api/users/:id
const getUser = async (req, res) => {
    try {
        const user = await GalleryEntry.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}`;

        res.status(200).json({
            success: true,
            data: {
                ...user._doc,
                image: user.image.startsWith('http') ? user.image : `${baseUrl}${user.image}`
            }
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
        const user = await GalleryEntry.findByIdAndDelete(req.params.id);

        if (!user) {
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
    deleteUser
};
