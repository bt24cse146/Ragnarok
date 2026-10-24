const mongoose = require('mongoose');
const AgentRun = require('../models/AgentRun');

async function listRuns(req, res) {
  const parsedLimit = Number.parseInt(req.query.limit, 10);
  const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 100) : 50;
  const runs = await AgentRun.find({ ownerUid: req.authUser.uid })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-__v');
  return res.json({ runs });
}

async function getRun(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid run ID.' });
  }
  const run = await AgentRun.findOne({ _id: req.params.id, ownerUid: req.authUser.uid }).select('-__v');
  if (!run) return res.status(404).json({ message: 'Run not found.' });
  return res.json({ run });
}

async function deleteRun(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid run ID.' });
  }
  const result = await AgentRun.deleteOne({ _id: req.params.id, ownerUid: req.authUser.uid });
  if (!result.deletedCount) return res.status(404).json({ message: 'Run not found.' });
  return res.json({ deleted: true });
}

async function getRunStats(req, res) {
  const [total, success, preview, failed] = await Promise.all([
    AgentRun.countDocuments({ ownerUid: req.authUser.uid }),
    AgentRun.countDocuments({ ownerUid: req.authUser.uid, status: 'success' }),
    AgentRun.countDocuments({ ownerUid: req.authUser.uid, status: 'preview' }),
    AgentRun.countDocuments({ ownerUid: req.authUser.uid, status: 'failed' }),
  ]);
  return res.json({ stats: { total, success, preview, failed } });
}

module.exports = { listRuns, getRun, deleteRun, getRunStats };
