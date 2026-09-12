import React, { useState, useEffect } from 'react';
import { RovelaLogo } from '../ui/RovelaLogo';
import { useChat } from '../../context/ChatContext';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
  Fingerprint,
  Smartphone,
  ShieldCheck,
  Camera,
  Lock,
  ChevronRight,
  ArrowRight,
  Info,
} from 'lucide-react';

export type AuthScreenId =
  | 'welcome' // Screen 1
  | 'register' // Screen 2
  | 'verify' // Screen 3
  | 'profile' // Screen 4
  | 'pin' // Screen 5
  | 'biometric' // Screen 6
  | 'login'; // Screen 17

interface RovelaAuthJourneyProps {
  initialScreen?: AuthScreenId;
  onComplete?: () => void;
  onCancel?: () => void;
}

export const RovelaAuthJourney: React.FC<RovelaAuthJourneyProps> = ({
  initialScreen = 'welcome',
  onComplete,
  onCancel,
}) => {
  const { login, register, updateUserProfile, updateSettings } = useChat();

  const [currentScreen, setCurrentScreen] = useState<AuthScreenId>(initialScreen);

  // Form states
  // Screen 2: Registration
  const [regFullName, setRegFullName] = useState('John Doe');
  const [regUsername, setRegUsername] = useState('johndoe');
  const [regEmailOrPhone, setRegEmailOrPhone] = useState('john@example.com');
  const [regPassword, setRegPassword] = useState('Rovela2026!#');
  const [showPassword, setShowPassword] = useState(false);

  // Screen 3: Verification
  const [otpDigits, setOtpDigits] = useState(['5', '2', '9', '', '', '']);
  const [verifyCountdown, setVerifyCountdown] = useState(42);

  // Screen 4: Profile
  const [profileName, setProfileName] = useState('John Doe');
  const [profileUsername, setProfileUsername] = useState('johndoe');
  const [profileAbout, setProfileAbout] = useState('Connecting on Rovela ✨');
  const [profileAvatar, setProfileAvatar] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
  );

  // Screen 5: PIN
  const [pinDigits, setPinDigits] = useState<string[]>(['1', '2', '3', '4', '', '']);

  // Screen 6: Biometrics
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  // Screen 17: Login
  const [loginIdentifier, setLoginIdentifier] = useState('john@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginRememberMe, setLoginRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Verification timer countdown
  useEffect(() => {
    if (currentScreen !== 'verify') return;
    if (verifyCountdown <= 0) return;
    const timer = setInterval(() => {
      setVerifyCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentScreen, verifyCountdown]);

  // Password validation checklist
  const hasMinLength = regPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(regPassword);
  const hasNumber = /[0-9]/.test(regPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(regPassword);
  const isStrong = hasMinLength && hasUppercase && hasNumber && hasSpecial;

  // Keypad click for PIN
  const handleKeypadPress = (digit: string) => {
    const nextEmptyIndex = pinDigits.findIndex((d) => d === '');
    if (nextEmptyIndex !== -1) {
      const updated = [...pinDigits];
      updated[nextEmptyIndex] = digit;
      setPinDigits(updated);
    }
  };

  const handleKeypadBackspace = () => {
    // Find last filled digit
    const lastFilled = [...pinDigits].reverse().findIndex((d) => d !== '');
    if (lastFilled !== -1) {
      const actualIndex = 5 - lastFilled;
      const updated = [...pinDigits];
      updated[actualIndex] = '';
      setPinDigits(updated);
    }
  };

  const finishAuthAndEnter = () => {
    register(profileName, profileUsername, regEmailOrPhone);
    updateUserProfile({
      bio: profileAbout,
      avatar_url: profileAvatar,
    });
    updateSettings({
      securityPin: pinDigits.join('') || '123456',
      biometricEnabled,
    });
    if (onComplete) onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0D0B12] text-white select-none overflow-y-auto font-sans">
      {/* Ambient background waves matching the Rovela reference */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[450px] bg-gradient-to-b from-purple-700/25 via-violet-900/10 to-transparent blur-[100px]" />
      <div className="pointer-events-none fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-[300px] bg-gradient-to-t from-purple-900/20 to-transparent blur-[120px]" />

      {/* Screen Quick-Navigation Header / Debug Strip */}
      <div className="relative z-20 w-full max-w-md mx-auto px-4 pt-3 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <span className="text-purple-400 font-bold uppercase tracking-wider text-[10px] mr-1">
            Reference Screens:
          </span>
          {(
            [
              { id: 'welcome', label: '1. Welcome' },
              { id: 'register', label: '2. Register' },
              { id: 'verify', label: '3. Verify' },
              { id: 'profile', label: '4. Profile' },
              { id: 'pin', label: '5. PIN' },
              { id: 'biometric', label: '6. Biometric' },
              { id: 'login', label: '17. Login' },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentScreen(s.id)}
              className={`px-2 py-0.5 rounded-full cursor-pointer transition-all ${
                currentScreen === s.id
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="ml-2 text-slate-400 hover:text-white text-xs font-semibold"
          >
            Close
          </button>
        )}
      </div>

      {/* Main Screen Content Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center p-4 sm:p-6 w-full max-w-md mx-auto">
        {/* ========================================================================= */}
        {/* SCREEN 1: WELCOME / ONBOARDING                                            */}
        {/* ========================================================================= */}
        {currentScreen === 'welcome' && (
          <div className="w-full flex flex-col items-center text-center my-auto">
            {/* Centered Rovela Ribbon Logo */}
            <div className="relative mb-6 mt-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-purple-600/30 blur-2xl scale-125 pointer-events-none" />
              <RovelaLogo size="xl" showWordmark={false} />
            </div>

            {/* Title & Tagline */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Rovela
            </h1>
            <p className="text-sm font-semibold text-purple-300 tracking-wide mb-3">
              Connect. Chat. Belong.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xs leading-relaxed mb-10">
              Private conversations, Meaningful connections.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="w-full flex flex-col gap-3 max-w-xs">
              <button
                type="button"
                onClick={() => setCurrentScreen('register')}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(124,58,237,0.45)] transition-all cursor-pointer"
              >
                Get Started
              </button>

              <button
                type="button"
                onClick={() => setCurrentScreen('login')}
                className="w-full py-3.5 px-6 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] active:scale-[0.98] text-slate-200 font-semibold text-sm tracking-wide transition-all cursor-pointer"
              >
                I already have an account
              </button>
            </div>

            {/* Ambient Purple Wave Graphic at bottom */}
            <div className="mt-12 w-full flex justify-center opacity-60">
              <div className="w-48 h-1.5 rounded-full bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: REGISTRATION (CREATE ACCOUNT)                                   */}
        {/* ========================================================================= */}
        {currentScreen === 'register' && (
          <div className="w-full flex flex-col my-auto">
            {/* Header with Back button */}
            <div className="flex items-center mb-6">
              <button
                type="button"
                onClick={() => setCurrentScreen('welcome')}
                className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1.5">
              Create Account
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mb-6">
              Join Rovela and start your journey.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCurrentScreen('verify');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#161224] border border-white/[0.12] focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-white text-sm placeholder:text-slate-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="@johndoe"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#161224] border border-white/[0.12] focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-white text-sm placeholder:text-slate-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email or phone number
                </label>
                <input
                  type="text"
                  value={regEmailOrPhone}
                  onChange={(e) => setRegEmailOrPhone(e.target.value)}
                  placeholder="+234 801 234 5678 or john@example.com"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#161224] border border-white/[0.12] focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-white text-sm placeholder:text-slate-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a secure password"
                    required
                    className="w-full px-4 py-3 pr-11 rounded-2xl bg-[#161224] border border-white/[0.12] focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-white text-sm placeholder:text-slate-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password strength indicator and 4 requirements matching reference */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Strength:</span>
                  <span
                    className={`font-bold ${
                      isStrong
                        ? 'text-emerald-400'
                        : hasMinLength
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {isStrong ? 'Strong password' : hasMinLength ? 'Moderate' : 'Too weak'}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isStrong
                        ? 'w-full bg-emerald-500'
                        : hasMinLength
                        ? 'w-2/3 bg-amber-500'
                        : 'w-1/4 bg-rose-500'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                  <div
                    className={`flex items-center gap-1.5 ${
                      hasMinLength ? 'text-emerald-400 font-medium' : 'text-slate-500'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>At least 8 characters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      hasUppercase ? 'text-emerald-400 font-medium' : 'text-slate-500'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>One uppercase letter</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      hasNumber ? 'text-emerald-400 font-medium' : 'text-slate-500'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>One number</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      hasSpecial ? 'text-emerald-400 font-medium' : 'text-slate-500'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>One special character</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(124,58,237,0.45)] transition-all cursor-pointer"
              >
                Continue
              </button>

              <p className="text-center text-xs text-slate-400 pt-2">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setCurrentScreen('login')}
                  className="text-purple-400 font-bold hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </p>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: VERIFICATION (VERIFY YOUR ACCOUNT)                              */}
        {/* ========================================================================= */}
        {currentScreen === 'verify' && (
          <div className="w-full flex flex-col my-auto text-center">
            {/* Header with Back button */}
            <div className="flex items-center mb-6">
              <button
                type="button"
                onClick={() => setCurrentScreen('register')}
                className="flex items-center gap-1 -ml-2 text-slate-300 hover:text-white text-xs font-semibold py-1 px-2 rounded-xl hover:bg-white/5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Verify your account
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto mb-8">
              We&apos;ve sent a verification code to{' '}
              <span className="text-slate-200 font-semibold">+234 ••• ••• 1234</span>
            </p>

            {/* 6 separate input boxes matching reference */}
            <div className="flex justify-center items-center gap-2 sm:gap-3 mb-6">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    const updated = [...otpDigits];
                    updated[idx] = val;
                    setOtpDigits(updated);
                    if (val && idx < 5) {
                      const next = document.getElementById(`otp-input-${idx + 1}`);
                      if (next) next.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
                      const prev = document.getElementById(`otp-input-${idx - 1}`);
                      if (prev) prev.focus();
                    }
                  }}
                  className={`w-12 h-14 sm:w-13 sm:h-16 text-center text-xl font-extrabold rounded-2xl border transition-all focus:outline-none ${
                    digit
                      ? 'bg-purple-600/15 border-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                      : 'bg-[#161224] border-white/[0.12] text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30'
                  }`}
                />
              ))}
            </div>

            {/* Countdown timer & resend link */}
            <div className="flex flex-col items-center gap-2 mb-8">
              <span className="text-xs font-mono font-semibold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                00:{verifyCountdown < 10 ? `0${verifyCountdown}` : verifyCountdown}
              </span>
              <button
                type="button"
                onClick={() => setVerifyCountdown(42)}
                disabled={verifyCountdown > 0}
                className={`text-xs font-semibold ${
                  verifyCountdown > 0
                    ? 'text-slate-500 cursor-not-allowed'
                    : 'text-purple-400 hover:underline cursor-pointer'
                }`}
              >
                Resend code
              </button>
            </div>

            <button
              type="button"
              onClick={() => setCurrentScreen('profile')}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(124,58,237,0.45)] transition-all cursor-pointer mb-3"
            >
              Verify & Continue
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreen('register')}
              className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Change number
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 4: PROFILE SETUP (COMPLETE YOUR PROFILE)                           */}
        {/* ========================================================================= */}
        {currentScreen === 'profile' && (
          <div className="w-full flex flex-col my-auto">
            {/* Header with Back button */}
            <div className="flex items-center mb-4">
              <button
                type="button"
                onClick={() => setCurrentScreen('verify')}
                className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1.5">
              Complete your profile
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mb-6">
              Help others get to know you.
            </p>

            {/* Circular photo upload matching reference */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500/40 p-0.5 bg-gradient-to-b from-purple-500/30 to-violet-700/10">
                  <img
                    src={profileAvatar}
                    alt="Profile preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-purple-600 border-2 border-[#0D0B12] flex items-center justify-center text-white shadow-md">
                  <Camera className="w-4 h-4" />
                </div>
              </div>
              <span className="text-[11px] text-purple-300/80 mt-2 font-medium">
                Change Profile Photo
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCurrentScreen('pin');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#161224] border border-white/[0.12] focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-white text-sm placeholder:text-slate-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={profileUsername}
                  onChange={(e) => setProfileUsername(e.target.value)}
                  placeholder="johndoe"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#161224] border border-white/[0.12] focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-white text-sm placeholder:text-slate-500 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    About / Status
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {profileAbout.length}/140
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={140}
                  value={profileAbout}
                  onChange={(e) => setProfileAbout(e.target.value)}
                  placeholder="Tell your contacts what you're up to..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#161224] border border-white/[0.12] focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-white text-sm placeholder:text-slate-500 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(124,58,237,0.45)] transition-all cursor-pointer"
              >
                Continue
              </button>

              <button
                type="button"
                onClick={() => setCurrentScreen('pin')}
                className="w-full py-2.5 text-center text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Skip for now
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 5: SECURITY PIN (CREATE YOUR SECURITY PIN)                         */}
        {/* ========================================================================= */}
        {currentScreen === 'pin' && (
          <div className="w-full flex flex-col my-auto text-center">
            {/* Header with Back button */}
            <div className="flex items-center mb-3">
              <button
                type="button"
                onClick={() => setCurrentScreen('profile')}
                className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Create your security PIN
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mb-8 leading-relaxed">
              Use your PIN to unlock protected content and add extra security to your account.
            </p>

            {/* 6 Large circular indicator dots matching reference */}
            <div className="flex justify-center items-center gap-4 mb-8">
              {pinDigits.map((digit, idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    digit
                      ? 'bg-purple-500 scale-125 shadow-[0_0_10px_rgba(168,85,247,0.8)]'
                      : 'border-2 border-white/30 bg-transparent'
                  }`}
                />
              ))}
            </div>

            {/* Clean Numeric Keypad matching reference */}
            <div className="grid grid-cols-3 gap-3.5 max-w-xs mx-auto mb-6 w-full">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="h-14 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] active:bg-purple-600/30 border border-white/[0.08] active:border-purple-500/40 text-xl font-bold text-white transition-all cursor-pointer flex items-center justify-center shadow-sm"
                >
                  {digit}
                </button>
              ))}
              <div className="h-14" /> {/* Blank placeholder for alignment */}
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="h-14 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] active:bg-purple-600/30 border border-white/[0.08] active:border-purple-500/40 text-xl font-bold text-white transition-all cursor-pointer flex items-center justify-center shadow-sm"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleKeypadBackspace}
                className="h-14 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] active:bg-purple-600/30 border border-white/[0.08] active:border-purple-500/40 text-sm font-semibold text-slate-300 transition-all cursor-pointer flex items-center justify-center shadow-sm"
              >
                ⌫
              </button>
            </div>

            {/* Next button */}
            <button
              type="button"
              onClick={() => setCurrentScreen('biometric')}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(124,58,237,0.45)] transition-all cursor-pointer"
            >
              Continue
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 6: BIOMETRIC AUTHENTICATION                                        */}
        {/* ========================================================================= */}
        {currentScreen === 'biometric' && (
          <div className="w-full flex flex-col my-auto text-center">
            {/* Header with Back button */}
            <div className="flex items-center mb-3">
              <button
                type="button"
                onClick={() => setCurrentScreen('pin')}
                className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Use biometric authentication
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mb-8 leading-relaxed">
              Unlock protected content quickly using your device&apos;s supported biometric security.
            </p>

            {/* Glowing circular fingerprint artwork matching reference */}
            <div className="relative mx-auto mb-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-purple-600/25 blur-3xl scale-150 pointer-events-none" />
              <div className="w-32 h-32 rounded-full border-2 border-purple-500/40 bg-gradient-to-b from-purple-500/10 to-transparent flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-purple-400/30 bg-purple-900/30 flex items-center justify-center">
                  <Fingerprint className="w-14 h-14 text-purple-300 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Biometric toggle card matching reference */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between mb-4">
              <div className="text-left">
                <h4 className="text-sm font-bold text-white leading-tight">
                  Use biometric authentication
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Face ID or Touch ID for instant unlock
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={biometricEnabled}
                  onChange={(e) => setBiometricEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
              </label>
            </div>

            {/* Info fallback banner matching reference */}
            <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-800/30 flex items-start gap-2.5 text-left mb-8">
              <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span>Biometric authentication availability depends on your browser & device capabilities. </span>
                <button
                  type="button"
                  onClick={() => setCurrentScreen('pin')}
                  className="text-purple-300 font-bold hover:underline"
                >
                  Use PIN instead
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={finishAuthAndEnter}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(124,58,237,0.45)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Finish Setup & Enter Rovela</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 17: LOGIN                                                          */}
        {/* ========================================================================= */}
        {currentScreen === 'login' && (
          <div className="w-full flex flex-col my-auto">
            {/* Centered Rovela Ribbon Logo */}
            <div className="flex flex-col items-center text-center mb-6">
              <RovelaLogo size="lg" showWordmark={false} className="mb-3" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Sign in to continue
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                login(loginIdentifier);
                if (onComplete) onComplete();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email or phone
                </label>
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="you@example.com or +234..."
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#161224] border border-white/[0.12] focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-white text-sm placeholder:text-slate-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-11 rounded-2xl bg-[#161224] border border-white/[0.12] focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-white text-sm placeholder:text-slate-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={loginRememberMe}
                    onChange={(e) => setLoginRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 text-purple-600 focus:ring-purple-500 bg-slate-800"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Mock password reset code sent to your contact.')}
                  className="text-purple-400 hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(124,58,237,0.45)] transition-all cursor-pointer"
              >
                Log In
              </button>

              {/* Social Login Options */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.08]" />
                </div>
                <span className="relative px-3 bg-[#0D0B12] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  or continue with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    login('john@example.com');
                    if (onComplete) onComplete();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span className="font-bold text-sm">G</span>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    login('john@example.com');
                    if (onComplete) onComplete();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span className="font-bold text-sm"></span>
                  <span>Apple</span>
                </button>
              </div>

              <p className="text-center text-xs text-slate-400 pt-3">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setCurrentScreen('register')}
                  className="text-purple-400 font-bold hover:underline cursor-pointer"
                >
                  Create account
                </button>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
