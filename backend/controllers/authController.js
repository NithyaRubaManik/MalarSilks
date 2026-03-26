const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/signup
const signup = async (req, res) => {
    try {
        const { name, email, password, phone, address, city, pincode } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            address,
            city,
            pincode
        });

        if (user) {
            res.status(201).json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                _id: user._id,
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
// @route   GET /api/auth/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user profile by email
// @route   GET /api/auth/profile/:email
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (user) {
            res.status(200).json({
                success: true,
                data: user
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.body.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            user.city = req.body.city || user.city;
            user.pincode = req.body.pincode || user.pincode;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                _id: updatedUser._id,
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
