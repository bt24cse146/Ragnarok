const express = require('express');
const { listRuns, getRun, deleteRun, getRunStats } = require('../controllers/runsController');
const { requireAuth } = require('../middleware/auth');
const { requireDatabase } = require('../middleware/requireDatabase');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();
router.use(requireAuth, requireDatabase);
router.get('/stats', asyncHandler(getRunStats));
router.get('/', asyncHandler(listRuns));
router.get('/:id', asyncHandler(getRun));
router.delete('/:id', asyncHandler(deleteRun));

module.exports = router;
