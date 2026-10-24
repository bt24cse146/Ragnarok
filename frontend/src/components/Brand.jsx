import { ArrowUpRight } from 'lucide-react';

export default function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? 'brand-compact' : ''}`}>
      <span className="brand-mark" aria-hidden="true"><ArrowUpRight size={19} strokeWidth={2.4} /></span>
      {!compact && <span className="brand-name">relay<span className="brand-period">.</span></span>}
    </div>
  );
}
