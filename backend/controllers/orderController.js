const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
    try {
        const {
            user,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            user,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice
        });

        const createdOrder = await order.save();
        res.status(201).json({
            success: true,
            data: createdOrder
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
        const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });

        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}`;

        const formattedOrders = orders.map(order => {
            const formattedItems = order.orderItems.map(item => ({
                ...item._doc,
                image: item.image.startsWith('http') ? item.image : `${baseUrl}${item.image}`
            }));
            return {
                ...order._doc,
                orderItems: formattedItems
            };
        });

        res.status(200).json({
            success: true,
            data: formattedOrders
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
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            const protocol = req.protocol;
            const host = req.get('host');
            const baseUrl = `${protocol}://${host}`;

            const formattedItems = order.orderItems.map(item => ({
                ...item._doc,
                image: item.image.startsWith('http') ? item.image : `${baseUrl}${item.image}`
            }));

            res.status(200).json({
                success: true,
                data: {
                    ...order._doc,
                    orderItems: formattedItems
                }
            });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
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
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status || order.status;
            
            if (req.body.status === 'Delivered') {
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();
            
            const protocol = req.protocol;
            const host = req.get('host');
            const baseUrl = `${protocol}://${host}`;

            const formattedItems = updatedOrder.orderItems.map(item => ({
                ...item._doc,
                image: item.image.startsWith('http') ? item.image : `${baseUrl}${item.image}`
            }));

            res.status(200).json({
                success: true,
                data: {
                    ...updatedOrder._doc,
                    orderItems: formattedItems
                }
            });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
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
        const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
        
        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}`;

        const formattedOrders = orders.map(order => {
            const formattedItems = order.orderItems.map(item => ({
                ...item._doc,
                image: item.image.startsWith('http') ? item.image : `${baseUrl}${item.image}`
            }));
            return {
                ...order._doc,
                orderItems: formattedItems
            };
        });

        res.status(200).json({
            success: true,
            data: formattedOrders
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
    getMyOrders
};
