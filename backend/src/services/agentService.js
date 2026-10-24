/**
 * Replace this placeholder with your team's agent runtime.
 * Keep the return shape stable, or update agentController.js and the frontend together.
 */
async function executeAgent({ prompt, user }) {
  const name = user?.name || 'there';

  return {
    status: 'preview',
    output: [
      'This is a starter preview, not a real AI-generated result.',
      '',
      `Hi ${name} — the agent workspace received your request:`,
      `“${prompt.trim()}”`,
      '',
      'Connect your team’s agent in backend/src/services/agentService.js to replace this preview with live output.',
    ].join('\n'),
    metadata: { provider: 'starter-preview' },
  };
}

module.exports = { executeAgent };
