const express = require('express');
const router = express.Router();
const { createCouplet, getCouplets, getUserCouplets } = require('../controllers/coupletController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCouplets)
    .post(protect, createCouplet);

router.get('/mine', protect, getUserCouplets);

module.exports = router;
