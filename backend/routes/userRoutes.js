const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { registerUser, getUsers, getUser, deleteUser, getAllSubmissions, updateGalleryStatus } = require('../controllers/userController');
const { addProduct, getProducts, deleteProduct, updateProduct, getProductById } = require('../controllers/productController');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary (User needs to add these to .env)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'malar_silks_products',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    }
});

const upload = multer({ storage: storage });

const { protect } = require('../middleware/authMiddleware');

// User Routes
router.post('/upload', upload.single('image'), registerUser);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.delete('/users/:id', protect, deleteUser);
router.get('/submissions', protect, getAllSubmissions);
router.put('/submissions/:id', protect, updateGalleryStatus);

// Product Routes
router.post('/products', protect, upload.single('image'), addProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', protect, upload.single('image'), updateProduct);
router.delete('/products/:id', protect, deleteProduct);

module.exports = router;
