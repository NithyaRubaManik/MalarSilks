const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { addPost, getPosts, deletePost } = require('../controllers/postController');

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
        cb(null, `post-${Date.now()}-${file.originalname}`);
    }
});

// File filter
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

// Post Routes
router.post('/', upload.single('image'), addPost);
router.get('/', getPosts);
router.delete('/:id', deletePost);

module.exports = router;
