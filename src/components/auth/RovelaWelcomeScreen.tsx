import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Sun,
  Moon,
  MessageSquare,
  Users,
  Radio,
  Zap,
} from 'lucide-react';
import { RovelaLogo } from '../ui/RovelaLogo';
import { useChat } from '../../context/ChatContext';

interface RovelaWelcomeScreenProps {
  onGoToRegister: () => void;
  onLoginSuccess?: () => void;
  onCancel?: () => void;
}

export const RovelaWelcomeScreen: React.FC<RovelaWelcomeScreenProps> = ({
  onGoToRegister,
  onLoginSuccess,
  onCancel,
}) => {
  const { login, switchDemoUser, users, settings, toggleTheme, showToast } = useChat();

  const isDarkMode = settings.theme === 'dark';

  // Sign-in Form States
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState<string | null>(null);

  // Field validation helper
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setForgotPasswordNotice(null);

    // Form Validation (Req 15)
    if (!identifier.trim()) {
      setErrorMessage('Enter your email or username.');
      return;
    }
    if (!password) {
      setErrorMessage('Enter your password.');
      return;
    }

    if (identifier.includes('@') && !identifier.includes('.')) {
      setErrorMessage('Enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(identifier.trim(), password);
      if (success) {
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setErrorMessage('Invalid credentials. Check your email/username and password.');
        setIsLoading(false);
      }
    } catch {
      setErrorMessage('Unable to sign in. Please verify your connection and try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await login(identifier.trim() || 'user@rovela.app');
      if (onLoginSuccess) onLoginSuccess();
    } catch {
      setIsLoading(false);
    }
  };

  const handleDemoUserSelect = (email: string) => {
    setIdentifier(email);
    setPassword('Rovela2026!#');
    setErrorMessage(null);
  };

  return (
    <div
      id="rovela-welcome-root"
      className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden transition-colors duration-500 bg-[#F8F7FA] dark:bg-[#0D0B12] text-[#0D0B12] dark:text-white select-none font-sans"
    >
      {/* ========================================================================= */}
      {/* 20. AMBIENT BACKGROUND & LIQUID LIGHT                                     */}
      {/* ========================================================================= */}
      {/* Subtle purple ambient lighting in dark mode / lavender tints in light mode */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      >
        {/* Top-Left Ambient Violet Bloom */}
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-[#7C3AED]/15 dark:from-[#5B21B6]/25 to-transparent blur-[120px] dark:blur-[140px]" />

        {/* Center-Right Ambient Electric Purple Bloom */}
        <div className="absolute top-1/3 -right-24 w-[480px] h-[480px] rounded-full bg-gradient-to-tl from-[#A855F7]/12 dark:from-[#7C3AED]/20 to-transparent blur-[110px] dark:blur-[130px]" />

        {/* Bottom Ambient Glow */}
        <div className="absolute -bottom-24 left-1/4 w-[600px] h-[360px] rounded-full bg-gradient-to-t from-[#C4B5FD]/20 dark:from-[#5B21B6]/15 to-transparent blur-[130px]" />

        {/* Ultra-subtle geometric grid for visual depth without noise */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* TOP HEADER: BRANDING & THEME SWITCHER                                    */}
      {/* ========================================================================= */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-5 sm:pt-6 flex items-center justify-between">
        {/* Minimal Brand stamp visible on all viewports */}
        <div className="flex items-center gap-2.5">
          <RovelaLogo size="md" showWordmark={true} showTagline={false} />
        </div>

        {/* Actions: Theme Toggle & Optional Close */}
        <div className="flex items-center gap-2.5">
          <button
            id="theme-toggle-btn"
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/70 dark:bg-white/[0.06] hover:bg-white dark:hover:bg-white/[0.1] border border-slate-200/80 dark:border-white/[0.08] text-slate-700 dark:text-[#C4B5FD] transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center"
            title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-purple-600" />}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-2 rounded-xl bg-white/70 dark:bg-white/[0.06] hover:bg-white dark:hover:bg-white/[0.1] border border-slate-200/80 dark:border-white/[0.08] text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER: TWO COLUMNS (DESKTOP) / VERTICAL STACK (MOBILE)          */}
      {/* ========================================================================= */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* ===================================================================== */}
          {/* LEFT COLUMN: ROVELA BRAND IDENTITY & TAGLINE                          */}
          {/* ===================================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 xl:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left pt-2 lg:pt-0"
          >
            {/* Brand Mark & Tagline */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] opacity-40 blur-lg group-hover:opacity-75 transition duration-500 pointer-events-none" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-transparent shadow-[0_8px_32px_rgba(124,58,237,0.35)]">
                  <img
                    src="/rovela-icon.png"
                    alt="Rovela Brand Mark"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== 'https://i.ibb.co/WW403np7/file-000000007eb481f4add391e50c54ffd8.png') {
                        target.src = 'https://i.ibb.co/WW403np7/file-000000007eb481f4add391e50c54ffd8.png';
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col items-start text-left">
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0D0B12] dark:text-white">
                    ROVELA
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#A855F7] shadow-[0_0_10px_#A855F7]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#7C3AED] dark:text-[#C4B5FD] tracking-wider uppercase">
                  Connect. Chat. Belong.
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-[#0D0B12] dark:text-white leading-[1.15] mb-4">
              Simple, fast, and <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#C4B5FD] bg-clip-text text-transparent">
                secure messaging.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md mb-6 leading-relaxed">
              Stay connected with your people wherever you are, across all your devices.
            </p>
          </motion.div>

          {/* ===================================================================== */}
          {/* 7, 8, 9. RIGHT COLUMN: REFINED LIQUID-GLASS SIGN-IN CARD              */}
          {/* ===================================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 xl:col-span-5 w-full max-w-md mx-auto"
          >
            {/* The Elevated Liquid Glass Card */}
            <div
              id="rovela-signin-card"
              className="relative rounded-3xl p-6 sm:p-8 bg-white/90 dark:bg-[#130E22]/85 backdrop-blur-2xl border border-slate-200/90 dark:border-white/[0.12] shadow-[0_20px_50px_rgba(13,11,18,0.08)] dark:shadow-[0_24px_60px_rgba(91,33,182,0.28)] transition-all duration-300"
            >
              {/* Card top specular rim highlight */}
              <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-purple-400/40 dark:via-purple-400/60 to-transparent pointer-events-none" />

              {/* 8. Heading & Supporting Text */}
              <div className="mb-6 text-left">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0D0B12] dark:text-white">
                  Welcome back
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Sign in to continue to Rovela.
                </p>
              </div>

              {/* 16. Semantic Inline Error Banner */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs font-medium flex items-center gap-2"
                    role="alert"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Notice for Forgot Password */}
              <AnimatePresence>
                {forgotPasswordNotice && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-medium flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>{forgotPasswordNotice}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* Field: Email or username */}
                <div>
                  <label
                    htmlFor="rovela-identifier-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                  >
                    Email or username
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="rovela-identifier-input"
                      type="text"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="alex.rivers@rovela.dev or @alexrivers"
                      autoComplete="username"
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-[#1A142E] border border-slate-200 dark:border-white/[0.12] focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/25 text-sm text-[#0D0B12] dark:text-white placeholder:text-slate-400 transition-all"
                    />
                  </div>
                </div>

                {/* Field: Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="rovela-password-input"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="rovela-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      disabled={isLoading}
                      className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-100/80 dark:bg-[#1A142E] border border-slate-200 dark:border-white/[0.12] focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/25 text-sm text-[#0D0B12] dark:text-white placeholder:text-slate-400 transition-all"
                    />
                    {/* 14. Password Visibility Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 10 & 13. Remember me & Forgot Password */}
                <div className="flex items-center justify-between pt-0.5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-white/20 text-[#7C3AED] focus:ring-[#7C3AED] bg-slate-100 dark:bg-slate-800 cursor-pointer"
                    />
                    <span className="font-medium">Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setForgotPasswordNotice('A password reset link has been sent to your email.');
                      setTimeout(() => setForgotPasswordNotice(null), 5000);
                    }}
                    className="text-xs font-semibold text-[#7C3AED] dark:text-[#C4B5FD] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* 9. Primary Sign In Button (#7C3AED with white text) */}
                <button
                  id="rovela-sign-in-button"
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-[0.98] text-white font-semibold text-sm tracking-wide shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_6px_24px_rgba(124,58,237,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* 12. Clean Divider */}
                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-white/[0.08]" />
                  </div>
                  <span className="relative px-3 bg-white dark:bg-[#130E22] text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    or continue with
                  </span>
                </div>

                {/* Continue with Google */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.1] text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* 11. Create Account (Secondary Action) */}
                <div className="pt-3 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Don&apos;t have a Rovela account?{' '}
                    <button
                      id="rovela-create-account-link"
                      type="button"
                      onClick={onGoToRegister}
                      className="text-[#7C3AED] dark:text-[#C4B5FD] font-bold hover:underline cursor-pointer ml-1 inline-flex items-center gap-1"
                    >
                      <span>Create account</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 27. MINIMAL FOOTER                                                        */}
      {/* ========================================================================= */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/50 dark:border-white/[0.05] mt-auto">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <span>© 2026 ROVELA</span>
          <span>•</span>
          <span className="text-[#7C3AED] dark:text-[#C4B5FD]/70 font-medium">Connect. Chat. Belong.</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              showToast(
                'Privacy & Security',
                'Rovela operates with end-to-end encrypted messaging and zero data selling.',
                'info'
              )
            }
            className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            Privacy
          </button>
          <button
            type="button"
            onClick={() =>
              showToast(
                'Terms of Service',
                'By using Rovela, you agree to respectful, safe communication standards.',
                'info'
              )
            }
            className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            Terms
          </button>
          <button
            type="button"
            onClick={() =>
              showToast(
                'Rovela Support',
                'For questions or assistance, contact support@rovela.dev',
                'info'
              )
            }
            className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            Help
          </button>
        </div>
      </footer>
    </div>
  );
};
