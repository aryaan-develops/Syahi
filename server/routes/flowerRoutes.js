const express = require('express');
const router = express.Router();
const { plantFlower, getFlowers, deleteFlower } = require('../controllers/flowerController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getFlowers)
    .post(protect, plantFlower);

router.delete('/:id', protect, deleteFlower);

module.exports = router;
