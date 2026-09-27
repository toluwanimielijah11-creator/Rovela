import React, { useState, useEffect, useRef } from 'react';
import { StatusType, StatusPrivacy } from '../../types';
import { useChat } from '../../context/ChatContext';
import {
  ArrowLeft,
  Send,
  Lock,
  Play,
  Volume2,
  VolumeX,
  X,
  AlertCircle,
  Loader2,
  HelpCircle,
} from 'lucide-react';
import { StatusPrivacyModal } from './StatusPrivacyModal';
import { safePlayMedia, safePauseMedia } from '../../utils/mediaUtils';

interface MediaStatusEditorProps {
  isOpen: boolean;
  file?: File | null;
  mediaUrl?: string;
  type?: StatusType; // 'IMAGE' | 'VIDEO'
  onClose: () => void;
  onPublished?: () => void;
}

export const MediaStatusEditor: React.FC<MediaStatusEditorProps> = ({
  isOpen,
  file,
  mediaUrl,
  type = 'IMAGE',
  onClose,
  onPublished,
}) => {
  const { addStatusItem, showToast, currentUser } = useChat();
  const [previewUrl, setPreviewUrl] = useState<string | null>(mediaUrl || null);
  const [caption, setCaption] = useState<string>('');
  const [privacy, setPrivacy] = useState<StatusPrivacy>('contacts');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState<boolean>(false);

  // Dynamic visual viewport height for Android/iOS mobile keyboard adaptation
  const [viewportHeight, setViewportHeight] = useState<string>('100dvh');

  // Video playback states
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playPromiseRef = useRef<Promise<void> | undefined>(undefined);

  // Safe playback start and cleanup on unmount
  useEffect(() => {
    if (type === 'VIDEO' && videoRef.current) {
      playPromiseRef.current = safePlayMedia(videoRef.current, () => {
        setIsPlaying(true);
      });
    }

    return () => {
      safePauseMedia(videoRef.current, playPromiseRef.current);
    };
  }, [type, previewUrl]);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Viewport resize tracking (handles on-screen keyboard showing/hiding)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateHeight = () => {
      if (window.visualViewport) {
        setViewportHeight(`${window.visualViewport.height}px`);
      } else {
        setViewportHeight(`${window.innerHeight}px`);
      }
    };

    updateHeight();

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight);
      return () => window.visualViewport?.removeEventListener('resize', updateHeight);
    } else {
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, []);

  // Handle media file or URL
  useEffect(() => {
    if (file) {
      // Validate file size
      const maxSizeBytes = type === 'VIDEO' ? 50 * 1024 * 1024 : 15 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        showToast(
          'File is too large',
          `Maximum allowed size for ${type.toLowerCase()} is ${type === 'VIDEO' ? '50MB' : '15MB'}.`,
          'error'
        );
        onClose();
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (mediaUrl) {
      setPreviewUrl(mediaUrl);
    }
  }, [file, mediaUrl, type]);

  if (!isOpen) return null;

  // Back button with discard confirmation check
  const handleBack = () => {
    safePauseMedia(videoRef.current, playPromiseRef.current);
    if (caption.trim().length > 0) {
      setShowDiscardDialog(true);
    } else {
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    safePauseMedia(videoRef.current, playPromiseRef.current);
    setShowDiscardDialog(false);
    onClose();
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        safePauseMedia(videoRef.current, playPromiseRef.current, () => {
          setIsPlaying(false);
        });
      } else {
        playPromiseRef.current = safePlayMedia(videoRef.current, () => {
          setIsPlaying(true);
        });
      }
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handlePublish = async () => {
    if (isPublishing) return;
    setIsPublishing(true);

    try {
      if (file) {
        // Read file as Data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          const mediaDataUrl = reader.result as string;

          addStatusItem({
            user_id: currentUser.id,
            user_name: currentUser.name,
            user_avatar: currentUser.avatar_url,
            type,
            media_url: mediaDataUrl,
            caption: caption.trim() || undefined,
            privacy,
          });

          setIsPublishing(false);
          onPublished?.();
          onClose();
        };

        reader.onerror = () => {
          // Fallback to previewUrl
          addStatusItem({
            user_id: currentUser.id,
            user_name: currentUser.name,
            user_avatar: currentUser.avatar_url,
            type,
            media_url: previewUrl || '',
            caption: caption.trim() || undefined,
            privacy,
          });

          setIsPublishing(false);
          onPublished?.();
          onClose();
        };

        reader.readAsDataURL(file);
      } else {
        // Direct mediaUrl (e.g. sample photo or persistent URL)
        addStatusItem({
          user_id: currentUser.id,
          user_name: currentUser.name,
          user_avatar: currentUser.avatar_url,
          type,
          media_url: previewUrl || '',
          caption: caption.trim() || undefined,
          privacy,
        });

        setIsPublishing(false);
        onPublished?.();
        onClose();
      }
    } catch {
      setIsPublishing(false);
      showToast('Failed to post status', 'Please try again', 'error');
    }
  };

  const getPrivacyLabel = () => {
    switch (privacy) {
      case 'contacts':
        return 'Contacts';
      case 'contacts_except':
        return 'Contacts Except...';
      case 'only_share_with':
        return 'Only Share With...';
      default:
        return 'Contacts';
    }
  };

  return (
    <>
      {/* Status Privacy Modal */}
      <StatusPrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        currentPrivacy={privacy}
        onSave={(p) => setPrivacy(p)}
      />

      {/* Discard Status Confirmation Dialog */}
      {showDiscardDialog && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          onClick={() => setShowDiscardDialog(false)}
        >
          <div
            className="w-full max-w-sm bg-[#16131F] border border-white/15 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Discard Status?</h3>
            <p className="text-xs text-white/70 mt-1.5 leading-relaxed">
              If you go back now, your status update and caption will be discarded.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowDiscardDialog(false)}
                className="px-4 py-2.5 rounded-xl border border-white/15 text-xs font-semibold text-white/80 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={handleConfirmDiscard}
                className="px-4 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 active:scale-95 transition-all shadow-md shadow-red-500/20 cursor-pointer"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* IMMERSIVE STATUS PREVIEW SCREEN (100dvh, flexible media, no global nav)  */}
      {/* ========================================================================= */}
      <div
        id="status-preview-screen"
        style={{ height: viewportHeight }}
        className="fixed inset-0 z-50 flex flex-col w-full bg-[#0D0B12] text-white select-none overflow-hidden"
      >
        {/* 1. TOP HEADER */}
        <header className="shrink-0 z-20 flex items-center justify-between px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] bg-gradient-to-b from-[#0D0B12] via-[#0D0B12]/80 to-transparent">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Title & Type */}
          <div className="text-center">
            <h2 className="text-sm font-bold tracking-wide text-white">Status Preview</h2>
            <p className="text-[11px] text-white/70">
              {type === 'IMAGE' ? 'Photo status' : 'Video status'}
            </p>
          </div>

          {/* Privacy Button */}
          <button
            type="button"
            onClick={() => setIsPrivacyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/90 hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
            title="Configure Status Privacy"
          >
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px] font-medium">{getPrivacyLabel()}</span>
          </button>
        </header>

        {/* 2. CENTER MEDIA AREA (FLEXIBLE: flex-1 min-h-0) */}
        <div
          className="flex-1 min-h-0 relative flex items-center justify-center overflow-hidden bg-[#0D0B12] p-2"
          onClick={type === 'VIDEO' ? handleTogglePlay : undefined}
        >
          {type === 'IMAGE' && previewUrl && previewUrl.trim() !== '' ? (
            <img
              src={previewUrl}
              alt="Status preview"
              className="max-h-full max-w-full w-auto h-auto object-contain rounded-2xl select-none"
            />
          ) : type === 'VIDEO' && previewUrl && previewUrl.trim() !== '' ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                src={previewUrl}
                loop
                playsInline
                muted={isMuted}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                    if (videoRef.current.duration) setDuration(videoRef.current.duration);
                  }
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current && videoRef.current.duration) {
                    setDuration(videoRef.current.duration);
                  }
                }}
                className="max-h-full max-w-full object-contain rounded-2xl cursor-pointer"
              />
              {/* Play / Pause overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-2xl pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white shadow-2xl">
                    <Play className="w-8 h-8 translate-x-0.5 fill-white" />
                  </div>
                </div>
              )}
              {/* Interactive Video Scrubber Bar on bottom of video preview */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-4 inset-x-4 z-20 flex items-center gap-2.5 p-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/15"
              >
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="p-1 rounded-lg text-white hover:bg-white/20 active:scale-95 transition-all"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  <Play className={`w-3.5 h-3.5 ${isPlaying ? 'opacity-50' : 'opacity-100 fill-white'}`} />
                </button>
                <div className="flex-1 flex flex-col gap-0.5">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 focus:outline-none"
                    aria-label="Seek video"
                  />
                  <div className="flex justify-between text-[9px] text-white/70 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                {/* Mute button */}
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="p-1.5 rounded-lg text-white hover:bg-white/20 transition-all cursor-pointer"
                  title={isMuted ? 'Unmute video' : 'Mute video'}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-white/50 gap-2">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white/40">
                <HelpCircle className="w-8 h-8" />
              </div>
              <p className="text-xs">No media loaded</p>
            </div>
          )}
        </div>

        {/* 3. BOTTOM STATUS CONTROLS (Dedicated to Status Preview; NOT global nav!) */}
        <div className="shrink-0 z-20 px-4 py-3 pb-[max(1rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#0D0B12] via-[#0D0B12]/95 to-transparent flex flex-col gap-3">
          {/* Caption Input Field */}
          <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2.5 focus-within:border-purple-500 transition-colors">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption..."
              maxLength={200}
              className="w-full bg-transparent text-white placeholder-white/50 text-sm focus:outline-none"
            />
            <span className="text-[10px] text-white/40 ml-2 shrink-0 select-none">
              {caption.length}/200
            </span>
          </div>

          {/* Actions Bar: Privacy Selector & Post Status Button */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white/90 active:scale-95 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>{getPrivacyLabel()}</span>
            </button>

            {/* Post Status Button (Rovela Purple #7C3AED) */}
            <button
              type="button"
              disabled={isPublishing}
              onClick={handlePublish}
              className="flex-1 max-w-[220px] py-2.5 px-5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 active:scale-95 transition-all disabled:opacity-50 cursor-pointer shrink-0 ml-auto"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <span>Post Status</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
