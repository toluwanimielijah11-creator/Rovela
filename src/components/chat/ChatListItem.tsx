import React, { useState, useEffect, useRef } from 'react';
import { Conversation, UserStatus } from '../../types';
import { Avatar } from '../ui/Avatar';
import { useChat } from '../../context/ChatContext';
import { BlockUserDialog } from '../modals/BlockUserDialog';
import { formatRelativeMessageTime } from '../../utils/dateUtils';
import {
  Pin,
  BellOff,
  MoreVertical,
  CheckCheck,
  Archive,
  ArchiveRestore,
  Trash2,
  Ban,
} from 'lucide-react';

interface ChatListItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onLongPress?: () => void;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
  conversation,
  isActive,
  onClick,
  isSelectionMode = false,
  isSelected = false,
  onToggleSelect,
  onLongPress,
}) => {
  const {
    currentUser,
    users,
    togglePinConversation,
    toggleArchiveConversation,
    toggleMuteConversation,
    markConversationAsRead,
    clearChatMessages,
    typingUsers,
    getEffectiveDisplayName,
    getEffectiveAvatarUrl,
    openProfilePreview,
    openUserProfile,
    openContactDetails,
  } = useChat();

  const [menuOpen, setMenuOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  const startLongPress = (e: React.TouchEvent | React.MouseEvent) => {
    if (isSelectionMode) return;
    if ('touches' in e && e.touches.length > 0) {
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    longPressTimerRef.current = setTimeout(() => {
      onLongPress?.();
    }, 450);
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current || !e.touches[0]) return;
    const diffX = Math.abs(e.touches[0].clientX - touchStartPos.current.x);
    const diffY = Math.abs(e.touches[0].clientY - touchStartPos.current.y);
    if (diffX > 10 || diffY > 10) {
      cancelLongPress();
    }
  };

  // Close context dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Derive partner details if direct chat
  let partnerStatus: UserStatus | undefined;
  let partnerUser = null;
  if (conversation.type === 'direct') {
    const partnerId = conversation.participant_ids.find((id) => id !== currentUser.id);
    partnerUser = users.find((u) => u.id === partnerId);
    partnerStatus = partnerUser?.status_state;
  }

  const effectiveTitle =
    conversation.type === 'direct' && partnerUser
      ? getEffectiveDisplayName(partnerUser)
      : conversation.title;

  const effectiveAvatar =
    conversation.type === 'direct' && partnerUser
      ? getEffectiveAvatarUrl(partnerUser)
      : conversation.avatar_url;

  // Check if anyone in this conversation is typing
  const typers = typingUsers[conversation.id] || [];
  const isTyping = typers.length > 0;

  const handleContextMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    if (conversation.type === 'direct' && partnerUser) {
      e.stopPropagation();
      openProfilePreview(partnerUser.id);
    }
  };

  return (
    <>
      <div
        onTouchStart={startLongPress}
        onTouchEnd={cancelLongPress}
        onTouchMove={handleTouchMove}
        onMouseDown={startLongPress}
        onMouseUp={cancelLongPress}
        onMouseLeave={cancelLongPress}
        onContextMenu={(e) => {
          e.preventDefault();
          onLongPress?.();
        }}
        onClick={() => {
          if (isSelectionMode) {
            onToggleSelect?.();
            return;
          }
          setMenuOpen(false);
          onClick();
        }}
        className={`group relative flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all duration-150 select-none active:scale-[0.99] ${
          isSelected
            ? 'bg-purple-500/15 border border-purple-500/40 shadow-sm'
            : isActive
            ? 'bg-[var(--rovela-surface-active)] border border-purple-500/35 shadow-md shadow-purple-950/20'
            : 'hover:bg-[var(--rovela-surface-hover)] border border-transparent'
        }`}
      >
        {/* Selection Checkbox */}
        {isSelectionMode && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect?.();
            }}
            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
              isSelected
                ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                : 'border-[var(--rovela-border)] bg-[var(--rovela-surface-secondary)]'
            }`}
          >
            {isSelected && <CheckCheck className="w-3 h-3 text-white" />}
          </div>
        )}

        {/* Active Left Border Accent */}
        {isActive && !isSelectionMode && (
          <span className="absolute left-1 top-3.5 bottom-3.5 w-1 rounded-full bg-gradient-to-b from-violet-600 to-purple-600 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
        )}

        {/* Avatar with Status - Clickable to open Profile Preview */}
        <div
          onClick={(e) => {
            if (isSelectionMode) {
              onToggleSelect?.();
              return;
            }
            handleAvatarClick(e);
          }}
          className={conversation.type === 'direct' && !isSelectionMode ? 'cursor-pointer hover:scale-105 transition-transform' : ''}
          title={conversation.type === 'direct' ? `View @${partnerUser?.username || 'profile'}` : undefined}
        >
          <Avatar
            src={effectiveAvatar}
            name={effectiveTitle}
            size="md"
            status={partnerStatus}
            showStatus={conversation.type === 'direct'}
            isGroup={conversation.type === 'group'}
          />
        </div>

        {/* Main Content Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1">
            <h4
              className={`text-sm font-bold truncate leading-tight tracking-tight ${
                isActive
                  ? 'text-purple-700 dark:text-purple-300'
                  : 'text-[var(--rovela-text-primary)]'
              }`}
            >
              {effectiveTitle}
            </h4>

            <div className="flex items-center gap-1.5 shrink-0">
              {conversation.is_pinned && (
                <span className="p-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400" title="Pinned">
                  <Pin className="w-2.5 h-2.5 rotate-45" />
                </span>
              )}
              {conversation.is_muted && (
                <BellOff className="w-3 h-3 text-[var(--rovela-text-muted)]" title="Muted" />
              )}
              {(() => {
                const timeObj = formatRelativeMessageTime(conversation.updated_at);
                return (
                  <span
                    title={timeObj.tooltip || timeObj.full}
                    className="text-[11px] font-medium text-[var(--rovela-text-muted)]"
                  >
                    {timeObj.relative}
                  </span>
                );
              })()}
            </div>
          </div>

          {/* Message Preview or Typing Indicator */}
          <div className="flex items-center justify-between gap-2">
            {isTyping ? (
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 truncate flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>{typers.join(', ')} is typing...</span>
              </p>
            ) : (
              <p className="text-xs text-[var(--rovela-text-secondary)] truncate leading-normal">
                {conversation.last_message?.sender_id === currentUser.id && (
                  <span className="text-purple-600 dark:text-purple-400 font-semibold mr-1">
                    You:
                  </span>
                )}
                {conversation.last_message?.content || 'No messages yet'}
              </p>
            )}

            {/* Unread Pill */}
            {conversation.unread_count > 0 && (
              <span className="shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-[0_0_8px_rgba(168,85,247,0.45)]">
                {conversation.unread_count}
              </span>
            )}
          </div>
        </div>

        {/* Hover Action Menu Button */}
        <div className="relative shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" ref={menuRef}>
          <button
            type="button"
            onClick={handleContextMenuClick}
            className="p-1.5 rounded-xl text-[var(--rovela-text-muted)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)] active:scale-90 transition-all cursor-pointer"
            aria-label="Conversation options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Context Dropdown */}
          {menuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-8 z-30 w-48 rounded-2xl bg-[var(--rovela-surface)] shadow-2xl py-1.5 text-xs text-[var(--rovela-text-primary)] border border-[var(--rovela-border)]"
            >
              {conversation.type === 'direct' && partnerUser && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      openUserProfile(partnerUser.id);
                      setMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer text-purple-400 font-medium"
                  >
                    <span>View Profile (@{partnerUser.username})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      openContactDetails(partnerUser.id);
                      setMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer text-[var(--rovela-text-secondary)]"
                  >
                    <span>Contact Details & Notes</span>
                  </button>
                </>
              )}

              {/* Pin / Unpin */}
              <button
                type="button"
                onClick={() => {
                  togglePinConversation(conversation.id);
                  setMenuOpen(false);
                }}
                className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
              >
                <Pin className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                <span>{conversation.is_pinned ? 'Unpin chat' : 'Pin to top'}</span>
              </button>

              {/* Archive / Unarchive */}
              <button
                type="button"
                onClick={() => {
                  toggleArchiveConversation(conversation.id);
                  setMenuOpen(false);
                }}
                className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
              >
                {conversation.is_archived ? (
                  <>
                    <ArchiveRestore className="w-3.5 h-3.5 text-purple-500" />
                    <span>Unarchive chat</span>
                  </>
                ) : (
                  <>
                    <Archive className="w-3.5 h-3.5 text-[var(--rovela-text-muted)]" />
                    <span>Archive chat</span>
                  </>
                )}
              </button>

              {/* Mute */}
              <button
                type="button"
                onClick={() => {
                  toggleMuteConversation(conversation.id);
                  setMenuOpen(false);
                }}
                className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
              >
                <BellOff className="w-3.5 h-3.5 text-[var(--rovela-text-muted)]" />
                <span>{conversation.is_muted ? 'Unmute' : 'Mute notifications'}</span>
              </button>

              {/* Mark as read */}
              <button
                type="button"
                onClick={() => {
                  markConversationAsRead(conversation.id);
                  setMenuOpen(false);
                }}
                className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Mark as read</span>
              </button>

              {/* Clear chat history */}
              <button
                type="button"
                onClick={() => {
                  clearChatMessages(conversation.id);
                  setMenuOpen(false);
                }}
                className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-[var(--rovela-text-muted)]" />
                <span>Clear chat history</span>
              </button>

              {/* Block user if direct chat */}
              {conversation.type === 'direct' && partnerUser && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setBlockDialogOpen(true);
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-rose-500/10 text-left transition-colors cursor-pointer text-rose-600 dark:text-rose-400 border-t border-[var(--rovela-border)] mt-1"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Block {partnerUser.name}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Block Dialog */}
      {conversation.type === 'direct' && partnerUser && (
        <BlockUserDialog
          isOpen={blockDialogOpen}
          onClose={() => setBlockDialogOpen(false)}
          userId={partnerUser.id}
          userName={partnerUser.name}
        />
      )}
    </>
  );
};
