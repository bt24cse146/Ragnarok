import { useEffect, useMemo, useState } from 'react';
import { Bot, CalendarDays, Check, Clipboard, Clock3, FileText, Search, SlidersHorizontal } from 'lucide-react';
import { getRuns } from '../api/runs';
import { useAuth } from '../context/AuthContext';
import RunStatus from '../components/RunStatus';
import { formatDate } from '../utils/formatters';

export default function History() {
  const { user } = useAuth();
  const [runs, setRuns] = useState([]);
  const [source, setSource] = useState('server');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    let mounted = true;
    getRuns(100).then((result) => {
      if (mounted) {
        setRuns(result.runs);
        setSource(result.source);
      }
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const filteredRuns = useMemo(() => runs.filter((run) => {
    const query = search.trim().toLowerCase();
    const matchesQuery = !query || [run.title, run.input, run.output].some((value) => String(value || '').toLowerCase().includes(query));
    const matchesStatus = statusFilter === 'all' || run.status === statusFilter;
    return matchesQuery && matchesStatus;
  }), [runs, search, statusFilter]);

  async function copyOutput(run) {
    try {
      await navigator.clipboard.writeText(run.output || '');
      setCopied(run.id);
      window.setTimeout(() => setCopied(''), 1800);
    } catch {
      setCopied('');
    }
  }

  return (
    <div className="page-stack">
      <section className="page-heading-row">
        <div><div className="page-eyebrow">YOUR WORK</div><h1>Run history</h1><p>Review previous prompts and their outputs.</p></div>
        <div className="history-total"><FileText size={16} /><strong>{runs.length}</strong><span>{runs.length === 1 ? 'run saved' : 'runs saved'}</span></div>
      </section>

      <section className="panel history-panel">
        <div className="history-toolbar">
          <div className="history-search"><Search size={17} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search prompts and outputs…" aria-label="Search run history" /></div>
          <label className="filter-select-wrap"><SlidersHorizontal size={15} /><span className="sr-only">Filter by status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option><option value="success">Successful</option><option value="preview">Preview</option><option value="failed">Failed</option></select></label>
        </div>

        {loading ? <div className="history-loading"><span /><span /><span /></div> : filteredRuns.length ? (
          <div className="history-list">
            {filteredRuns.map((run) => (
              <details className="history-item" key={run.id}>
                <summary className="history-summary">
                  <span className="history-run-icon"><Bot size={18} /></span>
                  <span className="history-run-main"><strong>{run.title}</strong><small><CalendarDays size={13} /> {formatDate(run.createdAt)} <span className="meta-dot">·</span> <Clock3 size={13} /> {run.durationMs ? `${(run.durationMs / 1000).toFixed(1)} sec` : 'Duration unavailable'}</small></span>
                  <RunStatus status={run.status} />
                  <span className="history-expand" aria-hidden="true">+</span>
                </summary>
                <div className="history-detail">
                  <div className="history-detail-block"><div className="detail-block-heading"><strong>Prompt</strong><span>INPUT</span></div><p>{run.input || 'No prompt saved.'}</p></div>
                  <div className="history-detail-block"><div className="detail-block-heading"><strong>Output</strong><button className="text-icon-button" onClick={() => copyOutput(run)}>{copied === run.id ? <Check size={14} /> : <Clipboard size={14} />}{copied === run.id ? 'Copied' : 'Copy output'}</button></div><pre>{run.output || 'No output saved.'}</pre></div>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="empty-state history-empty">
            <span className="empty-icon"><Search size={21} /></span>
            <h3>{search || statusFilter !== 'all' ? 'No matching runs' : 'Your history is empty'}</h3>
            <p>{search || statusFilter !== 'all' ? 'Try changing your search or filter.' : 'When you run your agent, the prompt and output will be saved here.'}</p>
            {(search || statusFilter !== 'all') && <button className="button button-secondary button-small" onClick={() => { setSearch(''); setStatusFilter('all'); }}>Clear filters</button>}
          </div>
        )}
        {source === 'local' && runs.length > 0 && <div className="panel-footnote">Local preview history is stored in this browser. Configure the API and Atlas for persistent account history.</div>}
      </section>
    </div>
  );
}
