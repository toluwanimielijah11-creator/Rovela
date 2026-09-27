import React, { useState, useRef } from 'react';
import { X, Upload, Check, Image as ImageIcon, Sparkles, Plus } from 'lucide-react';
import { StickerItem } from '../../data/emojisAndStickers';

interface CreateStickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSticker: (sticker: StickerItem) => void;
}

export const CreateStickerModal: React.FC<CreateStickerModalProps> = ({
  isOpen,
  onClose,
  onAddSticker,
}) => {
  const [name, setName] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPack, setSelectedPack] = useState('custom-stickers');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
      if (!name) {
        setName(file.name.replace(/\.[^/.]+$/, '').slice(0, 24));
      }
    };
    reader.readAsDataURL(file);
  };

  const sampleStickers = [
    { name: 'Sparkle Heart', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80' },
    { name: 'Cosmic Purple', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=200&auto=format&fit=crop&q=80' },
    { name: 'Happy Kitty', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) return;

    const newSticker: StickerItem = {
      id: `sticker-custom-${Date.now()}`,
      name: name.trim() || 'Custom Sticker',
      imageUrl: previewUrl,
      packId: selectedPack,
      isFavorite: true,
    };

    onAddSticker(newSticker);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[var(--rovela-surface)] border border-[var(--rovela-border)] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 px-6 border-b border-[var(--rovela-border)] flex items-center justify-between bg-[var(--rovela-surface-secondary)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[var(--rovela-text-primary)]">
                Create & Import Sticker
              </h3>
              <p className="text-[11px] text-[var(--rovela-text-secondary)]">
                Add transparent PNG or photo sticker to Rovela
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Upload Area / Preview */}
          <div>
            <label className="block text-xs font-bold text-[var(--rovela-text-primary)] mb-2">
              Sticker Artwork
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative group w-full h-44 rounded-2xl bg-[var(--rovela-surface-secondary)] border-2 border-dashed border-purple-500/40 flex items-center justify-center overflow-hidden p-4">
                <img
                  src={previewUrl}
                  alt="Sticker Preview"
                  className="max-h-36 max-w-36 object-contain rounded-xl drop-shadow-xl"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity cursor-pointer"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-44 rounded-2xl bg-[var(--rovela-surface-secondary)] border-2 border-dashed border-[var(--rovela-border)] hover:border-purple-500/50 flex flex-col items-center justify-center gap-2 text-[var(--rovela-text-secondary)] hover:text-purple-600 transition-all cursor-pointer p-4 text-center"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Select an image from device</span>
                <span className="text-[10px] text-[var(--rovela-text-muted)]">
                  PNG, JPG, or WEBP with transparent background recommended
                </span>
              </button>
            )}
          </div>

          {/* Quick preset selection */}
          {!previewUrl && (
            <div>
              <span className="text-[11px] font-semibold text-[var(--rovela-text-muted)] block mb-1.5">
                Or pick a starter sample:
              </span>
              <div className="flex gap-2">
                {sampleStickers.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPreviewUrl(sample.url);
                      setName(sample.name);
                    }}
                    className="flex-1 p-2 rounded-xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] hover:border-purple-500/40 flex flex-col items-center gap-1.5 cursor-pointer text-center group"
                  >
                    <img
                      src={sample.url}
                      alt={sample.name}
                      className="w-10 h-10 rounded-lg object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="text-[10px] font-medium text-[var(--rovela-text-secondary)] truncate w-full">
                      {sample.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-[var(--rovela-text-primary)] mb-1.5">
              Sticker Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Happy Cheers"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-xs text-[var(--rovela-text-primary)] placeholder-[var(--rovela-text-muted)] focus:outline-none focus:border-purple-500"
              maxLength={32}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--rovela-border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!previewUrl}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Sticker</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
