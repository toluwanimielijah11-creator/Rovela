import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { ChatListItem } from './ChatListItem';
import { Tabs, TabItem } from '../ui/Tabs';
import { StatusStoriesBar } from '../status/StatusStoriesBar';
import { EmptyState } from '../common/EmptyState';
import { Avatar } from '../ui/Avatar';
import { RovelaLogo } from '../ui/RovelaLogo';
import { ChatFilter } from '../../types';
import {
  Search,
  MoreVertical,
  ArrowLeft,
  X,
  Plus,
  MessageSquarePlus,
  Users,
  UserPlus,
  Archive,
  Pin,
  CheckCheck,
  Settings as SettingsIcon,
  Lock,
  ChevronRight,
  MessageSquareDashed,
  FolderKanban,
  FileText,
  User,
  Trash2,
  BellOff,
  Ban,
} from 'lucide-react';

interface ChatListProps {
  onOpenNewChat: () => void;
  onOpenCreateGroup: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  onOpenNewChat,
  onOpenCreateGroup,
}) => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    markConversationAsRead,
    togglePinConversation,
    toggleArchiveConversation,
    toggleMuteConversation,
    clearChatMessages,
    blockUser,
    chatFilter,
    setChatFilter,
    searchQuery,
    setSearchQuery,
    lockedChatsUnlocked,
    setActiveSection,
    currentUser,
    users,
    showToast,
    openStatusTextEditor,
    createDirectConversation,
  } = useChat();

  const [selectedChatIds, setSelectedChatIds] = useState<Set<string>>(new Set());
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchCategory, setSearchCategory] = useState<
    'all' | 'people' | 'messages' | 'groups' | 'files' | 'conversations'
  >('all');
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);

  const headerMenuRef = useRef<HTMLDivElement>(null);
  const fabMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleToggleSelectChat = (id: string) => {
    setSelectedChatIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleStartSelectChat = (id: string) => {
    setSelectedChatIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedChatIds(new Set());
  };

  const handlePinSelected = () => {
    selectedChatIds.forEach((id) => togglePinConversation(id));
    showToast(`${selectedChatIds.size} chat${selectedChatIds.size > 1 ? 's' : ''} updated`);
    handleClearSelection();
  };

  const handleArchiveSelected = () => {
    selectedChatIds.forEach((id) => toggleArchiveConversation(id));
    showToast(`${selectedChatIds.size} chat${selectedChatIds.size > 1 ? 's' : ''} archived`);
    handleClearSelection();
  };

  const handleMuteSelected = () => {
    selectedChatIds.forEach((id) => toggleMuteConversation(id));
    showToast(`${selectedChatIds.size} chat${selectedChatIds.size > 1 ? 's' : ''} muted/unmuted`);
    handleClearSelection();
  };

  const handleMarkReadSelected = () => {
    selectedChatIds.forEach((id) => markConversationAsRead(id));
    showToast(`${selectedChatIds.size} chat${selectedChatIds.size > 1 ? 's' : ''} marked as read`);
    handleClearSelection();
  };

  const handleClearSelected = () => {
    selectedChatIds.forEach((id) => clearChatMessages(id));
    showToast(`${selectedChatIds.size} chat${selectedChatIds.size > 1 ? 's' : ''} cleared`);
    handleClearSelection();
  };

  const handleBlockSelected = () => {
    if (selectedChatIds.size === 1) {
      const id = Array.from(selectedChatIds)[0];
      const conv = conversations.find((c) => c.id === id);
      if (conv && conv.type === 'direct') {
        const partnerId = conv.participant_ids.find((pid) => pid !== currentUser.id);
        if (partnerId) {
          blockUser(partnerId);
          showToast('User blocked');
        }
      }
    }
    handleClearSelection();
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(e.target as Node)) {
        setIsHeaderMenuOpen(false);
      }
      if (fabMenuRef.current && !fabMenuRef.current.contains(e.target as Node)) {
        setIsFabMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when activated
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  // Count locked conversations
  const lockedCount = conversations.filter((c) => c.is_locked).length;

  // Filter conversations
  const filteredConversations = conversations
    .filter((conv) => {
      if (conv.is_locked && !lockedChatsUnlocked) {
        return false;
      }
      if (chatFilter === 'archived') {
        return !!conv.is_archived;
      }
      if (conv.is_archived) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = conv.title ? conv.title.toLowerCase().includes(q) : false;
        const matchMessage = conv.last_message?.content
          ? conv.last_message.content.toLowerCase().includes(q)
          : false;

        if (searchCategory === 'groups' && conv.type !== 'group') return false;
        if (searchCategory === 'conversations' && conv.type !== 'direct') return false;
        if (searchCategory === 'messages' && !matchMessage) return false;

        if (!matchTitle && !matchMessage) return false;
      }

      switch (chatFilter) {
        case 'unread':
          return conv.unread_count > 0;
        case 'direct':
          return conv.type === 'direct';
        case 'groups':
          return conv.type === 'group';
        case 'pinned':
          return !!conv.is_pinned;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      if (chatFilter === 'archived') return 0;
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return 0;
    });

  // Matching people for expanded search results
  const matchingPeople = searchQuery.trim()
    ? users.filter(
        (u) =>
          u.id !== currentUser.id &&
          (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.username.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const unreadCount = conversations.filter((c) => !c.is_archived && c.unread_count > 0).length;
  const archivedCount = conversations.filter((c) => c.is_archived).length;

  const tabs: TabItem[] = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread', count: unreadCount > 0 ? unreadCount : undefined },
    { id: 'direct', label: 'Direct' },
    { id: 'groups', label: 'Groups' },
    { id: 'pinned', label: 'Pinned' },
    { id: 'archived', label: 'Archived', count: archivedCount > 0 ? archivedCount : undefined },
  ];

  const handleMarkAllRead = () => {
    conversations.forEach((conv) => {
      if (conv.unread_count > 0) {
        markConversationAsRead(conv.id);
      }
    });
    setIsHeaderMenuOpen(false);
    showToast('All conversations marked as read', undefined, 'success');
  };

  return (
    <div className="relative flex flex-col h-full bg-[var(--rovela-surface)] backdrop-blur-md select-none border-r border-[var(--rovela-border)]">
      {/* ========================================================================= */}
      {/* 4. CHAT SCREEN TOP HEADER / SELECTION BAR / 5. CHAT SEARCH                */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-4.5 pb-2 flex flex-col gap-2.5">
        {selectedChatIds.size > 0 ? (
          /* Selection Action Bar */
          <div className="flex items-center justify-between py-1.5 px-2 bg-purple-500/10 rounded-2xl border border-purple-500/25 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearSelection}
                className="p-1.5 rounded-xl text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] cursor-pointer active:scale-95 transition-all"
                title="Cancel selection"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-300">
                {selectedChatIds.size} selected
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePinSelected}
                className="p-2 rounded-xl text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-all active:scale-95"
                title="Pin / Unpin"
              >
                <Pin className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleArchiveSelected}
                className="p-2 rounded-xl text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-all active:scale-95"
                title="Archive"
              >
                <Archive className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleMuteSelected}
                className="p-2 rounded-xl text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-all active:scale-95"
                title="Mute / Unmute"
              >
                <BellOff className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleMarkReadSelected}
                className="p-2 rounded-xl text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-all active:scale-95"
                title="Mark as Read"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleClearSelected}
                className="p-2 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer transition-all active:scale-95"
                title="Clear messages"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {selectedChatIds.size === 1 && (
                <button
                  type="button"
                  onClick={handleBlockSelected}
                  className="p-2 rounded-xl text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 cursor-pointer transition-all active:scale-95"
                  title="Block contact"
                >
                  <Ban className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : isSearchActive ? (
          /* 5. Expanded Chat Search Header */
          <div className="space-y-2.5 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsSearchActive(false);
                  setSearchQuery('');
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] active:scale-95 transition-all cursor-pointer"
                aria-label="Back to conversations"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--rovela-text-muted)]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search people, chats and messages"
                  className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-[var(--rovela-text-primary)] placeholder-[var(--rovela-text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/30 shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--rovela-text-muted)] hover:text-[var(--rovela-text-primary)]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Category Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'people', label: 'People' },
                  { id: 'messages', label: 'Messages' },
                  { id: 'groups', label: 'Groups' },
                  { id: 'files', label: 'Files' },
                  { id: 'conversations', label: 'Conversations' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSearchCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    searchCategory === cat.id
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-[var(--rovela-surface-secondary)] text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        ) : chatFilter === 'archived' ? (
          /* Dedicated Archived Chats Header with Back button */
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setChatFilter('all')}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] active:scale-90 transition-all cursor-pointer"
                title="Back to all chats"
                aria-label="Back to all chats"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-black tracking-tight text-[var(--rovela-text-primary)] flex items-center gap-2">
                  <span>Archived Chats</span>
                </h2>
                <p className="text-[11px] font-medium text-purple-600 dark:text-purple-400">
                  {filteredConversations.length} archived conversation{filteredConversations.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSearchActive(true)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)] active:scale-90 transition-all cursor-pointer"
              aria-label="Search archived"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        ) : (
          /* 4. Normal Top Header: Left: Rovela (with avatar shortcut), Right: Search, More */
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar profile shortcut */}
              <button
                type="button"
                onClick={() => setActiveSection('profile')}
                className="relative rounded-full focus:outline-none active:scale-95 transition-transform cursor-pointer"
                title="View Profile"
              >
                <Avatar
                  src={currentUser.avatar_url}
                  name={currentUser.name}
                  size="sm"
                  status="online"
                  showStatus
                />
              </button>
              <div>
                <h2 className="text-xl font-black tracking-tight text-[var(--rovela-text-primary)] flex items-center gap-1.5">
                  <span>Rovela</span>
                </h2>
                <p className="text-[11px] font-medium text-purple-600 dark:text-purple-400">
                  {filteredConversations.length} conversation{filteredConversations.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            {/* Right Header Actions: 🔍 Search, ⋮ More */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsSearchActive(true)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)] active:scale-90 transition-all cursor-pointer"
                aria-label="Search"
                title="Search people, chats and messages"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* More Menu Trigger */}
              <div className="relative" ref={headerMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)] active:scale-90 transition-all cursor-pointer"
                  aria-label="More Options"
                  title="More Options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {/* More Menu Dropdown */}
                {isHeaderMenuOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-10 z-40 w-52 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] shadow-2xl py-1.5 text-xs text-[var(--rovela-text-primary)] animate-in fade-in zoom-in-95 duration-100"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setChatFilter('archived');
                        setIsHeaderMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                    >
                      <Archive className="w-4 h-4 text-purple-500" />
                      <span>Archived Chats</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setChatFilter('pinned');
                        setIsHeaderMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                    >
                      <Pin className="w-4 h-4 text-purple-500" />
                      <span>Starred & Pinned</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                    >
                      <CheckCheck className="w-4 h-4 text-emerald-500" />
                      <span>Mark all as read</span>
                    </button>

                    <div className="h-[1px] bg-[var(--rovela-border)] my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection('settings');
                        setIsHeaderMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                    >
                      <SettingsIcon className="w-4 h-4 text-[var(--rovela-text-muted)]" />
                      <span>Settings</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Regular Filter Tabs (Hidden when search active) */}
        {!isSearchActive && (
          <Tabs
            tabs={tabs}
            activeTab={chatFilter}
            onChange={(id) => setChatFilter(id as ChatFilter)}
            variant="pill"
          />
        )}
      </div>

      {/* Prominent Status Entry (Stories Bar): My Status / Add Status + Recent Updates */}
      {!isSearchActive && chatFilter !== 'archived' && (
        <div className="shrink-0">
          <StatusStoriesBar onAddStatus={openStatusTextEditor} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. CHAT LIST STREAM / CATEGORIZED SEARCH RESULTS                           */}
      {/* ========================================================================= */}
      <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-1">
        {/* If in search mode and "people" or "all" matches exist */}
        {isSearchActive && searchQuery.trim() && (searchCategory === 'all' || searchCategory === 'people') && matchingPeople.length > 0 && (
          <div className="mb-3">
            <p className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              People ({matchingPeople.length})
            </p>
            <div className="space-y-1">
              {matchingPeople.map((person) => (
                <div
                  key={person.id}
                  onClick={() => {
                    const convId = createDirectConversation(person.id);
                    setActiveConversationId(convId);
                    setIsSearchActive(false);
                    setSearchQuery('');
                  }}
                  className="p-2.5 rounded-2xl hover:bg-[var(--rovela-surface-hover)] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={person.avatar_url}
                      name={person.name}
                      size="sm"
                      status={person.status_state}
                      showStatus
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[var(--rovela-text-primary)]">
                        {person.name}
                      </h4>
                      <p className="text-[11px] text-purple-600 dark:text-purple-400">
                        @{person.username}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                    Message
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Chats Vault access tile (Screen 15) */}
        {lockedCount > 0 && !lockedChatsUnlocked && chatFilter === 'all' && !isSearchActive && (
          <div
            onClick={() => setActiveSection('locked-chats')}
            className="mb-2 p-3 rounded-2xl bg-purple-500/10 hover:bg-purple-500/15 border border-purple-500/20 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--rovela-text-primary)]">
                  Locked Chats
                </p>
                <p className="text-[11px] text-[var(--rovela-text-secondary)]">
                  {lockedCount} protected conversation{lockedCount > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-purple-600 dark:text-purple-400">
              <span>Unlock</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Conversation rows */}
        {filteredConversations.length > 0 ? (
          <>
            {isSearchActive && searchQuery.trim() && (
              <p className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Conversations & Messages ({filteredConversations.length})
              </p>
            )}
            {filteredConversations.map((conv) => (
              <ChatListItem
                key={conv.id}
                conversation={conv}
                isActive={activeConversationId === conv.id}
                isSelectionMode={selectedChatIds.size > 0}
                isSelected={selectedChatIds.has(conv.id)}
                onToggleSelect={() => handleToggleSelectChat(conv.id)}
                onLongPress={() => handleStartSelectChat(conv.id)}
                onClick={() => {
                  setActiveConversationId(conv.id);
                  if (conv.unread_count > 0) {
                    markConversationAsRead(conv.id);
                  }
                }}
              />
            ))}
          </>
        ) : (
          <div className="py-12">
            {searchQuery ? (
              <EmptyState
                icon={<MessageSquareDashed className="w-7 h-7" />}
                title="No results found"
                description={`We couldn't find any chats matching "${searchQuery}".`}
                actionLabel="Clear search"
                onAction={() => setSearchQuery('')}
              />
            ) : chatFilter === 'unread' ? (
              <EmptyState
                icon={<MessageSquareDashed className="w-7 h-7" />}
                title="All caught up!"
                description="You have read all incoming messages."
                actionLabel="View all chats"
                onAction={() => setChatFilter('all')}
              />
            ) : chatFilter === 'pinned' ? (
              <EmptyState
                icon={<Pin className="w-7 h-7" />}
                title="No pinned chats"
                description="Hover over any conversation and select 'Pin to top' for quick access."
                actionLabel="View all chats"
                onAction={() => setChatFilter('all')}
              />
            ) : chatFilter === 'archived' ? (
              <EmptyState
                icon={<Archive className="w-7 h-7" />}
                title="No archived conversations"
                description="Chats you archive will be stored here to keep your active inbox clean."
                actionLabel="View active chats"
                onAction={() => setChatFilter('all')}
              />
            ) : (
              <EmptyState
                icon={<MessageSquarePlus className="w-7 h-7" />}
                title="No conversations yet"
                description="Start a direct chat with a teammate or create a group channel."
                actionLabel="Start a conversation"
                onAction={onOpenNewChat}
              />
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 8. NEW CHAT / CREATE ACTION: FLOATING ACTION BUTTON (FAB)                 */}
      {/* ========================================================================= */}
      <div className="absolute right-4 bottom-5 md:bottom-6 z-30" ref={fabMenuRef}>
        {/* Start New Popover */}
        {isFabMenuOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 bottom-16 w-56 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] shadow-2xl p-2 text-xs text-[var(--rovela-text-primary)] animate-in fade-in slide-in-from-bottom-2 duration-150"
          >
            <p className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Start New
            </p>

            {/* New Conversation */}
            <button
              type="button"
              onClick={() => {
                setIsFabMenuOpen(false);
                onOpenNewChat();
              }}
              className="w-full p-2.5 rounded-xl flex items-center gap-3 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                <MessageSquarePlus className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-[var(--rovela-text-primary)]">New Conversation</p>
                <p className="text-[10px] text-[var(--rovela-text-secondary)]">Direct message with someone</p>
              </div>
            </button>

            {/* New Group */}
            <button
              type="button"
              onClick={() => {
                setIsFabMenuOpen(false);
                onOpenCreateGroup();
              }}
              className="w-full p-2.5 rounded-xl flex items-center gap-3 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-[var(--rovela-text-primary)]">New Group</p>
                <p className="text-[10px] text-[var(--rovela-text-secondary)]">Collaborate with multiple people</p>
              </div>
            </button>

            {/* New Contact */}
            <button
              type="button"
              onClick={() => {
                setIsFabMenuOpen(false);
                setActiveSection('contacts');
              }}
              className="w-full p-2.5 rounded-xl flex items-center gap-3 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-[var(--rovela-text-primary)]">New Contact</p>
                <p className="text-[10px] text-[var(--rovela-text-secondary)]">Add or import contacts</p>
              </div>
            </button>
          </div>
        )}

        {/* Floating Button Trigger */}
        <button
          type="button"
          onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
          aria-label="Start New"
          title="Start New"
          className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center shadow-[0_6px_20px_rgba(124,58,237,0.45)] hover:shadow-[0_8px_25px_rgba(124,58,237,0.6)] active:scale-95 transition-all cursor-pointer"
        >
          <Plus
            className={`w-6 h-6 transition-transform duration-200 ${
              isFabMenuOpen ? 'rotate-45' : 'rotate-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

