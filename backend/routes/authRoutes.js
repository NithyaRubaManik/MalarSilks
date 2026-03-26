const express = require('express');
const router = express.Router();
const { signup, login, getAllUsers, getUserProfile, updateUserProfile } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/users', getAllUsers);
router.get('/profile/:email', getUserProfile);
router.put('/profile', updateUserProfile);

module.exports = router;
