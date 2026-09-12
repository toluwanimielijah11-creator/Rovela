import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { ActiveNavSection } from '../../types';
import { RovelaLogo } from '../ui/RovelaLogo';
import { Avatar } from '../ui/Avatar';
import { Tooltip } from '../ui/Tooltip';
import {
  MessageSquare,
  Users,
  FolderKanban,
  PhoneCall,
  Bell,
  User,
  Settings,
  HelpCircle,
  MoreHorizontal,
  Archive,
  LogOut,
  X,
  ChevronRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const NavigationSidebar: React.FC = () => {
  const {
    activeSection,
    setActiveSection,
    unreadMessagesTotal,
    unreadNotificationCount,
    hasUnreadStatuses,
    currentUser,
    setChatFilter,
    logout,
  } = useChat();

  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  // Section 2: Primary Navigation Items (Desktop & Mobile)
  const primaryNavItems = [
    {
      id: 'chats' as ActiveNavSection,
      label: 'Chats',
      icon: <MessageSquare className="w-5 h-5" />,
      badgeCount: unreadMessagesTotal,
    },
    {
      id: 'status' as ActiveNavSection,
      label: 'Status',
      icon: (
        <div className="relative flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
          {hasUnreadStatuses && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 ring-2 ring-[var(--rovela-surface)]" />
          )}
        </div>
      ),
      hasIndicator: hasUnreadStatuses,
    },
    {
      id: 'contacts' as ActiveNavSection,
      label: 'Contacts',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'groups' as ActiveNavSection,
      label: 'Groups',
      icon: <FolderKanban className="w-5 h-5" />,
    },
    {
      id: 'calls' as ActiveNavSection,
      label: 'Calls',
      icon: <PhoneCall className="w-5 h-5" />,
    },
  ];

  const handleMobileNavClick = (section: ActiveNavSection) => {
    setActiveSection(section);
    setMobileMoreOpen(false);
  };

  const handleOpenArchived = () => {
    setActiveSection('chats');
    setChatFilter('archived');
    setMobileMoreOpen(false);
  };

  const handleOpenHelp = () => {
    setActiveSection('settings');
    setMobileMoreOpen(false);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 2. DESKTOP APP SHELL: COMPACT LEFT SIDEBAR RAIL                           */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col items-center justify-between w-20 lg:w-22 py-5 bg-[var(--rovela-surface)] border-r border-[var(--rovela-border)] shrink-0 z-30 select-none">
        {/* Top: Rovela Logo */}
        <div className="flex flex-col items-center w-full gap-5">
          <Tooltip content="Rovela" position="right">
            <button
              onClick={() => setActiveSection('chats')}
              className="focus:outline-none transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Rovela Home"
            >
              <RovelaLogo size="md" showWordmark={false} />
            </button>
          </Tooltip>

          {/* Primary Navigation: 💬 Chats, 👥 Contacts, ◉ Groups, ☎ Calls */}
          <nav className="flex flex-col items-center gap-1.5 w-full px-2" role="navigation" aria-label="Primary Navigation">
            {primaryNavItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <Tooltip key={item.id} content={item.label} position="right">
                  <button
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-tr from-violet-600 to-purple-600 text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)] font-medium'
                        : 'text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)]'
                    }`}
                  >
                    {item.icon}

                    {/* Unread badge */}
                    {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-[0_0_8px_rgba(168,85,247,0.5)] ring-2 ring-white dark:ring-[#110E1A]">
                        {item.badgeCount > 99 ? '99+' : item.badgeCount}
                      </span>
                    )}

                    {/* Active vertical indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 w-1 h-6 rounded-r-full bg-purple-600 dark:bg-purple-400 -ml-2.5" />
                    )}
                  </button>
                </Tooltip>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="w-8 h-[1px] bg-[var(--rovela-border)] my-0.5" />

          {/* Activity: 🔔 Notifications */}
          <Tooltip content="Notifications" position="right">
            <button
              type="button"
              onClick={() => setActiveSection('notifications')}
              aria-label="Notifications"
              aria-current={activeSection === 'notifications' ? 'page' : undefined}
              className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer ${
                activeSection === 'notifications'
                  ? 'bg-gradient-to-tr from-violet-600 to-purple-600 text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)]'
                  : 'text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)]'
              }`}
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-[0_0_8px_rgba(168,85,247,0.5)] ring-2 ring-white dark:ring-[#110E1A]">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
          </Tooltip>

          {/* Account: 👤 Profile, ⚙ Settings */}
          <Tooltip content="Profile" position="right">
            <button
              type="button"
              onClick={() => setActiveSection('profile')}
              aria-label="Profile"
              aria-current={activeSection === 'profile' ? 'page' : undefined}
              className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer ${
                activeSection === 'profile'
                  ? 'bg-gradient-to-tr from-violet-600 to-purple-600 text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)]'
                  : 'text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)]'
              }`}
            >
              <User className="w-5 h-5" />
            </button>
          </Tooltip>

          <Tooltip content="Settings" position="right">
            <button
              type="button"
              onClick={() => setActiveSection('settings')}
              aria-label="Settings"
              aria-current={activeSection === 'settings' ? 'page' : undefined}
              className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer ${
                activeSection === 'settings'
                  ? 'bg-gradient-to-tr from-violet-600 to-purple-600 text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)]'
                  : 'text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)]'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>

        {/* Bottom Section: Help & Support, User avatar, User name, Online status */}
        <div className="flex flex-col items-center gap-3 w-full px-2">
          {/* Help & Support Shortcut */}
          <Tooltip content="Help & Support" position="right">
            <button
              type="button"
              onClick={handleOpenHelp}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--rovela-text-muted)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)] active:scale-95 transition-all cursor-pointer"
              aria-label="Help & Support"
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
          </Tooltip>

          {/* User Profile avatar, name, and online status */}
          <Tooltip content={`${currentUser.name} (Online)`} position="right">
            <button
              type="button"
              onClick={() => setActiveSection('profile')}
              className="relative flex flex-col items-center group cursor-pointer focus:outline-none"
              aria-label="Current User Profile"
            >
              <Avatar
                src={currentUser.avatar_url}
                name={currentUser.name}
                size="sm"
                status="online"
                showStatus
              />
              <span className="text-[10px] font-semibold text-[var(--rovela-text-secondary)] mt-1 truncate max-w-[64px] text-center">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          </Tooltip>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 3. MOBILE APP SHELL: BOTTOM NAVIGATION BAR (Chats, Calls, Contacts, Groups, More) */}
      {/* ========================================================================= */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--rovela-surface)] border-t border-[var(--rovela-border)] px-2 py-1.5 flex items-center justify-around shadow-2xl select-none"
        role="navigation"
        aria-label="Mobile Navigation"
      >
        {/* Chats */}
        <button
          type="button"
          onClick={() => handleMobileNavClick('chats')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] py-1 px-3 rounded-xl transition-all active:scale-90 cursor-pointer ${
            activeSection === 'chats'
              ? 'text-purple-600 dark:text-purple-300 font-bold bg-purple-500/12 dark:bg-purple-500/20'
              : 'text-[var(--rovela-text-secondary)]'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {unreadMessagesTotal > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[9px] font-extrabold flex items-center justify-center shadow-[0_0_6px_rgba(168,85,247,0.6)]">
                {unreadMessagesTotal}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Chats</span>
        </button>

        {/* Calls */}
        <button
          type="button"
          onClick={() => handleMobileNavClick('calls')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] py-1 px-3 rounded-xl transition-all active:scale-90 cursor-pointer ${
            activeSection === 'calls'
              ? 'text-purple-600 dark:text-purple-300 font-bold bg-purple-500/12 dark:bg-purple-500/20'
              : 'text-[var(--rovela-text-secondary)]'
          }`}
        >
          <PhoneCall className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Calls</span>
        </button>

        {/* Contacts */}
        <button
          type="button"
          onClick={() => handleMobileNavClick('contacts')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] py-1 px-3 rounded-xl transition-all active:scale-90 cursor-pointer ${
            activeSection === 'contacts'
              ? 'text-purple-600 dark:text-purple-300 font-bold bg-purple-500/12 dark:bg-purple-500/20'
              : 'text-[var(--rovela-text-secondary)]'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Contacts</span>
        </button>

        {/* Groups */}
        <button
          type="button"
          onClick={() => handleMobileNavClick('groups')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] py-1 px-3 rounded-xl transition-all active:scale-90 cursor-pointer ${
            activeSection === 'groups'
              ? 'text-purple-600 dark:text-purple-300 font-bold bg-purple-500/12 dark:bg-purple-500/20'
              : 'text-[var(--rovela-text-secondary)]'
          }`}
        >
          <FolderKanban className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Groups</span>
        </button>

        {/* More area trigger */}
        <button
          type="button"
          onClick={() => setMobileMoreOpen(true)}
          className={`relative flex flex-col items-center justify-center min-h-[44px] py-1 px-3 rounded-xl transition-all active:scale-90 cursor-pointer ${
            mobileMoreOpen || activeSection === 'settings' || activeSection === 'profile' || activeSection === 'notifications'
              ? 'text-purple-600 dark:text-purple-300 font-bold bg-purple-500/12 dark:bg-purple-500/20'
              : 'text-[var(--rovela-text-secondary)]'
          }`}
        >
          <div className="relative">
            <MoreHorizontal className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-500 ring-2 ring-white dark:ring-[#110E1A]" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">More</span>
        </button>
      </nav>

      {/* ========================================================================= */}
      {/* MOBILE "MORE" BOTTOM SHEET                                                */}
      {/* Contains: Notifications, Archived Chats, Profile, Settings, Help & Support*/}
      {/* ========================================================================= */}
      {mobileMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-150">
          <div
            className="w-full bg-[var(--rovela-surface)] rounded-t-3xl border-t border-[var(--rovela-border)] p-5 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-200 text-[var(--rovela-text-primary)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle and Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--rovela-border)]">
              <div className="flex items-center gap-3">
                <Avatar
                  src={currentUser.avatar_url}
                  name={currentUser.name}
                  size="sm"
                  status="online"
                  showStatus
                />
                <div>
                  <h3 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                    {currentUser.name}
                  </h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    @{currentUser.username}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMoreOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-muted)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Rows */}
            <div className="space-y-1">
              {/* Status */}
              <button
                type="button"
                onClick={() => handleMobileNavClick('status')}
                className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600/20 to-purple-600/20 text-purple-600 dark:text-purple-300 flex items-center justify-center relative">
                    <Sparkles className="w-4.5 h-4.5" />
                    {hasUnreadStatuses && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-pink-500 ring-2 ring-[var(--rovela-surface)]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--rovela-text-primary)] flex items-center gap-2">
                      <span>Status</span>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold bg-purple-500/10 px-1.5 py-0.2 rounded-md">
                        24h
                      </span>
                    </h4>
                    <p className="text-[11px] text-[var(--rovela-text-secondary)]">
                      Share photos, videos or text with contacts
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

              {/* Notifications */}
              <button
                type="button"
                onClick={() => handleMobileNavClick('notifications')}
                className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                    <Bell className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--rovela-text-primary)]">
                      Notifications
                    </h4>
                    <p className="text-[11px] text-[var(--rovela-text-secondary)]">
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

              {/* Archived Chats */}
              <button
                type="button"
                onClick={handleOpenArchived}
                className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                    <Archive className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--rovela-text-primary)]">
                      Archived Chats
                    </h4>
                    <p className="text-[11px] text-[var(--rovela-text-secondary)]">
                      View preserved discussions
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
              </button>

              {/* Profile */}
              <button
                type="button"
                onClick={() => handleMobileNavClick('profile')}
                className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--rovela-text-primary)]">
                      Profile
                    </h4>
                    <p className="text-[11px] text-[var(--rovela-text-secondary)]">
                      Personal info, bio and avatar
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
              </button>

              {/* Settings */}
              <button
                type="button"
                onClick={() => handleMobileNavClick('settings')}
                className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                    <Settings className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--rovela-text-primary)]">
                      Settings
                    </h4>
                    <p className="text-[11px] text-[var(--rovela-text-secondary)]">
                      Account, privacy, appearance & preferences
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
              </button>

              {/* Help & Support */}
              <button
                type="button"
                onClick={handleOpenHelp}
                className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                    <HelpCircle className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--rovela-text-primary)]">
                      Help & Support
                    </h4>
                    <p className="text-[11px] text-[var(--rovela-text-secondary)]">
                      FAQ, contact support & app info
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
              </button>
            </div>

            {/* Logout button at bottom */}
            <div className="pt-3 mt-3 border-t border-[var(--rovela-border)]">
              <button
                type="button"
                onClick={() => {
                  setMobileMoreOpen(false);
                  logout();
                }}
                className="w-full p-2.5 rounded-xl flex items-center justify-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors text-xs font-bold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

