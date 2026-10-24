import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowRight, Bot, Check, ChevronDown, Clipboard, CornerDownLeft, LoaderCircle, Plus, RotateCcw, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { createAgentRun } from '../api/runs';
import { useAuth } from '../context/AuthContext';
import RunStatus from '../components/RunStatus';
import { formatDate } from '../utils/formatters';

const suggestions = [
  'Summarize the key requirements in a project brief',
  'Turn a rough idea into a clear implementation plan',
  'Review a workflow and identify possible improvements',
];

export default function AgentWorkspace() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState('');
  const [source, setSource] = useState('');
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), [messages, busy]);

  async function handleSubmit(event) {
    event?.preventDefault();
    const value = prompt.trim();
    if (!value || busy) return;
    setMessages((current) => [...current, { id: `user-${Date.now()}`, role: 'user', content: value }]);
    setPrompt('');
    setBusy(true);
    try {
      const result = await createAgentRun(value);
      setSource(result.source);
      setMessages((current) => [...current, {
        id: result.run.id || `agent-${Date.now()}`,
        role: 'agent',
        content: result.run.output,
        run: result.run,
        preview: result.run.status === 'preview' || result.source === 'local',
      }]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  async function copyText(id, text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      window.setTimeout(() => setCopied(''), 1800);
    } catch {
      setCopied('');
    }
  }

  function resetConversation() {
    setMessages([]);
    setSource('');
    setPrompt('');
  }

  return (
    <div className="page-stack agent-page">
      <section className="page-heading-row agent-heading-row">
        <div><div className="page-eyebrow">PLAYGROUND</div><h1>Agent workspace</h1><p>Test prompts and review what your agent returns.</p></div>
        <div className="agent-controls"><span className="preview-mode-pill"><span className="status-dot" /> Preview mode</span><button className="button button-secondary button-small" onClick={resetConversation}><RotateCcw size={15} /> Reset</button></div>
      </section>

      <section className="agent-workspace-card">
        <div className="agent-toolbar">
          <div className="agent-toolbar-left"><span className="agent-toolbar-icon"><Bot size={17} /></span><div><strong>General agent</strong><span>Default workspace</span></div><ChevronDown size={15} className="muted-icon" /></div>
          <div className="agent-toolbar-right"><span><ShieldCheck size={14} /> Private session</span><span className="toolbar-divider" /><span>Output: text</span></div>
        </div>

        <div className={`conversation-area ${messages.length ? 'conversation-has-messages' : ''}`}>
          {!messages.length ? (
            <div className="agent-welcome">
              <span className="agent-welcome-mark"><Sparkles size={23} /></span>
              <h2>What would you like to work on?</h2>
              <p>Write a task below or start with one of these examples.</p>
              <div className="suggestion-list">
                {suggestions.map((suggestion) => <button key={suggestion} className="suggestion-button" onClick={() => { setPrompt(suggestion); inputRef.current?.focus(); }}><span>{suggestion}</span><ArrowRight size={15} /></button>)}
              </div>
            </div>
          ) : (
            <div className="conversation-thread">
              {messages.map((message) => message.role === 'user' ? (
                <div className="chat-message chat-message-user" key={message.id}>
                  <span className="chat-avatar user-chat-avatar"><UserRound size={16} /></span>
                  <div className="chat-message-body"><div className="chat-message-meta"><strong>You</strong></div><div className="chat-bubble user-bubble">{message.content}</div></div>
                </div>
              ) : (
                <div className="chat-message" key={message.id}>
                  <span className="chat-avatar agent-chat-avatar"><Bot size={17} /></span>
                  <div className="chat-message-body">
                    <div className="chat-message-meta"><strong>Relay agent</strong>{message.preview && <RunStatus status="preview" />}</div>
                    <div className="agent-response">
                      <pre>{message.content}</pre>
                      <div className="response-footer"><span>{message.run?.createdAt ? formatDate(message.run.createdAt) : 'Just now'}</span><button className="text-icon-button" onClick={() => copyText(message.id, message.content)}>{copied === message.id ? <Check size={14} /> : <Clipboard size={14} />}{copied === message.id ? 'Copied' : 'Copy output'}</button></div>
                    </div>
                    {message.preview && <div className="preview-disclaimer">This is placeholder output. Connect your team's agent to return real results.</div>}
                  </div>
                </div>
              ))}
              {busy && <div className="chat-message"><span className="chat-avatar agent-chat-avatar"><Bot size={17} /></span><div className="agent-thinking"><LoaderCircle className="spin" size={17} /> Preparing preview…</div></div>}
              <div ref={endRef} />
            </div>
          )}
        </div>

        <form className="prompt-composer" onSubmit={handleSubmit}>
          <textarea ref={inputRef} value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); handleSubmit(event); } }} rows={2} maxLength={20000} placeholder="Give your agent a task… (Shift + Enter for a new line)" aria-label="Agent prompt" />
          <div className="composer-footer"><div className="composer-meta"><span><Plus size={14} /> Prompt</span><span className="composer-separator">·</span><span>{prompt.length.toLocaleString()} / 20,000</span></div><button type="submit" className="button button-primary send-button" disabled={!prompt.trim() || busy}>{busy ? <LoaderCircle className="spin" size={17} /> : <>Run prompt <CornerDownLeft size={15} /></>}</button></div>
        </form>
      </section>
      <div className="agent-page-footnote"><ShieldCheck size={15} /> {source === 'server' ? 'Connected to your API. Results are saved to run history.' : 'Preview mode keeps runs in this browser until the API is configured.'}<span className="footnote-spacer" /><ArrowDownToLine size={14} /> Prompt history is available in <a href="/app/history">Run history</a>.</div>
    </div>
  );
}
