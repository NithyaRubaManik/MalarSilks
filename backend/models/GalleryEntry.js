const mongoose = require('mongoose');

const galleryEntrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    image: {
        type: String, // Store file path only
        required: [true, 'Please add an image path'],
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('GalleryEntry', galleryEntrySchema);
