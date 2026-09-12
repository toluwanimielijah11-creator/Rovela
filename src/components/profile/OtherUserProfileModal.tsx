import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Copy,
  MessageSquare,
  Phone,
  Video,
  Search,
  Users,
  Image as ImageIcon,
  FileText,
  Link2,
  BellOff,
  Lock,
  Edit3,
  Share2,
  Trash2,
  Ban,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  MoreVertical,
  Play,
  Download,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { SAMPLE_SHARED_MEDIA } from '../../data/mockData';

interface OtherUserProfileModalProps {
  userId: string | null;
  onClose: () => void;
}

export const OtherUserProfileModal: React.FC<OtherUserProfileModalProps> = ({
  userId,
  onClose,
}) => {
  const {
    users,
    currentUser,
    contacts,
    getContactForUser,
    getEffectiveDisplayName,
    getEffectiveAvatarUrl,
    createDirectConversation,
    startCall,
    openContactDetails,
    openEditContact,
    openAddContact,
    openShareProfile,
    openMediaViewer,
    openBlockUserModal,
    openReportUserModal,
    openStatusViewer,
    statusGroups,
    showToast,
    conversations,
    setActiveConversationId,
    setActiveSection,
    toggleLockConversation,
  } = useChat();

  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'videos' | 'files' | 'links'>('photos');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  if (!userId) return null;

  const user = users.find((u) => u.id === userId);
  const contact = getContactForUser(userId);

  if (!user) return null;

  const displayName = getEffectiveDisplayName(user);
  const avatarUrl = getEffectiveAvatarUrl(user);
  const isSaved = Boolean(contact);

  // Check if this user has an active status in statusGroups
  const userStatusGroup = statusGroups.find((g) => g.user_id === userId);
  const hasActiveStatus = Boolean(userStatusGroup && userStatusGroup.items.length > 0);

  // Direct conversation with this user
  const directConv = conversations.find(
    (c) => c.type === 'direct' && c.participant_ids.includes(userId)
  );

  // Shared Groups
  const sharedGroups = conversations.filter(
    (c) =>
      c.type === 'group' &&
      c.participant_ids.includes(userId) &&
      c.participant_ids.includes(currentUser.id)
  );

  const handleCopyRovelaId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`@${user.username}`);
      showToast('Rovela ID copied', `@${user.username}`, 'success');
    }
  };

  const handleMessage = () => {
    onClose();
    createDirectConversation(userId);
  };

  const handleVoiceCall = () => {
    onClose();
    startCall(userId, 'voice');
  };

  const handleVideoCall = () => {
    onClose();
    startCall(userId, 'video');
  };

  const handleOpenStatus = () => {
    if (userStatusGroup) {
      onClose();
      openStatusViewer(userStatusGroup, 0);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-xl bg-[var(--rovela-surface)] border-0 sm:border border-[var(--rovela-border)] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Top App Bar */}
          <header className="px-6 py-4 border-b border-[var(--rovela-border)] flex items-center justify-between bg-[var(--rovela-surface-secondary)] z-10 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
              aria-label="Back"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-sm font-extrabold text-[var(--rovela-text-primary)]">
              Rovela Profile
            </h2>

            {/* More Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen((m) => !m)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {isMoreMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 8 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-[var(--rovela-surface)] border border-[var(--rovela-border)] rounded-2xl shadow-xl py-1.5 z-30"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        onClose();
                        openShareProfile(user);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-purple-400" />
                      Share Contact
                    </button>

                    {directConv && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          toggleLockConversation(directConv.id);
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs font-medium text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Lock className="w-4 h-4 text-amber-400" />
                        {directConv.is_locked ? 'Unlock Chat' : 'Lock Chat'}
                      </button>
                    )}

                    <div className="h-px bg-[var(--rovela-border)] my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        onClose();
                        openBlockUserModal(user);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-rose-500 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Ban className="w-4 h-4" />
                      Block User
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        onClose();
                        openReportUserModal(user);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-rose-500 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      Report User
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Large Centered Profile Photo & Identity */}
            <div className="flex flex-col items-center text-center space-y-3">
              <button
                type="button"
                onClick={() =>
                  openMediaViewer({
                    url: avatarUrl,
                    title: user.name,
                    subtitle: `@${user.username} • Profile Photo`,
                  })
                }
                className="relative group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-28 h-28 rounded-full p-1 ${
                    hasActiveStatus
                      ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 animate-pulse'
                      : 'ring-4 ring-purple-500/30'
                  }`}
                >
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover shadow-xl group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span
                  className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[var(--rovela-surface)] ${
                    user.status_state === 'online'
                      ? 'bg-emerald-500'
                      : user.status_state === 'busy'
                      ? 'bg-amber-500'
                      : 'bg-zinc-400'
                  }`}
                />
              </button>

              <div>
                <div className="flex items-center justify-center gap-1.5">
                  <h3 className="text-2xl font-black text-[var(--rovela-text-primary)]">
                    {user.name}
                  </h3>
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                </div>

                {/* Saved Contact Name notice (Requirement 1) */}
                {isSaved && contact?.custom_display_name && contact.custom_display_name !== user.name && (
                  <p className="text-xs text-[var(--rovela-text-secondary)] mt-0.5">
                    Saved as: <span className="font-bold text-[var(--rovela-text-primary)]">{contact.custom_display_name}</span>
                  </p>
                )}

                {/* Rovela ID with copy icon */}
                <button
                  type="button"
                  onClick={handleCopyRovelaId}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-bold mt-1.5 transition-colors cursor-pointer group"
                >
                  <span>@{user.username}</span>
                  <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                </button>

                <p className="text-xs text-[var(--rovela-text-muted)] mt-1">
                  {user.status_state === 'online' ? 'Online' : user.last_seen || 'Recently active'}
                </p>

                <p className="text-xs text-[var(--rovela-text-secondary)] mt-2 max-w-sm">
                  {user.status_text || user.bio || 'Available for great conversations on Rovela'}
                </p>
              </div>

              {/* Active Status Banner (Requirement 15) */}
              {hasActiveStatus && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpenStatus}
                  className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-purple-900/30 border border-purple-500/40 flex items-center justify-between gap-3 text-left cursor-pointer shadow-lg shadow-purple-900/10"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-purple-400 to-pink-400 shrink-0">
                      <img
                        src={avatarUrl}
                        alt="Status thumb"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        {user.name.split(' ')[0]}'s Status
                      </span>
                      <span className="text-[11px] text-purple-200/80 truncate block">
                        Tap to watch latest status update
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-300" />
                </motion.button>
              )}

              {/* Primary Actions (Message, Audio, Video) */}
              <div className="flex items-center justify-center gap-3 pt-2 w-full max-w-sm">
                <button
                  type="button"
                  onClick={handleMessage}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs flex flex-col items-center gap-1.5 shadow-lg shadow-purple-900/30 transition-all active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </button>

                <button
                  type="button"
                  onClick={handleVoiceCall}
                  className="flex-1 py-3 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] hover:bg-[var(--rovela-surface-hover)] text-[var(--rovela-text-primary)] font-bold text-xs flex flex-col items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-purple-400" />
                  <span>Audio</span>
                </button>

                <button
                  type="button"
                  onClick={handleVideoCall}
                  className="flex-1 py-3 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] hover:bg-[var(--rovela-surface-hover)] text-[var(--rovela-text-primary)] font-bold text-xs flex flex-col items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Video className="w-4 h-4 text-purple-400" />
                  <span>Video</span>
                </button>
              </div>
            </div>

            {/* Contact Details & Private Notes Shortcut (Requirement 8) */}
            <div className="p-4 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[var(--rovela-text-primary)] block">
                  {isSaved ? 'Contact Record & Private Notes' : 'Not in your saved contacts'}
                </span>
                <span className="text-[11px] text-[var(--rovela-text-secondary)]">
                  {isSaved
                    ? contact?.notes
                      ? 'You have a private note saved for this contact.'
                      : 'Add private nicknames or notes.'
                    : 'Save this person with a custom name and notes.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (isSaved) {
                    openContactDetails(userId);
                  } else {
                    openAddContact({
                      name: user.name,
                      username: user.username,
                      email: user.email,
                      phone: user.phone,
                    });
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/20 cursor-pointer shrink-0 ml-2"
              >
                {isSaved ? 'View Contact' : 'Add to Contacts'}
              </button>
            </div>

            {/* Shared Media, Links & Files (Requirement 13) */}
            <div className="p-4 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--rovela-text-secondary)] uppercase tracking-wider">
                  Media, Links & Files
                </span>
                <span className="text-[11px] text-purple-400 font-bold">
                  {SAMPLE_SHARED_MEDIA.length} items
                </span>
              </div>

              {/* Media Tabs */}
              <div className="flex items-center gap-1 border-b border-[var(--rovela-border)] pb-2">
                {(['photos', 'videos', 'files', 'links'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveMediaTab(tab)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                      activeMediaTab === tab
                        ? 'bg-purple-600 text-white'
                        : 'text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Media Grid / List */}
              {(() => {
                const userMedia = (userId && SAMPLE_SHARED_MEDIA[userId]) || SAMPLE_SHARED_MEDIA['user-sarah'] || [];

                if (activeMediaTab === 'photos') {
                  return (
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {userMedia
                        .filter((m) => m.type === 'photo')
                        .map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                              openMediaViewer({
                                url: item.url,
                                title: item.title,
                                subtitle: `${user.name} • ${item.date || ''}`,
                              })
                            }
                            className="aspect-square rounded-xl overflow-hidden bg-black/20 hover:opacity-90 transition-opacity cursor-pointer group relative"
                          >
                            <img
                              src={item.thumbnail || item.url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </button>
                        ))}
                    </div>
                  );
                }

                if (activeMediaTab === 'videos') {
                  return (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {userMedia
                        .filter((m) => m.type === 'video')
                        .map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                              openMediaViewer({
                                url: item.url,
                                title: item.title,
                                subtitle: `Video • ${item.date || ''}`,
                                type: 'video',
                              })
                            }
                            className="relative aspect-video rounded-xl overflow-hidden bg-black/40 hover:opacity-90 transition-opacity cursor-pointer group"
                          >
                            <img
                              src={item.thumbnail || item.url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                              <div className="w-8 h-8 rounded-full bg-white/80 text-black flex items-center justify-center shadow-lg">
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                  );
                }

                if (activeMediaTab === 'files') {
                  return (
                    <div className="space-y-2 pt-1">
                      {userMedia
                        .filter((m) => m.type === 'file')
                        .map((item) => (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 text-left">
                                <p className="text-xs font-bold text-[var(--rovela-text-primary)] truncate">
                                  {item.title}
                                </p>
                                <p className="text-[10px] text-[var(--rovela-text-muted)]">
                                  {item.size || ''} • {item.date || ''}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => showToast('Downloading file...', item.title, 'info')}
                              className="w-7 h-7 rounded-lg hover:bg-[var(--rovela-surface-hover)] text-[var(--rovela-text-secondary)] flex items-center justify-center cursor-pointer"
                              title="Download file"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                    </div>
                  );
                }

                if (activeMediaTab === 'links') {
                  return (
                    <div className="space-y-2 pt-1">
                      {userMedia
                        .filter((m) => m.type === 'link')
                        .map((item) => (
                          <a
                            key={item.id}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] flex items-center justify-between gap-3 hover:border-purple-500/40 transition-colors block"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                                <Link2 className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 text-left">
                                <p className="text-xs font-bold text-[var(--rovela-text-primary)] truncate">
                                  {item.title}
                                </p>
                                <p className="text-[10px] text-purple-400 truncate">
                                  {item.url}
                                </p>
                              </div>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-[var(--rovela-text-muted)] shrink-0" />
                          </a>
                        ))}
                    </div>
                  );
                }

                return null;
              })()}
            </div>

            {/* Shared Groups (Requirement 14) */}
            {sharedGroups.length > 0 && (
              <div className="p-4 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--rovela-text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    Groups in Common ({sharedGroups.length})
                  </span>
                </div>
                <div className="space-y-1.5">
                  {sharedGroups.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveConversationId(g.id);
                        setActiveSection('chats');
                      }}
                      className="w-full p-2.5 rounded-xl bg-[var(--rovela-surface)] hover:bg-[var(--rovela-surface-hover)] border border-[var(--rovela-border)] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={g.avatar_url}
                          alt={g.title}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="text-left min-w-0">
                          <p className="text-xs font-bold text-[var(--rovela-text-primary)] truncate">
                            {g.title}
                          </p>
                          <p className="text-[10px] text-[var(--rovela-text-muted)]">
                            {g.participant_ids.length} members
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy & Safety Actions */}
            <div className="p-4 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] space-y-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openBlockUserModal(user);
                }}
                className="w-full flex items-center gap-2.5 py-2 text-xs font-bold text-rose-500 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <Ban className="w-4 h-4" />
                <span>Block @{user.username}</span>
              </button>

              <div className="h-px bg-[var(--rovela-border)]" />

              <button
                type="button"
                onClick={() => {
                  onClose();
                  openReportUserModal(user);
                }}
                className="w-full flex items-center gap-2.5 py-2 text-xs font-bold text-rose-500 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Report User</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
