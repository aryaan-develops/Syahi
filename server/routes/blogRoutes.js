const express = require('express');
const router = express.Router();
const { createBlog, getBlogs, getUserBlogs, refineText, deleteBlog, toggleBlogVisibility, likeBlog } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getBlogs)
    .post(protect, createBlog);

router.get('/mine', protect, getUserBlogs);
router.post('/refine', protect, refineText);
router.delete('/:id', protect, deleteBlog);
router.patch('/:id/visibility', protect, toggleBlogVisibility);
router.post('/:id/like', protect, likeBlog);

module.exports = router;
