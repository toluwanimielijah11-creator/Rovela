import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useProfile } from '../../context/ProfileContext';
import { useContact } from '../../context/ContactContext';
import { UserStatus, PrivacyVisibility } from '../../types';
import { Avatar } from '../ui/Avatar';
import { ProfileQRCode } from './ProfileQRCode';
import {
  Camera,
  Check,
  Sparkles,
  Mail,
  Phone,
  Calendar,
  AtSign,
  Shield,
  MessageSquare,
  Users,
  Lock,
  Smartphone,
  Laptop,
  ChevronRight,
  Edit2,
  QrCode,
  Share2,
  Copy,
  Eye,
  Trash2,
  Globe,
  UserCheck,
  ShieldCheck,
  Sliders,
  ArrowLeft,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    conversations,
    setActiveSection,
    showToast,
    openEditProfile,
    openPhotoCrop,
    openRovelaQr,
    openShareProfile,
    openMediaViewer,
  } = useChat();

  const { profile, copyRovelaId } = useProfile();
  const { contacts } = useContact();
  const [showQrModal, setShowQrModal] = useState(false);

  const activeUser = {
    ...currentUser,
    ...profile,
    display_name: profile.display_name || profile.name || currentUser.name,
    about: profile.about || profile.bio || currentUser.bio,
  };

  const [statusText, setStatusText] = useState(activeUser.status_text || 'Available for collaboration');
  const [statusState, setStatusState] = useState<UserStatus>(activeUser.status_state);

  const directCount = conversations.filter((c) => c.type === 'direct').length;
  const groupCount = conversations.filter((c) => c.type === 'group').length;

  const presetStatuses = [
    { label: 'Available', state: 'online' as UserStatus, text: 'Available to chat' },
    { label: 'Busy', state: 'busy' as UserStatus, text: 'Do Not Disturb • Focusing' },
    { label: 'In a Meeting', state: 'busy' as UserStatus, text: 'In a meeting • Call back later' },
    { label: 'Away', state: 'away' as UserStatus, text: 'Be right back' },
  ];

  const handleCopyRovelaId = () => {
    copyRovelaId();
  };

  const handleRemovePhoto = () => {
    updateUserProfile({
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        currentUser.name
      )}&backgroundColor=7c3aed`,
    });
    showToast('Profile photo removed', undefined, 'info');
  };

  const handlePrivacyChange = (
    field: 'photo_privacy' | 'about_privacy' | 'last_seen_privacy',
    val: PrivacyVisibility
  ) => {
    updateUserProfile({ [field]: val });
    showToast('Privacy settings updated', undefined, 'success');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--rovela-surface)] overflow-y-auto select-none">
      {/* Top Header */}
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
            <h2 className="text-2xl font-extrabold tracking-tight text-[var(--rovela-text-primary)]">
              My Profile
            </h2>
            <p className="text-xs text-[var(--rovela-text-secondary)] mt-0.5">
              Manage your personal Rovela identity, privacy, and presence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] hover:bg-[var(--rovela-surface-hover)] text-[var(--rovela-text-primary)] text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <QrCode className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Show QR</span>
          </button>

          <button
            type="button"
            onClick={() => openShareProfile(activeUser)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] hover:bg-[var(--rovela-surface-hover)] text-[var(--rovela-text-primary)] text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Share2 className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            type="button"
            onClick={openEditProfile}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Main Profile Content */}
      <div className="p-4 sm:p-6 max-w-3xl mx-auto w-full space-y-6">
        {/* CENTER CARD: Large Avatar, Rovela ID, Copy, QR Shortcut */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar & Photo Action Badges */}
            <div className="relative group shrink-0">
              <button
                type="button"
                onClick={() =>
                  openMediaViewer({
                    url: activeUser.avatar_url,
                    title: activeUser.display_name || activeUser.name,
                    subtitle: `@${activeUser.username} • Profile Photo`,
                  })
                }
                className="block cursor-pointer focus:outline-none"
                title="View Full Profile Photo"
              >
                <Avatar
                  src={activeUser.avatar_url}
                  name={activeUser.display_name || activeUser.name}
                  size="xl"
                  className="w-24 h-24 sm:w-28 sm:h-28 text-2xl ring-4 ring-purple-500/30 shadow-2xl group-hover:scale-105 transition-transform rounded-full"
                />
              </button>

              <button
                type="button"
                onClick={openPhotoCrop}
                className="absolute bottom-0 right-0 p-2.5 rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-950/40 hover:bg-purple-500 transition-transform active:scale-95 cursor-pointer"
                title="Change & Adjust Photo"
                aria-label="Change & Adjust Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h3 className="text-2xl font-black tracking-tight text-[var(--rovela-text-primary)]">
                  {activeUser.display_name || activeUser.name}
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/25 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  Verified
                </span>
              </div>

              {/* Rovela ID with Copy Button */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="text-sm font-bold text-purple-500">
                  @{activeUser.username}
                </span>
                <button
                  type="button"
                  onClick={handleCopyRovelaId}
                  className="p-1.5 rounded-lg hover:bg-[var(--rovela-surface-hover)] text-[var(--rovela-text-secondary)] hover:text-purple-400 transition-colors cursor-pointer"
                  title="Copy Rovela ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-[var(--rovela-text-secondary)] font-medium mb-3">
                {activeUser.phone || '+1 (555) 382-9901'} • {activeUser.email}
              </p>

              {/* About Section */}
              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--rovela-text-muted)] block mb-1">
                  About
                </span>
                <p className="text-xs text-[var(--rovela-text-primary)] max-w-lg leading-relaxed bg-[var(--rovela-surface)] p-3 rounded-2xl border border-[var(--rovela-border)]">
                  {activeUser.about || activeUser.bio || 'Living in flow. Building meaningful human connections on Rovela.'}
                </p>
              </div>

              {/* Photo Options Pill */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 pb-3">
                <button
                  type="button"
                  onClick={() =>
                    openMediaViewer({
                      url: currentUser.avatar_url,
                      title: currentUser.name,
                      subtitle: `@${currentUser.username} • Profile Photo`,
                    })
                  }
                  className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] text-xs font-semibold text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-purple-400" />
                  <span>View Photo</span>
                </button>

                <button
                  type="button"
                  onClick={openPhotoCrop}
                  className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] text-xs font-semibold text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-purple-400" />
                  <span>Change Photo</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              {/* Stats row */}
              <div className="flex items-center justify-center sm:justify-start gap-6 pt-3 border-t border-[var(--rovela-border)] text-xs text-[var(--rovela-text-secondary)]">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-500" />
                  <span>
                    <strong className="text-[var(--rovela-text-primary)]">{directCount}</strong> Direct Chats
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span>
                    <strong className="text-[var(--rovela-text-primary)]">{groupCount}</strong> Groups
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>Joined {currentUser.joined_at || '2024'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROVELA ID & QR CODE CARD (Requirement 44, 46, 47) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                Your Unique Rovela ID
              </h4>
              <p className="text-xs text-[var(--rovela-text-secondary)]">
                Friends can scan your QR code or search <span className="text-purple-400 font-bold">@{currentUser.username}</span> to find and connect with you instantly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-900/30 transition-all cursor-pointer"
            >
              Show My QR
            </button>
            <button
              type="button"
              onClick={() => openShareProfile(activeUser)}
              className="px-4 py-2 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] hover:bg-[var(--rovela-surface-hover)] text-[var(--rovela-text-primary)] text-xs font-bold transition-all cursor-pointer"
            >
              Share Link
            </button>
          </div>
        </div>

        {/* STATUS SECTION */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                Presence Status
              </h4>
              <p className="text-xs text-[var(--rovela-text-secondary)]">
                Current status: <span className="font-semibold text-purple-600 dark:text-purple-400">{statusText}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presetStatuses.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setStatusState(preset.state);
                  setStatusText(preset.text);
                  updateUserProfile({ status_state: preset.state, status_text: preset.text });
                  showToast(`Status set to ${preset.label}`, undefined, 'info');
                }}
                className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-start gap-1 transition-all cursor-pointer ${
                  statusText === preset.text
                    ? 'bg-purple-500/15 border-purple-500 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/30'
                    : 'bg-[var(--rovela-surface)] border-[var(--rovela-border)] text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      preset.state === 'online'
                        ? 'bg-emerald-500'
                        : preset.state === 'busy'
                        ? 'bg-rose-500'
                        : 'bg-amber-500'
                    }`}
                  />
                  <span>{preset.label}</span>
                </div>
                <span className="text-[10px] text-[var(--rovela-text-muted)] font-normal truncate max-w-full">
                  {preset.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* PRIVACY CONTROLS (Requirement 4 & Profile System Part A) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Profile Privacy Controls
            </h4>
            <span className="text-[11px] text-[var(--rovela-text-muted)]">
              Control who sees your details
            </span>
          </div>

          <div className="space-y-3">
            {/* Photo Privacy */}
            <div className="p-3.5 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[var(--rovela-text-primary)]">
                  Who can see my profile photo
                </p>
                <p className="text-[11px] text-[var(--rovela-text-muted)]">
                  Current: {currentUser.photo_privacy || 'everyone'}
                </p>
              </div>

              <select
                value={currentUser.photo_privacy || 'everyone'}
                onChange={(e) =>
                  handlePrivacyChange('photo_privacy', e.target.value as PrivacyVisibility)
                }
                aria-label="Profile photo visibility"
                className="px-3 py-1.5 rounded-xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-xs font-semibold text-[var(--rovela-text-primary)] focus:outline-none cursor-pointer"
              >
                <option value="everyone">Everyone</option>
                <option value="contacts">My Contacts Only</option>
                <option value="nobody">Nobody</option>
              </select>
            </div>

            {/* About Privacy */}
            <div className="p-3.5 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[var(--rovela-text-primary)]">
                  Who can see my About & Bio
                </p>
                <p className="text-[11px] text-[var(--rovela-text-muted)]">
                  Current: {currentUser.about_privacy || 'everyone'}
                </p>
              </div>

              <select
                value={currentUser.about_privacy || 'everyone'}
                onChange={(e) =>
                  handlePrivacyChange('about_privacy', e.target.value as PrivacyVisibility)
                }
                aria-label="About and bio visibility"
                className="px-3 py-1.5 rounded-xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-xs font-semibold text-[var(--rovela-text-primary)] focus:outline-none cursor-pointer"
              >
                <option value="everyone">Everyone</option>
                <option value="contacts">My Contacts Only</option>
                <option value="nobody">Nobody</option>
              </select>
            </div>

            {/* Online / Last Seen Privacy */}
            <div className="p-3.5 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[var(--rovela-text-primary)]">
                  Last Seen & Online Presence
                </p>
                <p className="text-[11px] text-[var(--rovela-text-muted)]">
                  Current: {currentUser.last_seen_privacy || 'everyone'}
                </p>
              </div>

              <select
                value={currentUser.last_seen_privacy || 'everyone'}
                onChange={(e) =>
                  handlePrivacyChange('last_seen_privacy', e.target.value as PrivacyVisibility)
                }
                aria-label="Last seen and presence visibility"
                className="px-3 py-1.5 rounded-xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-xs font-semibold text-[var(--rovela-text-primary)] focus:outline-none cursor-pointer"
              >
                <option value="everyone">Everyone</option>
                <option value="contacts">My Contacts Only</option>
                <option value="nobody">Nobody</option>
              </select>
            </div>
          </div>
        </div>

        {/* SETTINGS SHORTCUTS */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Account & Security
          </h4>

          <div className="rounded-2xl divide-y divide-[var(--rovela-border)] border border-[var(--rovela-border)] overflow-hidden">
            {/* Account Security */}
            <div
              onClick={() => setActiveSection('settings')}
              className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--rovela-text-primary)]">
                    Account Security
                  </p>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Two-step verification, security PIN, session tokens
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
            </div>

            {/* Linked Devices */}
            <div
              onClick={() => showToast('Linked Devices: 1 Active Web Session (Ubuntu/Chrome)', undefined, 'info')}
              className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--rovela-text-primary)]">
                    Linked Devices
                  </p>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Desktop App, Web Session (Active now)
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Profile QR Code Modal */}
      <ProfileQRCode
        user={activeUser}
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
      />
    </div>
  );
};
