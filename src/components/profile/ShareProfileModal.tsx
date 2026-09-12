import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Share2, QrCode, MessageSquare, Check, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../../types';
import { useChat } from '../../context/ChatContext';

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const ShareProfileModal: React.FC<ShareProfileModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { showToast, openQrModal, createDirectConversation } = useChat();

  if (!isOpen) return null;

  const profileLink = `https://rovela.app/@${user.username}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profileLink);
      showToast('Profile link copied to clipboard', profileLink, 'success');
    }
  };

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`@${user.username}`);
      showToast('Rovela ID copied', `@${user.username}`, 'success');
    }
  };

  const handleSystemShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.name} on Rovela`,
          text: `Connect with ${user.name} (@${user.username}) on Rovela:`,
          url: profileLink,
        });
      } catch (err) {
        // cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md bg-[var(--rovela-surface)] border border-[var(--rovela-border)] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[var(--rovela-border)] flex items-center justify-between bg-[var(--rovela-surface-secondary)]">
            <h3 className="text-base font-extrabold text-[var(--rovela-text-primary)]">
              Share Rovela Profile
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Card Preview */}
          <div className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-500/30 shadow-lg"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[var(--rovela-surface)]" />
            </div>

            <div>
              <div className="flex items-center justify-center gap-1.5">
                <h4 className="text-lg font-bold text-[var(--rovela-text-primary)]">
                  {user.name}
                </h4>
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-xs font-semibold text-purple-400">@{user.username}</p>
              <p className="text-xs text-[var(--rovela-text-secondary)] mt-1 max-w-xs">
                {user.status_text || user.bio || 'Available on Rovela'}
              </p>
            </div>

            {/* Link Pill */}
            <div className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-[var(--rovela-text-secondary)] truncate">
                {profileLink}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-2.5 py-1 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>
          </div>

          {/* Actions List */}
          <div className="p-4 bg-[var(--rovela-surface-secondary)] border-t border-[var(--rovela-border)] grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleCopyId}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] hover:bg-[var(--rovela-surface-hover)] text-xs font-bold text-[var(--rovela-text-primary)] transition-all cursor-pointer"
            >
              <Copy className="w-4 h-4 text-purple-400" />
              Copy Rovela ID
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                openQrModal(user);
              }}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] hover:bg-[var(--rovela-surface-hover)] text-xs font-bold text-[var(--rovela-text-primary)] transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              Show QR Code
            </button>

            <button
              type="button"
              onClick={handleSystemShare}
              className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Share Link with Apps...
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
