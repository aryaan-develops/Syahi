const mongoose = require('mongoose');

const BouquetSchema = new mongoose.Schema({
    flowers: [{
        type: String,
        enum: ['rose', 'lily', 'sunflower', 'lotus', 'jasmine'],
        required: true
    }],
    message: {
        type: String,
        required: [true, 'Please provide the words for your bouquet'],
        trim: true,
        maxlength: [500, 'Keep your sentiment heartfelt but concise']
    },
    attachedShayari: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Couplet'
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
    isPublic: {
        type: Boolean,
        default: false // Default to private link-only access
    },
    spotifyUrl: {
        type: String,
        trim: true
    },
    musicData: {
        title: String,
        artist: String,
        previewUrl: String,
        artworkUrl: String
    },
    cakeType: {
        type: String,
        enum: [null, 'classic', 'chocolate', 'vanilla', 'redvelvet', 'strawberry', 'butterscotch'],
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Bouquet', BouquetSchema);
