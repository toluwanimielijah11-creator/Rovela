import React, { useRef } from 'react';
import { Camera, Video, Type, X, Image as ImageIcon } from 'lucide-react';

interface StatusCreationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (file: File) => void;
  onSelectVideo: (file: File) => void;
  onSelectText: () => void;
  onSelectSamplePhoto?: (url: string) => void;
  onSelectSampleVideo?: (url: string) => void;
}

export const StatusCreationSheet: React.FC<StatusCreationSheetProps> = ({
  isOpen,
  onClose,
  onSelectPhoto,
  onSelectVideo,
  onSelectText,
  onSelectSamplePhoto,
  onSelectSampleVideo,
}) => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoClick = () => {
    photoInputRef.current?.click();
  };

  const handleVideoClick = () => {
    videoInputRef.current?.click();
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectPhoto(file);
      onClose();
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectVideo(file);
      onClose();
    }
  };

  return (
    <>
      {/* Hidden real HTML file pickers */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handlePhotoFileChange}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={handleVideoFileChange}
      />

      <div
        id="status-creation-overlay"
        className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center items-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 p-0 md:p-4"
        onClick={onClose}
      >
        <div
          id="status-creation-sheet"
          className="w-full md:max-w-md bg-[var(--rovela-surface)] rounded-t-3xl md:rounded-3xl border border-[var(--rovela-border)] p-6 pb-8 md:pb-6 shadow-2xl animate-in slide-in-from-bottom duration-200 text-[var(--rovela-text-primary)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-[var(--rovela-border)]">
            <div>
              <h3 className="text-base font-bold text-[var(--rovela-text-primary)]">
                Create Status
              </h3>
              <p className="text-xs text-[var(--rovela-text-secondary)]">
                Share updates that disappear after 24 hours
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-muted)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Options */}
          <div className="space-y-3 py-2">
            {/* 1. Photo */}
            <button
              type="button"
              onClick={handlePhotoClick}
              className="w-full p-4 rounded-2xl border border-[var(--rovela-border)] hover:border-purple-500/50 hover:bg-purple-500/05 active:scale-[0.98] transition-all flex items-center gap-4 cursor-pointer text-left group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Camera className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-[var(--rovela-text-primary)] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Photo Status
                </h4>
                <p className="text-xs text-[var(--rovela-text-secondary)] mt-0.5 leading-relaxed">
                  Select a photo from your gallery or camera
                </p>
              </div>
            </button>

            {/* 2. Video */}
            <button
              type="button"
              onClick={handleVideoClick}
              className="w-full p-4 rounded-2xl border border-[var(--rovela-border)] hover:border-purple-500/50 hover:bg-purple-500/05 active:scale-[0.98] transition-all flex items-center gap-4 cursor-pointer text-left group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-600 text-white flex items-center justify-center shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Video className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-[var(--rovela-text-primary)] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Video Status
                </h4>
                <p className="text-xs text-[var(--rovela-text-secondary)] mt-0.5 leading-relaxed">
                  Share video clips up to 30 seconds
                </p>
              </div>
            </button>

            {/* 3. Text Status */}
            <button
              type="button"
              onClick={() => {
                onSelectText();
                onClose();
              }}
              className="w-full p-4 rounded-2xl border border-[var(--rovela-border)] hover:border-purple-500/50 hover:bg-purple-500/05 active:scale-[0.98] transition-all flex items-center gap-4 cursor-pointer text-left group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-violet-800 text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform shrink-0">
                <Type className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-[var(--rovela-text-primary)] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Text Status
                </h4>
                <p className="text-xs text-[var(--rovela-text-secondary)] mt-0.5 leading-relaxed">
                  Write a thought with curated Rovela color backgrounds
                </p>
              </div>
            </button>
            {/* Quick Demo Preview Options for immediate testing */}
            <div className="pt-2 border-t border-[var(--rovela-border)]/60">
              <p className="text-[11px] font-semibold text-[var(--rovela-text-muted)] mb-2">
                Quick preview presets:
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onSelectSamplePhoto?.(
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80'
                    );
                    onClose();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-[var(--rovela-surface-hover)] hover:bg-purple-500/10 border border-[var(--rovela-border)] text-xs font-semibold text-[var(--rovela-text-primary)] transition-all cursor-pointer text-center"
                >
                  📷 Sample Photo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectSampleVideo?.(
                      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                    );
                    onClose();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-[var(--rovela-surface-hover)] hover:bg-purple-500/10 border border-[var(--rovela-border)] text-xs font-semibold text-[var(--rovela-text-primary)] transition-all cursor-pointer text-center"
                >
                  🎬 Sample Video
                </button>
              </div>
            </div>
          </div>

          {/* Cancel button */}
          <div className="pt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl border border-[var(--rovela-border)] text-xs font-semibold text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
