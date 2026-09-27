import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../../types';
import { useChat } from '../../context/ChatContext';
import { Avatar } from '../ui/Avatar';
import { ForwardDialog } from '../modals/ForwardDialog';
import { ReportMessageDialog } from '../modals/ReportMessageDialog';
import { MessageRenderer } from './renderer/MessageRenderer';
import { AllReactionsPicker } from './AllReactionsPicker';
import { formatRelativeMessageTime } from '../../utils/dateUtils';
import {
  Reply,
  Trash2,
  Forward,
  Flag,
  Copy,
  MoreVertical,
  Star,
  Pin,
  Info,
  X,
  Plus,
} from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  showSenderName?: boolean;
  onReply: (message: Message) => void;
  onJumpToReply?: (replyId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
  showSenderName = false,
  onReply,
  onJumpToReply,
}) => {
  const {
    addReaction,
    deleteMessage,
    currentUser,
    showToast,
    retryMessage,
  } = useChat();

  const [showActions, setShowActions] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAllReactionsOpen, setIsAllReactionsOpen] = useState(false);
  const [isForwardOpen, setIsForwardOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // Swipe-to-reply and long-press state
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
        setIsAllReactionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quickEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

  // Handle system message
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-3 select-none">
        <span className="px-3.5 py-1 rounded-full text-xs font-semibold text-[var(--rovela-text-secondary)] bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)]">
          {message.content}
        </span>
      </div>
    );
  }

  const handleCopy = () => {
    let copyText = message.content;
    if (message.type === 'voice' || message.voice_data) {
      const dur = message.voice_data?.duration || message.voice_duration || 0;
      copyText = `Voice note (${Math.floor(dur / 60)}:${(dur % 60).toString().padStart(2, '0')})`;
    } else if (message.type === 'video' || message.video_data) {
      copyText = message.video_data?.caption || message.content || 'Video message';
    }
    navigator.clipboard.writeText(copyText);
    showToast('Copied to clipboard', undefined, 'success');
    setIsMenuOpen(false);
  };

  const handleStar = () => {
    setIsStarred(!isStarred);
    showToast(!isStarred ? 'Message starred' : 'Message unstarred', undefined, 'info');
    setIsMenuOpen(false);
  };

  const handlePin = () => {
    setIsPinned(!isPinned);
    showToast(!isPinned ? 'Message pinned' : 'Message unpinned', undefined, 'info');
    setIsMenuOpen(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    // Long press detection for mobile
    longPressTimerRef.current = setTimeout(() => {
      setIsMenuOpen(true);
      setShowActions(true);
    }, 450);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current || !e.touches[0]) return;
    const diffX = e.touches[0].clientX - touchStartPos.current.x;
    const diffY = e.touches[0].clientY - touchStartPos.current.y;

    if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      // Horizontal swipe to reply
      const offset = isCurrentUser
        ? Math.min(0, Math.max(-65, diffX))
        : Math.max(0, Math.min(65, diffX));
      setSwipeOffset(offset);
      setIsSwiping(true);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (Math.abs(swipeOffset) >= 40) {
      onReply(message);
      showToast(`Replying to ${message.sender_name}`);
    }

    setSwipeOffset(0);
    setIsSwiping(false);
    touchStartPos.current = null;
  };

  return (
    <>
      <div
        className={`group relative flex items-end gap-2.5 my-1.5 select-text ${
          isCurrentUser ? 'justify-end' : 'justify-start'
        }`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => {
          if (!isMenuOpen && !isAllReactionsOpen) setShowActions(false);
        }}
        onContextMenu={handleContextMenu}
      >
        {/* Swipe-to-reply indicator icon behind the bubble */}
        <div
          className={`absolute ${
            isCurrentUser ? 'right-full mr-2' : 'left-full ml-2'
          } self-center flex items-center justify-center pointer-events-none transition-all duration-150 ${
            Math.abs(swipeOffset) > 15 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
            <Reply className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Left Avatar for incoming messages */}
        {!isCurrentUser && (
          <Avatar
            src={message.sender_avatar}
            name={message.sender_name}
            size="xs"
            className="mb-1 shrink-0"
          />
        )}

        {/* Floating Quick Reactions + Single More Options Menu */}
        <div
          className={`absolute -top-7 ${
            isCurrentUser ? 'right-0' : 'left-9'
          } z-20 flex items-center gap-0.5 p-1 rounded-full bg-[var(--rovela-surface)] shadow-xl transition-all duration-150 select-none border border-[var(--rovela-border)] ${
            showActions || isMenuOpen || isAllReactionsOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
          ref={menuRef}
        >
          {/* Quick Reactions */}
          <div className="flex items-center gap-0.5 px-1 border-r border-[var(--rovela-border)]">
            {quickEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => addReaction(message.id, emoji)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs hover:scale-125 active:scale-95 transition-transform cursor-pointer"
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
            {/* ＋ Button to open All Reactions */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsAllReactionsOpen(!isAllReactionsOpen);
              }}
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)] active:scale-95 transition-all cursor-pointer font-bold"
              title="All reactions"
              aria-label="All reactions"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* All Reactions Popover */}
          {isAllReactionsOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute top-8 ${isCurrentUser ? 'right-0' : 'left-0'} z-50`}
            >
              <AllReactionsPicker
                onSelectReaction={(emoji) => {
                  addReaction(message.id, emoji);
                  setIsAllReactionsOpen(false);
                }}
                onClose={() => setIsAllReactionsOpen(false)}
                align={isCurrentUser ? 'right' : 'left'}
              />
            </div>
          )}

          {/* More Options trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-full text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)] active:scale-90 transition-all cursor-pointer"
              title="Message options"
              aria-label="Message options"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {/* Action Menu dropdown */}
            {isMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute ${
                  isCurrentUser ? 'right-0' : 'left-0'
                } top-8 z-50 w-48 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] shadow-2xl py-1 text-xs text-[var(--rovela-text-primary)] animate-in fade-in zoom-in-95 duration-100`}
              >
                {/* Reply */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onReply(message);
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                >
                  <Reply className="w-3.5 h-3.5 text-purple-500" />
                  <span>Reply</span>
                </button>

                {/* Forward */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsForwardOpen(true);
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                >
                  <Forward className="w-3.5 h-3.5 text-purple-500" />
                  <span>Forward</span>
                </button>

                {/* Copy */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[var(--rovela-text-muted)]" />
                  <span>Copy</span>
                </button>

                {/* Star */}
                <button
                  type="button"
                  onClick={handleStar}
                  className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                >
                  <Star className={`w-3.5 h-3.5 ${isStarred ? 'text-amber-500 fill-amber-500' : 'text-[var(--rovela-text-muted)]'}`} />
                  <span>{isStarred ? 'Unstar' : 'Star'}</span>
                </button>

                {/* Pin */}
                <button
                  type="button"
                  onClick={handlePin}
                  className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                >
                  <Pin className={`w-3.5 h-3.5 ${isPinned ? 'text-purple-500' : 'text-[var(--rovela-text-muted)]'}`} />
                  <span>{isPinned ? 'Unpin' : 'Pin'}</span>
                </button>

                {/* Info */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsInfoOpen(true);
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-[var(--rovela-text-muted)]" />
                  <span>Info</span>
                </button>

                {/* Delete */}
                {isCurrentUser && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      deleteMessage(message.id);
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-left transition-colors cursor-pointer border-t border-[var(--rovela-border)]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}

                {/* Report */}
                {!isCurrentUser && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsReportOpen(true);
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-left transition-colors cursor-pointer border-t border-[var(--rovela-border)]"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bubble Container with Long-Press & Horizontal Swipe Gesture */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `translateX(${swipeOffset}px)`,
            transition: isSwiping ? 'none' : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}
        >
          {/* Sender Name for group chats */}
          {showSenderName && !isCurrentUser && (
            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 mb-1 ml-1 select-none">
              {message.sender_name}
            </span>
          )}

          {/* Forwarded Header Indicator */}
          {message.is_forwarded && (
            <div className="flex items-center gap-1 text-[10px] italic text-slate-500 dark:text-slate-400 mb-1 ml-1 select-none">
              <Forward className="w-3 h-3 text-purple-500" />
              <span>Forwarded{message.forwarded_from ? ` from ${message.forwarded_from}` : ''}</span>
            </div>
          )}

          {/* Quoted Reply context preview */}
          {message.reply_to && (
            <div
              onClick={() => onJumpToReply?.(message.reply_to!.id)}
              className={`mb-1 px-3 py-1.5 rounded-xl text-xs border-l-2 cursor-pointer transition-all hover:opacity-90 select-none max-w-full ${
                isCurrentUser
                  ? 'bg-purple-900/40 border-purple-300 text-purple-200'
                  : 'bg-[var(--rovela-surface-secondary)] border-purple-500 text-[var(--rovela-text-primary)]'
              }`}
            >
              <p className="font-bold text-[10px] text-purple-600 dark:text-purple-300">
                {message.reply_to.sender_name}
              </p>
              <p className="truncate text-[11px] opacity-80">{message.reply_to.content}</p>
            </div>
          )}

          {/* Render dedicated message type through modular MessageRenderer */}
          <div className="relative group/bubble">
            <MessageRenderer
              message={message}
              isCurrentUser={isCurrentUser}
              onRetry={retryMessage}
            />

            {/* Pinned / Starred subtle badge indicators */}
            {(isStarred || isPinned) && (
              <div
                className={`absolute -bottom-2 ${
                  isCurrentUser ? 'left-2' : 'right-2'
                } flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[var(--rovela-surface)] border border-[var(--rovela-border)] shadow-xs select-none`}
              >
                {isStarred && <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />}
                {isPinned && <Pin className="w-2.5 h-2.5 text-purple-500" />}
              </div>
            )}
          </div>

          {/* Reaction badges pill dock */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1 -mb-1 px-1 select-none">
              {message.reactions.map((react, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => addReaction(message.id, react.emoji)}
                  className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                    react.users.includes(currentUser.name)
                      ? 'ring-1 ring-purple-500/50 bg-purple-500/10'
                      : ''
                  }`}
                >
                  <span>{react.emoji}</span>
                  <span className="text-[10px] font-bold text-[var(--rovela-text-secondary)]">
                    {react.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message Info Dialog */}
      {isInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] shadow-2xl p-5 space-y-4 text-[var(--rovela-text-primary)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Info className="w-4 h-4 text-purple-500" />
                <span>Message Info</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsInfoOpen(false)}
                className="p-1 rounded-lg text-[var(--rovela-text-muted)] hover:text-[var(--rovela-text-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs divide-y divide-[var(--rovela-border)]">
              <div className="pt-2 flex justify-between">
                <span className="text-[var(--rovela-text-secondary)]">Sender</span>
                <span className="font-semibold">{message.sender_name}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-[var(--rovela-text-secondary)]">Sent time</span>
                <span className="font-semibold">
                  {formatRelativeMessageTime(message.created_at).full} ({formatRelativeMessageTime(message.created_at).relative})
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-[var(--rovela-text-secondary)]">Status</span>
                <span className="font-semibold capitalize">{message.status}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-[var(--rovela-text-secondary)]">Encryption</span>
                <span className="font-semibold text-emerald-500">End-to-end encrypted</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsInfoOpen(false)}
              className="w-full py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Forward Dialog */}
      <ForwardDialog
        isOpen={isForwardOpen}
        onClose={() => setIsForwardOpen(false)}
        message={message}
      />

      {/* Report Dialog */}
      <ReportMessageDialog
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        messageId={message.id}
      />
    </>
  );
};
