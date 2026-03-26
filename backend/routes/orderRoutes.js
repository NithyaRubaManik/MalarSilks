const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getMyOrders
} = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.get('/myorders/:userId', getMyOrders);

module.exports = router;
