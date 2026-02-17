const Bouquet = require('../models/Bouquet');
const Couplet = require('../models/Couplet');

// @desc    Create a bouquet
// @route   POST /api/bouquets
// @access  Private
exports.createBouquet = async (req, res) => {
    const { flowers, message, attachedShayari, receiver, isPublic, spotifyUrl, musicData, cakeType } = req.body;

    if (!flowers || flowers.length === 0) {
        return res.status(400).json({ message: 'A bouquet needs flowers to bloom' });
    }

    if (!message) {
        return res.status(400).json({ message: 'A bouquet needs words to carry' });
    }

    try {
        const bouquet = await Bouquet.create({
            flowers,
            message,
            attachedShayari,
            receiver: receiver || 'Collective Soul',
            isPublic: isPublic || false,
            spotifyUrl,
            musicData,
            cakeType: cakeType || null,
            sender: req.user._id,
            senderName: req.user.username
        });

        res.status(201).json(bouquet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get public bouquets for the garden
// @route   GET /api/bouquets/public
// @access  Public
exports.getPublicBouquets = async (req, res) => {
    try {
        const bouquets = await Bouquet.find({ isPublic: true })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(bouquets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a specific bouquet by ID (Private or Public)
// @route   GET /api/bouquets/:id
// @access  Public
exports.getBouquetById = async (req, res) => {
    try {
        const bouquet = await Bouquet.findById(req.params.id).populate('attachedShayari');

        if (!bouquet) {
            return res.status(404).json({ message: 'The bouquet has withered and vanished' });
        }

        res.json(bouquet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a bouquet
// @route   DELETE /api/bouquets/:id
// @access  Private
exports.deleteBouquet = async (req, res) => {
    try {
        const bouquet = await Bouquet.findById(req.params.id);

        if (!bouquet) {
            return res.status(404).json({ message: 'Bouquet not found' });
        }

        if (bouquet.sender.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to wither this bouquet' });
        }

        await bouquet.deleteOne();
        res.json({ message: 'Bouquet removed from the garden' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
