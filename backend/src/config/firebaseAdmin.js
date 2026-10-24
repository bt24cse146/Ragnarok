const admin = require('firebase-admin');
const path = require('path');

function initializeFirebaseAdmin() {
  if (admin.apps.length) return admin;

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  try {
    if (clientEmail && privateKey && projectId) {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        projectId,
      });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      const credentialPath = path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS);
      admin.initializeApp({
        credential: admin.credential.cert(require(credentialPath)),
        projectId: projectId || undefined,
      });
    } else {
      console.warn('[firebase-admin] Admin credentials are not configured. Protected API calls will return 503.');
    }
  } catch (error) {
    console.error('[firebase-admin] Initialization failed:', error.message);
  }

  return admin;
}

function isFirebaseAdminReady() {
  return admin.apps.length > 0;
}

module.exports = { admin, initializeFirebaseAdmin, isFirebaseAdminReady };
