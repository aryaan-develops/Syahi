const Problem = require('../models/Problem');

// @desc    Report a burden (Create a problem)
// @route   POST /api/problems
// @access  Private
exports.createProblem = async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    try {
        const problem = await Problem.create({
            title,
            content,
            author: req.user._id,
            authorName: req.user.username
        });

        res.status(201).json(problem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all shards (problems)
// @route   GET /api/problems
// @access  Public
exports.getProblems = async (req, res) => {
    try {
        const problems = await Problem.find().sort({ createdAt: -1 });
        res.json(problems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add solace (answer) to a shard
// @route   POST /api/problems/:id/solace
// @access  Private
exports.addSolace = async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Solace must not be empty' });
    }

    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({ message: 'The shard has vanished' });
        }

        problem.answers.push({
            content,
            author: req.user._id,
            authorName: req.user.username
        });

        await problem.save();
        res.json(problem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a shard (problem)
// @route   DELETE /api/problems/:id
// @access  Private
exports.deleteProblem = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({ message: 'The shard has already vanished' });
        }

        // Check ownership
        if (problem.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to remove this shard' });
        }

        await problem.deleteOne();
        res.json({ message: 'The burden has been erased' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove solace (answer) from a shard
// @route   DELETE /api/problems/:id/solace/:solaceId
// @access  Private
exports.deleteSolace = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({ message: 'The shard has vanished' });
        }

        const solace = problem.answers.id(req.params.solaceId);

        if (!solace) {
            return res.status(404).json({ message: 'Solace not found' });
        }

        // Check ownership
        if (solace.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to remove this comfort' });
        }

        solace.deleteOne();
        await problem.save();
        res.json(problem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
