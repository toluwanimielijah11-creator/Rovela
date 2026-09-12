import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { UserStatusGroup, StatusPrivacy } from '../../types';
import { Avatar } from '../ui/Avatar';
import { StatusCreationSheet } from './StatusCreationSheet';
import { MediaStatusEditor } from './MediaStatusEditor';
import { TextStatusEditor } from './TextStatusEditor';
import { StatusPrivacyModal } from './StatusPrivacyModal';
import {
  Plus,
  Search,
  MoreVertical,
  Camera,
  Video,
  Type,
  ChevronDown,
  ChevronRight,
  Shield,
  VolumeX,
  Clock,
  Sparkles,
  Eye,
  AlertCircle,
  X,
} from 'lucide-react';

export const StatusView: React.FC = () => {
  const {
    currentUser,
    statusGroups,
    openStatusViewer,
    toggleMuteUserStatus,
  } = useChat();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [isMutedExpanded, setIsMutedExpanded] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [statusPrivacy, setStatusPrivacy] = useState<StatusPrivacy>('contacts');

  // Creation Sheet and Editors State
  const [isCreationSheetOpen, setIsCreationSheetOpen] = useState<boolean>(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [isMediaEditorOpen, setIsMediaEditorOpen] = useState<boolean>(false);
  const [isTextEditorOpen, setIsTextEditorOpen] = useState<boolean>(false);

  // Filter out expired statuses
  const now = Date.now();
  const validGroups = statusGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => new Date(item.expires_at).getTime() > now),
  }));

  // Identify Current User's status group
  const selfGroup = validGroups.find((g) => g.user_id === currentUser.id || g.is_self);
  const myStatusItems = selfGroup?.items || [];
  const hasMyStatus = myStatusItems.length > 0;

  // Contact statuses
  const contactGroups = validGroups.filter(
    (g) => g.user_id !== currentUser.id && !g.is_self && g.items.length > 0
  );

  // Filter by search query
  const filteredGroups = contactGroups.filter((g) =>
    g.user_name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // Split into Recent Updates (unread), Viewed Updates (read), and Muted Updates
  const mutedUpdates = filteredGroups.filter((g) => g.is_muted);
  const unmutedGroups = filteredGroups.filter((g) => !g.is_muted);
  const recentUpdates = unmutedGroups.filter((g) => g.has_unread);
  const viewedUpdates = unmutedGroups.filter((g) => !g.has_unread);

  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    try {
      const diffMs = now - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min ago`;
      const diffHrs = Math.floor(diffMins / 60);
      if (diffHrs < 24) return `${diffHrs}h ago`;
      return 'Yesterday';
    } catch {
      return 'Recently';
    }
  };

  const handleSelectPhoto = (file: File) => {
    setMediaFile(file);
    setMediaType('IMAGE');
    setIsMediaEditorOpen(true);
  };

  const handleSelectVideo = (file: File) => {
    setMediaFile(file);
    setMediaType('VIDEO');
    setIsMediaEditorOpen(true);
  };

  const handleOpenMyStatus = () => {
    if (hasMyStatus && selfGroup) {
      openStatusViewer(selfGroup, 0);
    } else {
      setIsCreationSheetOpen(true);
    }
  };

  return (
    <div
      id="status-view"
      className="flex-1 flex flex-col h-full bg-[var(--rovela-bg)] text-[var(--rovela-text-primary)] overflow-hidden select-none"
    >
      {/* Creation Sheet */}
      <StatusCreationSheet
        isOpen={isCreationSheetOpen}
        onClose={() => setIsCreationSheetOpen(false)}
        onSelectPhoto={handleSelectPhoto}
        onSelectVideo={handleSelectVideo}
        onSelectText={() => setIsTextEditorOpen(true)}
      />

      {/* Media Editor */}
      <MediaStatusEditor
        isOpen={isMediaEditorOpen}
        file={mediaFile}
        type={mediaType}
        onClose={() => {
          setIsMediaEditorOpen(false);
          setMediaFile(null);
        }}
        onPublished={() => {}}
      />

      {/* Text Editor */}
      <TextStatusEditor
        isOpen={isTextEditorOpen}
        onClose={() => setIsTextEditorOpen(false)}
        onPublished={() => {}}
      />

      {/* Privacy Settings Modal */}
      <StatusPrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        currentPrivacy={statusPrivacy}
        onSave={(p) => setStatusPrivacy(p)}
      />

      {/* ========================================================================= */}
      {/* 1. TOP HEADER                                                             */}
      {/* ========================================================================= */}
      <header className="px-6 py-4 border-b border-[var(--rovela-border)] bg-[var(--rovela-surface)]/80 backdrop-blur-xl shrink-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold tracking-tight text-[var(--rovela-text-primary)]">
              Status
            </h1>
            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
              24h Updates
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop Add Status Primary Action */}
            <button
              type="button"
              onClick={() => setIsCreationSheetOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold shadow-md shadow-purple-500/20 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Status</span>
            </button>

            {/* Search Toggle */}
            <button
              type="button"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                isSearchVisible
                  ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300'
                  : 'text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)]'
              }`}
              title="Search status updates"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* More Menu Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
                title="More options"
              >
                <MoreVertical className="w-4.5 h-4.5" />
              </button>

              {/* Popover */}
              {isMoreMenuOpen && (
                <div
                  className="absolute right-0 top-11 w-48 bg-[var(--rovela-surface)] border border-[var(--rovela-border)] rounded-2xl p-1.5 shadow-2xl text-[var(--rovela-text-primary)] z-50 animate-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      setIsPrivacyModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
                  >
                    <Shield className="w-4 h-4 text-purple-500" />
                    <span>Status Privacy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      setIsMutedExpanded(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
                  >
                    <VolumeX className="w-4 h-4 text-amber-500" />
                    <span>Muted Updates ({mutedUpdates.length})</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Search Input */}
        {isSearchVisible && (
          <div className="mt-3 relative flex items-center animate-in fade-in duration-150">
            <Search className="w-4 h-4 text-[var(--rovela-text-muted)] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contact updates..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[var(--rovela-bg)] border border-[var(--rovela-border)] text-xs text-[var(--rovela-text-primary)] placeholder-[var(--rovela-text-muted)] focus:outline-none focus:border-purple-500/70"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 p-1 rounded-full text-[var(--rovela-text-muted)] hover:text-[var(--rovela-text-primary)] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. SCROLLABLE CONTENT BODY                                                */}
      {/* ========================================================================= */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-7 max-w-4xl w-full mx-auto">
        {/* ======================================================================= */}
        {/* A. MY STATUS SECTION                                                    */}
        {/* ======================================================================= */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold tracking-wider text-[var(--rovela-text-secondary)] uppercase">
              My Status
            </h2>
            {hasMyStatus && (
              <button
                type="button"
                onClick={() => setIsCreationSheetOpen(true)}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add update</span>
              </button>
            )}
          </div>

          <div
            onClick={handleOpenMyStatus}
            className={`p-4 rounded-3xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
              hasMyStatus
                ? 'bg-gradient-to-r from-purple-500/08 via-purple-500/03 to-transparent border-purple-500/30 hover:border-purple-500/50 hover:shadow-[0_4px_20px_rgba(124,58,237,0.12)]'
                : 'bg-[var(--rovela-surface)] border-[var(--rovela-border)] hover:border-purple-500/40 hover:bg-[var(--rovela-surface-hover)]'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Avatar with Status Ring */}
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-full p-0.5 transition-all ${
                    hasMyStatus
                      ? 'bg-gradient-to-tr from-violet-600 via-purple-500 to-pink-500 shadow-md shadow-purple-500/25 group-hover:scale-105'
                      : 'border-2 border-dashed border-[var(--rovela-border)]'
                  }`}
                >
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.name}
                    className="w-full h-full rounded-full object-cover ring-2 ring-[var(--rovela-surface)]"
                  />
                </div>

                {/* Plus badge if no status */}
                {!hasMyStatus ? (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/30 ring-2 ring-[var(--rovela-surface)]">
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="absolute -bottom-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-purple-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow ring-2 ring-[var(--rovela-surface)]">
                    {myStatusItems.length}
                  </div>
                )}
              </div>

              {/* Status Info */}
              <div>
                {hasMyStatus ? (
                  <>
                    <h3 className="text-sm font-bold text-[var(--rovela-text-primary)] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      Your Status
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[var(--rovela-text-secondary)] mt-0.5">
                      <span>
                        {myStatusItems.length}{' '}
                        {myStatusItems.length === 1 ? 'update' : 'updates'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium">
                        <Clock className="w-3 h-3" />
                        Updated {formatTimeAgo(selfGroup?.latest_created_at)}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-sm font-bold text-[var(--rovela-text-primary)] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      Share a status
                    </h3>
                    <p className="text-xs text-[var(--rovela-text-secondary)] mt-0.5">
                      Share photos, videos or text with your contacts.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Action on Right */}
            {hasMyStatus ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  View
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCreationSheetOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold shadow-md shadow-purple-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Status</span>
              </button>
            )}
          </div>
        </section>

        {/* ======================================================================= */}
        {/* B. RECENT UPDATES (UNREAD)                                              */}
        {/* ======================================================================= */}
        {recentUpdates.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold tracking-wider text-[var(--rovela-text-secondary)] uppercase flex items-center justify-between">
              <span>Recent Updates</span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold bg-purple-500/10 px-2 py-0.5 rounded-full">
                {recentUpdates.length} new
              </span>
            </h2>

            <div className="space-y-2">
              {recentUpdates.map((group) => (
                <div
                  key={group.user_id}
                  onClick={() => openStatusViewer(group, 0)}
                  className="p-3.5 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] hover:border-purple-500/40 hover:bg-[var(--rovela-surface-hover)] transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Vibrant Purple Gradient Status Ring */}
                    <div className="relative">
                      <div className="w-13 h-13 rounded-full p-[2.5px] bg-gradient-to-tr from-violet-600 via-purple-500 to-pink-500 shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                        <img
                          src={group.user_avatar}
                          alt={group.user_name}
                          className="w-full h-full rounded-full object-cover ring-2 ring-[var(--rovela-surface)]"
                        />
                      </div>
                      {group.items.length > 1 && (
                        <div className="absolute -bottom-1 -right-1 px-1.5 h-4.5 rounded-full bg-purple-600 text-white text-[9px] font-extrabold flex items-center justify-center shadow ring-2 ring-[var(--rovela-surface)]">
                          {group.items.length}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-[var(--rovela-text-primary)] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {group.user_name}
                      </h3>
                      <p className="text-xs text-[var(--rovela-text-secondary)] mt-0.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <span>{formatTimeAgo(group.latest_created_at)}</span>
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)] group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======================================================================= */}
        {/* C. VIEWED UPDATES (READ)                                                */}
        {/* ======================================================================= */}
        {viewedUpdates.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold tracking-wider text-[var(--rovela-text-secondary)] uppercase">
              Viewed Updates
            </h2>

            <div className="space-y-2">
              {viewedUpdates.map((group) => (
                <div
                  key={group.user_id}
                  onClick={() => openStatusViewer(group, 0)}
                  className="p-3.5 rounded-2xl bg-[var(--rovela-surface)]/60 border border-[var(--rovela-border)] hover:bg-[var(--rovela-surface-hover)] transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Subtle Muted Ring */}
                    <div className="relative">
                      <div className="w-13 h-13 rounded-full p-[2px] border-2 border-[var(--rovela-border)] group-hover:border-purple-400/50 transition-colors">
                        <img
                          src={group.user_avatar}
                          alt={group.user_name}
                          className="w-full h-full rounded-full object-cover ring-1 ring-[var(--rovela-surface)] opacity-85 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-[var(--rovela-text-primary)]">
                        {group.user_name}
                      </h3>
                      <p className="text-xs text-[var(--rovela-text-muted)] mt-0.5">
                        {formatTimeAgo(group.latest_created_at)}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======================================================================= */}
        {/* D. MUTED UPDATES (COLLAPSIBLE)                                          */}
        {/* ======================================================================= */}
        {mutedUpdates.length > 0 && (
          <section className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => setIsMutedExpanded(!isMutedExpanded)}
              className="w-full flex items-center justify-between text-xs font-bold tracking-wider text-[var(--rovela-text-secondary)] uppercase cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <VolumeX className="w-3.5 h-3.5 text-amber-500" />
                <span>Muted Updates ({mutedUpdates.length})</span>
              </div>
              {isMutedExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {isMutedExpanded && (
              <div className="space-y-2 animate-in fade-in duration-150">
                {mutedUpdates.map((group) => (
                  <div
                    key={group.user_id}
                    className="p-3.5 rounded-2xl bg-[var(--rovela-surface)]/40 border border-[var(--rovela-border)] flex items-center justify-between"
                  >
                    <div
                      className="flex items-center gap-3.5 cursor-pointer flex-1"
                      onClick={() => openStatusViewer(group, 0)}
                    >
                      <div className="w-12 h-12 rounded-full p-[2px] border border-[var(--rovela-border)]">
                        <img
                          src={group.user_avatar}
                          alt={group.user_name}
                          className="w-full h-full rounded-full object-cover opacity-60"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[var(--rovela-text-primary)] opacity-80">
                          {group.user_name}
                        </h4>
                        <p className="text-[11px] text-[var(--rovela-text-muted)] mt-0.5">
                          Muted • {formatTimeAgo(group.latest_created_at)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleMuteUserStatus(group.user_id)}
                      className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline px-2.5 py-1 rounded-lg hover:bg-purple-500/10 cursor-pointer"
                    >
                      Unmute
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ======================================================================= */}
        {/* E. EMPTY STATE (WHEN NO UPDATES)                                        */}
        {/* ======================================================================= */}
        {contactGroups.length === 0 && (
          <div className="py-14 text-center flex flex-col items-center justify-center px-6">
            <div className="w-16 h-16 rounded-3xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4 shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[var(--rovela-text-primary)]">
              No recent updates
            </h3>
            <p className="text-xs text-[var(--rovela-text-secondary)] mt-1.5 max-w-sm leading-relaxed">
              When your contacts share photos, videos or text updates, they'll appear here for 24 hours.
            </p>
            <button
              type="button"
              onClick={() => setIsCreationSheetOpen(true)}
              className="mt-5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-purple-500/20 active:scale-95 transition-all cursor-pointer"
            >
              Post your first status
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE FLOATING ACTION BUTTON                                          */}
      {/* ========================================================================= */}
      <div className="md:hidden fixed bottom-20 right-5 z-30 flex flex-col gap-2 items-end">
        <button
          type="button"
          onClick={() => setIsCreationSheetOpen(true)}
          className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-purple-600/35 active:scale-95 transition-all cursor-pointer ring-4 ring-white/10"
          aria-label="Add status"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
