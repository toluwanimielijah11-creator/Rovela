import React, { useState, useEffect, useRef } from 'react';
import { StatusType, StatusPrivacy } from '../../types';
import { useChat } from '../../context/ChatContext';
import {
  ArrowLeft,
  Send,
  Lock,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Smile,
  X,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { StatusPrivacyModal } from './StatusPrivacyModal';

interface MediaStatusEditorProps {
  isOpen: boolean;
  file: File | null;
  type: StatusType; // 'IMAGE' | 'VIDEO'
  onClose: () => void;
  onPublished: () => void;
}

export const MediaStatusEditor: React.FC<MediaStatusEditorProps> = ({
  isOpen,
  file,
  type,
  onClose,
  onPublished,
}) => {
  const { addStatusItem, showToast, currentUser } = useChat();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [privacy, setPrivacy] = useState<StatusPrivacy>('contacts');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // Video playback states
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    } else {
      setPreviewUrl(null);
    }
  }, [file, type]);

  if (!isOpen || !file || !previewUrl) return null;

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
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
      // Convert file to Base64 or persistent objectUrl for mock stage
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
        onPublished();
        onClose();
      };

      reader.onerror = () => {
        // Fallback to previewUrl
        addStatusItem({
          user_id: currentUser.id,
          user_name: currentUser.name,
          user_avatar: currentUser.avatar_url,
          type,
          media_url: previewUrl,
          caption: caption.trim() || undefined,
          privacy,
        });

        setIsPublishing(false);
        onPublished();
        onClose();
      };

      reader.readAsDataURL(file);
    } catch {
      setIsPublishing(false);
      showToast('Failed to post status', 'Please try again', 'error');
    }
  };

  const insertEmoji = (emoji: string) => {
    setCaption((prev) => prev + emoji);
  };

  return (
    <>
      <StatusPrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        currentPrivacy={privacy}
        onSave={(p) => setPrivacy(p)}
      />

      <div
        id="media-status-editor"
        className="fixed inset-0 z-50 flex flex-col bg-black text-white animate-in fade-in duration-200 select-none"
      >
        {/* Top Floating Control Bar */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h3 className="text-sm font-bold tracking-wide">Status Preview</h3>
            <span className="text-[10px] text-white/70">
              {type === 'IMAGE' ? 'Photo status' : 'Video status'}
            </span>
          </div>

          {/* Privacy Button */}
          <button
            type="button"
            onClick={() => setIsPrivacyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs text-white/90 hover:bg-black/60 active:scale-95 transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px] font-medium capitalize">
              {privacy.replace('_', ' ')}
            </span>
          </button>
        </div>

        {/* Center Media Preview Container */}
        <div
          className="flex-1 relative flex items-center justify-center overflow-hidden bg-black cursor-pointer"
          onClick={type === 'VIDEO' ? handleTogglePlay : undefined}
        >
          {type === 'IMAGE' ? (
            <img
              src={previewUrl}
              alt="Status preview"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                src={previewUrl}
                autoPlay
                loop
                playsInline
                muted={isMuted}
                className="max-h-full max-w-full object-contain"
              />
              {/* Play / Pause indicator overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                  <div className="w-16 h-16 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white shadow-2xl">
                    <Play className="w-8 h-8 translate-x-0.5 fill-white" />
                  </div>
                </div>
              )}
              {/* Mute button */}
              <button
                type="button"
                onClick={handleToggleMute}
                className="absolute bottom-24 right-4 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all cursor-pointer"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-red-400" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Glass Caption and Post Bar */}
        <div className="absolute bottom-0 inset-x-0 z-20 p-4 pb-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-3">
          {/* Quick Emoji Bar */}
          <div className="flex items-center gap-2 px-2 overflow-x-auto no-scrollbar">
            {['✨', '🔥', '💜', '😂', '🎉', '🙌', '😍', '👏'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => insertEmoji(emoji)}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-sm active:scale-95 transition-all cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Caption Input & Post Button */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2.5 focus-within:border-purple-500/80 transition-all">
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption..."
                maxLength={200}
                className="w-full bg-transparent text-white placeholder-white/50 text-sm focus:outline-none"
              />
              <span className="text-[10px] text-white/40 ml-2">
                {caption.length}/200
              </span>
            </div>

            {/* Post Status Button */}
            <button
              type="button"
              disabled={isPublishing}
              onClick={handlePublish}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 active:scale-95 transition-all disabled:opacity-50 cursor-pointer shrink-0"
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
