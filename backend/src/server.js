require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const { initializeFirebaseAdmin } = require('./config/firebaseAdmin');
const userRoutes = require('./routes/userRoutes');
const agentRoutes = require('./routes/agentRoutes');
const runRoutes = require('./routes/runRoutes');

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(helmet());
app.use(cors({
  origin: (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map((origin) => origin.trim()),
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'relay-api', timestamp: new Date().toISOString() });
});
app.use('/api/users', userRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/runs', runRoutes);

app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` }));
app.use((error, _req, res, _next) => {
  console.error('[api] Unhandled error:', error);
  if (res.headersSent) return;
  const status = Number(error.status) || 500;
  res.status(status).json({
    message: status >= 500 ? 'Something went wrong on the server.' : error.message,
    ...(process.env.NODE_ENV !== 'production' && status >= 500 ? { detail: error.message } : {}),
  });
});

async function start() {
  await connectDB();
  initializeFirebaseAdmin();
  app.listen(port, () => console.log(`[api] Relay API listening on http://localhost:${port}`));
}

start();
