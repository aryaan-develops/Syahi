const Blog = require('../models/Blog');

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
exports.createBlog = async (req, res) => {
    const { title, content, isPublic } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    try {
        const blog = await Blog.create({
            title,
            content,
            author: req.user._id,
            authorName: req.user.username,
            isPublic: isPublic !== undefined ? isPublic : true
        });

        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all public blogs
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublic: true }).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's own blogs
// @route   GET /api/blogs/mine
// @access  Private
exports.getUserBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
