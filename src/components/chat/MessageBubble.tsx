import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../../types';
import { StatusIndicator } from '../common/StatusIndicator';
import { useChat } from '../../context/ChatContext';
import { Avatar } from '../ui/Avatar';
import { VoiceMessage } from './VoiceMessage';
import { ForwardDialog } from '../modals/ForwardDialog';
import { ReportMessageDialog } from '../modals/ReportMessageDialog';
import {
  Reply,
  FileText,
  Download,
  Trash2,
  Edit2,
  Forward,
  Flag,
  Copy,
  Check,
  MoreVertical,
  Star,
  Pin,
  Info,
  X,
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
  const { addReaction, deleteMessage, editMessage, currentUser, showToast } = useChat();
  const [showActions, setShowActions] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isForwardOpen, setIsForwardOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quickEmojis = ['❤️', '👍', '😂', '🔥', '😮', '🙏'];

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

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editContent.trim()) {
      editMessage(message.id, editContent);
      setIsEditing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    showToast('Copied to clipboard', undefined, 'success');
    setIsMenuOpen(false);
    setTimeout(() => setIsCopied(false), 1500);
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

  return (
    <>
      <div
        className={`group relative flex items-end gap-2.5 my-1.5 select-text ${
          isCurrentUser ? 'justify-end' : 'justify-start'
        }`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => {
          if (!isMenuOpen) setShowActions(false);
        }}
        onContextMenu={handleContextMenu}
      >
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
            showActions || isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
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
          </div>

          {/* Single More Options trigger button for Section 11 Message Action Menu */}
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

            {/* ========================================================================= */}
            {/* 11. MESSAGE ACTION MENU (Reply, Forward, Copy, Star, Pin, Info, Delete, Report) */}
            {/* ========================================================================= */}
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

                {/* Edit (if text and sender) */}
                {isCurrentUser && message.type === 'text' && !message.is_deleted && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setEditContent(message.content);
                      setIsEditing(true);
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer border-t border-[var(--rovela-border)]"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[var(--rovela-text-muted)]" />
                    <span>Edit message</span>
                  </button>
                )}

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

        {/* Bubble Container */}
        <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
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
              className={`mb-1 px-3 py-1.5 rounded-xl text-xs border-l-2 cursor-pointer transition-all hover:opacity-90 select-none ${
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

          {/* Actual Message Content Bubble (Liquid Glass styling) */}
          <div
            className={`relative px-4 py-2.5 rounded-3xl text-sm break-words transition-all duration-150 ${
              isCurrentUser
                ? 'bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/15 rounded-br-md'
                : 'bg-[var(--rovela-surface-secondary)] text-[var(--rovela-text-primary)] border border-[var(--rovela-border)] shadow-sm rounded-bl-md'
            }`}
          >
            {/* Inline editing mode */}
            {isEditing ? (
              <form onSubmit={handleSaveEdit} className="space-y-2 min-w-[200px]">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl bg-black/20 text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-purple-300"
                  rows={2}
                  autoFocus
                />
                <div className="flex justify-end gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-2.5 py-1 rounded-lg bg-black/20 hover:bg-black/30 text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-2.5 py-1 rounded-lg bg-purple-500 hover:bg-purple-400 text-white font-bold cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Text Message Content */}
                {message.type === 'text' && (
                  <p className="whitespace-pre-wrap leading-relaxed font-normal">
                    {message.content}
                  </p>
                )}

                {/* Voice Message Content */}
                {message.type === 'voice' && message.voice_data && (
                  <VoiceMessage
                    duration={message.voice_data.duration}
                    waveform={message.voice_data.waveform}
                    isCurrentUser={isCurrentUser}
                  />
                )}

                {/* Attachments Preview */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="space-y-1.5 mt-1.5">
                    {message.attachments.map((att) => (
                      <div
                        key={att.id}
                        className={`p-2.5 rounded-2xl flex items-center justify-between gap-3 border ${
                          isCurrentUser
                            ? 'bg-white/10 border-white/15 text-white'
                            : 'bg-[var(--rovela-surface)] border border-[var(--rovela-border)] text-[var(--rovela-text-primary)]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate leading-tight">
                              {att.name}
                            </p>
                            <p className="text-[10px] opacity-70 mt-0.5">
                              {att.size || 'Attachment'}
                            </p>
                          </div>
                        </div>
                        <a
                          href={att.url}
                          download={att.name}
                          onClick={() => showToast('File downloaded', undefined, 'success')}
                          className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-purple-400 shrink-0 cursor-pointer"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Bubble Meta Footer: Time, Status, Edited Tag */}
            <div
              className={`flex items-center gap-1.5 mt-1 text-[10px] select-none ${
                isCurrentUser ? 'text-purple-200 justify-end' : 'text-[var(--rovela-text-muted)] justify-end'
              }`}
            >
              {message.is_edited && <span className="italic opacity-80">edited</span>}
              {isStarred && <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />}
              {isPinned && <Pin className="w-2.5 h-2.5 text-purple-400" />}
              <span>{message.timestamp}</span>
              {isCurrentUser && <StatusIndicator status={message.status} />}
            </div>
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
                className="p-1 rounded-lg text-[var(--rovela-text-muted)] hover:text-[var(--rovela-text-primary)]"
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
                <span className="font-semibold">{message.timestamp}</span>
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
              className="w-full py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-colors"
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

