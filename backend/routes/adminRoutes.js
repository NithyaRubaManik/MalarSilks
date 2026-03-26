const express = require('express');
const router = express.Router();
const { loginAdmin, seedAdmin, getAdmins, createAdmin, deleteAdmin } = require('../controllers/adminController');

router.post('/login', loginAdmin);
router.get('/seed', seedAdmin);
router.get('/all', getAdmins);
router.post('/create', createAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;
