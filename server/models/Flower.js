const mongoose = require('mongoose');

const FlowerSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Please provide the words for your flower'],
        trim: true,
        maxlength: [200, 'Keep your sentiment concise, like a petal']
    },
    flowerType: {
        type: String,
        enum: ['rose', 'lily', 'sunflower', 'lotus', 'jasmine'],
        default: 'rose'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        trim: true,
        default: 'Collective Soul'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Flower', FlowerSchema);
