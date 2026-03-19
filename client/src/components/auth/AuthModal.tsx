import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../../lib/firebase';
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
        await signUpWithEmail(email, password);
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

      <Button onClick={handleGoogle} disabled={isLoading} variant="ghost" className="w-full mb-4 bg-white text-black hover:bg-gray-100 hover:text-black">
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.01 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
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
