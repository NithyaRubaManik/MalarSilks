const Product = require('../models/Product');

// @desc    Add a new product
// @route   POST /api/products
const addProduct = async (req, res) => {
    try {
        const { name, price, category, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a product image' });
        }

        const imagePath = `/uploads/${req.file.filename}`;

        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}`;

        const product = await Product.create({
            name,
            price,
            category,
            description,
            image: imagePath
        });

        res.status(201).json({
            success: true,
            data: {
                ...product._doc,
                image: product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        
        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}`;

        const formattedProducts = products.map(product => ({
            ...product._doc,
            image: product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`
        }));

        res.status(200).json({
            success: true,
            count: products.length,
            data: formattedProducts
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
    try {
        const { name, price, category, description, inStock } = req.body;
        let updateData = { name, price, category, description, inStock };

        // If new image is uploaded
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}`;

        res.status(200).json({
            success: true,
            data: {
                ...product._doc,
                image: product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}`;

        res.status(200).json({
            success: true,
            data: {
                ...product._doc,
                image: product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addProduct,
    getProducts,
    deleteProduct,
    updateProduct,
    getProductById
};
