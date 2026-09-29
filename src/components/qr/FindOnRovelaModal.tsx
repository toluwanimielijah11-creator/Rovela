import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar } from '../ui/Avatar';
import {
  X,
  Search,
  AtSign,
  UserPlus,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';

interface FindOnRovelaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const FindOnRovelaModal: React.FC<FindOnRovelaModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
}) => {
  const {
    currentUser,
    users,
    contacts,
    openUserProfile,
    openAddContact,
    createDirectConversation,
    getContactForUser,
  } = useChat();

  const [query, setQuery] = useState(initialQuery);

  const cleanQuery = query.replace('@', '').toLowerCase().trim();

  // Search through all available Rovela users from database
  const searchResults = useMemo(() => {
    if (!cleanQuery) {
      return users.filter((u) => u.id !== currentUser.id).slice(0, 4);
    }
    return users.filter(
      (u) =>
        u.id !== currentUser.id &&
        (u.username.toLowerCase().includes(cleanQuery) ||
          u.name.toLowerCase().includes(cleanQuery) ||
          (u.email && u.email.toLowerCase().includes(cleanQuery)))
    );
  }, [cleanQuery, currentUser.id, users]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg bg-[var(--rovela-surface)] border border-[var(--rovela-border)] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[var(--rovela-border)] flex items-center justify-between bg-[var(--rovela-surface-secondary)]">
            <div>
              <h2 className="text-base font-extrabold text-[var(--rovela-text-primary)]">
                Find Someone on Rovela
              </h2>
              <p className="text-xs text-[var(--rovela-text-secondary)]">
                Search by unique Rovela ID (@username) or name
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-all cursor-pointer"
              aria-label="Close find modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="p-4 border-b border-[var(--rovela-border)] bg-[var(--rovela-surface)]">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-purple-400" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter @username or full name..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-sm font-semibold text-[var(--rovela-text-primary)] placeholder:text-[var(--rovela-text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 text-[var(--rovela-text-muted)] hover:text-[var(--rovela-text-primary)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2 px-1 text-[11px] text-[var(--rovela-text-muted)]">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Try: @sarahw, @marcusv, @elena, @davidk, @aishar</span>
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {searchResults.length === 0 ? (
              <div className="py-12 text-center">
                <AtSign className="w-10 h-10 text-purple-400/40 mx-auto mb-2" />
                <p className="text-sm font-bold text-[var(--rovela-text-primary)]">
                  No Rovela user found for "{query}"
                </p>
                <p className="text-xs text-[var(--rovela-text-secondary)] mt-1 max-w-xs mx-auto">
                  Check the spelling of the Rovela ID or try searching by full name.
                </p>
              </div>
            ) : (
              searchResults.map((user) => {
                const contactRecord = getContactForUser(user.id);
                const isSaved = Boolean(contactRecord);

                return (
                  <div
                    key={user.id}
                    className="p-3.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] hover:border-purple-500/40 transition-all flex items-center justify-between gap-3 group"
                  >
                    {/* User Info */}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        openUserProfile(user.id);
                      }}
                      className="flex items-center gap-3 min-w-0 text-left flex-1 cursor-pointer"
                    >
                      <div className="relative shrink-0">
                        <Avatar
                          src={user.avatar_url}
                          name={user.name}
                          size="md"
                          className="w-12 h-12 rounded-2xl ring-2 ring-purple-500/20"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[var(--rovela-surface)] ${
                            user.status_state === 'online'
                              ? 'bg-emerald-500'
                              : user.status_state === 'busy'
                              ? 'bg-amber-500'
                              : 'bg-zinc-400'
                          }`}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-[var(--rovela-text-primary)] truncate group-hover:text-purple-400 transition-colors">
                            {user.name}
                          </h4>
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          {isSaved && (
                            <span className="px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-[10px] font-bold shrink-0">
                              Saved
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-purple-400 truncate">
                          @{user.username}
                        </p>
                        <p className="text-xs text-[var(--rovela-text-secondary)] truncate mt-0.5">
                          {user.status_text || user.bio || 'Rovela member'}
                        </p>
                      </div>
                    </button>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          createDirectConversation(user.id);
                        }}
                        className="w-9 h-9 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 flex items-center justify-center transition-colors cursor-pointer"
                        title="Send Message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      {!isSaved ? (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            openAddContact({
                              name: user.name,
                              username: user.username,
                              email: user.email,
                              phone: user.phone,
                            });
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/20 cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            openUserProfile(user.id);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] text-xs font-semibold text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
