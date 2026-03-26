const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
    },
    image: {
        type: String,
        required: [true, 'Please add an image path'],
    },
    description: {
        type: String,
    },
    rating: {
        type: Number,
        default: 5.0,
    },
    inStock: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
