import React from 'react';
import { useChat } from '../../context/ChatContext';
import { Plus } from 'lucide-react';

interface StatusStoriesBarProps {
  onAddStatus: () => void;
}

export const StatusStoriesBar: React.FC<StatusStoriesBarProps> = ({ onAddStatus }) => {
  const { currentUser, statusGroups, openStatusViewer, setActiveSection } = useChat();

  const now = Date.now();
  const validGroups = statusGroups.map((g) => ({
    ...g,
    items: g.items.filter((item) => new Date(item.expires_at).getTime() > now),
  }));

  const selfGroup = validGroups.find((g) => g.user_id === currentUser.id || g.is_self);
  const myItems = selfGroup?.items || [];
  const hasMyStatus = myItems.length > 0;

  const contactGroups = validGroups.filter(
    (g) => g.user_id !== currentUser.id && !g.is_self && g.items.length > 0 && !g.is_muted
  );

  return (
    <div
      id="status-stories-bar"
      className="px-4 py-2.5 border-b border-[var(--rovela-border)] bg-[var(--rovela-surface)]/40 flex items-center gap-3 overflow-x-auto no-scrollbar select-none"
    >
      {/* 1. Current User (My Status) Bubble */}
      <button
        type="button"
        onClick={() => {
          if (hasMyStatus && selfGroup) {
            openStatusViewer(selfGroup, 0);
          } else {
            onAddStatus();
          }
        }}
        className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer focus:outline-none"
      >
        <div className="relative">
          <div
            className={`w-13 h-13 rounded-full p-[2px] transition-transform group-hover:scale-105 ${
              hasMyStatus
                ? 'bg-gradient-to-tr from-violet-600 via-purple-500 to-pink-500 shadow-md shadow-purple-500/20'
                : 'border border-dashed border-[var(--rovela-border)]'
            }`}
          >
            <img
              src={currentUser.avatar_url}
              alt={currentUser.name}
              className="w-full h-full rounded-full object-cover ring-2 ring-[var(--rovela-surface)]"
            />
          </div>

          {!hasMyStatus ? (
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center ring-2 ring-[var(--rovela-surface)] shadow">
              <Plus className="w-3 h-3 stroke-[3]" />
            </div>
          ) : (
            <div className="absolute -bottom-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-purple-600 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-[var(--rovela-surface)] shadow">
              {myItems.length}
            </div>
          )}
        </div>
        <span className="text-[10px] font-semibold text-[var(--rovela-text-secondary)] tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400">
          {hasMyStatus ? 'Your Status' : 'Add Status'}
        </span>
      </button>

      {/* Vertical subtle divider */}
      {contactGroups.length > 0 && (
        <div className="w-[1px] h-8 bg-[var(--rovela-border)] shrink-0 my-auto" />
      )}

      {/* 2. Contact Stories */}
      {contactGroups.map((group) => (
        <button
          key={group.user_id}
          type="button"
          onClick={() => openStatusViewer(group, 0)}
          className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer focus:outline-none"
        >
          <div className="relative">
            <div
              className={`w-13 h-13 rounded-full p-[2px] transition-transform group-hover:scale-105 ${
                group.has_unread
                  ? 'bg-gradient-to-tr from-violet-600 via-purple-500 to-pink-500 shadow-md shadow-purple-500/25'
                  : 'border border-[var(--rovela-border)]'
              }`}
            >
              <img
                src={group.user_avatar}
                alt={group.user_name}
                className={`w-full h-full rounded-full object-cover ring-2 ring-[var(--rovela-surface)] ${
                  group.has_unread ? '' : 'opacity-80'
                }`}
              />
            </div>

            {group.items.length > 1 && (
              <div className="absolute -bottom-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-purple-600 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-[var(--rovela-surface)] shadow">
                {group.items.length}
              </div>
            )}
          </div>

          <span className="text-[10px] font-medium text-[var(--rovela-text-secondary)] max-w-[60px] truncate tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400">
            {group.user_name.split(' ')[0]}
          </span>
        </button>
      ))}

      {/* "View All" button navigating to Status section */}
      <button
        type="button"
        onClick={() => setActiveSection('status')}
        className="flex flex-col items-center justify-center shrink-0 w-13 h-13 rounded-full border border-dashed border-purple-500/30 hover:border-purple-500/70 hover:bg-purple-500/05 transition-all text-purple-600 dark:text-purple-400 group cursor-pointer"
        title="Open full Status view"
      >
        <span className="text-[10px] font-bold">All</span>
      </button>
    </div>
  );
};
