export default function RunStatus({ status = 'preview' }) {
  const labels = { success: 'Successful', preview: 'Preview', failed: 'Failed' };
  return <span className={`status-badge status-${status}`}>{labels[status] || status}</span>;
}
