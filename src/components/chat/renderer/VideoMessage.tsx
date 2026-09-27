import React, { useState } from 'react';
import { Play, Film, AlertCircle, RotateCcw, Check, CheckCheck, Clock, X } from 'lucide-react';
import { Message } from '../../../types';
import { formatMediaDuration } from '../../../utils/mediaUtils';
import { formatRelativeMessageTime } from '../../../utils/dateUtils';
import { VideoPlayerModal } from '../media/VideoPlayerModal';
import { ReadReceipt } from '../ReadReceipt';
import { useChat } from '../../../context/ChatContext';

interface VideoMessageProps {
  message: Message;
  isCurrentUser: boolean;
  onRetry?: (messageId: string) => void;
}

export const VideoMessage: React.FC<VideoMessageProps> = ({
  message,
  isCurrentUser,
  onRetry,
}) => {
  const { deleteMessage } = useChat();
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // Extract video details
  const videoData = message.video_data;
  const videoAttachment = message.attachments?.find(
    (a) =>
      a.type?.startsWith('video/') ||
      a.url?.match(/\.(mp4|webm|mov|m4v)(\?.*)?$/i)
  );

  const videoUrl =
    videoData?.url ||
    videoAttachment?.url ||
    message.media_url ||
    'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-smartphone-with-green-screen-42939-large.mp4';

  const thumbnailUrl =
    videoData?.thumbnail_url ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

  const duration = videoData?.duration || 18;
  const caption = videoData?.caption || (message.content && !message.content.startsWith('http') && message.content !== 'video.mp4' ? message.content : undefined);
  const isUploading = videoData?.is_uploading || message.status === 'sending';
  const uploadProgress = videoData?.upload_progress ?? 68;
  const isFailed = message.status === 'failed' || videoData?.is_failed;
  const isLoading = videoData?.is_loading;

  // Aspect ratio styling
  const aspectRatio = videoData?.aspect_ratio || 'landscape';
  const aspectClass =
    aspectRatio === 'portrait'
      ? 'aspect-[9/16] max-h-[380px]'
      : aspectRatio === 'square'
      ? 'aspect-square max-h-[320px]'
      : 'aspect-[16/10] max-h-[260px]';

  // 1. Loading Skeleton
  if (isLoading) {
    return (
      <div className="w-[280px] sm:w-[320px] aspect-[16/10] rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] animate-pulse flex flex-col items-center justify-center gap-2 select-none">
        <Film className="w-8 h-8 text-purple-500/30" />
        <span className="text-xs text-[var(--rovela-text-muted)]">Loading video…</span>
      </div>
    );
  }

  // 2. Failed State
  if (isFailed) {
    return (
      <div className="flex flex-col gap-2 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 select-none max-w-xs">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>Couldn't send video</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-rose-500/20">
          <button
            type="button"
            onClick={() => onRetry?.(message.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Retry</span>
          </button>
          <button
            type="button"
            onClick={() => deleteMessage(message.id)}
            className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-xs font-medium transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  // 3. Normal Native Video Message
  return (
    <>
      <div
        className={`flex flex-col overflow-hidden rounded-2xl w-[280px] sm:w-[340px] max-w-full select-none shadow-sm transition-all ${
          isCurrentUser
            ? 'bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-white shadow-purple-950/20'
            : 'bg-[var(--rovela-surface)] border border-[var(--rovela-border)] text-[var(--rovela-text-primary)]'
        }`}
        role="region"
        aria-label="Video Message"
      >
        {/* Dominant Video Thumbnail Surface */}
        <div
          onClick={() => !isUploading && setIsPlayerOpen(true)}
          className={`relative w-full ${aspectClass} bg-black/80 overflow-hidden cursor-pointer group`}
        >
          <img
            src={thumbnailUrl}
            alt={caption || 'Video preview'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />

          {/* Liquid Glass Center Play Overlay Button */}
          {!isUploading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-purple-600/80 transition-all duration-200">
                <Play className="w-6 h-6 fill-white ml-0.5 text-white" />
              </div>
            </div>
          )}

          {/* Uploading Overlay State */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-2 p-4 text-center">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="w-12 h-12 border-3 border-purple-500/30 border-t-purple-400 rounded-full animate-spin" />
                <span className="absolute text-[11px] font-bold text-white">
                  {uploadProgress}%
                </span>
              </div>
              <span className="text-xs font-semibold text-white/90">Uploading video…</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMessage(message.id);
                }}
                className="text-[11px] text-rose-300 hover:text-rose-200 underline mt-1"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Bottom Duration Badge */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono text-white/90 shadow-sm pointer-events-none">
            <Film className="w-3 h-3 text-purple-300" />
            <span>{formatMediaDuration(duration)}</span>
          </div>
        </div>

        {/* Caption Section (Cleanly below the video media) */}
        {caption && (
          <div className="px-3.5 pt-2 pb-1 text-sm font-normal leading-relaxed break-words">
            {caption}
          </div>
        )}

        {/* Footer: Timestamp & Delivery Status */}
        {(() => {
          const timeObj = formatRelativeMessageTime(message.created_at);
          return (
            <div
              className={`flex items-center justify-end gap-1.5 px-3 py-1.5 text-[10.5px] select-none ${
                isCurrentUser
                  ? 'text-white/75 font-medium tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]'
                  : 'text-[var(--rovela-text-secondary)] dark:text-slate-400 font-medium tracking-tight'
              }`}
            >
              <span
                title={timeObj.tooltip || timeObj.full}
                className="cursor-default hover:underline decoration-dotted decoration-1"
              >
                {timeObj.relative}
              </span>
              <ReadReceipt status={message.status} isCurrentUser={isCurrentUser} />
            </div>
          );
        })()}
      </div>

      {/* Dedicated Full Video Player Modal */}
      <VideoPlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        videoUrl={videoUrl}
        thumbnailUrl={thumbnailUrl}
        title={caption || 'Video Message'}
        caption={caption}
        duration={duration}
      />
    </>
  );
};
