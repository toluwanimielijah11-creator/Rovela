import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MessageSquare,
  Phone,
  Video,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';

interface ProfilePreviewSheetProps {
  userId: string | null;
  onClose: () => void;
}

export const ProfilePreviewSheet: React.FC<ProfilePreviewSheetProps> = ({
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
    openUserProfile,
    openAddContact,
    openMediaViewer,
  } = useChat();

  if (!userId) return null;

  const user = users.find((u) => u.id === userId) || (userId === currentUser.id ? currentUser : null);
  if (!user) return null;

  const contactRecord = getContactForUser(userId);
  const isSaved = Boolean(contactRecord);
  const displayName = getEffectiveDisplayName(user);
  const avatarUrl = getEffectiveAvatarUrl(user);

  const handleMessage = () => {
    onClose();
    createDirectConversation(user.id);
  };

  const handleVoiceCall = () => {
    onClose();
    startCall(user.id, 'voice');
  };

  const handleVideoCall = () => {
    onClose();
    startCall(user.id, 'video');
  };

  const handleViewFullProfile = () => {
    onClose();
    openUserProfile(user.id);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm select-none">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="w-full sm:max-w-md bg-[var(--rovela-surface)] border border-[var(--rovela-border)] rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        >
          {/* Top Grabber for Mobile */}
          <div className="pt-3 pb-1 flex justify-center sm:hidden">
            <div className="w-12 h-1.5 rounded-full bg-[var(--rovela-border)]" />
          </div>

          {/* Close button */}
          <div className="px-5 pt-3 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Card Content */}
          <div className="px-6 pb-6 pt-1 flex flex-col items-center text-center space-y-3.5">
            <button
              type="button"
              onClick={() =>
                openMediaViewer({
                  url: avatarUrl,
                  title: displayName,
                  subtitle: `@${user.username} • Profile Photo`,
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
              <div className="flex items-center justify-center gap-1.5">
                <h3 className="text-lg font-black text-[var(--rovela-text-primary)]">
                  {displayName}
                </h3>
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-xs font-semibold text-purple-400">@{user.username}</p>
              {isSaved && displayName !== user.name && (
                <p className="text-[11px] text-[var(--rovela-text-muted)] mt-0.5">
                  Official name: {user.name}
                </p>
              )}
              <p className="text-xs text-[var(--rovela-text-secondary)] mt-1.5 max-w-xs">
                {user.status_text || user.bio || 'Available on Rovela'}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2 w-full max-w-xs">
              <button
                type="button"
                onClick={handleMessage}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs flex flex-col items-center gap-1 shadow-lg shadow-purple-900/30 transition-all active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message</span>
              </button>

              <button
                type="button"
                onClick={handleVoiceCall}
                className="flex-1 py-3 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] hover:bg-[var(--rovela-surface-hover)] text-[var(--rovela-text-primary)] font-bold text-xs flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-purple-400" />
                <span>Audio</span>
              </button>

              <button
                type="button"
                onClick={handleVideoCall}
                className="flex-1 py-3 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] hover:bg-[var(--rovela-surface-hover)] text-[var(--rovela-text-primary)] font-bold text-xs flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <Video className="w-4 h-4 text-purple-400" />
                <span>Video</span>
              </button>
            </div>

            {/* Full Profile & Contact Actions */}
            <div className="w-full pt-3 border-t border-[var(--rovela-border)] flex items-center justify-between gap-2">
              {!isSaved ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openAddContact({
                      name: user.name,
                      username: user.username,
                      email: user.email,
                      phone: user.phone,
                    });
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add to Contacts</span>
                </button>
              ) : (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Saved in Contacts</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleViewFullProfile}
                className="flex items-center gap-1 text-xs font-bold text-[var(--rovela-text-primary)] hover:text-purple-400 transition-colors cursor-pointer"
              >
                <span>Full Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
