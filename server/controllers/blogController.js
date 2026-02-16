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
// @desc    Refine text with "Syahi's Touch" (Heuristic Polish)
// @route   POST /api/blogs/refine
// @access  Private
exports.refineText = async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: "The parchment is empty. There is nothing to polish." });
    }

    try {
        // A "Magical" heuristic grammar fix for the vintage feel
        let refined = content
            .trim()
            .replace(/(^\w|[\.\?\!]\s+\w)/gm, c => c.toUpperCase()) // Capitalize sentence starts
            .replace(/\bi\b/g, 'I')                                  // single 'i' to 'I'
            .replace(/\bi've\b/g, "I've")
            .replace(/\bi'm\b/g, "I'm")
            .replace(/\bdont\b/g, "don't")
            .replace(/\bcant\b/g, "can't")
            .replace(/\bive\b/g, "I've")
            .replace(/\bim\b/g, "I'm")
            .replace(/\b([^'])\b(s|t|re|ve|m|ll|d)\b/g, "$1'$2")     // naive attempt at general contractions
            .replace(/\s+/g, ' ');                                   // Fix double spaces

        res.json({ refined });
    } catch (error) {
        res.status(500).json({ message: "The ink blurred. Failed to refine the scroll." });
    }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check ownership
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to delete this scroll' });
        }

        await blog.deleteOne();
        res.json({ message: 'History removed from the archives' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Toggle blog visibility
// @route   PATCH /api/blogs/:id/visibility
// @access  Private
exports.toggleBlogVisibility = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        blog.isPublic = !blog.isPublic;
        await blog.save();

        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Like/Unlike a blog
// @route   POST /api/blogs/:id/like
// @access  Private
exports.likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const isLiked = blog.likes.includes(req.user._id);

        if (isLiked) {
            // Unlike
            blog.likes = blog.likes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            // Like
            blog.likes.push(req.user._id);
        }

        await blog.save();
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
