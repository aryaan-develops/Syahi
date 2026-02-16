const express = require('express');
const router = express.Router();
const { createCouplet, getCouplets, getUserCouplets, deleteCouplet, toggleCoupletVisibility, likeCouplet } = require('../controllers/coupletController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCouplets)
    .post(protect, createCouplet);

router.get('/mine', protect, getUserCouplets);
router.delete('/:id', protect, deleteCouplet);
router.patch('/:id/visibility', protect, toggleCoupletVisibility);
router.post('/:id/like', protect, likeCouplet);

module.exports = router;
