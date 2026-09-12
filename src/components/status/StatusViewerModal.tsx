import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { UserStatusGroup, StatusItem } from '../../types';
import { STATUS_BACKGROUND_PRESETS } from '../../data/mockData';
import { Avatar } from '../ui/Avatar';
import { StatusViewersDrawer } from './StatusViewersDrawer';
import { DeleteStatusConfirmDialog } from './DeleteStatusConfirmDialog';
import {
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Eye,
  Trash2,
  Send,
  Smile,
  Volume,
  Clock,
  ShieldAlert,
  VolumeX as MuteIcon,
} from 'lucide-react';

interface StatusViewerModalProps {
  isOpen: boolean;
  group: UserStatusGroup | null;
  initialIndex?: number;
  onClose: () => void;
}

export const StatusViewerModal: React.FC<StatusViewerModalProps> = ({
  isOpen,
  group,
  initialIndex = 0,
  onClose,
}) => {
  const {
    currentUser,
    statusGroups,
    openStatusViewer,
    deleteStatusItem,
    markStatusGroupAsViewed,
    toggleMuteUserStatus,
    reactToStatus,
    replyToStatus,
  } = useChat();

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [isViewersDrawerOpen, setIsViewersDrawerOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [group, initialIndex]);

  const items = group?.items || [];
  const currentItem: StatusItem | undefined = items[currentIndex];

  // Mark status group as viewed if looking at another user
  useEffect(() => {
    if (group && !group.is_self && currentItem) {
      markStatusGroupAsViewed(group.user_id);
    }
  }, [group?.user_id, currentItem?.id]);

  // Duration for current item: 6 seconds for images/text, or duration of video
  const durationMs = currentItem?.type === 'VIDEO' ? 12000 : 6000;

  // Progress timer loop
  useEffect(() => {
    if (!isOpen || !currentItem || isPaused || isViewersDrawerOpen || isDeleteDialogOpen) {
      return;
    }

    const intervalMs = 50;
    const increment = (intervalMs / durationMs) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOpen, currentItem?.id, currentIndex, isPaused, isViewersDrawerOpen, isDeleteDialogOpen, durationMs]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ') {
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, items.length]);

  if (!isOpen || !group || !currentItem) return null;

  const isSelf = group.is_self || group.user_id === currentUser.id;

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      // Find next user status group if available
      const activeGroups = statusGroups.filter((g) => g.items.length > 0);
      const currentGroupIdx = activeGroups.findIndex((g) => g.user_id === group.user_id);
      if (currentGroupIdx >= 0 && currentGroupIdx < activeGroups.length - 1) {
        const nextGroup = activeGroups[currentGroupIdx + 1];
        openStatusViewer(nextGroup, 0);
      } else {
        onClose();
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    } else {
      // Go to previous user group if available
      const activeGroups = statusGroups.filter((g) => g.items.length > 0);
      const currentGroupIdx = activeGroups.findIndex((g) => g.user_id === group.user_id);
      if (currentGroupIdx > 0) {
        const prevGroup = activeGroups[currentGroupIdx - 1];
        openStatusViewer(prevGroup, prevGroup.items.length - 1);
      }
    }
  };

  const handleHoldStart = () => {
    setIsPaused(true);
    if (videoRef.current) videoRef.current.pause();
  };

  const handleHoldEnd = () => {
    setIsPaused(false);
    if (videoRef.current) videoRef.current.play();
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins} min ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      return 'Yesterday';
    } catch {
      return 'Recently';
    }
  };

  const formatExpiresIn = (expiresAtStr: string) => {
    try {
      const diffMs = new Date(expiresAtStr).getTime() - Date.now();
      if (diffMs <= 0) return 'Expiring soon';
      const hours = Math.ceil(diffMs / (60 * 60 * 1000));
      return `Expires in ${hours}h`;
    } catch {
      return '24h status';
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    replyToStatus(group.user_id, currentItem.id, replyText);
    setReplyText('');
  };

  const handleSendReaction = (emoji: string) => {
    reactToStatus(group.user_id, currentItem.id, emoji);
  };

  const bgPreset =
    STATUS_BACKGROUND_PRESETS.find((p) => p.id === currentItem.background_style) ||
    STATUS_BACKGROUND_PRESETS[1];

  return (
    <>
      {/* Viewers Drawer */}
      <StatusViewersDrawer
        isOpen={isViewersDrawerOpen}
        onClose={() => setIsViewersDrawerOpen(false)}
        viewers={currentItem.viewers || []}
        createdAt={currentItem.created_at}
      />

      {/* Delete Dialog */}
      <DeleteStatusConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          deleteStatusItem(currentItem.id);
        }}
      />

      <div
        id="status-viewer-modal"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 text-white animate-in fade-in duration-200 select-none"
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
      >
        {/* Main Viewing Stage */}
        <div className="relative w-full h-full max-w-lg md:max-h-[95vh] md:rounded-3xl overflow-hidden bg-black flex flex-col justify-between shadow-2xl border border-white/10">
          {/* 1. TOP BAR: Progress Indicators & Author Info */}
          <div className="absolute top-0 inset-x-0 z-30 p-4 pt-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex flex-col gap-3">
            {/* Segmented Progress Bars */}
            <div className="flex items-center gap-1.5 w-full">
              {items.map((item, idx) => {
                let fillPercent = 0;
                if (idx < currentIndex) fillPercent = 100;
                else if (idx === currentIndex) fillPercent = progress;
                return (
                  <div
                    key={item.id || idx}
                    className="flex-1 h-1 bg-white/25 rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full bg-white rounded-full transition-all duration-75 ease-linear"
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Author Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  src={group.user_avatar}
                  name={group.user_name}
                  size="sm"
                  className="ring-2 ring-purple-500/80"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold tracking-tight text-white">
                      {isSelf ? 'Your Status' : group.user_name}
                    </h3>
                    <span className="text-[10px] text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded-full font-medium border border-purple-500/20">
                      {currentIndex + 1} of {items.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-white/70 mt-0.5">
                    <span>{formatTimeAgo(currentItem.created_at)}</span>
                    <span>•</span>
                    <span className="text-purple-300/90 font-medium">
                      {formatExpiresIn(currentItem.expires_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions: Mute / Sound / More / Close */}
              <div className="flex items-center gap-1">
                {currentItem.type === 'VIDEO' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (videoRef.current) {
                        videoRef.current.muted = !isMuted;
                        setIsMuted(!isMuted);
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-black/60 transition-all cursor-pointer"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-red-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                )}

                {/* More Options Dropdown Toggle */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMoreMenuOpen(!isMoreMenuOpen);
                    }}
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-black/60 transition-all cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Menu popover */}
                  {isMoreMenuOpen && (
                    <div
                      className="absolute right-0 top-10 w-44 bg-[var(--rovela-surface)] border border-[var(--rovela-border)] rounded-2xl p-1.5 shadow-2xl text-[var(--rovela-text-primary)] z-50 animate-in zoom-in-95 duration-150"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isSelf ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setIsMoreMenuOpen(false);
                              setIsViewersDrawerOpen(true);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
                          >
                            <Eye className="w-4 h-4 text-purple-500" />
                            <span>Viewers ({currentItem.viewers?.length || 0})</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsMoreMenuOpen(false);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-500 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                            <span>Delete status</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              toggleMuteUserStatus(group.user_id);
                              setIsMoreMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
                          >
                            <MuteIcon className="w-4 h-4 text-amber-500" />
                            <span>{group.is_muted ? 'Unmute status' : 'Mute status'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsMoreMenuOpen(false);
                              onClose();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-500 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                          >
                            <ShieldAlert className="w-4 h-4 text-red-500" />
                            <span>Report status</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-all cursor-pointer ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* 2. CENTER CONTENT */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            {/* Tap Navigation Overlays */}
            <div
              className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              title="Previous status"
            />
            <div
              className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              title="Next status"
            />

            {/* Media Rendering */}
            {currentItem.type === 'IMAGE' && (
              <img
                src={currentItem.media_url}
                alt="Status update"
                className="w-full h-full object-contain"
              />
            )}

            {currentItem.type === 'VIDEO' && (
              <video
                ref={videoRef}
                src={currentItem.media_url}
                autoPlay
                playsInline
                loop
                muted={isMuted}
                className="w-full h-full object-contain"
                onEnded={handleNext}
              />
            )}

            {currentItem.type === 'TEXT' && (
              <div
                className={`w-full h-full flex items-center justify-center p-8 md:p-12 transition-colors ${bgPreset.bgClass}`}
                style={bgPreset.styleObject}
              >
                <p
                  style={{
                    color: bgPreset.textColor,
                    textAlign: currentItem.text_alignment || 'center',
                  }}
                  className={`max-w-md select-text break-words whitespace-pre-wrap font-medium ${
                    currentItem.text_size === 'title'
                      ? 'text-3xl md:text-4xl font-extrabold tracking-tight'
                      : currentItem.text_size === 'normal'
                      ? 'text-lg md:text-xl'
                      : 'text-2xl md:text-3xl font-semibold'
                  }`}
                >
                  {currentItem.text_content}
                </p>
              </div>
            )}

            {/* Caption banner if exists */}
            {currentItem.caption && (
              <div className="absolute bottom-28 inset-x-4 z-20 flex justify-center">
                <div className="max-w-md bg-black/60 backdrop-blur-xl border border-white/15 px-4 py-2.5 rounded-2xl text-xs text-white font-medium shadow-xl text-center leading-relaxed">
                  {currentItem.caption}
                </div>
              </div>
            )}

            {/* Display Reactions if any */}
            {currentItem.reactions && currentItem.reactions.length > 0 && (
              <div className="absolute bottom-20 left-4 z-20 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-xs">
                {currentItem.reactions.map((r, i) => (
                  <span key={i} className="flex items-center gap-0.5">
                    <span>{r.emoji}</span>
                    <span className="text-[10px] text-purple-300 font-bold">{r.count}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 3. BOTTOM BAR */}
          <div className="z-30 p-4 pb-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-3">
            {isSelf ? (
              // Own status: View counter & quick delete action
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsViewersDrawerOpen(true);
                  }}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 border border-white/15 active:scale-95 transition-all text-xs font-semibold text-white cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span>
                    Viewed by {currentItem.viewers?.length || 0}{' '}
                    {(currentItem.viewers?.length || 0) === 1 ? 'contact' : 'contacts'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteDialogOpen(true);
                  }}
                  className="w-10 h-10 rounded-full bg-red-500/20 backdrop-blur-md hover:bg-red-500/30 border border-red-500/30 flex items-center justify-center text-red-400 active:scale-95 transition-all cursor-pointer"
                  title="Delete this status"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              // Other user status: Reply field & Quick Reactions
              <div className="flex flex-col gap-2.5">
                {/* Quick Reactions Bar */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    {['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '✨'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendReaction(emoji);
                        }}
                        className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-sm active:scale-125 transition-transform cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEmojiPicker(!showEmojiPicker);
                    }}
                    className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-bold text-purple-300 backdrop-blur-md active:scale-95 transition-all cursor-pointer"
                  >
                    + React
                  </button>
                </div>

                {/* Reply Form */}
                <form
                  onSubmit={handleSendReply}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2"
                >
                  <div className="flex-1 relative flex items-center bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2 focus-within:border-purple-500/80 transition-all">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${group.user_name}...`}
                      className="w-full bg-transparent text-white placeholder-white/50 text-xs focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="w-10 h-10 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white flex items-center justify-center disabled:opacity-40 shadow-lg shadow-purple-600/30 active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
