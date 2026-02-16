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

// @desc    Delete a couplet
// @route   DELETE /api/couplets/:id
// @access  Private
exports.deleteCouplet = async (req, res) => {
    try {
        const couplet = await Couplet.findById(req.params.id);

        if (!couplet) {
            return res.status(404).json({ message: 'Couplet not found' });
        }

        // Check ownership
        if (couplet.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to delete this scroll' });
        }

        await couplet.deleteOne();
        res.json({ message: 'Whisper removed from the archives' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Toggle couplet visibility
// @route   PATCH /api/couplets/:id/visibility
// @access  Private
exports.toggleCoupletVisibility = async (req, res) => {
    try {
        const couplet = await Couplet.findById(req.params.id);

        if (!couplet) {
            return res.status(404).json({ message: 'Couplet not found' });
        }

        if (couplet.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        couplet.isPublic = !couplet.isPublic;
        await couplet.save();

        res.json(couplet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Like/Unlike a couplet
// @route   POST /api/couplets/:id/like
// @access  Private
exports.likeCouplet = async (req, res) => {
    try {
        const couplet = await Couplet.findById(req.params.id);

        if (!couplet) {
            return res.status(404).json({ message: 'Couplet not found' });
        }

        const isLiked = couplet.likes.includes(req.user._id);

        if (isLiked) {
            // Unlike
            couplet.likes = couplet.likes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            // Like
            couplet.likes.push(req.user._id);
        }

        await couplet.save();
        res.json(couplet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
