const AgentRun = require('../models/AgentRun');
const { executeAgent } = require('../services/agentService');

function titleFromPrompt(prompt) {
  const normalized = prompt.replace(/\s+/g, ' ').trim();
  return normalized.length > 68 ? `${normalized.slice(0, 65)}…` : normalized;
}

async function runAgent(req, res) {
  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  if (!prompt) return res.status(400).json({ message: 'Enter a prompt to run the agent.' });
  if (prompt.length > 20000) return res.status(413).json({ message: 'Prompt must be 20,000 characters or fewer.' });

  const startedAt = Date.now();
  const result = await executeAgent({
    prompt,
    user: {
      uid: req.authUser.uid,
      email: req.authUser.email,
      name: req.authUser.name || req.authUser.email?.split('@')[0] || 'there',
    },
  });
  const durationMs = Date.now() - startedAt;

  const run = await AgentRun.create({
    ownerUid: req.authUser.uid,
    title: titleFromPrompt(prompt) || 'Agent run',
    input: prompt,
    output: String(result.output || ''),
    status: result.status || 'success',
    durationMs,
    metadata: result.metadata || {},
  });

  return res.status(201).json({ run });
}

module.exports = { runAgent };
