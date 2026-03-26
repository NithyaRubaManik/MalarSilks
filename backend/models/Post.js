const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Please add an image path'],
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
