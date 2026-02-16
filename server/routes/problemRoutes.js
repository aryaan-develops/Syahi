const express = require('express');
const router = express.Router();
const { createProblem, getProblems, addSolace, deleteProblem, deleteSolace } = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProblems)
    .post(protect, createProblem);

router.delete('/:id', protect, deleteProblem);
router.post('/:id/solace', protect, addSolace);
router.delete('/:id/solace/:solaceId', protect, deleteSolace);

module.exports = router;
