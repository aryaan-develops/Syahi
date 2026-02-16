const express = require('express');
const router = express.Router();
const { createBlog, getBlogs, getUserBlogs } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getBlogs)
    .post(protect, createBlog);

router.get('/mine', protect, getUserBlogs);

module.exports = router;
