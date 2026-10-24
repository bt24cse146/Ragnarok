const express = require('express');
const { syncCurrentUser, getCurrentUser } = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');
const { requireDatabase } = require('../middleware/requireDatabase');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();
router.post('/sync', requireAuth, requireDatabase, asyncHandler(syncCurrentUser));
router.get('/me', requireAuth, requireDatabase, asyncHandler(getCurrentUser));

module.exports = router;
