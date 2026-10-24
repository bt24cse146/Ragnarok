const User = require('../models/User');

async function syncCurrentUser(req, res) {
  const { uid, email, name, picture } = req.authUser;
  if (!uid || !email) {
    return res.status(400).json({ message: 'Firebase account is missing a user ID or email address.' });
  }

  const user = await User.findOneAndUpdate(
    { firebaseUid: uid },
    {
      $set: {
        email,
        displayName: name || email.split('@')[0],
        photoURL: picture || '',
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  ).select('-__v');

  return res.json({ user });
}

async function getCurrentUser(req, res) {
  const user = await User.findOne({ firebaseUid: req.authUser.uid }).select('-__v');
  if (!user) return res.status(404).json({ message: 'Profile not found. Sign in again to synchronize it.' });
  return res.json({ user });
}

module.exports = { syncCurrentUser, getCurrentUser };
