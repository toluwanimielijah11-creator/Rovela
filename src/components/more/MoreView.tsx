import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { Avatar } from '../ui/Avatar';
import { HelpSupportModal } from '../modals/HelpSupportModal';
import {
  Sparkles,
  Archive,
  Star,
  Bell,
  Settings,
  HelpCircle,
  ShieldAlert,
  ChevronRight,
  LogOut,
  X,
  AlertTriangle,
} from 'lucide-react';

export const MoreView: React.FC = () => {
  const {
    currentUser,
    setActiveSection,
    setChatFilter,
    logout,
    hasUnreadStatuses,
    unreadNotificationCount,
    isAdmin,
  } = useChat();

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const handleOpenArchived = () => {
    setChatFilter('archived');
    setActiveSection('chats');
  };

  const handleOpenStarred = () => {
    setChatFilter('pinned');
    setActiveSection('chats');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--rovela-surface)] overflow-y-auto select-none">
      {/* Help & Support Modal */}
      <HelpSupportModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="w-full max-w-sm rounded-3xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] p-6 shadow-2xl text-[var(--rovela-text-primary)] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-center text-[var(--rovela-text-primary)]">
              Sign out of Rovela?
            </h3>
            <p className="text-xs text-[var(--rovela-text-secondary)] text-center mt-1.5 mb-6 leading-relaxed">
              Are you sure you want to sign out? You will need to log back in to access your conversations and synced data.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSignOutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-[var(--rovela-border)] hover:bg-[var(--rovela-surface-hover)] text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSignOutConfirm(false);
                  logout();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-rose-900/30"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen Header: Just "More" with no unnecessary description */}
      <div className="p-4 sm:p-6 pb-2 border-b border-[var(--rovela-border)] bg-[var(--rovela-surface)] shrink-0">
        <h1 className="text-2xl font-black tracking-tight text-[var(--rovela-text-primary)]">
          More
        </h1>
      </div>

      <div className="p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-6 pb-12">
        {/* ========================================================================= */}
        {/* TOP IDENTITY: User Profile Card                                            */}
        {/* Tapping opens Profile                                                     */}
        {/* ========================================================================= */}
        <div
          onClick={() => setActiveSection('profile')}
          className="p-4 sm:p-5 rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] shadow-sm hover:border-purple-500/40 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
          role="button"
          aria-label="Open User Profile"
        >
          <div className="flex items-center gap-3.5 sm:gap-4">
            <Avatar
              src={currentUser.avatar_url}
              name={currentUser.name}
              size="lg"
              status="online"
              showStatus
            />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--rovela-text-primary)]">
                {currentUser.name}
              </h2>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                @{currentUser.username}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-[var(--rovela-text-muted)] font-medium">
                  Online
                </span>
                {currentUser.role === 'admin' && (
                  <span className="ml-1 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-600 dark:text-purple-300">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="w-9 h-9 rounded-full bg-[var(--rovela-surface-hover)] flex items-center justify-center text-[var(--rovela-text-muted)]">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. FIRST SECTION: YOUR ROVELA (Personal Communication Features)           */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--rovela-text-muted)] px-3">
            Your Rovela
          </h3>
          <div className="rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] divide-y divide-[var(--rovela-border)] overflow-hidden shadow-sm">
            {/* Status */}
            <button
              type="button"
              onClick={() => setActiveSection('status')}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600/20 to-purple-600/20 text-purple-600 dark:text-purple-300 flex items-center justify-center relative">
                  <Sparkles className="w-5 h-5" />
                  {hasUnreadStatuses && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-pink-500 ring-2 ring-[var(--rovela-surface)]" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--rovela-text-primary)] flex items-center gap-2">
                    <span>Status</span>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold bg-purple-500/10 px-1.5 py-0.5 rounded-md">
                      24h
                    </span>
                  </h4>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Share photos, videos and updates
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasUnreadStatuses && (
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-bold">
                    New
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
              </div>
            </button>

            {/* Archived Chats */}
            <button
              type="button"
              onClick={handleOpenArchived}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                  <Archive className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                    Archived Chats
                  </h4>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    View archived conversations
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
            </button>

            {/* Starred / Saved */}
            <button
              type="button"
              onClick={handleOpenStarred}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                    Starred / Saved
                  </h4>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Access saved or starred messages
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SECOND SECTION: APP PREFERENCES                                        */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--rovela-text-muted)] px-3">
            App
          </h3>
          <div className="rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] divide-y divide-[var(--rovela-border)] overflow-hidden shadow-sm">
            {/* Notifications */}
            <button
              type="button"
              onClick={() => setActiveSection('notifications')}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                    Notifications
                  </h4>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Messages, groups, calls and alerts
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadNotificationCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold">
                    {unreadNotificationCount}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
              </div>
            </button>

            {/* Settings */}
            <button
              type="button"
              onClick={() => setActiveSection('settings')}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                    Settings
                  </h4>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    Account, privacy, appearance & preferences
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. THIRD SECTION: SUPPORT                                                 */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--rovela-text-muted)] px-3">
            Support
          </h3>
          <div className="rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] overflow-hidden shadow-sm">
            {/* Help & Support */}
            <button
              type="button"
              onClick={() => setIsHelpModalOpen(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                    Help & Support
                  </h4>
                  <p className="text-xs text-[var(--rovela-text-secondary)]">
                    FAQ, contact support and app information
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. FOURTH SECTION: ADMINISTRATION (ONLY VISIBLE TO ADMINS)                */}
        {/* ========================================================================= */}
        {isAdmin && (
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 px-3">
              Administration
            </h3>
            <div className="rounded-3xl bg-[var(--rovela-surface-secondary)] border border-purple-500/25 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setActiveSection('admin')}
                className="w-full p-4 flex items-center justify-between hover:bg-purple-500/10 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-500 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--rovela-text-primary)] flex items-center gap-2">
                      <span>Admin Console</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-600 dark:text-purple-300">
                        Admin Only
                      </span>
                    </h4>
                    <p className="text-xs text-[var(--rovela-text-secondary)]">
                      Manage users, reports and platform controls
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. DESTRUCTIVE EXIT ACTION: SIGN OUT                                       */}
        {/* Separated cleanly at bottom with distinct red styling                     */}
        {/* ========================================================================= */}
        <div className="pt-4 border-t border-[var(--rovela-border)]">
          <button
            type="button"
            onClick={() => setShowSignOutConfirm(true)}
            className="w-full p-4 rounded-2xl flex items-center justify-center gap-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 active:bg-rose-500/15 border border-rose-500/25 transition-all text-sm font-bold cursor-pointer shadow-sm"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Sign Out</span>
          </button>
          <p className="text-center text-[11px] text-[var(--rovela-text-muted)] mt-2.5">
            Rovela Messenger • Version 2.4
          </p>
        </div>
      </div>
    </div>
  );
};
