import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { signInWithGoogle, signInWithGitHub, signInWithEmail, signUpWithEmail } from '../../lib/firebase';
import { FirebaseError } from 'firebase/app';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogle = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      if (onClose) onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHub = async () => {
    try {
      setIsLoading(true);
      await signInWithGitHub();
      if (onClose) onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with GitHub');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        if (!displayName.trim()) {
          throw new Error('Please enter a display name');
        }
        const userCredential = await signUpWithEmail(email, password);
        const { updateProfile } = await import('firebase/auth');
        await updateProfile(userCredential.user, { displayName });
      }
      if (onClose) onClose();
    } catch (err: any) {
      let msg = 'An unexpected error occurred';
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            msg = 'Incorrect password or email';
            break;
          case 'auth/user-not-found':
            msg = 'No account with that email';
            break;
          case 'auth/email-already-in-use':
            msg = 'An account with this email already exists';
            break;
          case 'auth/weak-password':
            msg = 'Password must be at least 6 characters';
            break;
          case 'auth/invalid-email':
            msg = 'Please enter a valid email address';
            break;
          default:
            msg = err.message;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-display text-white mb-2">{isLogin ? 'Welcome back' : 'Create account'}</h2>
        <p className="text-[var(--text-secondary)] text-sm">Sign in to start writing better replies</p>
      </div>

      <Button onClick={handleGoogle} disabled={isLoading} variant="ghost" className="w-full mb-3 bg-white text-black hover:bg-gray-100 hover:text-black">
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.01 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </Button>
      <Button onClick={handleGitHub} disabled={isLoading} variant="ghost" className="w-full mb-4 bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--border-hover)]">
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.165c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
        Continue with GitHub
      </Button>

      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-[var(--border)]"></div>
        <span className="flex-shrink-0 px-4 text-[var(--border-hover)] text-sm">or</span>
        <div className="flex-grow border-t border-[var(--border)]"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Display Name</label>
            <Input type="text" required value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Jane Doe" disabled={isLoading} />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email</label>
          <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="hello@example.com" disabled={isLoading} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Password</label>
          <Input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" disabled={isLoading} minLength={6} />
        </div>

        {error && <div className="text-[var(--error)] text-sm text-center bg-[var(--error)]/10 py-2 rounded-[var(--radius)]">{error}</div>}

        <Button type="submit" className="w-full" isLoading={isLoading}>
          {isLogin ? 'Sign In' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button type="button" onClick={() => { setIsLogin(!isLogin); setError(null); }} className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium">
          {isLogin ? 'Sign up' : 'Sign in'}
        </button>
      </div>
    </Modal>
  );
}
