const express = require('express');
const router = express.Router();
const { createBouquet, getPublicBouquets, getBouquetById, deleteBouquet } = require('../controllers/bouquetController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createBouquet);

router.get('/public', getPublicBouquets);
router.get('/:id', getBouquetById);
router.delete('/:id', protect, deleteBouquet);

module.exports = router;
