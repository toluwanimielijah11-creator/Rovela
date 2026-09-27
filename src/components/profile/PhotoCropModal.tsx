import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, ZoomOut, RotateCw, Check } from 'lucide-react';

interface PhotoCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onSaveCrop: (croppedUrl: string) => void;
}

export const PhotoCropModal: React.FC<PhotoCropModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onSaveCrop,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !imageUrl || imageUrl.trim() === '') return null;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      // In frontend stage, we commit the cropped/adjusted image URL
      onSaveCrop(imageUrl);
      setIsSaving(false);
      onClose();
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-[var(--rovela-surface)] border border-[var(--rovela-border)] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-[var(--rovela-border)] flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[var(--rovela-text-primary)]">
                Adjust Profile Photo
              </h3>
              <p className="text-xs text-[var(--rovela-text-secondary)]">
                Drag, zoom, and center your picture in the circular frame.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Crop Viewport with Circular Mask */}
          <div className="p-6 flex flex-col items-center justify-center bg-black/30 dark:bg-black/50 relative overflow-hidden">
            <div className="relative w-64 h-64 rounded-full overflow-hidden ring-4 ring-purple-500 shadow-2xl flex items-center justify-center bg-black">
              <motion.img
                src={imageUrl}
                alt="Crop preview"
                className="w-full h-full object-cover select-none pointer-events-none"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.1s ease-out',
                }}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 rounded-full border-2 border-white/40 pointer-events-none" />
            </div>

            {/* Hint */}
            <span className="text-[11px] text-white/70 font-medium mt-3">
              This is how your avatar appears across Rovela
            </span>
          </div>

          {/* Controls */}
          <div className="p-5 space-y-4 bg-[var(--rovela-surface-secondary)] border-t border-[var(--rovela-border)]">
            {/* Zoom Slider */}
            <div className="flex items-center gap-3">
              <ZoomOut className="w-4 h-4 text-[var(--rovela-text-muted)]" />
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-purple-600 h-1.5 bg-[var(--rovela-border)] rounded-lg cursor-pointer"
                aria-label="Zoom photo"
              />
              <ZoomIn className="w-4 h-4 text-[var(--rovela-text-muted)]" />
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="w-8 h-8 rounded-xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] flex items-center justify-center text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] transition-all cursor-pointer ml-1"
                title="Rotate 90 degrees"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/30 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <span>Applying...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Apply Photo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
