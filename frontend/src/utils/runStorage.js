const STORAGE_KEY = 'relay:demo-runs';

export function readLocalRuns() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export function saveLocalRun(run) {
  const runs = [run, ...readLocalRuns()].slice(0, 100);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
  return run;
}

export function removeLocalRun(id) {
  const runs = readLocalRuns().filter((run) => (run._id || run.id) !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
  return runs;
}

export function clearLocalRuns() {
  localStorage.removeItem(STORAGE_KEY);
}

export function normalizeRun(run) {
  return {
    ...run,
    id: run._id || run.id,
    title: run.title || 'Agent run',
    createdAt: run.createdAt || new Date().toISOString(),
    status: run.status || 'preview',
    input: run.input || '',
    output: run.output || '',
  };
}
