import { ArrowUpRight, Check, ShieldCheck } from 'lucide-react';
import Brand from '../components/Brand';

export default function AuthLayout({ children, mode = 'login' }) {
  return (
    <div className="auth-shell">
      <header className="auth-topbar"><Brand /><div className="auth-top-note"><ShieldCheck size={15} /> Secure workspace access</div></header>
      <main className="auth-content">
        <section className="auth-form-column">
          <div className="auth-form-wrap">
            {children}
            <p className="auth-legal">By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
          </div>
        </section>
        <aside className="auth-aside">
          <div className="auth-aside-inner">
            <div className="eyebrow"><span className="eyebrow-line" /> BUILT FOR THE BUILD</div>
            <h2>From first prompt<br />to working product.</h2>
            <p>A focused workspace for experimenting with your agent, reviewing its output, and keeping every run organized.</p>
            <div className="auth-feature-list">
              <div><span className="feature-check"><Check size={14} /></span><span>One place to run and review tasks</span></div>
              <div><span className="feature-check"><Check size={14} /></span><span>Run history you can revisit</span></div>
              <div><span className="feature-check"><Check size={14} /></span><span>Ready for your team's agent logic</span></div>
            </div>
            <div className="auth-aside-footer"><span>RELAY WORKSPACE</span><span>DESIGNED TO ADAPT <ArrowUpRight size={13} /></span></div>
          </div>
          <div className="auth-decor-lines" aria-hidden="true"><span /><span /><span /><span /></div>
        </aside>
      </main>
    </div>
  );
}
