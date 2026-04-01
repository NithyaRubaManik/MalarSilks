const express = require('express');
const router = express.Router();
const { loginAdmin, seedAdmin, getAdmins, createAdmin, deleteAdmin } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.get('/seed', seedAdmin); 
router.get('/all', protect, getAdmins);
router.post('/create', protect, createAdmin);
router.delete('/:id', protect, deleteAdmin);

module.exports = router;
