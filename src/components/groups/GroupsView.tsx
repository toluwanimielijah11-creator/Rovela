import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { EmptyState } from '../common/EmptyState';
import {
  Users,
  Plus,
  Shield,
  MessageSquare,
  ArrowRight,
  Search,
  Hash,
  Globe,
  Lock,
  Compass,
} from 'lucide-react';

interface GroupsViewProps {
  onOpenCreateGroup: () => void;
}

export const GroupsView: React.FC<GroupsViewProps> = ({ onOpenCreateGroup }) => {
  const {
    conversations,
    currentUser,
    setActiveConversationId,
    setActiveSection,
    showToast,
  } = useChat();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'my' | 'discover'>('my');

  // Real group conversations
  const myGroups = conversations.filter((c) => c.type === 'group');
  const [joinedGroupIds, setJoinedGroupIds] = useState<Set<string>>(new Set());

  const discoverableGroups = myGroups.map((c) => ({
    id: c.id,
    title: c.title,
    topic: c.description || 'Public Channel',
    member_count: Math.max(1, c.participant_ids?.length || 1),
    avatar_url: c.avatar_url || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=100&auto=format&fit=crop&q=80',
    description: c.description || 'Discussion group on Rovela.',
    is_joined: c.participant_ids?.includes(currentUser.id) || joinedGroupIds.has(c.id),
  }));

  const filteredMyGroups = myGroups.filter((g) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return g.title.toLowerCase().includes(q) || (g.description && g.description.toLowerCase().includes(q));
  });

  const filteredDiscoverable = discoverableGroups.filter((g) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      g.title.toLowerCase().includes(q) ||
      g.topic.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q)
    );
  });

  const handleJoinDiscoverable = (groupId: string) => {
    setJoinedGroupIds((prev) => new Set([...prev, groupId]));
    showToast('Joined group successfully', undefined, 'success');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--rovela-surface)] overflow-hidden select-none">
      {/* Top Header matching Section 14 */}
      <div className="p-4 sm:p-6 border-b border-[var(--rovela-border)] bg-[var(--rovela-surface)] flex flex-col gap-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[var(--rovela-text-primary)]">
              Groups
            </h2>
            <p className="text-xs text-[var(--rovela-text-secondary)] mt-0.5">
              Discover public communities and manage project channels
            </p>
          </div>

          {/* PRIMARY ACTION: Create Group */}
          <button
            type="button"
            onClick={onOpenCreateGroup}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-[0_2px_10px_rgba(124,58,237,0.35)] transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Group</span>
          </button>
        </div>

        {/* 🔍 Search groups */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[var(--rovela-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search groups by name, topic, or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] focus:border-purple-500 focus:outline-none text-[var(--rovela-text-primary)] placeholder:[var(--rovela-text-muted)] transition-all"
          />
        </div>

        {/* LIST: My Groups vs Public / Discoverable Groups */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('my')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'my'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[var(--rovela-surface-secondary)] text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>My Groups ({myGroups.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('discover')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'discover'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[var(--rovela-surface-secondary)] text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Public / Discoverable Groups ({discoverableGroups.length})</span>
          </button>
        </div>
      </div>

      {/* Main List Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-4xl mx-auto w-full">
        {activeTab === 'my' ? (
          filteredMyGroups.length > 0 ? (
            /* ========================================================================= */
            /* SECTION 14 ROW ITEMS: Group Avatar, Group Name, Topic/Category, Member count, Action: Join OR Open */
            /* ========================================================================= */
            <div className="divide-y divide-[var(--rovela-border)] rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] overflow-hidden">
              {filteredMyGroups.map((group) => {
                const isAdmin = group.admin_ids?.includes(currentUser.id);

                return (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-[var(--rovela-surface-hover)] transition-colors"
                  >
                    {/* Left: Avatar & Info */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Avatar
                        src={group.avatar_url}
                        name={group.title}
                        size="md"
                        isGroup
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold truncate leading-tight text-[var(--rovela-text-primary)]">
                            {group.title}
                          </h4>
                          {isAdmin && (
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center gap-1">
                              <Shield className="w-2.5 h-2.5" />
                              Admin
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--rovela-text-secondary)]">
                          <span className="font-semibold text-purple-600 dark:text-purple-400">
                            Channel
                          </span>
                          <span>•</span>
                          <span>{group.participant_ids.length} members</span>
                        </div>

                        {group.description && (
                          <p className="text-[11px] text-[var(--rovela-text-secondary)] truncate mt-0.5 max-w-md">
                            {group.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Action: Open */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveConversationId(group.id);
                        setActiveSection('chats');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0 ml-3"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={<Users className="w-7 h-7" />}
              title="No groups found"
              description={
                search
                  ? `No groups matched "${search}".`
                  : 'You have not joined any group channels yet.'
              }
              actionLabel="Create Group"
              onAction={onOpenCreateGroup}
            />
          )
        ) : (
          /* Public / Discoverable Groups List */
          filteredDiscoverable.length > 0 ? (
            <div className="divide-y divide-[var(--rovela-border)] rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] overflow-hidden">
              {filteredDiscoverable.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-[var(--rovela-surface-hover)] transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Avatar
                      src={group.avatar_url}
                      name={group.title}
                      size="md"
                      isGroup
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold truncate leading-tight text-[var(--rovela-text-primary)]">
                          {group.title}
                        </h4>
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          Public
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--rovela-text-secondary)]">
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                          {group.topic}
                        </span>
                        <span>•</span>
                        <span>{group.member_count} members</span>
                      </div>

                      <p className="text-[11px] text-[var(--rovela-text-secondary)] truncate mt-0.5 max-w-md">
                        {group.description}
                      </p>
                    </div>
                  </div>

                  {/* Action: Join OR Open */}
                  {group.is_joined ? (
                    <button
                      type="button"
                      onClick={() => showToast('Already in group', undefined, 'info')}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-300 text-xs font-bold transition-all shrink-0 ml-3"
                    >
                      Joined
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleJoinDiscoverable(group.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0 ml-3"
                    >
                      <span>Join</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Globe className="w-7 h-7" />}
              title="No discoverable groups found"
              description="Try adjusting your search query."
              actionLabel="Clear search"
              onAction={() => setSearch('')}
            />
          )
        )}
      </div>
    </div>
  );
};
