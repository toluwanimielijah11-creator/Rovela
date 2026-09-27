import React, { useState, useMemo } from 'react';
import { EMOJI_CATEGORIES } from '../../data/emojisAndStickers';
import { Search, X, Clock } from 'lucide-react';

interface AllReactionsPickerProps {
  onSelectReaction: (emoji: string) => void;
  onClose: () => void;
  recentReactions?: string[];
  align?: 'left' | 'right' | 'center';
}

export const AllReactionsPicker: React.FC<AllReactionsPickerProps> = ({
  onSelectReaction,
  onClose,
  recentReactions = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '🎉'],
  align = 'center',
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('smileys');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEmojis = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    const matched: string[] = [];
    EMOJI_CATEGORIES.forEach((cat) => {
      cat.emojis.forEach((emoji) => {
        if (!matched.includes(emoji)) {
          matched.push(emoji);
        }
      });
    });
    return matched.slice(0, 70);
  }, [searchQuery]);

  const currentCategoryObj = useMemo(() => {
    return EMOJI_CATEGORIES.find((c) => c.id === activeCategory) || EMOJI_CATEGORIES[0];
  }, [activeCategory]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`w-80 sm:w-88 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] shadow-2xl overflow-hidden flex flex-col z-50 text-[var(--rovela-text-primary)] animate-in zoom-in-95 duration-150 ${
        align === 'right' ? 'right-0' : align === 'left' ? 'left-0' : 'left-1/2 -translate-x-1/2'
      }`}
    >
      {/* Search & Header */}
      <div className="p-3 border-b border-[var(--rovela-border)] flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-xs">
          <Search className="w-3.5 h-3.5 text-[var(--rovela-text-muted)] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search emoji reactions..."
            className="w-full bg-transparent text-[var(--rovela-text-primary)] placeholder-[var(--rovela-text-muted)] focus:outline-none"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[var(--rovela-text-muted)] hover:text-[var(--rovela-text-primary)]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-[var(--rovela-text-muted)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Category Tabs */}
      {!searchQuery && (
        <div className="px-2 pt-2 flex items-center justify-between border-b border-[var(--rovela-border)] overflow-x-auto no-scrollbar">
          {EMOJI_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`p-1.5 rounded-lg text-sm transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-purple-500/15 scale-110'
                  : 'opacity-60 hover:opacity-100 hover:bg-[var(--rovela-surface-hover)]'
              }`}
              title={cat.label}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      )}

      {/* Emoji Body Grid */}
      <div className="p-3 max-h-56 overflow-y-auto custom-scrollbar">
        {/* Search Results */}
        {searchQuery ? (
          <div>
            <div className="text-[11px] font-bold text-[var(--rovela-text-secondary)] mb-2">
              Search Results
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {filteredEmojis?.map((emoji, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onSelectReaction(emoji);
                    onClose();
                  }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg hover:bg-[var(--rovela-surface-hover)] active:scale-125 transition-all cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Recent Reactions */}
            {recentReactions.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--rovela-text-secondary)] mb-2">
                  <Clock className="w-3 h-3 text-purple-500" />
                  <span>Recent</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {recentReactions.map((emoji, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onSelectReaction(emoji);
                        onClose();
                      }}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-base hover:bg-[var(--rovela-surface-hover)] active:scale-125 transition-all cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Current Category */}
            <div>
              <div className="text-[11px] font-bold text-[var(--rovela-text-secondary)] mb-2">
                {currentCategoryObj.label}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {currentCategoryObj.emojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onSelectReaction(emoji);
                      onClose();
                    }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg hover:bg-[var(--rovela-surface-hover)] active:scale-125 transition-all cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
