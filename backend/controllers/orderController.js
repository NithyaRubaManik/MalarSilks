const { pool } = require('../config/db');

// @desc    Create new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
    try {
        const {
            user_id,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const result = await pool.query(
            'INSERT INTO orders (user_id, shipping_address, payment_method, total_price) VALUES ($1, $2, $3, $4) RETURNING *, total_price AS "totalPrice", created_at AS "createdAt", shipping_address AS "shippingAddress", payment_method AS "paymentMethod"',
            [user_id || null, JSON.stringify(shippingAddress), paymentMethod, totalPrice]
        );
        
        const order = result.rows[0];
        
        // Insert order items
        for (const item of orderItems) {
            await pool.query(
                'INSERT INTO order_items (order_id, product_id, name, qty, image, price) VALUES ($1, $2, $3, $4, $5, $6)',
                [order.id, item.product_id || null, item.name, item.qty, item.image, item.price]
            );
        }

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
const getOrders = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT o.*, 
                   o.total_price AS "totalPrice", 
                   o.created_at AS "createdAt", 
                   o.shipping_address AS "shippingAddress",
                   o.payment_method AS "paymentMethod",
                   u.name as user_name, u.email as user_email 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC
        `);

        // Fetch items for each order
        const orders = [];
        for (const order of result.rows) {
            const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
            
            // Parse shipping address if it's a string
            let shippingAddress = order.shippingAddress;
            if (typeof shippingAddress === 'string') {
                try { shippingAddress = JSON.parse(shippingAddress); } catch (e) {}
            }

            orders.push({
                ...order,
                shippingAddress,
                user: { name: order.user_name, email: order.user_email },
                orderItems: itemsResult.rows
            });
        }

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT o.*, 
                   o.total_price AS "totalPrice", 
                   o.created_at AS "createdAt", 
                   o.shipping_address AS "shippingAddress",
                   o.payment_method AS "paymentMethod",
                   o.delivered_at AS "deliveredAt",
                   u.name as user_name, u.email as user_email 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            WHERE o.id = $1
        `, [req.params.id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = result.rows[0];
        const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);

        res.status(200).json({
            success: true,
            data: {
                ...order,
                user: { name: order.user_name, email: order.user_email },
                orderItems: itemsResult.rows
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        let query = 'UPDATE orders SET status = $1';
        let values = [status];
        
        if (status === 'Delivered') {
            query += ', delivered_at = NOW()';
        }
        
        query += ' WHERE id = $2 RETURNING *';
        values.push(req.params.id);

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Order not found' });
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

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders/:userId
const getMyOrders = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT *, 
                   total_price AS "totalPrice", 
                   created_at AS "createdAt", 
                   shipping_address AS "shippingAddress",
                   payment_method AS "paymentMethod"
            FROM orders 
            WHERE user_id = $1 
            ORDER BY created_at DESC
        `, [req.params.userId]);
        
        const orders = [];
        for (const order of result.rows) {
            const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
            
            // Parse shipping address if it's a string
            let shippingAddress = order.shippingAddress;
            if (typeof shippingAddress === 'string') {
                try { shippingAddress = JSON.parse(shippingAddress); } catch (e) {}
            }

            orders.push({
                ...order,
                shippingAddress,
                orderItems: itemsResult.rows
            });
        }

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete order (Admin)
// @route   DELETE /api/orders/:id
const deleteOrder = async (req, res) => {
    try {
        // First delete items
        await pool.query('DELETE FROM order_items WHERE order_id = $1', [req.params.id]);
        // Then delete order
        const result = await pool.query('DELETE FROM orders WHERE id = $1', [req.params.id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getMyOrders,
    deleteOrder
};
