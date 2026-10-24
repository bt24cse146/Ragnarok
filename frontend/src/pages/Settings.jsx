import { useState } from 'react';
import { Check, CircleUserRound, Fingerprint, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [showSaved, setShowSaved] = useState(false);
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  function acknowledge() {
    setShowSaved(true);
    window.setTimeout(() => setShowSaved(false), 2200);
  }

  return (
    <div className="page-stack settings-page">
      <section className="page-heading-row"><div><div className="page-eyebrow">PREFERENCES</div><h1>Settings</h1><p>Manage your account and workspace details.</p></div></section>
      <section className="panel settings-panel">
        <div className="settings-section-heading"><div><h2>Account information</h2><p>Your sign-in details are managed securely by Firebase.</p></div><span className="settings-avatar"><CircleUserRound size={22} /></span></div>
        <div className="settings-fields">
          <div className="settings-field"><span className="settings-field-icon"><CircleUserRound size={17} /></span><div><small>Display name</small><strong>{displayName}</strong></div></div>
          <div className="settings-field"><span className="settings-field-icon"><Mail size={17} /></span><div><small>Email address</small><strong>{user?.email || '—'}</strong></div><span className="verified-label"><Check size={13} /> Signed in</span></div>
          <div className="settings-field"><span className="settings-field-icon"><Fingerprint size={17} /></span><div><small>Authentication provider</small><strong>Firebase Authentication</strong></div></div>
        </div>
        <div className="settings-divider" />
        <div className="settings-section-heading"><div><h2>Workspace setup</h2><p>The starter is ready to connect to your team's agent implementation.</p></div></div>
        <div className="setup-status-row"><span className="setup-status-icon"><ShieldCheck size={18} /></span><div><strong>Agent integration</strong><small>Preview response until the agent service is connected.</small></div><span className="preview-mode-pill">Preview</span></div>
        <div className="settings-action-row"><p>Account settings are read-only in this starter.</p><button className="button button-secondary button-small" onClick={acknowledge}>{showSaved ? <><Check size={15} /> All set</> : 'Done'}</button></div>
      </section>
    </div>
  );
}
