const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['mindmap', 'bundle', 'credits'],
        required: true
    },
    subject: String, // For mindmaps
    chapters: [String], // For bundles/mindmaps
    contentUrl: String, // URL to the actual content/PDF
    previewUrl: String, // URL to blurred preview
    isLocked: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
