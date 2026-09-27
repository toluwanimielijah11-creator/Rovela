import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Send, Trash2, Film } from 'lucide-react';
import { formatMediaDuration, safePlayMedia, safePauseMedia } from '../../../utils/mediaUtils';

interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  thumbnailUrl?: string;
  videoName?: string;
  fileSize?: string;
  duration?: number;
  onSend: (caption: string) => void;
}

export const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  thumbnailUrl,
  videoName = 'video.mp4',
  fileSize = '5.4 MB',
  duration: initialDuration = 18,
  onSend,
}) => {
  const [caption, setCaption] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(initialDuration);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playPromiseRef = useRef<Promise<void> | undefined>(undefined);

  useEffect(() => {
    if (!isOpen && videoRef.current) {
      safePauseMedia(videoRef.current, playPromiseRef.current);
      setIsPlaying(false);
    }
    return () => {
      safePauseMedia(videoRef.current, playPromiseRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      playPromiseRef.current = safePlayMedia(videoRef.current, () => setIsPlaying(true));
    } else {
      safePauseMedia(videoRef.current, playPromiseRef.current, () => setIsPlaying(false));
    }
  };

  const handleClose = () => {
    safePauseMedia(videoRef.current, playPromiseRef.current, () => setIsPlaying(false));
    onClose();
  };

  const handleSend = () => {
    safePauseMedia(videoRef.current, playPromiseRef.current, () => setIsPlaying(false));
    onSend(caption.trim());
    setCaption('');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-3 sm:p-6 select-none"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 10 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-[var(--rovela-surface)] border border-[var(--rovela-border)] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--rovela-border)]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Film className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[var(--rovela-text-primary)] truncate">
                  Preview Video
                </h3>
                <p className="text-[11px] text-[var(--rovela-text-secondary)]">
                  {videoName} • {fileSize} • {formatMediaDuration(duration)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
              title="Close preview"
              aria-label="Close preview modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Video Preview Center Area */}
          <div
            className="relative bg-black flex items-center justify-center max-h-[50vh] min-h-[220px] overflow-hidden cursor-pointer group"
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              src={videoUrl}
              poster={thumbnailUrl}
              playsInline
              loop
              onLoadedMetadata={() => {
                if (videoRef.current?.duration) {
                  setDuration(Math.round(videoRef.current.duration));
                }
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="max-h-[50vh] max-w-full object-contain"
            />

            {/* Center Play/Pause button */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ${
                isPlaying ? 'opacity-0 group-hover:opacity-90' : 'opacity-100'
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-white" />
                ) : (
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                )}
              </div>
            </div>

            {/* Duration badge */}
            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono text-white/90">
              {formatMediaDuration(duration)}
            </div>
          </div>

          {/* Caption Input & Actions */}
          <div className="p-4 flex flex-col gap-3 bg-[var(--rovela-surface-secondary)]">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Add a caption…"
              className="w-full px-4 py-2.5 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] text-sm text-[var(--rovela-text-primary)] placeholder:text-[var(--rovela-text-muted)] focus:outline-none focus:border-purple-500 transition-colors"
              autoFocus
            />

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Discard video"
                aria-label="Discard video message"
              >
                <Trash2 className="w-4 h-4" />
                <span>Discard</span>
              </button>

              <button
                type="button"
                onClick={handleSend}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-900/30 active:scale-95 transition-all cursor-pointer"
                title="Send video"
                aria-label="Send video with caption"
              >
                <span>Send Video</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
