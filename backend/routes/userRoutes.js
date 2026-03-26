const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { registerUser, getUsers, getUser, deleteUser } = require('../controllers/userController');
const { addProduct, getProducts, deleteProduct, updateProduct, getProductById } = require('../controllers/productController');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File filter (optional but good practice)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

// User Routes
router.post('/upload', upload.single('image'), registerUser);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.delete('/users/:id', deleteUser);

// Product Routes
router.post('/products', upload.single('image'), addProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', upload.single('image'), updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;
