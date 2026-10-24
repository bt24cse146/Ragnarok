import { apiRequest } from './client';
import { normalizeRun, readLocalRuns, removeLocalRun, saveLocalRun } from '../utils/runStorage';

export async function getRuns(limit = 50) {
  try {
    const response = await apiRequest(`/runs?limit=${limit}`);
    return { runs: (response.runs || []).map(normalizeRun), source: 'server' };
  } catch {
    return { runs: readLocalRuns().map(normalizeRun), source: 'local' };
  }
}

export async function createAgentRun(prompt) {
  try {
    const response = await apiRequest('/agent/run', { method: 'POST', body: { prompt } });
    return { run: normalizeRun(response.run), source: 'server' };
  } catch {
    const createdAt = new Date().toISOString();
    const normalizedPrompt = prompt.replace(/\s+/g, ' ').trim();
    const run = normalizeRun({
      id: globalThis.crypto?.randomUUID?.() || `demo-${Date.now()}`,
      title: normalizedPrompt.length > 68 ? `${normalizedPrompt.slice(0, 65)}…` : normalizedPrompt,
      input: prompt,
      output: [
        'This is a starter preview, not a real AI-generated result.',
        '',
        'Your prompt has been captured by the Agent Workspace.',
        '',
        'Connect your team’s agent in backend/src/services/agentService.js to replace this preview with live output.',
      ].join('\n'),
      status: 'preview',
      durationMs: 0,
      createdAt,
    });
    saveLocalRun(run);
    return { run, source: 'local' };
  }
}

export async function deleteRun(run) {
  if (String(run.id).startsWith('demo-') || !/^[a-f\d]{24}$/i.test(String(run.id))) {
    return removeLocalRun(run.id);
  }
  try {
    await apiRequest(`/runs/${run.id}`, { method: 'DELETE' });
    return null;
  } catch {
    return removeLocalRun(run.id);
  }
}
