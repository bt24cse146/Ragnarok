const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('[database] MONGO_URI is not set. API will start, but database-backed routes will be unavailable.');
    return false;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log(`[database] Connected to MongoDB (${mongoose.connection.name})`);
    return true;
  } catch (error) {
    console.error('[database] Could not connect to MongoDB:', error.message);
    return false;
  }
}

function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDB, isDatabaseReady };
