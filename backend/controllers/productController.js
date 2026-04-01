const { pool } = require('../config/db');

// @desc    Add a new product
// @route   POST /api/products
const addProduct = async (req, res) => {
    try {
        const { name, price, category, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a product image' });
        }

        // With Cloudinary, req.file.path is the full URL
        const imageUrl = req.file.path;

        const result = await pool.query(
            'INSERT INTO products (name, price, category, image, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, price, category, imageUrl, description]
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

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, price, category, image, description, in_stock as "inStock", created_at as "createdAt" FROM products ORDER BY created_at DESC');

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

// @desc    Update product
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
    try {
        const { name, price, category, description, inStock } = req.body;
        const productId = req.params.id;

        let query = 'UPDATE products SET name = $1, price = $2, category = $3, description = $4, in_stock = $5';
        let values = [name, price, category, description, String(inStock) === 'true'];

        if (req.file) {
            query += ', image = $6 WHERE id = $7 RETURNING id, name, price, category, image, description, in_stock as "inStock", created_at as "createdAt"';
            values.push(req.file.path, productId);
        } else {
            query += ' WHERE id = $6 RETURNING id, name, price, category, image, description, in_stock as "inStock", created_at as "createdAt"';
            values.push(productId);
        }

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
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

// @desc    Delete product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);

        if (result.rowCount === 0) {
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
        const result = await pool.query('SELECT id, name, price, category, image, description, in_stock as "inStock", created_at as "createdAt" FROM products WHERE id = $1', [req.params.id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
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

module.exports = {
    addProduct,
    getProducts,
    deleteProduct,
    updateProduct,
    getProductById
};
