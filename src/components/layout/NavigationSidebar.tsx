import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { ActiveNavSection } from '../../types';
import { RovelaLogo } from '../ui/RovelaLogo';
import { Avatar } from '../ui/Avatar';
import { Tooltip } from '../ui/Tooltip';
import { HelpSupportModal } from '../modals/HelpSupportModal';
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
  ShieldAlert,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const NavigationSidebar: React.FC = () => {
  const {
    activeSection,
    setActiveSection,
    unreadMessagesTotal,
    unreadNotificationCount,
    hasUnreadStatuses,
    currentUser,
    isAdmin,
    activeStatusView,
    activeStatusEditor,
  } = useChat();

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rovela_sidebar_expanded');
      return saved !== null ? saved === 'true' : false; // Default compact/rail with toggle
    } catch {
      return false;
    }
  });

  const toggleExpand = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('rovela_sidebar_expanded', String(next));
      } catch {}
      return next;
    });
  };

  // IMMERSIVE STATUS VIEW:
  // When Status Preview, Status Creation/Editor, or Status Viewer is active,
  // the global navigation (Desktop Sidebar & Mobile Bottom Nav) must NOT render.
  if (activeStatusView || activeStatusEditor) {
    return null;
  }

  // Primary Navigation Items
  const primaryNavItems = [
    {
      id: 'chats' as ActiveNavSection,
      label: 'Chats',
      icon: <MessageSquare className="w-5 h-5 shrink-0" />,
      badgeCount: unreadMessagesTotal,
    },
    {
      id: 'status' as ActiveNavSection,
      label: 'Status',
      icon: (
        <div className="relative flex items-center justify-center shrink-0">
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
      icon: <Users className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'groups' as ActiveNavSection,
      label: 'Groups',
      icon: <FolderKanban className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'calls' as ActiveNavSection,
      label: 'Calls',
      icon: <PhoneCall className="w-5 h-5 shrink-0" />,
    },
  ];

  return (
    <>
      {/* Help & Support Dialog */}
      <HelpSupportModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* ========================================================================= */}
      {/* 1. DESKTOP APP SHELL: EXPANDABLE / COLLAPSIBLE SIDEBAR RAIL               */}
      {/* ========================================================================= */}
      <aside
        className={`hidden md:flex flex-col justify-between bg-[var(--rovela-surface)] border-r border-[var(--rovela-border)] shrink-0 z-30 select-none transition-all duration-200 ease-in-out ${
          isExpanded ? 'w-64 p-4' : 'w-20 lg:w-22 py-5 items-center'
        }`}
      >
        {/* Top: Rovela Logo & Navigation */}
        <div className="flex flex-col w-full gap-4">
          {/* Header Row */}
          {isExpanded ? (
            <div className="flex items-center justify-between w-full px-1">
              <button
                type="button"
                onClick={() => setActiveSection('chats')}
                className="focus:outline-none transition-transform hover:scale-102 active:scale-95 cursor-pointer"
                aria-label="Rovela Home"
              >
                <RovelaLogo size="md" showWordmark={true} />
              </button>
              <button
                type="button"
                onClick={toggleExpand}
                className="p-1.5 rounded-xl text-[var(--rovela-text-muted)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Tooltip content="Rovela" position="right">
                <button
                  type="button"
                  onClick={() => setActiveSection('chats')}
                  className="focus:outline-none transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="Rovela Home"
                >
                  <RovelaLogo size="md" showWordmark={false} />
                </button>
              </Tooltip>
              <Tooltip content="Expand sidebar" position="right">
                <button
                  type="button"
                  onClick={toggleExpand}
                  className="p-1 rounded-lg text-[var(--rovela-text-muted)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
                  aria-label="Expand sidebar"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            </div>
          )}

          {/* Primary Navigation */}
          <nav
            className={`flex flex-col gap-1.5 w-full ${isExpanded ? 'px-0' : 'px-2 items-center'}`}
            role="navigation"
            aria-label="Primary Navigation"
          >
            {primaryNavItems.map((item) => {
              const isActive = activeSection === item.id;
              if (isExpanded) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full px-3 py-2.5 rounded-2xl flex items-center justify-between transition-all duration-150 active:scale-[0.98] cursor-pointer focus:outline-none ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold'
                        : 'text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.icon}
                      <span className="text-sm font-semibold truncate">{item.label}</span>
                    </div>

                    {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                          isActive
                            ? 'bg-white text-purple-700'
                            : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                        }`}
                      >
                        {item.badgeCount > 99 ? '99+' : item.badgeCount}
                      </span>
                    )}
                  </button>
                );
              }

              return (
                <Tooltip key={item.id} content={item.label} position="right">
                  <button
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer focus:outline-none ${
                      isActive
                        ? 'bg-gradient-to-tr from-violet-600 to-purple-600 text-white font-medium'
                        : 'text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)]'
                    }`}
                  >
                    {item.icon}

                    {/* Unread badge */}
                    {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white dark:ring-[#110E1A]">
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
          <div className={`h-[1px] bg-[var(--rovela-border)] my-0.5 ${isExpanded ? 'w-full' : 'w-8 mx-auto'}`} />

          {/* Secondary Features: Notifications, Profile, Settings, More Hub */}
          <div className={`flex flex-col gap-1.5 w-full ${isExpanded ? 'px-0' : 'px-2 items-center'}`}>
            {/* Notifications */}
            {isExpanded ? (
              <button
                type="button"
                onClick={() => setActiveSection('notifications')}
                aria-label="Notifications"
                aria-current={activeSection === 'notifications' ? 'page' : undefined}
                className={`w-full px-3 py-2.5 rounded-2xl flex items-center justify-between transition-all duration-150 active:scale-[0.98] cursor-pointer focus:outline-none ${
                  activeSection === 'notifications'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold'
                    : 'text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Bell className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-semibold truncate">Notifications</span>
                </div>
                {unreadNotificationCount > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                      activeSection === 'notifications'
                        ? 'bg-white text-purple-700'
                        : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                    }`}
                  >
                    {unreadNotificationCount}
                  </span>
                )}
              </button>
            ) : (
              <Tooltip content="Notifications" position="right">
                <button
                  type="button"
                  onClick={() => setActiveSection('notifications')}
                  aria-label="Notifications"
                  aria-current={activeSection === 'notifications' ? 'page' : undefined}
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer focus:outline-none ${
                    activeSection === 'notifications'
                      ? 'bg-gradient-to-tr from-violet-600 to-purple-600 text-white'
                      : 'text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)]'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white dark:ring-[#110E1A]">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>
              </Tooltip>
            )}

            {/* Profile */}
            {isExpanded ? (
              <button
                type="button"
                onClick={() => setActiveSection('profile')}
                aria-label="Profile"
                aria-current={activeSection === 'profile' ? 'page' : undefined}
                className={`w-full px-3 py-2.5 rounded-2xl flex items-center gap-3 transition-all duration-150 active:scale-[0.98] cursor-pointer focus:outline-none ${
                  activeSection === 'profile'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold'
                    : 'text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)]'
                }`}
              >
                <User className="w-5 h-5 shrink-0" />
                <span className="text-sm font-semibold truncate">Profile</span>
              </button>
            ) : (
              <Tooltip content="Profile" position="right">
                <button
                  type="button"
                  onClick={() => setActiveSection('profile')}
                  aria-label="Profile"
                  aria-current={activeSection === 'profile' ? 'page' : undefined}
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer focus:outline-none ${
                    activeSection === 'profile'
                      ? 'bg-gradient-to-tr from-violet-600 to-purple-600 text-white'
                      : 'text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)]'
                  }`}
                >
                  <User className="w-5 h-5" />
                </button>
              </Tooltip>
            )}

            {/* Settings */}
            {isExpanded ? (
              <button
                type="button"
                onClick={() => setActiveSection('settings')}
                aria-label="Settings"
                aria-current={activeSection === 'settings' ? 'page' : undefined}
                className={`w-full px-3 py-2.5 rounded-2xl flex items-center gap-3 transition-all duration-150 active:scale-[0.98] cursor-pointer focus:outline-none ${
                  activeSection === 'settings'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold'
                    : 'text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)]'
                }`}
              >
                <Settings className="w-5 h-5 shrink-0" />
                <span className="text-sm font-semibold truncate">Settings</span>
              </button>
            ) : (
              <Tooltip content="Settings" position="right">
                <button
                  type="button"
                  onClick={() => setActiveSection('settings')}
                  aria-label="Settings"
                  aria-current={activeSection === 'settings' ? 'page' : undefined}
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer focus:outline-none ${
                    activeSection === 'settings'
                      ? 'bg-gradient-to-tr from-violet-600 to-purple-600 text-white'
                      : 'text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)]'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                </button>
              </Tooltip>
            )}

            {/* More Hub */}
            {isExpanded ? (
              <button
                type="button"
                onClick={() => setActiveSection('more')}
                aria-label="More Hub"
                aria-current={activeSection === 'more' ? 'page' : undefined}
                className={`w-full px-3 py-2.5 rounded-2xl flex items-center gap-3 transition-all duration-150 active:scale-[0.98] cursor-pointer focus:outline-none ${
                  activeSection === 'more'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold'
                    : 'text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)]'
                }`}
              >
                <MoreHorizontal className="w-5 h-5 shrink-0" />
                <span className="text-sm font-semibold truncate">More Hub</span>
              </button>
            ) : (
              <Tooltip content="More Hub" position="right">
                <button
                  type="button"
                  onClick={() => setActiveSection('more')}
                  aria-label="More Hub"
                  aria-current={activeSection === 'more' ? 'page' : undefined}
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer focus:outline-none ${
                    activeSection === 'more'
                      ? 'bg-gradient-to-tr from-violet-600 to-purple-600 text-white font-medium'
                      : 'text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)]'
                  }`}
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </Tooltip>
            )}

            {/* Admin Console: ONLY visible when authenticated user has admin privileges */}
            {isAdmin && (
              isExpanded ? (
                <button
                  type="button"
                  onClick={() => setActiveSection('admin')}
                  aria-label="Admin Console"
                  aria-current={activeSection === 'admin' ? 'page' : undefined}
                  className={`w-full px-3 py-2.5 rounded-2xl flex items-center justify-between transition-all duration-150 active:scale-[0.98] cursor-pointer focus:outline-none ${
                    activeSection === 'admin'
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold'
                      : 'text-purple-500 hover:text-purple-400 hover:bg-[var(--rovela-surface-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-semibold truncate">Admin Console</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-600 dark:text-purple-300 shrink-0">
                    Admin
                  </span>
                </button>
              ) : (
                <Tooltip content="Admin Console (Admin Only)" position="right">
                  <button
                    type="button"
                    onClick={() => setActiveSection('admin')}
                    aria-label="Admin Console"
                    aria-current={activeSection === 'admin' ? 'page' : undefined}
                    className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer focus:outline-none ${
                      activeSection === 'admin'
                        ? 'bg-gradient-to-tr from-violet-600 to-purple-600 text-white'
                        : 'text-purple-400 hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)]'
                    }`}
                  >
                    <ShieldAlert className="w-5 h-5" />
                  </button>
                </Tooltip>
              )
            )}
          </div>
        </div>

        {/* Bottom Section: Help & Support, User Profile Card */}
        <div className={`flex flex-col gap-3 w-full ${isExpanded ? 'px-0 pt-3 border-t border-[var(--rovela-border)]' : 'px-2 items-center'}`}>
          {/* Help & Support Shortcut */}
          {isExpanded ? (
            <button
              type="button"
              onClick={() => setIsHelpModalOpen(true)}
              className="w-full px-3 py-2 rounded-xl flex items-center gap-3 text-[var(--rovela-text-muted)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)] active:scale-95 transition-all cursor-pointer"
              aria-label="Help & Support"
            >
              <HelpCircle className="w-4.5 h-4.5 shrink-0" />
              <span className="text-xs font-semibold truncate">Help & Support</span>
            </button>
          ) : (
            <Tooltip content="Help & Support" position="right">
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(true)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--rovela-text-muted)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)] active:scale-95 transition-all cursor-pointer"
                aria-label="Help & Support"
              >
                <HelpCircle className="w-4.5 h-4.5" />
              </button>
            </Tooltip>
          )}

          {/* User Profile avatar, name, and online status */}
          {isExpanded ? (
            <div
              onClick={() => setActiveSection('profile')}
              className="w-full p-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] hover:border-purple-500/30 flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveSection('profile')}
              aria-label="Open Profile"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar
                  src={currentUser.avatar_url}
                  name={currentUser.name}
                  size="sm"
                  status="online"
                  showStatus
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[var(--rovela-text-primary)] truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-purple-600 dark:text-purple-400 truncate font-medium">
                    @{currentUser.username}
                  </p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Online" />
            </div>
          ) : (
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
          )}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE APP SHELL: BOTTOM NAVIGATION BAR                                 */}
      {/* Strict Mobile Navigation: Chats, Calls, Contacts, Groups, More            */}
      {/* "More" is ONLY a navigation destination (Never More -> More)              */}
      {/* Touch hitboxes >= 44px with comfortable finger reach                       */}
      {/* ========================================================================= */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--rovela-surface)]/95 backdrop-blur-md border-t border-[var(--rovela-border)] px-2 py-1 flex items-center justify-around shadow-2xl select-none"
        role="navigation"
        aria-label="Mobile Navigation"
      >
        {/* Chats */}
        <button
          type="button"
          onClick={() => setActiveSection('chats')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[52px] py-1 px-3 rounded-xl transition-all active:scale-90 cursor-pointer focus:outline-none ${
            activeSection === 'chats'
              ? 'text-purple-600 dark:text-purple-300 font-bold bg-purple-500/12 dark:bg-purple-500/20'
              : 'text-[var(--rovela-text-secondary)]'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {unreadMessagesTotal > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[9px] font-extrabold flex items-center justify-center">
                {unreadMessagesTotal}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Chats</span>
        </button>

        {/* Calls */}
        <button
          type="button"
          onClick={() => setActiveSection('calls')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[52px] py-1 px-3 rounded-xl transition-all active:scale-90 cursor-pointer focus:outline-none ${
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
          onClick={() => setActiveSection('contacts')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[52px] py-1 px-3 rounded-xl transition-all active:scale-90 cursor-pointer focus:outline-none ${
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
          onClick={() => setActiveSection('groups')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[52px] py-1 px-3 rounded-xl transition-all active:scale-90 cursor-pointer focus:outline-none ${
            activeSection === 'groups'
              ? 'text-purple-600 dark:text-purple-300 font-bold bg-purple-500/12 dark:bg-purple-500/20'
              : 'text-[var(--rovela-text-secondary)]'
          }`}
        >
          <FolderKanban className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Groups</span>
        </button>

        {/* More Destination: Tapping opens the dedicated More Screen hub */}
        <button
          type="button"
          onClick={() => setActiveSection('more')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[52px] py-1 px-3 rounded-xl transition-all active:scale-90 cursor-pointer focus:outline-none ${
            activeSection === 'more'
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
    </>
  );
};
