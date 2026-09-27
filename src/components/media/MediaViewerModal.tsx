import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Share2,
  Download,
  Camera,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { safePlayMedia, safePauseMedia } from '../../utils/mediaUtils';

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  subtitle?: string;
  type?: 'image' | 'video';
  allowEdit?: boolean;
  isSelf?: boolean;
  onEditPhoto?: () => void;
  onRemovePhoto?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  isOpen,
  onClose,
  url,
  title,
  subtitle,
  type = 'image',
  allowEdit = false,
  isSelf = false,
  onEditPhoto,
  onRemovePhoto,
  onNext,
  onPrev,
}) => {
  const { showToast } = useChat();
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playPromiseRef = useRef<Promise<void> | undefined>(undefined);

  const handleClose = useCallback(() => {
    safePauseMedia(videoRef.current, playPromiseRef.current);
    onClose();
  }, [onClose]);

  const handleNextMedia = useCallback(() => {
    safePauseMedia(videoRef.current, playPromiseRef.current);
    onNext?.();
  }, [onNext]);

  const handlePrevMedia = useCallback(() => {
    safePauseMedia(videoRef.current, playPromiseRef.current);
    onPrev?.();
  }, [onPrev]);

  useEffect(() => {
    if (isOpen && type === 'video' && videoRef.current) {
      playPromiseRef.current = safePlayMedia(videoRef.current);
    }
    return () => {
      safePauseMedia(videoRef.current, playPromiseRef.current);
    };
  }, [isOpen, url, type]);

  if (!isOpen || !url || url.trim() === '') return null;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.3, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.3, 0.6));
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast('Image link copied to clipboard', undefined, 'success');
    } else {
      showToast('Share link ready', url, 'info');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || 'rovela-media'}.jpg`;
    link.target = '_blank';
    link.click();
    showToast('Saved to device', undefined, 'success');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col select-none"
      >
        {/* Top App Bar */}
        <header className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md shrink-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={handleClose}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              aria-label="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate">
                {title || 'Media Viewer'}
              </h3>
              {subtitle && (
                <p className="text-xs text-purple-300/80 truncate">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {type === 'image' && (
              <>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.6}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all cursor-pointer"
                  title="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all cursor-pointer"
                  title="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRotate}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  title="Rotate image"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                {(zoom !== 1 || rotation !== 0) && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Download image"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* If viewing own profile photo, allow edit & remove */}
            {isSelf && (
              <>
                {onEditPhoto && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEditPhoto();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer ml-1 shadow-lg shadow-purple-900/40"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Change Photo</span>
                  </button>
                )}
                {onRemovePhoto && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onRemovePhoto();
                    }}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        </header>

        {/* Media Viewport */}
        <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
          {/* Navigation controls if gallery mode */}
          {onPrev && (
            <button
              type="button"
              onClick={handlePrevMedia}
              className="absolute left-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all cursor-pointer"
              aria-label="Previous media"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {onNext && (
            <button
              type="button"
              onClick={handleNextMedia}
              className="absolute right-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all cursor-pointer"
              aria-label="Next media"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {type === 'video' ? (
            <video
              ref={videoRef}
              src={url}
              controls
              playsInline
              className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-2xl object-contain"
            />
          ) : (
            <motion.div
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.15s ease-out',
              }}
              className="max-h-[85vh] max-w-[90vw] flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
              <img
                src={url}
                alt={title || 'Profile Photo'}
                className="max-h-[80vh] max-w-[85vw] object-contain rounded-2xl shadow-2xl select-none pointer-events-auto"
                referrerPolicy="no-referrer"
                draggable={false}
              />
            </motion.div>
          )}
        </div>

        {/* Footer brand indicator */}
        <footer className="h-10 px-6 flex items-center justify-between text-[11px] text-white/40 border-t border-white/5 bg-black/30 shrink-0">
          <span>Rovela Liquid Viewer</span>
          {type === 'image' && <span>Zoom: {Math.round(zoom * 100)}%</span>}
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};
