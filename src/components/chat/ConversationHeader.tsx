import React, { useState, useRef, useEffect } from 'react';
import { Conversation, UserStatus } from '../../types';
import { Avatar } from '../ui/Avatar';
import { IconButton } from '../ui/IconButton';
import { useChat } from '../../context/ChatContext';
import { BlockUserDialog } from '../modals/BlockUserDialog';
import { ReportMessageDialog } from '../modals/ReportMessageDialog';
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Pin,
  BellOff,
  Bell,
  Search,
  Image as ImageIcon,
  Lock,
  Unlock,
  Ban,
  Flag,
  Info,
} from 'lucide-react';

interface ConversationHeaderProps {
  conversation: Conversation;
  onBackMobile: () => void;
  onStartCall: (type: 'audio' | 'video') => void;
  onToggleSearch: () => void;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversation,
  onBackMobile,
  onStartCall,
  onToggleSearch,
}) => {
  const {
    currentUser,
    users,
    toggleInfoPanel,
    togglePinConversation,
    toggleMuteConversation,
    toggleLockConversation,
    openUserProfile,
    openContactDetails,
    getEffectiveDisplayName,
    getEffectiveAvatarUrl,
    showToast,
  } = useChat();

  const [menuOpen, setMenuOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine partner details if direct chat
  let partnerStatus: UserStatus | undefined;
  let statusSubtitle = '';
  const partnerId = conversation.type === 'direct'
    ? conversation.participant_ids.find((id) => id !== currentUser.id)
    : undefined;
  const partner = users.find((u) => u.id === partnerId);

  const effectiveTitle =
    conversation.type === 'direct' && partner
      ? getEffectiveDisplayName(partner)
      : conversation.title;

  const effectiveAvatar =
    conversation.type === 'direct' && partner
      ? getEffectiveAvatarUrl(partner)
      : conversation.avatar_url;

  if (conversation.type === 'direct') {
    partnerStatus = partner?.status_state;
    statusSubtitle =
      partner?.status_state === 'online'
        ? 'Online'
        : partner?.status_state === 'away'
        ? 'Away'
        : partner?.last_seen ? `Last seen ${partner.last_seen}` : 'Offline';
  } else {
    statusSubtitle = `${conversation.participant_ids.length} members`;
  }

  return (
    <>
      <header className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-[var(--rovela-border)] bg-[var(--rovela-surface)] shrink-0 select-none z-20">
        {/* ========================================================================= */}
        {/* 9. CONVERSATION HEADER: LEFT (Back, Avatar) & CENTER (Name, Status)       */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onBackMobile}
            className="md:hidden min-w-[40px] min-h-[40px] -ml-2 rounded-xl flex items-center justify-center text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)] active:scale-90 transition-all cursor-pointer"
            aria-label="Back to conversations list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Clickable Header info to open details panel */}
          <div
            onClick={toggleInfoPanel}
            className="flex items-center gap-3 cursor-pointer group rounded-2xl p-1 -m-1 hover:bg-[var(--rovela-surface-hover)] active:scale-[0.98] transition-all"
            title="Click to view conversation info"
          >
            <Avatar
              src={effectiveAvatar}
              name={effectiveTitle}
              size="sm"
              status={partnerStatus}
              showStatus={conversation.type === 'direct'}
              isGroup={conversation.type === 'group'}
            />

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                {/* Contact Name (Strongest element) */}
                <h3 className="text-sm sm:text-base font-extrabold text-[var(--rovela-text-primary)] truncate leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                  {effectiveTitle}
                </h3>
                {conversation.is_pinned && (
                  <Pin className="w-3 h-3 text-purple-500 rotate-45 shrink-0" />
                )}
                {conversation.is_muted && (
                  <BellOff className="w-3 h-3 text-[var(--rovela-text-muted)] shrink-0" />
                )}
                {conversation.is_locked && (
                  <Lock className="w-3 h-3 text-purple-500 shrink-0" />
                )}
              </div>
              {/* Online status / member count (noticeably smaller) */}
              <p className="text-[11px] text-[var(--rovela-text-secondary)] truncate flex items-center gap-1.5">
                {partnerStatus === 'online' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
                )}
                <span>{statusSubtitle}</span>
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 9. RIGHT: Direct Voice Call, Video Call, and ⋮ More                       */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* ☎ Voice Call */}
          <IconButton
            icon={<Phone className="w-4.5 h-4.5 text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300" />}
            label="Voice Call"
            variant="ghost"
            size="sm"
            onClick={() => onStartCall('audio')}
          />

          {/* ▣ Video Call */}
          <IconButton
            icon={<Video className="w-4.5 h-4.5 text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300" />}
            label="Video Call"
            variant="ghost"
            size="sm"
            onClick={() => onStartCall('video')}
          />

          {/* ⋮ More Menu Trigger */}
          <div className="relative" ref={menuRef}>
            <IconButton
              icon={<MoreVertical className="w-4.5 h-4.5" />}
              label="More options"
              variant={menuOpen ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setMenuOpen(!menuOpen)}
            />

            {/* ========================================================================= */}
            {/* 10. CONVERSATION MORE MENU                                               */}
            {/* ========================================================================= */}
            {menuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-10 z-40 w-56 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] shadow-2xl py-1.5 text-xs text-[var(--rovela-text-primary)] animate-in fade-in zoom-in-95 duration-100"
              >
                {/* Conversation Info */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    toggleInfoPanel();
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                >
                  <Info className="w-4 h-4 text-purple-500" />
                  <span>Conversation Info</span>
                </button>

                {conversation.type === 'direct' && partner && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        openUserProfile(partner.id);
                      }}
                      className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                    >
                      <Info className="w-4 h-4 text-purple-400" />
                      <span>Rovela Profile (@{partner.username})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        openContactDetails(partner.id);
                      }}
                      className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                    >
                      <Info className="w-4 h-4 text-emerald-400" />
                      <span>Contact Details & Notes</span>
                    </button>
                  </>
                )}

                {/* Search in Chat */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onToggleSearch();
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4 text-[var(--rovela-text-muted)]" />
                  <span>Search in Chat</span>
                </button>

                {/* Media, Links and Docs */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    toggleInfoPanel();
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-[var(--rovela-text-muted)]" />
                  <span>Media, Links and Docs</span>
                </button>

                {/* Pinned Messages */}
                <button
                  type="button"
                  onClick={() => {
                    togglePinConversation(conversation.id);
                    setMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                >
                  <Pin className="w-4 h-4 text-purple-500" />
                  <span>{conversation.is_pinned ? 'Unpin Conversation' : 'Pin Conversation'}</span>
                </button>

                {/* Mute Notifications */}
                <button
                  type="button"
                  onClick={() => {
                    toggleMuteConversation(conversation.id);
                    setMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                >
                  {conversation.is_muted ? (
                    <>
                      <Bell className="w-4 h-4 text-purple-500" />
                      <span>Unmute Notifications</span>
                    </>
                  ) : (
                    <>
                      <BellOff className="w-4 h-4 text-[var(--rovela-text-muted)]" />
                      <span>Mute Notifications</span>
                    </>
                  )}
                </button>

                {/* Lock Chat */}
                <button
                  type="button"
                  onClick={() => {
                    toggleLockConversation(conversation.id);
                    setMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                >
                  {conversation.is_locked ? (
                    <>
                      <Unlock className="w-4 h-4 text-emerald-500" />
                      <span>Unlock Chat</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-purple-500" />
                      <span>Lock Chat</span>
                    </>
                  )}
                </button>

                {/* Block Contact (if direct) */}
                {conversation.type === 'direct' && partner && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setBlockDialogOpen(true);
                    }}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-left transition-colors cursor-pointer border-t border-[var(--rovela-border)] mt-1"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Block Contact</span>
                  </button>
                )}

                {/* Report Contact */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setReportDialogOpen(true);
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-left transition-colors cursor-pointer"
                >
                  <Flag className="w-4 h-4" />
                  <span>Report Contact</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Block Dialog */}
      {conversation.type === 'direct' && partner && (
        <BlockUserDialog
          isOpen={blockDialogOpen}
          onClose={() => setBlockDialogOpen(false)}
          userId={partner.id}
          userName={partner.name}
        />
      )}

      {/* Report Dialog */}
      <ReportMessageDialog
        isOpen={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        messageId={conversation.id}
      />
    </>
  );
};

