import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { LockedChatsView } from '../security/LockedChatsView';
import { RovelaAuthJourney } from '../auth/RovelaAuthJourney';
import { HelpSupportModal } from '../modals/HelpSupportModal';
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
  Mail,
  Phone,
  Eye,
  Sliders,
  Flag,
  Wifi,
  FileText,
  LifeBuoy,
  Database,
  Copy,
  Cloud,
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
    logout,
    supabaseChatHealth,
    refreshSupabaseHealth,
    copySupabaseSql,
  } = useChat();

  // Navigation subviews
  const [subView, setSubView] = useState<
    'main' | 'privacy-security' | 'two-step' | 'locked-chats' | 'onboarding-demo'
  >('main');

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [helpModalTab, setHelpModalTab] = useState<'faq' | 'contact' | 'report' | 'about'>('faq');
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  // Two-step verification form state
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

  const openHelpTab = (tab: 'faq' | 'contact' | 'report' | 'about') => {
    setHelpModalTab(tab);
    setIsHelpModalOpen(true);
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

  // Subview: Locked Chats
  if (subView === 'locked-chats') {
    return <LockedChatsView onBack={() => setSubView('privacy-security')} />;
  }

  // Subview: Two-Step Verification
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

  // Subview: Privacy & Security
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
              Account protection, encryption, PIN, biometrics, and permission controls.
            </p>
          </div>
        </div>

        <div className="p-6 max-w-2xl mx-auto w-full space-y-6">
          {/* Section: Account Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-3">
              Security & Credentials
            </h4>
            <div className="rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] divide-y divide-[var(--rovela-border)] overflow-hidden">
              <div
                onClick={() => showToast('Password reset link sent to ' + currentUser.email, undefined, 'info')}
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

          {/* Section: Protected Content & Biometrics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-3">
              Vault & Biometrics
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
                      Biometric Authentication
                    </p>
                    <p className="text-xs text-[var(--rovela-text-secondary)]">
                      Use Face ID or Touch ID to unlock vault
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

          {/* Section: Privacy Preferences */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-3">
              Privacy Controls
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
                    Online Status Visibility
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

          {/* Section: Reporting */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-3">
              Reporting & Safety
            </h4>
            <div className="rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] overflow-hidden">
              <button
                type="button"
                onClick={() => openHelpTab('report')}
                className="w-full p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                    <Flag className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--rovela-text-primary)]">
                      Report a Safety Concern or Bug
                    </p>
                    <p className="text-xs text-[var(--rovela-text-secondary)]">
                      Submit diagnostic or harassment report to trust team
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN SETTINGS VIEW: Professionally categorized containers
  // ACCOUNT → PRIVACY & SECURITY → APPEARANCE → NOTIFICATIONS → CHATS → CONTACTS → CALLS → DATA & STORAGE → HELP & SUPPORT
  // =========================================================================
  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--rovela-surface)] overflow-y-auto select-none">
      {/* Help & Support Modal */}
      <HelpSupportModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        initialTab={helpModalTab}
      />

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="w-full max-w-sm rounded-3xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] p-6 shadow-2xl text-[var(--rovela-text-primary)] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-center text-[var(--rovela-text-primary)]">
              Sign out of Rovela?
            </h3>
            <p className="text-xs text-[var(--rovela-text-secondary)] text-center mt-1.5 mb-6 leading-relaxed">
              Are you sure you want to sign out? You will need to log back in to access your conversations and synced data.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSignOutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-[var(--rovela-border)] hover:bg-[var(--rovela-surface-hover)] text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSignOutConfirm(false);
                  logout();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-rose-900/30"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Header */}
      <div className="p-4 sm:p-6 border-b border-[var(--rovela-border)] bg-[var(--rovela-surface)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveSection('more')}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-colors"
            title="Back to More"
            aria-label="Back to More"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[var(--rovela-text-primary)]">
              Settings
            </h2>
            <p className="text-xs text-[var(--rovela-text-secondary)] mt-0.5">
              Account, privacy, appearance & preferences
            </p>
          </div>
        </div>

        {/* Action button to test onboarding screens */}
        <button
          type="button"
          onClick={() => setSubView('onboarding-demo')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-xs font-bold transition-all cursor-pointer"
          title="Inspect the 6-screen onboarding flow"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Inspect Onboarding</span>
        </button>
      </div>

      {/* Main Settings Body */}
      <div className="p-4 sm:p-6 max-w-3xl mx-auto w-full space-y-7 pb-16">
        {/* ========================================================================= */}
        {/* 1. ACCOUNT SECTION                                                        */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--rovela-text-muted)] px-3">
            Account
          </h3>
          <div className="rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] divide-y divide-[var(--rovela-border)] overflow-hidden shadow-sm">
            {/* Primary Profile Card */}
            <div
              onClick={() => setActiveSection('profile')}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-4">
                <Avatar
                  src={currentUser.avatar_url}
                  name={currentUser.name}
                  size="lg"
                  status="online"
                  showStatus
                />
                <div>
                  <h4 className="text-base font-bold text-[var(--rovela-text-primary)]">
                    {currentUser.name}
                  </h4>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    @{currentUser.username}
                  </p>
                  <p className="text-xs text-[var(--rovela-text-secondary)] mt-0.5 line-clamp-1">
                    {currentUser.bio || 'Connecting on Rovela ✨'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--rovela-text-muted)]" />
            </div>

            {/* Account Information & Contact Details */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--rovela-text-primary)]">
                    Email Address
                  </p>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Verified
              </span>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--rovela-text-primary)]">
                    Phone Number
                  </p>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    {currentUser.phone || '+1 (555) 392-1084'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. PRIVACY & SECURITY SECTION                                             */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--rovela-text-muted)] px-3">
            Privacy & Security
          </h3>
          <div className="rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] divide-y divide-[var(--rovela-border)] overflow-hidden shadow-sm">
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
                    Privacy & Security Center
                  </h4>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    PIN, two-step verification, biometric, locked chats vault, blocked contacts
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--rovela-text-muted)]" />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--rovela-text-primary)]">
                    Read Receipts
                  </p>
                  <p className="text-[11px] text-[var(--rovela-text-secondary)]">
                    Send and receive read confirmations
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.readReceipts}
                onChange={(e) => updateSettings({ readReceipts: e.target.checked })}
                className="w-5 h-5 rounded border-[var(--rovela-border)] text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. APPEARANCE SECTION                                                     */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--rovela-text-muted)] px-3">
            Appearance
          </h3>
          <div className="rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                  Theme Preferences
                </h4>
                <p className="text-xs text-[var(--rovela-text-secondary)]">
                  Choose between obsidian dark mode and crisp off-white light mode
                </p>
              </div>
            </div>

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
        </div>

        {/* ========================================================================= */}
        {/* 4. NOTIFICATIONS SECTION                                                  */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--rovela-text-muted)] px-3">
            Notifications
          </h3>
          <div className="rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] divide-y divide-[var(--rovela-border)] overflow-hidden shadow-sm">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                    Sound Alerts
                  </h4>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Play chime sounds for incoming messages and alerts
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

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                    Desktop / In-App Banners
                  </h4>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Display notification banners for groups and direct messages
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.desktopNotifications}
                onChange={(e) => updateSettings({ desktopNotifications: e.target.checked })}
                className="w-5 h-5 rounded border-[var(--rovela-border)] text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. CHATS SECTION                                                          */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--rovela-text-muted)] px-3">
            Chats
          </h3>
          <div className="rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] divide-y divide-[var(--rovela-border)] overflow-hidden shadow-sm">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                    Enter Key Behavior
                  </h4>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Press Enter to send message immediately
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

            <div
              onClick={() => showToast('Chat wallpaper set to Default Obsidian Glass', undefined, 'info')}
              className="p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                    Chat Wallpaper & Media Visibility
                  </h4>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Ambient animated mesh background active
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--rovela-text-muted)]" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. CONTACTS SECTION                                                       */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--rovela-text-muted)] px-3">
            Contacts
          </h3>
          <div className="rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] divide-y divide-[var(--rovela-border)] overflow-hidden shadow-sm">
            <div
              onClick={() => {
                setActiveSection('contacts');
              }}
              className="p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                    Contact Preferences & Sync
                  </h4>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Manage saved contacts, address book import & synchronization
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--rovela-text-muted)]" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 7. CALLS SECTION                                                          */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--rovela-text-muted)] px-3">
            Calls
          </h3>
          <div className="rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] divide-y divide-[var(--rovela-border)] overflow-hidden shadow-sm">
            <div
              onClick={() => setActiveSection('calls')}
              className="p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                    Voice & Video Call Settings
                  </h4>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Call history, microphone, camera, and low-bandwidth mode
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--rovela-text-muted)]" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 8. DATA & STORAGE SECTION                                                 */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--rovela-text-muted)] px-3">
            Data & Storage
          </h3>
          <div className="rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                  Media Auto-Download & Network
                </h4>
                <p className="text-xs text-[var(--rovela-text-secondary)]">
                  Manage network usage, media storage, and cache retention
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)]">
                <div className="flex items-center gap-2.5">
                  <Wifi className="w-4 h-4 text-purple-500" />
                  <span className="font-medium text-[var(--rovela-text-primary)]">Auto-download media on Wi-Fi</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-[var(--rovela-border)] text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)]">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-purple-500" />
                  <span className="font-medium text-[var(--rovela-text-primary)]">Auto-download media on Cellular</span>
                </div>
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[var(--rovela-border)] text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)]">
                <div>
                  <span className="font-medium text-[var(--rovela-text-primary)]">Local Cached Storage</span>
                  <p className="text-[11px] text-[var(--rovela-text-muted)]">42.8 MB temporary files</p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Cache cleared successfully', undefined, 'success')}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold transition-all cursor-pointer"
                >
                  Clear Cache
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 9. SUPABASE CLOUD DATABASE & REALTIME SYNC                                */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--rovela-text-muted)] px-3">
            Cloud Database & Sync
          </h3>
          <div className="rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                      Supabase Realtime Cloud
                    </h4>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Connected
                    </span>
                  </div>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Project: <span className="font-mono text-purple-400">yjbufofcjbrmeqvdbxji</span> (Rovela)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  refreshSupabaseHealth();
                  showToast('Database Status Checked', 'Supabase Realtime channel is live.', 'info');
                }}
                className="p-2 rounded-xl text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
                title="Refresh Status"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="p-3 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)]">
                <span className="text-[10px] text-[var(--rovela-text-muted)] uppercase tracking-wider block font-bold">
                  Latency
                </span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {supabaseChatHealth?.latencyMs ?? 18} ms
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)]">
                <span className="text-[10px] text-[var(--rovela-text-muted)] uppercase tracking-wider block font-bold">
                  Realtime Sync
                </span>
                <span className="text-sm font-bold text-purple-400">
                  Active (30 fps)
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[var(--rovela-text-muted)] uppercase tracking-wider block font-bold">
                  Chat Tables
                </span>
                <span className="text-sm font-bold text-[var(--rovela-text-primary)]">
                  {supabaseChatHealth?.tablesReady ? 'Ready & Synced' : 'Ready'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <button
                type="button"
                onClick={copySupabaseSql}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold transition-all active:scale-[0.98] cursor-pointer shadow-md shadow-purple-900/30"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Chat SQL Schema</span>
              </button>
              <a
                href="https://supabase.com/dashboard/project/yjbufofcjbrmeqvdbxji/sql"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] hover:bg-[var(--rovela-surface-hover)] text-xs font-bold text-[var(--rovela-text-primary)] transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Supabase Dashboard</span>
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 9. HELP & SUPPORT SECTION                                                 */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--rovela-text-muted)] px-3">
            Help & Support
          </h3>
          <div className="rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] divide-y divide-[var(--rovela-border)] overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => openHelpTab('faq')}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                    FAQ & Help Center
                  </h4>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Frequently asked questions and guides
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--rovela-text-muted)]" />
            </button>

            <button
              type="button"
              onClick={() => openHelpTab('contact')}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                    Contact Support
                  </h4>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Direct assistance from Rovela team
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--rovela-text-muted)]" />
            </button>

            <button
              type="button"
              onClick={() => openHelpTab('report')}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <Flag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                    Report a Problem
                  </h4>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Submit bug telemetry or issues
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--rovela-text-muted)]" />
            </button>

            <button
              type="button"
              onClick={() => openHelpTab('about')}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                    About Rovela
                  </h4>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Architecture v2.4, terms and privacy policy
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--rovela-text-muted)]" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 10. SIGN OUT (DESTRUCTIVE BUTTON WITH CONFIRMATION)                        */}
        {/* ========================================================================= */}
        <div className="pt-4 border-t border-[var(--rovela-border)]">
          <button
            type="button"
            onClick={() => setShowSignOutConfirm(true)}
            className="w-full p-4 rounded-2xl flex items-center justify-center gap-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 active:bg-rose-500/15 border border-rose-500/25 transition-all text-sm font-bold cursor-pointer shadow-sm"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Sign Out</span>
          </button>
          <p className="text-center text-[11px] text-[var(--rovela-text-muted)] mt-2.5">
            Rovela Messenger • Version 2.4
          </p>
        </div>
      </div>
    </div>
  );
};
