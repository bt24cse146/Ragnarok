import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { useAuth } from '../context/AuthContext';

function readableAuthError(error) {
  const messages = {
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/user-not-found': 'No account was found for this email.',
    'auth/wrong-password': 'Email or password is incorrect.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
    'auth/popup-closed-by-user': 'Google sign-in was closed before finishing.',
    'auth/popup-blocked': 'Your browser blocked the sign-in popup. Allow popups for localhost and try again.',
    'auth/operation-not-allowed': 'Google sign-in is not enabled yet. Enable Google in Firebase Authentication providers.',
    'auth/unauthorized-domain': 'This domain is not authorized for Firebase sign-in. Add localhost under Firebase Authentication settings.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
  };
  return messages[error.code] || error.message || 'Unable to sign in. Please try again.';
}

export default function Login() {
  const { signIn, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      navigate('/app', { replace: true });
    } catch (authError) {
      setError(readableAuthError(authError));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError('');
    setNotice('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate('/app', { replace: true });
    } catch (authError) {
      setError(readableAuthError(authError));
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleReset() {
    setError('');
    setNotice('');
    if (!email.trim()) {
      setError('Enter your email above and then select Forgot password.');
      return;
    }
    try {
      await resetPassword(email.trim());
      setNotice('Password reset instructions have been sent to your email.');
    } catch (authError) {
      setError(readableAuthError(authError));
    }
  }

  return (
    <AuthLayout mode="login">
      <div className="auth-heading">
        <div className="auth-kicker">WELCOME BACK</div>
        <h1>Sign in to Relay</h1>
        <p>Pick up where you left off.</p>
      </div>
      <div className="auth-social-block">
        {error && <div className="form-alert form-alert-error" role="alert">{error}</div>}
        <GoogleSignInButton onClick={handleGoogleSignIn} loading={googleLoading} disabled={loading} />
        <div className="auth-divider"><span>or sign in with email</span></div>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        {notice && <div className="form-alert form-alert-success" role="status">{notice}</div>}
        <label className="field-label" htmlFor="email">Email address</label>
        <div className="input-wrap"><Mail size={17} /><input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
        <div className="field-label-row"><label className="field-label" htmlFor="password">Password</label><button type="button" className="text-button" onClick={handleReset}>Forgot password?</button></div>
        <div className="input-wrap"><LockKeyhole size={17} /><input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} /><button type="button" className="input-action" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        <button className="button button-primary auth-submit" type="submit" disabled={loading || googleLoading}>{loading ? <LoaderCircle className="spin" size={18} /> : <>Sign in <ArrowRight size={17} /></>}</button>
      </form>
      <p className="auth-switch">New to Relay? <Link to="/signup">Create an account</Link></p>
    </AuthLayout>
  );
}
