import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { PasswordInput } from '../ui/PasswordInput';
import { Button } from '../ui/Button';
import { RovelaLogo } from '../ui/RovelaLogo';
import { useChat } from '../../context/ChatContext';
import { Mail, User, Check, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const { login, register } = useChat();

  // Login State
  const [loginEmail, setLoginEmail] = useState('alex.rivers@rovela.dev');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  // Register State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Validation / Error states
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginEmail || !loginPassword) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      login(loginEmail);
      setLoading(false);
      onClose();
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regName.trim() || !regUsername.trim() || !regEmail.trim() || !regPassword) {
      setError('All fields are required.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the Rovela terms of service.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      register(regName, regUsername, regEmail);
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex flex-col items-center text-center mb-6">
        <RovelaLogo size="lg" showWordmark showTagline={false} className="mb-3" />
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {mode === 'login' ? 'Welcome Back' : 'Create your Rovela Account'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {mode === 'login'
            ? 'Sign in to access your conversations and team channels.'
            : 'Join Rovela to experience fluid real-time communication.'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {mode === 'login' ? (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="you@domain.com"
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <PasswordInput
            label="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-white/20 text-purple-600 focus:ring-purple-500"
              />
              <span>Remember this device</span>
            </label>

            <button
              type="button"
              onClick={() => alert('Mock password reset email sent to ' + loginEmail)}
              className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading} className="mt-2">
            Sign In to Rovela
          </Button>

          {/* Quick Demo Pre-fill */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setLoginEmail('alex.rivers@rovela.dev');
                setLoginPassword('password123');
              }}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-purple-500 underline"
            >
              Click here to pre-fill Demo Account (Alex Rivers)
            </button>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 text-center text-xs text-slate-600 dark:text-slate-400">
            Don&apos;t have an account yet?{' '}
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode('register');
              }}
              className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
            >
              Sign Up
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Full Name"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="e.g. Maya Chen"
              icon={<User className="w-4 h-4" />}
              required
            />
            <Input
              label="Username"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              placeholder="@mayachen"
              required
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            placeholder="maya@company.com"
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <PasswordInput
              label="Password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
            />
            <PasswordInput
              label="Confirm Password"
              value={regConfirmPassword}
              onChange={(e) => setRegConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
            />
          </div>

          <div className="pt-1">
            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400 select-none">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 rounded mt-0.5 border-slate-300 dark:border-white/20 text-purple-600 focus:ring-purple-500"
              />
              <span>
                I agree to the <span className="text-purple-600 dark:text-purple-400 underline">Terms of Service</span> and{' '}
                <span className="text-purple-600 dark:text-purple-400 underline">Privacy Policy</span>.
              </span>
            </label>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading} className="mt-2">
            Create Rovela Account
          </Button>

          <div className="pt-3 border-t border-slate-200 dark:border-white/10 text-center text-xs text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode('login');
              }}
              className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
            >
              Sign In
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
