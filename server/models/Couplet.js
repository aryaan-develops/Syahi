const mongoose = require('mongoose');

const CoupletSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Please provide the couplet content'],
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Couplet', CoupletSchema);
