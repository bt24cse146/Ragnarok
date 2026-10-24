const { admin, isFirebaseAdminReady } = require('../config/firebaseAdmin');

async function requireAuth(req, res, next) {
  if (!isFirebaseAdminReady()) {
    return res.status(503).json({ message: 'Firebase Admin is not configured on the API server.' });
  }

  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required.' });

  try {
    req.authUser = await admin.auth().verifyIdToken(token);
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Your session is invalid or expired. Please sign in again.' });
  }
}

module.exports = { requireAuth };
