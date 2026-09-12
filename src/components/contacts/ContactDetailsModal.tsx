import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Edit3,
  MessageSquare,
  Phone,
  Video,
  Share2,
  FileText,
  Lock,
  Mail,
  Users,
  Image as ImageIcon,
  ShieldAlert,
  Ban,
  Star,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { SAMPLE_SHARED_MEDIA } from '../../data/mockData';

interface ContactDetailsModalProps {
  userId: string | null;
  onClose: () => void;
}

export const ContactDetailsModal: React.FC<ContactDetailsModalProps> = ({
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
    openEditContact,
    openUserProfile,
    openShareProfile,
    openMediaViewer,
    openBlockUserModal,
    openReportUserModal,
    toggleFavoriteContact,
    conversations,
    setActiveConversationId,
    setActiveSection,
  } = useChat();

  if (!userId) return null;

  const user = users.find((u) => u.id === userId);
  const contact = getContactForUser(userId);

  if (!user) return null;

  const displayName = getEffectiveDisplayName(user);
  const avatarUrl = getEffectiveAvatarUrl(user);
  const isCustomPhoto = contact?.use_custom_avatar && Boolean(contact?.custom_avatar_url);

  // Find shared group conversations
  const sharedGroups = conversations.filter(
    (c) =>
      c.type === 'group' &&
      c.participant_ids.includes(userId) &&
      c.participant_ids.includes(currentUser.id)
  );

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

  const handleOpenGroup = (groupId: string) => {
    onClose();
    setActiveConversationId(groupId);
    setActiveSection('chats');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg bg-[var(--rovela-surface)] border border-[var(--rovela-border)] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[var(--rovela-border)] flex items-center justify-between bg-[var(--rovela-surface-secondary)]">
            <h2 className="text-base font-extrabold text-[var(--rovela-text-primary)]">
              Contact Details
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => toggleFavoriteContact(userId)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
                title={contact?.is_favorite ? 'Remove favorite' : 'Favorite contact'}
              >
                <Star
                  className={`w-4 h-4 ${
                    contact?.is_favorite
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-[var(--rovela-text-secondary)]'
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openEditContact(userId);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
                title="Edit contact"
              >
                <Edit3 className="w-4 h-4 text-purple-400" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Top Identity Block */}
            <div className="flex flex-col items-center text-center space-y-3">
              <button
                type="button"
                onClick={() =>
                  openMediaViewer({
                    url: avatarUrl,
                    title: displayName,
                    subtitle: `@${user.username} • Contact Photo`,
                  })
                }
                className="relative group cursor-pointer focus:outline-none"
              >
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-purple-500/30 shadow-xl group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
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
                <h3 className="text-xl font-extrabold text-[var(--rovela-text-primary)]">
                  {displayName}
                </h3>
                {contact?.nickname && (
                  <p className="text-xs font-semibold text-purple-400">
                    "{contact.nickname}"
                  </p>
                )}

                {/* Subtle official reference */}
                <div className="flex items-center justify-center gap-1.5 mt-1 text-xs text-[var(--rovela-text-secondary)]">
                  <span>Rovela:</span>
                  <span className="font-semibold text-[var(--rovela-text-primary)]">{user.name}</span>
                  <span className="text-purple-400 font-bold">@{user.username}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                </div>

                {isCustomPhoto && (
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold">
                    Custom Local Photo
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-1 w-full max-w-sm">
                <button
                  type="button"
                  onClick={handleMessage}
                  className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs flex flex-col items-center gap-1 shadow-lg shadow-purple-900/30 transition-all active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </button>

                <button
                  type="button"
                  onClick={handleVoiceCall}
                  className="flex-1 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] hover:bg-[var(--rovela-surface-hover)] text-[var(--rovela-text-primary)] font-bold text-xs flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-purple-400" />
                  <span>Call</span>
                </button>

                <button
                  type="button"
                  onClick={handleVideoCall}
                  className="flex-1 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] hover:bg-[var(--rovela-surface-hover)] text-[var(--rovela-text-primary)] font-bold text-xs flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer"
                >
                  <Video className="w-4 h-4 text-purple-400" />
                  <span>Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openShareProfile(user);
                  }}
                  className="flex-1 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] hover:bg-[var(--rovela-surface-hover)] text-[var(--rovela-text-primary)] font-bold text-xs flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-purple-400" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Private Notes Card (Requirement 10) */}
            <div className="p-4 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--rovela-text-primary)] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  Private Contact Notes
                </span>
                <span className="text-[10px] font-semibold text-purple-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Only visible to you
                </span>
              </div>
              {contact?.notes ? (
                <p className="text-xs text-[var(--rovela-text-secondary)] leading-relaxed whitespace-pre-wrap">
                  {contact.notes}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openEditContact(userId);
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
                >
                  + Add private note or reminders about this person
                </button>
              )}
            </div>

            {/* Contact Coordinates */}
            <div className="p-4 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] space-y-3">
              <span className="text-xs font-bold text-[var(--rovela-text-secondary)] uppercase tracking-wider block">
                Contact Information
              </span>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-[var(--rovela-text-secondary)]">
                  <Phone className="w-4 h-4 text-[var(--rovela-text-muted)]" />
                  <span>Phone</span>
                </div>
                <span className="font-semibold text-[var(--rovela-text-primary)]">
                  {contact?.phone || user.phone || 'Not set'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-[var(--rovela-text-secondary)]">
                  <Mail className="w-4 h-4 text-[var(--rovela-text-muted)]" />
                  <span>Email</span>
                </div>
                <span className="font-semibold text-[var(--rovela-text-primary)]">
                  {contact?.email || user.email || 'Not set'}
                </span>
              </div>

              <div className="pt-1 border-t border-[var(--rovela-border)] flex items-center justify-between text-xs">
                <span className="text-[var(--rovela-text-secondary)]">Rovela Profile</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openUserProfile(userId);
                  }}
                  className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-bold cursor-pointer"
                >
                  <span>View Public Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Shared Groups */}
            {sharedGroups.length > 0 && (
              <div className="p-4 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--rovela-text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    Shared Groups ({sharedGroups.length})
                  </span>
                </div>
                <div className="space-y-1.5">
                  {sharedGroups.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleOpenGroup(g.id)}
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

            {/* Shared Media Snippet */}
            <div className="p-4 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--rovela-text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                  Media, Links & Docs
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openUserProfile(userId);
                  }}
                  className="text-[11px] font-bold text-purple-400 hover:text-purple-300 cursor-pointer"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {((userId && SAMPLE_SHARED_MEDIA[userId]) || SAMPLE_SHARED_MEDIA['user-sarah'] || [])
                  .slice(0, 4)
                  .map((media) => (
                    <button
                      key={media.id}
                      type="button"
                      onClick={() =>
                        openMediaViewer({
                          url: media.url,
                          title: media.title,
                          subtitle: `${media.type} • ${media.date || ''}`,
                        })
                      }
                      className="aspect-square rounded-xl overflow-hidden bg-black/20 hover:opacity-90 transition-opacity relative group cursor-pointer"
                    >
                      <img
                        src={media.thumbnail || media.url}
                        alt={media.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-4 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-rose-500/20 space-y-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openBlockUserModal(user);
                }}
                className="w-full flex items-center justify-between py-2 text-xs font-bold text-rose-500 hover:text-rose-400 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Ban className="w-4 h-4" />
                  <span>Block {displayName}</span>
                </div>
              </button>

              <div className="h-px bg-[var(--rovela-border)]" />

              <button
                type="button"
                onClick={() => {
                  onClose();
                  openReportUserModal(user);
                }}
                className="w-full flex items-center justify-between py-2 text-xs font-bold text-rose-500 hover:text-rose-400 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Report Contact</span>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
