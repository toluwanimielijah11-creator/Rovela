import React, { useState, useMemo } from 'react';
import { EMOJI_CATEGORIES, StickerItem, StickerPack, INITIAL_STICKER_PACKS } from '../../data/emojisAndStickers';
import { Search, X, Smile, Star, Plus, Sparkles, Image as ImageIcon, Flame } from 'lucide-react';
import { CreateStickerModal } from '../modals/CreateStickerModal';

interface EmojiAndStickerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
  onSendSticker: (stickerUrl: string, name: string) => void;
}

export const EmojiAndStickerDrawer: React.FC<EmojiAndStickerDrawerProps> = ({
  isOpen,
  onClose,
  onSelectEmoji,
  onSendSticker,
}) => {
  const [activeTab, setActiveTab] = useState<'emoji' | 'stickers' | 'gifs'>('emoji');
  const [activeCategory, setActiveCategory] = useState<string>('smileys');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stickerPacks, setStickerPacks] = useState<StickerPack[]>(() => {
    const saved = localStorage.getItem('rovela_sticker_packs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_STICKER_PACKS;
  });
  const [activeStickerPackId, setActiveStickerPackId] = useState<string>('rovela-vibes');
  const [isCreateStickerOpen, setIsCreateStickerOpen] = useState(false);

  // Sample curated GIFs
  const sampleGifs = [
    { title: 'Happy Dance', url: 'https://media.giphy.com/media/blSTtZehjAZ8I/giphy.gif' },
    { title: 'Thumbs Up', url: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif' },
    { title: 'Applause', url: 'https://media.giphy.com/media/l4q8cJzGdR9J8w3hS/giphy.gif' },
    { title: 'Excited', url: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif' },
    { title: 'High Five', url: 'https://media.giphy.com/media/pHb82xtBPfqEg/giphy.gif' },
    { title: 'Mind Blown', url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' },
  ];

  if (!isOpen) return null;

  const handleAddCustomSticker = (newSticker: StickerItem) => {
    setStickerPacks((prev) => {
      let customPack = prev.find((p) => p.id === 'custom-stickers');
      let updated: StickerPack[];
      if (customPack) {
        updated = prev.map((p) =>
          p.id === 'custom-stickers'
            ? { ...p, stickers: [newSticker, ...p.stickers] }
            : p
        );
      } else {
        const newPack: StickerPack = {
          id: 'custom-stickers',
          name: 'My Stickers',
          icon: '✨',
          stickers: [newSticker],
        };
        updated = [...prev, newPack];
      }
      localStorage.setItem('rovela_sticker_packs', JSON.stringify(updated));
      return updated;
    });
    setActiveStickerPackId('custom-stickers');
  };

  const activeStickerPack = stickerPacks.find((p) => p.id === activeStickerPackId) || stickerPacks[0];

  return (
    <>
      <CreateStickerModal
        isOpen={isCreateStickerOpen}
        onClose={() => setIsCreateStickerOpen(false)}
        onAddSticker={handleAddCustomSticker}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[var(--rovela-surface)] border border-[var(--rovela-border)] rounded-3xl shadow-2xl overflow-hidden flex flex-col mb-2 animate-in slide-in-from-bottom-3 duration-150 z-30"
      >
        {/* Top Segmented Navigation: EMOJI / STICKERS / GIFS */}
        <div className="p-3 border-b border-[var(--rovela-border)] flex items-center justify-between bg-[var(--rovela-surface-secondary)]/50">
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)]">
            <button
              type="button"
              onClick={() => setActiveTab('emoji')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'emoji'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)]'
              }`}
            >
              <span>😀</span>
              <span>Emoji</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('stickers')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'stickers'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Stickers</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gifs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'gifs'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>GIFs</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. EMOJI TAB */}
        {activeTab === 'emoji' && (
          <div className="flex flex-col">
            {/* Search Bar */}
            <div className="p-3 pb-2 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-xs">
                <Search className="w-3.5 h-3.5 text-[var(--rovela-text-muted)] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search emoji library..."
                  className="w-full bg-transparent text-[var(--rovela-text-primary)] placeholder-[var(--rovela-text-muted)] focus:outline-none"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3 text-[var(--rovela-text-muted)]" />
                  </button>
                )}
              </div>
            </div>

            {/* Category selector */}
            {!searchQuery && (
              <div className="px-3 py-1 flex items-center justify-between border-b border-[var(--rovela-border)] overflow-x-auto no-scrollbar">
                {EMOJI_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`p-1.5 rounded-xl text-base transition-all cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-purple-500/20 scale-110'
                        : 'opacity-60 hover:opacity-100 hover:bg-[var(--rovela-surface-hover)]'
                    }`}
                    title={cat.label}
                  >
                    {cat.icon}
                  </button>
                ))}
              </div>
            )}

            {/* Emoji Grid */}
            <div className="p-3 h-52 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-8 sm:grid-cols-10 gap-1">
                {(searchQuery
                  ? EMOJI_CATEGORIES.flatMap((c) => c.emojis).filter((e, idx, arr) => arr.indexOf(e) === idx)
                  : EMOJI_CATEGORIES.find((c) => c.id === activeCategory)?.emojis || []
                ).map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectEmoji(emoji)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xl hover:bg-[var(--rovela-surface-hover)] active:scale-125 transition-all cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. STICKERS TAB */}
        {activeTab === 'stickers' && (
          <div className="flex flex-col">
            {/* Pack Selector Header */}
            <div className="px-3 py-2 border-b border-[var(--rovela-border)] flex items-center justify-between">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {stickerPacks.map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => setActiveStickerPackId(pack.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeStickerPackId === pack.id
                        ? 'bg-purple-600/20 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                        : 'text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)]'
                    }`}
                  >
                    <span>{pack.icon}</span>
                    <span className="truncate max-w-[100px]">{pack.name}</span>
                  </button>
                ))}
              </div>

              {/* + Add Sticker Trigger */}
              <button
                type="button"
                onClick={() => setIsCreateStickerOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-sm hover:bg-purple-500 transition-all cursor-pointer shrink-0 ml-2"
                title="Create or import sticker"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>

            {/* Sticker Grid */}
            <div className="p-3 h-52 overflow-y-auto custom-scrollbar">
              {activeStickerPack && activeStickerPack.stickers.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {activeStickerPack.stickers.map((stk) => (
                    <button
                      key={stk.id}
                      type="button"
                      onClick={() => onSendSticker(stk.imageUrl, stk.name)}
                      className="group relative p-2 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] hover:border-purple-500/50 flex flex-col items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <img
                        src={stk.imageUrl}
                        alt={stk.name}
                        className="w-16 h-16 object-contain rounded-xl drop-shadow-md group-hover:scale-105 transition-transform"
                      />
                      <span className="text-[10px] font-medium text-[var(--rovela-text-secondary)] group-hover:text-[var(--rovela-text-primary)] truncate max-w-full">
                        {stk.name}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Sparkles className="w-8 h-8 text-purple-400 mb-2 opacity-50" />
                  <p className="text-xs font-bold text-[var(--rovela-text-primary)] mb-1">
                    No stickers yet
                  </p>
                  <p className="text-[11px] text-[var(--rovela-text-secondary)] mb-3">
                    Import photos or PNG artwork to build your collection
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCreateStickerOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold cursor-pointer"
                  >
                    + Create Sticker
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. GIFS TAB */}
        {activeTab === 'gifs' && (
          <div className="flex flex-col">
            <div className="p-3 h-56 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {sampleGifs.map((gif, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSendSticker(gif.url, gif.title)}
                    className="group relative rounded-2xl overflow-hidden aspect-video bg-black/20 hover:ring-2 hover:ring-purple-500 transition-all cursor-pointer"
                  >
                    <img
                      src={gif.url}
                      alt={gif.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent text-[10px] text-white font-bold truncate">
                      {gif.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
