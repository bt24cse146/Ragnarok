import { LoaderCircle } from 'lucide-react';

function GoogleMark() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48" focusable="false">
      <path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20c10.016 0 19.085-7.292 19.085-20 0-1.341-.138-2.655-.474-3.917Z" />
      <path fill="#34A853" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.998 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691Z" />
      <path fill="#FBBC05" d="M24 44c5.167 0 9.809-1.977 13.304-5.197l-6.145-5.203C29.091 35.127 26.7 36 24 36c-5.2 0-9.615-3.315-11.28-7.947l-6.52 5.025C9.53 39.777 16.258 44 24 44Z" />
      <path fill="#EA4335" d="M43.611 20.083H42V20H24v8h11.303a12 12 0 0 1-4.144 5.6l6.145 5.203C41.377 35.181 44 29.999 44 24c0-1.341-.138-2.655-.389-3.917Z" />
    </svg>
  );
}

export default function GoogleSignInButton({ onClick, loading = false, disabled = false }) {
  return (
    <button className="button button-secondary google-button" type="button" onClick={onClick} disabled={disabled || loading}>
      {loading ? <LoaderCircle className="spin" size={17} /> : <GoogleMark />}
      <span>{loading ? 'Connecting to Google…' : 'Continue with Google'}</span>
    </button>
  );
}
