const Post = require('../models/Post');

// @desc    Add a new post
// @route   POST /api/posts
const addPost = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image for the post' });
        }

        const imagePath = `/uploads/${req.file.filename}`;

        const post = await Post.create({
            title,
            description,
            imageUrl: imagePath
        });

        res.status(201).json({
            success: true,
            data: post
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
        const posts = await Post.find().sort({ createdAt: -1 });

        // Map posts to include the base URL for the imageUrl if it's a relative path
        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}`;

        const formattedPosts = posts.map(post => ({
            ...post._doc,
            imageUrl: post.imageUrl.startsWith('http') ? post.imageUrl : `${baseUrl}${post.imageUrl}`
        }));

        res.status(200).json({
            success: true,
            count: posts.length,
            data: formattedPosts
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
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        await post.deleteOne();

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
