const { isDatabaseReady } = require('../config/db');

function requireDatabase(req, res, next) {
  if (!isDatabaseReady()) {
    return res.status(503).json({ message: 'MongoDB is not connected. Configure MONGO_URI in backend/.env.' });
  }
  return next();
}

module.exports = { requireDatabase };
