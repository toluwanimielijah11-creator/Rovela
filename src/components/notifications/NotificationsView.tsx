import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import {
  Bell,
  CheckCheck,
  MessageSquare,
  Users,
  AtSign,
  UserCheck,
  ArrowRight,
  Settings,
  MoreVertical,
  VolumeX,
  Trash2,
  Check,
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveConversationId,
    setActiveSection,
    showToast,
  } = useChat();

  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredNotifs = notifications.filter((n) => {
    if (tab === 'unread') return !n.is_read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-4 h-4 text-purple-400" />;
      case 'group_activity':
        return <Users className="w-4 h-4 text-emerald-400" />;
      case 'mention':
        return <AtSign className="w-4 h-4 text-amber-400" />;
      case 'connection':
        return <UserCheck className="w-4 h-4 text-indigo-400" />;
      default:
        return <Bell className="w-4 h-4 text-purple-400" />;
    }
  };

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationAsRead(notif.id);
    if (notif.conversation_id) {
      setActiveConversationId(notif.conversation_id);
      setActiveSection('chats');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-[#0D0B12] overflow-y-auto select-none">
      {/* Top Header matching Section 16 */}
      <div className="p-4 sm:p-6 pb-4 border-b border-slate-200/80 dark:border-white/[0.08] glass-2-light dark:glass-2-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Notifications
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Stay updated with incoming messages, mentions, and updates.
          </p>
        </div>

        {/* PRIMARY ACTIONS: Mark all as read, Notification Settings */}
        <div className="flex items-center gap-2">
          <Button
            variant="glass"
            size="sm"
            onClick={markAllNotificationsAsRead}
            icon={<CheckCheck className="w-4 h-4 text-purple-500" />}
          >
            Mark all read
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveSection('settings')}
            icon={<Settings className="w-4 h-4" />}
          >
            Notification Settings
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4 max-w-4xl mx-auto w-full">
        <Tabs
          tabs={[
            { id: 'all', label: 'All Notifications', count: notifications.length },
            {
              id: 'unread',
              label: 'Unread',
              count: notifications.filter((n) => !n.is_read).length,
            },
          ]}
          activeTab={tab}
          onChange={(id) => setTab(id as 'all' | 'unread')}
          variant="pill"
        />
      </div>

      {/* List matching Section 16 */}
      <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-2.5">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all duration-150 flex items-start justify-between gap-4 relative ${
                !notif.is_read
                  ? 'glass-2-light dark:glass-2-dark border-purple-500/40 shadow-md shadow-purple-950/20'
                  : 'glass-1-light dark:glass-1-dark border-slate-200/70 dark:border-white/[0.06] hover:border-purple-500/25'
              }`}
            >
              {/* Left: Icon & Details */}
              <div
                className="flex items-start gap-3.5 min-w-0 flex-1 cursor-pointer"
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-sm font-bold truncate leading-tight ${
                        !notif.is_read
                          ? 'text-purple-700 dark:text-purple-200'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {notif.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {notif.created_at}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                    {notif.description}
                  </p>

                  {notif.conversation_id && (
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                      <span>Open chat</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Action (Open, Dismiss, Options) */}
              <div className="flex items-center gap-1 shrink-0">
                {!notif.is_read && (
                  <button
                    type="button"
                    onClick={() => markNotificationAsRead(notif.id)}
                    className="p-1.5 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 active:scale-95 transition-all cursor-pointer"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}

                {/* Options Menu trigger */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMenuId(activeMenuId === notif.id ? null : notif.id)
                    }
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                    title="Notification options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeMenuId === notif.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-8 z-30 w-44 rounded-2xl glass-3-light dark:glass-3-dark border border-slate-200/80 dark:border-white/10 shadow-2xl p-1 text-xs text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-100 space-y-0.5"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null);
                          handleNotificationClick(notif);
                        }}
                        className="w-full px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-purple-500/10 dark:hover:bg-white/10 text-left transition-colors cursor-pointer"
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-purple-500" />
                        <span>Open Details</span>
                      </button>

                      {/* Mute action inside options per Section 16 */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null);
                          showToast('Notifications muted for this thread', undefined, 'info');
                        }}
                        className="w-full px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-purple-500/10 dark:hover:bg-white/10 text-left transition-colors cursor-pointer"
                      >
                        <VolumeX className="w-3.5 h-3.5 text-amber-500" />
                        <span>Mute this thread</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null);
                          markNotificationAsRead(notif.id);
                          showToast('Notification dismissed', undefined, 'info');
                        }}
                        className="w-full px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-left transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Dismiss</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon={<Bell className="w-7 h-7" />}
            title="All caught up"
            description="You don't have any unread notifications."
          />
        )}
      </div>
    </div>
  );
};
