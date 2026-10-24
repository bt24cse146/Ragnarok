import { useEffect, useState } from 'react';
import { ArrowRight, Bot, CheckCircle2, Clock3, Plus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRuns } from '../api/runs';
import RunStatus from '../components/RunStatus';
import { formatDate, formatRelativeDate } from '../utils/formatters';

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top"><span className="stat-icon"><Icon size={17} /></span><span className="stat-label">{label}</span></div>
      <div className="stat-value">{value}</div>
      <div className="stat-detail">{detail}</div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [runs, setRuns] = useState([]);
  const [source, setSource] = useState('server');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const firstName = user?.displayName?.trim().split(/\s+/)[0] || user?.email?.split('@')[0] || 'there';
  const today = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

  useEffect(() => {
    let mounted = true;
    getRuns(100).then((result) => {
      if (mounted) {
        setRuns(result.runs);
        setSource(result.source);
      }
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [refreshKey]);

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = runs.filter((run) => new Date(run.createdAt).getTime() >= weekAgo).length;
  const successful = runs.filter((run) => run.status === 'success').length;
  const savedOutputs = runs.filter((run) => Boolean(run.output)).length;

  return (
    <div className="page-stack">
      <section className="welcome-row">
        <div>
          <div className="page-eyebrow">{today.toUpperCase()}</div>
          <h1>Good to see you, {firstName}.</h1>
          <p>Your workspace is ready. What are we building today?</p>
        </div>
        <Link to="/app/agent" className="button button-primary"><Plus size={18} /> New agent run</Link>
      </section>

      <section className="stats-grid" aria-label="Workspace statistics">
        <StatCard icon={Clock3} label="Runs this week" value={loading ? '—' : thisWeek} detail="Last 7 days" />
        <StatCard icon={CheckCircle2} label="Successful runs" value={loading ? '—' : successful} detail={runs.length ? `${Math.round((successful / runs.length) * 100)}% of all runs` : 'Your progress starts here'} />
        <StatCard icon={Bot} label="Saved outputs" value={loading ? '—' : savedOutputs} detail="Results in your history" />
      </section>

      <section className="dashboard-main-grid">
        <div className="panel recent-panel">
          <div className="panel-heading">
            <div><h2>Recent activity</h2><p>Your latest agent runs, all in one place.</p></div>
            <Link className="subtle-link" to="/app/history">View history <ArrowRight size={15} /></Link>
          </div>
          {loading ? <div className="skeleton-list"><span /><span /><span /></div> : runs.length ? (
            <div className="recent-list">
              {runs.slice(0, 5).map((run) => (
                <Link className="recent-row" to="/app/history" key={run.id}>
                  <span className="recent-file-icon"><Bot size={18} /></span>
                  <span className="recent-info"><strong>{run.title}</strong><small>{formatRelativeDate(run.createdAt)} <span className="meta-dot">·</span> {run.durationMs ? `${(run.durationMs / 1000).toFixed(1)}s` : '—'}</small></span>
                  <RunStatus status={run.status} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state dashboard-empty">
              <span className="empty-icon"><Clock3 size={21} /></span>
              <h3>No runs yet</h3>
              <p>Your agent activity will appear here after your first run.</p>
              <Link className="button button-secondary button-small" to="/app/agent">Open agent workspace <ArrowRight size={15} /></Link>
            </div>
          )}
          {source === 'local' && runs.length > 0 && <div className="panel-footnote">Showing local preview history while the API is unavailable.</div>}
        </div>

        <div className="panel getting-started-panel">
          <div className="getting-started-top"><span className="getting-started-icon"><Sparkles size={19} /></span><span className="subtle-count">QUICK START</span></div>
          <h2>Make the workspace yours.</h2>
          <p>The core screens are in place. Add your team’s agent logic when the challenge starts.</p>
          <div className="starter-steps">
            <div className="starter-step"><span className="step-number step-done"><CheckCircle2 size={15} /></span><div><strong>Set up your workspace</strong><small>You're signed in and ready to go.</small></div></div>
            <div className="starter-step"><span className="step-number">02</span><div><strong>Run a test prompt</strong><small>Try the agent workspace preview.</small></div></div>
            <div className="starter-step"><span className="step-number">03</span><div><strong>Connect the agent</strong><small>Wire in your team's API or runtime.</small></div></div>
          </div>
          <Link to="/app/agent" className="getting-started-link">Try the workspace <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="bottom-note"><span className="bottom-note-indicator" /> Your project is in setup mode. Preview runs are clearly marked until the agent is connected. <span className="bottom-note-date">Updated {formatDate(new Date())}</span></section>
    </div>
  );
}
