const Couplet = require('../models/Couplet');

// @desc    Create new couplet
// @route   POST /api/couplets
// @access  Private
exports.createCouplet = async (req, res) => {
    const { content, isPublic } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }

    try {
        const couplet = await Couplet.create({
            content,
            author: req.user._id,
            authorName: req.user.username,
            isPublic: isPublic !== undefined ? isPublic : true
        });

        res.status(201).json(couplet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all public couplets
// @route   GET /api/couplets
// @access  Public
exports.getCouplets = async (req, res) => {
    try {
        const couplets = await Couplet.find({ isPublic: true }).sort({ createdAt: -1 });
        res.json(couplets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's own couplets
// @route   GET /api/couplets/mine
// @access  Private
exports.getUserCouplets = async (req, res) => {
    try {
        const couplets = await Couplet.find({ author: req.user._id }).sort({ createdAt: -1 });
        res.json(couplets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
