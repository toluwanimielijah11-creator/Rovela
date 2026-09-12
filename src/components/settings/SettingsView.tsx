import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { LockedChatsView } from '../security/LockedChatsView';
import { RovelaAuthJourney } from '../auth/RovelaAuthJourney';
import {
  Palette,
  Bell,
  Lock,
  MessageSquare,
  Shield,
  HelpCircle,
  Sun,
  Moon,
  Volume2,
  Check,
  Smartphone,
  ExternalLink,
  Ban,
  UserX,
  Key,
  ChevronRight,
  ArrowLeft,
  Fingerprint,
  PhoneCall,
  User,
  ShieldCheck,
  Sparkles,
  HardDrive,
  LogOut,
  RefreshCw,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    currentUser,
    setActiveSection,
    showToast,
    unblockUser,
    users,
  } = useChat();

  // Navigation subviews
  const [subView, setSubView] = useState<
    'main' | 'privacy-security' | 'two-step' | 'locked-chats' | 'onboarding-demo'
  >('main');

  const [activeCategory, setActiveCategory] = useState<
    'account' | 'privacy' | 'appearance' | 'notifications' | 'chat' | 'calls' | 'help'
  >('appearance');

  // Two-step verification form state (Screen 14)
  const [twoStepPin, setTwoStepPin] = useState(settings?.securityPin || '123456');
  const [twoStepConfirmPin, setTwoStepConfirmPin] = useState(settings?.securityPin || '123456');
  const [twoStepEmail, setTwoStepEmail] = useState(currentUser.email || 'john@example.com');
  const [twoStepEnabled, setTwoStepEnabled] = useState(!!settings?.twoStepEnabled);

  // Blocked users list details safely guarded
  const blockedUserIds = settings?.blockedUserIds || [];
  const blockedUsers = users.filter((u) => blockedUserIds.includes(u.id));

  const handleSaveTwoStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoStepPin !== twoStepConfirmPin) {
      showToast('PIN mismatch', 'Confirmation PIN does not match', 'error');
      return;
    }
    updateSettings({
      twoStepEnabled,
      securityPin: twoStepPin,
    });
    showToast('Two-step verification updated', undefined, 'success');
    setSubView('privacy-security');
  };

  // Subview: Onboarding Demo (Shows full 6 screen journey)
  if (subView === 'onboarding-demo') {
    return (
      <RovelaAuthJourney
        initialScreen="welcome"
        onComplete={() => {
          showToast('Onboarding completed', undefined, 'success');
          setSubView('main');
        }}
        onCancel={() => setSubView('main')}
      />
    );
  }

  // Subview: Locked Chats (Screen 15)
  if (subView === 'locked-chats') {
    return <LockedChatsView onBack={() => setSubView('privacy-security')} />;
  }

  // Subview: Two-Step Verification (Screen 14)
  if (subView === 'two-step') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[var(--rovela-surface)] overflow-y-auto select-none">
        <div className="p-4 sm:p-6 border-b border-[var(--rovela-border)] bg-[var(--rovela-surface)] flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSubView('privacy-security')}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[var(--rovela-text-primary)]">
              Two-step verification
            </h2>
            <p className="text-xs text-[var(--rovela-text-secondary)]">
              Enhanced account security for registration on new devices.
            </p>
          </div>
        </div>

        <div className="p-6 max-w-xl mx-auto w-full">
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-6 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--rovela-text-secondary)] leading-relaxed">
              Add an additional security step when registering Rovela on a new device. You will be
              prompted for your security PIN whenever your phone number is verified.
            </p>
          </div>

          <form onSubmit={handleSaveTwoStep} className="space-y-4">
            <div className="p-4 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                  Enable two-step verification
                </h4>
                <p className="text-xs text-[var(--rovela-text-secondary)]">
                  Require PIN during login on new devices
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoStepEnabled}
                  onChange={(e) => setTwoStepEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--rovela-text-secondary)] mb-1.5">
                Create 6-Digit PIN
              </label>
              <input
                type="password"
                maxLength={6}
                value={twoStepPin}
                onChange={(e) => setTwoStepPin(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="••••••"
                className="w-full px-4 py-3 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] focus:border-purple-500 focus:outline-none text-[var(--rovela-text-primary)] font-mono text-center tracking-widest text-lg transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--rovela-text-secondary)] mb-1.5">
                Confirm 6-Digit PIN
              </label>
              <input
                type="password"
                maxLength={6}
                value={twoStepConfirmPin}
                onChange={(e) => setTwoStepConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="••••••"
                className="w-full px-4 py-3 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] focus:border-purple-500 focus:outline-none text-[var(--rovela-text-primary)] font-mono text-center tracking-widest text-lg transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--rovela-text-secondary)] mb-1.5">
                Recovery Email (Optional)
              </label>
              <input
                type="email"
                value={twoStepEmail}
                onChange={(e) => setTwoStepEmail(e.target.value)}
                placeholder="recovery@example.com"
                className="w-full px-4 py-3 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] focus:border-purple-500 focus:outline-none text-[var(--rovela-text-primary)] placeholder-[var(--rovela-text-muted)] text-xs transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-md shadow-purple-900/30 transition-all cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Subview: Privacy & Security (Screen 13)
  if (subView === 'privacy-security') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[var(--rovela-surface)] overflow-y-auto select-none">
        <div className="p-4 sm:p-6 border-b border-[var(--rovela-border)] bg-[var(--rovela-surface)] flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSubView('main')}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[var(--rovela-text-primary)]">
              Privacy & Security
            </h2>
            <p className="text-xs text-[var(--rovela-text-secondary)]">
              Account protection, encryption, and permission controls.
            </p>
          </div>
        </div>

        <div className="p-6 max-w-2xl mx-auto w-full space-y-6">
          {/* Section: Account Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-3">
              Account Security
            </h4>
            <div className="rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] divide-y divide-[var(--rovela-border)] overflow-hidden">
              <div
                onClick={() => showToast('Password change link sent', undefined, 'info')}
                className="p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-[var(--rovela-text-primary)]">
                    Password
                  </p>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Change your account password
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
              </div>

              <div
                onClick={() => setSubView('two-step')}
                className="p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-[var(--rovela-text-primary)]">
                    Two-step verification
                  </p>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    {settings?.twoStepEnabled ? 'Enabled' : 'Add extra account protection'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
              </div>

              <div
                onClick={() => showToast('Security PIN active: 123456', undefined, 'info')}
                className="p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-[var(--rovela-text-primary)]">
                    Security PIN
                  </p>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Manage your 6-digit access PIN
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
              </div>
            </div>
          </div>

          {/* Section: Protected Content */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-3">
              Protected Content
            </h4>
            <div className="rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] divide-y divide-[var(--rovela-border)] overflow-hidden">
              <div
                onClick={() => setSubView('locked-chats')}
                className="p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--rovela-text-primary)]">
                      Locked Chats Vault
                    </p>
                    <p className="text-xs text-[var(--rovela-text-secondary)]">
                      Manage protected conversations and vault encryption
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--rovela-text-primary)]">
                      Biometric Unlock
                    </p>
                    <p className="text-xs text-[var(--rovela-text-secondary)]">
                      Use Face ID or Touch ID to open locked vault
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings?.biometricEnabled ?? true}
                    onChange={(e) => updateSettings({ biometricEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
                </label>
              </div>
            </div>
          </div>

          {/* Section: Privacy */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-3">
              Privacy
            </h4>
            <div className="rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] divide-y divide-[var(--rovela-border)] overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--rovela-text-primary)]">
                    Read Receipts
                  </p>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Double purple ticks when messages are read
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.readReceipts}
                  onChange={(e) => updateSettings({ readReceipts: e.target.checked })}
                  className="w-5 h-5 rounded border-[var(--rovela-border)] text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--rovela-text-primary)]">
                    Online Status
                  </p>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Show green dot when active
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.activeStatusVisible}
                  onChange={(e) => updateSettings({ activeStatusVisible: e.target.checked })}
                  className="w-5 h-5 rounded border-[var(--rovela-border)] text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section: Blocked Contacts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-3">
              Blocked Contacts ({blockedUsers.length})
            </h4>
            {blockedUsers.length > 0 ? (
              <div className="space-y-2">
                {blockedUsers.map((bUser) => (
                  <div
                    key={bUser.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-rose-500/[0.05] border border-rose-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar src={bUser.avatar_url} name={bUser.name} size="sm" />
                      <div>
                        <p className="text-xs font-bold text-[var(--rovela-text-primary)]">
                          {bUser.name}
                        </p>
                        <p className="text-[10px] text-[var(--rovela-text-secondary)]">@{bUser.username}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => unblockUser(bUser.id)}
                      className="px-3 py-1 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-center text-xs text-[var(--rovela-text-secondary)]">
                <UserX className="w-5 h-5 mx-auto mb-1 opacity-40 text-[var(--rovela-text-muted)]" />
                No contacts are currently blocked.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Settings View (Screen 12)
  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--rovela-surface)] overflow-y-auto select-none">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[var(--rovela-border)] bg-[var(--rovela-surface)] flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[var(--rovela-text-primary)]">
            Settings
          </h2>
          <p className="text-xs text-[var(--rovela-text-secondary)] mt-0.5">
            Customize your visual experience, privacy preferences, and security.
          </p>
        </div>

        {/* Action button to test onboarding screens */}
        <button
          type="button"
          onClick={() => setSubView('onboarding-demo')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-xs font-bold transition-all cursor-pointer"
          title="Inspect the 6-screen onboarding flow"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Inspect Onboarding Flow</span>
        </button>
      </div>

      {/* Main Settings Body */}
      <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-6">
        {/* Profile Card Header matching Screen 12 */}
        <div
          onClick={() => setActiveSection('profile')}
          className="p-4 sm:p-5 rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] shadow-sm hover:border-purple-500/40 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-4">
            <Avatar
              src={currentUser.avatar_url}
              name={currentUser.name}
              size="lg"
            />
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[var(--rovela-text-primary)]">
                {currentUser.name}
              </h3>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                @{currentUser.username}
              </p>
              <p className="text-xs text-[var(--rovela-text-secondary)] mt-1 line-clamp-1">
                {currentUser.bio || 'Connecting on Rovela ✨'}
              </p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-[var(--rovela-surface-hover)] flex items-center justify-center text-[var(--rovela-text-muted)]">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Categories List matching Screen 12 */}
        <div className="rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] divide-y divide-[var(--rovela-border)] overflow-hidden shadow-sm">
          {/* Privacy & Security */}
          <div
            onClick={() => setSubView('privacy-security')}
            className="p-4 sm:p-4.5 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                  Privacy & Security
                </h4>
                <p className="text-xs text-[var(--rovela-text-secondary)]">
                  PIN, biometric, two-step verification, locked chats vault
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
          </div>

          {/* Appearance & Themes (Screen 18) */}
          <div className="p-4 sm:p-4.5">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                  Appearance & Themes
                </h4>
                <p className="text-xs text-[var(--rovela-text-secondary)]">
                  Obsidian Dark (#0D0B12) vs Crisp Off-White (#F8F7FA)
                </p>
              </div>
            </div>

            {/* Theme Toggle Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div
                onClick={() => updateSettings({ theme: 'dark' })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  settings.theme === 'dark'
                    ? 'border-purple-500 ring-2 ring-purple-500/30 bg-[#0D0B12]'
                    : 'border-[var(--rovela-border)] bg-[#0D0B12]/80 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold text-white">
                    <Moon className="w-4 h-4 text-purple-400" />
                    Obsidian Dark Mode
                  </span>
                  {settings.theme === 'dark' && (
                    <span className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
              </div>

              <div
                onClick={() => updateSettings({ theme: 'light' })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  settings.theme === 'light'
                    ? 'border-purple-500 ring-2 ring-purple-500/30 bg-[#F8F7FA]'
                    : 'border-[var(--rovela-border)] bg-[#F8F7FA] opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Sun className="w-4 h-4 text-amber-500" />
                    Off-White Light Mode
                  </span>
                  {settings.theme === 'light' && (
                    <span className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="p-4 sm:p-4.5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                  Notifications & Sounds
                </h4>
                <p className="text-xs text-[var(--rovela-text-secondary)]">
                  Chime audio alerts, push alerts
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              className="w-5 h-5 rounded border-[var(--rovela-border)] text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
          </div>

          {/* Chats Preferences */}
          <div className="p-4 sm:p-4.5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                  Chat Preferences
                </h4>
                <p className="text-xs text-[var(--rovela-text-secondary)]">
                  Press Enter to send message
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.enterToSend}
              onChange={(e) => updateSettings({ enterToSend: e.target.checked })}
              className="w-5 h-5 rounded border-[var(--rovela-border)] text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
          </div>

          {/* Calls Preferences */}
          <div
            onClick={() => setActiveSection('calls')}
            className="p-4 sm:p-4.5 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                  Calls & Dialing
                </h4>
                <p className="text-xs text-[var(--rovela-text-secondary)]">
                  Call history, mic and camera settings
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
          </div>

          {/* Storage & Data Section (Section 18) */}
          <div className="p-4 sm:p-4.5 space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                  Storage & Data
                </h4>
                <p className="text-xs text-[var(--rovela-text-secondary)]">
                  Network usage, media auto-download, local cache
                </p>
              </div>
            </div>

            <div className="pt-2 pl-13 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--rovela-text-secondary)] font-medium">Auto-download media on Wi-Fi</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-[var(--rovela-border)] text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--rovela-text-secondary)] font-medium">Auto-download media on Cellular</span>
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[var(--rovela-border)] text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[var(--rovela-text-muted)]">Cache storage used: 42.8 MB</span>
                <button
                  type="button"
                  onClick={() => showToast('Cache cleared successfully', undefined, 'success')}
                  className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-300 font-semibold hover:bg-purple-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  Clear Cache
                </button>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div
            onClick={() => showToast('Rovela specification v2.4 active', undefined, 'info')}
            className="p-4 sm:p-4.5 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                  Help / About
                </h4>
                <p className="text-xs text-[var(--rovela-text-secondary)]">
                  Rovela Architecture v2.4, terms of service, report a problem
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
          </div>
        </div>

        {/* PRIMARY DESTRUCTIVE ACTION (Section 18): Log Out (red, bottom of screen, separated from other items) */}
        <div className="pt-2 pb-6">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to log out of Rovela?')) {
                setSubView('onboarding-demo');
                showToast('Logged out of Rovela session', undefined, 'info');
              }
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
          <p className="text-center text-[11px] text-[var(--rovela-text-muted)] mt-2">
            Rovela Messenger • Student Project Specification v2.4
          </p>
        </div>
      </div>
    </div>
  );
};
