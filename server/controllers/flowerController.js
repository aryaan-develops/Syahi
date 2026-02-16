const Flower = require('../models/Flower');

// @desc    Plant a flower (Create a flower message)
// @route   POST /api/flowers
// @access  Private
exports.plantFlower = async (req, res) => {
    const { content, flowerType, receiver } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'A flower needs words to bloom' });
    }

    try {
        const flower = await Flower.create({
            content,
            flowerType: flowerType || 'rose',
            receiver: receiver || 'Collective Soul',
            sender: req.user._id,
            senderName: req.user.username
        });

        res.status(201).json(flower);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Glean all flowers (Get all flower messages)
// @route   GET /api/flowers
// @access  Public
exports.getFlowers = async (req, res) => {
    try {
        const flowers = await Flower.find().sort({ createdAt: -1 }).limit(50);
        res.json(flowers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Wither a flower (Delete a flower message)
// @route   DELETE /api/flowers/:id
// @access  Private
exports.deleteFlower = async (req, res) => {
    try {
        const flower = await Flower.findById(req.params.id);

        if (!flower) {
            return res.status(404).json({ message: 'The flower has already withered' });
        }

        // Check ownership
        if (flower.sender.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to wither this flower' });
        }

        await flower.deleteOne();
        res.json({ message: 'The flower has been removed from the garden' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
