import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, UserRound } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { useAuth } from '../context/AuthContext';

function readableAuthError(error) {
  const messages = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/weak-password': 'Use a stronger password with at least 6 characters.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
    'auth/popup-closed-by-user': 'Google sign-in was closed before finishing.',
    'auth/popup-blocked': 'Your browser blocked the sign-in popup. Allow popups for localhost and try again.',
    'auth/operation-not-allowed': 'Google sign-in is not enabled yet. Enable Google in Firebase Authentication providers.',
    'auth/unauthorized-domain': 'This domain is not authorized for Firebase sign-in. Add localhost under Firebase Authentication settings.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
  };
  return messages[error.code] || error.message || 'Unable to create your account. Please try again.';
}

export default function Signup() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGoogleSignIn() {
    setError('');
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

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await signUp(name, email.trim(), password);
      navigate('/app', { replace: true });
    } catch (authError) {
      setError(readableAuthError(authError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout mode="signup">
      <div className="auth-heading">
        <div className="auth-kicker">GET STARTED</div>
        <h1>Create your account</h1>
        <p>A clear workspace for your next big idea.</p>
      </div>
      <div className="auth-social-block">
        {error && <div className="form-alert form-alert-error" role="alert">{error}</div>}
        <GoogleSignInButton onClick={handleGoogleSignIn} loading={googleLoading} disabled={loading} />
        <div className="auth-divider"><span>or sign up with email</span></div>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="name">Full name</label>
        <div className="input-wrap"><UserRound size={17} /><input id="name" type="text" autoComplete="name" placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} /></div>
        <label className="field-label" htmlFor="email">Email address</label>
        <div className="input-wrap"><Mail size={17} /><input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
        <label className="field-label" htmlFor="password">Password</label>
        <div className="input-wrap"><LockKeyhole size={17} /><input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="At least 6 characters" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} /><button type="button" className="input-action" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        <label className="field-label" htmlFor="confirmPassword">Confirm password</label>
        <div className="input-wrap"><LockKeyhole size={17} /><input id="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Re-enter your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={6} /></div>
        <button className="button button-primary auth-submit" type="submit" disabled={loading || googleLoading}>{loading ? <LoaderCircle className="spin" size={18} /> : <>Create account <ArrowRight size={17} /></>}</button>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </AuthLayout>
  );
}
