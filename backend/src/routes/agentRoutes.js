const express = require('express');
const { runAgent } = require('../controllers/agentController');
const { requireAuth } = require('../middleware/auth');
const { requireDatabase } = require('../middleware/requireDatabase');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();
router.post('/run', requireAuth, requireDatabase, asyncHandler(runAgent));

module.exports = router;
