const mongoose = require('mongoose');

const agentRunSchema = new mongoose.Schema(
  {
    ownerUid: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    input: { type: String, required: true, maxlength: 20000 },
    output: { type: String, required: true, maxlength: 50000 },
    status: { type: String, enum: ['preview', 'success', 'failed'], default: 'preview' },
    durationMs: { type: Number, default: 0, min: 0 },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

agentRunSchema.index({ ownerUid: 1, createdAt: -1 });

module.exports = mongoose.model('AgentRun', agentRunSchema);
