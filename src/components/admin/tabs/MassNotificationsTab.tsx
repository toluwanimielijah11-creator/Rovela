import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { Bell, Send, Trash2, Check, Sparkles, X, Users, Mail, Smartphone, Filter } from 'lucide-react';
import { MassNotificationItem } from '../../../types/admin';

export const MassNotificationsTab: React.FC = () => {
  const { massNotifications, sendMassNotification, deleteMassNotification, adminUsers } = useAdmin();
  const [showSendModal, setShowSendModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New Broadcast Notification
  const [newNotif, setNewNotif] = useState<{
    title: string;
    body: string;
    targetAudience: 'all' | 'active-users' | 'admins' | 'new-users';
    channel: 'in-app' | 'email' | 'push';
  }>({
    title: '',
    body: '',
    targetAudience: 'all',
    channel: 'in-app',
  });

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotif.title.trim() || !newNotif.body.trim()) return;

    const recipientMap: Record<string, number> = {
      all: adminUsers.length * 800,
      'active-users': 1420,
      'new-users': 3100,
      admins: 12,
    };

    const count = recipientMap[newNotif.targetAudience] || 1000;

    sendMassNotification({
      title: newNotif.title,
      body: newNotif.body,
      targetAudience: newNotif.targetAudience,
      channel: newNotif.channel,
      recipientsCount: count,
    });

    setNewNotif({
      title: '',
      body: '',
      targetAudience: 'all',
      channel: 'in-app',
    });
    setShowSendModal(false);
    setSuccessToast(`Mass notification dispatched to ${count.toLocaleString()} recipients!`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="w-4 h-4 text-emerald-400" />;
      case 'push':
        return <Smartphone className="w-4 h-4 text-indigo-400" />;
      default:
        return <Bell className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-indigo-600/20 border border-purple-500/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Mass Notification Dispatcher & Push Broadcasts
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Dispatch bulk communications across In-App Notification Center, Mobile Push Triggers, and Email blasts to
            segmented user lists.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSendModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all active:scale-95 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Dispatch Broadcast</span>
        </button>
      </div>

      {/* Success Toast Banner */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* History Ledger Table */}
      <div className="p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white">Mass Notification History</h4>
            <p className="text-xs text-slate-400">Past broadcast campaigns and delivery outcomes</p>
          </div>
          <span className="text-xs font-mono text-purple-300">{massNotifications.length} dispatched</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="pb-3 font-semibold">Notification Title & Message</th>
                <th className="pb-3 font-semibold">Channel</th>
                <th className="pb-3 font-semibold">Target Audience</th>
                <th className="pb-3 font-semibold">Recipients</th>
                <th className="pb-3 font-semibold">Sent Timestamp</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {massNotifications.map((notif) => (
                <tr key={notif.id} className="text-slate-300 group hover:bg-white/[0.02]">
                  <td className="py-3 max-w-xs">
                    <span className="font-bold text-white block">{notif.title}</span>
                    <span className="text-[11px] text-slate-400 truncate block mt-0.5">{notif.body}</span>
                  </td>

                  <td className="py-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono capitalize">
                      {getChannelIcon(notif.channel)}
                      {notif.channel.replace('-', ' ')}
                    </span>
                  </td>

                  <td className="py-3 capitalize text-purple-300 font-mono text-[11px]">
                    {notif.targetAudience.replace('-', ' ')}
                  </td>

                  <td className="py-3 font-bold text-emerald-400">
                    {notif.recipientsCount.toLocaleString()} users
                  </td>

                  <td className="py-3 text-slate-400 font-mono text-[11px]">{notif.sent_at || 'Just now'}</td>

                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => deleteMassNotification(notif.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 cursor-pointer"
                      title="Delete Campaign Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Dispatch Broadcast */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#140F24] border border-purple-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-400" />
                Dispatch Mass Broadcast
              </h4>
              <button onClick={() => setShowSendModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Subject / Title</label>
                <input
                  type="text"
                  value={newNotif.title}
                  onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
                  placeholder="e.g. Major Platform Upgrade Complete"
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Notification Body</label>
                <textarea
                  rows={4}
                  value={newNotif.body}
                  onChange={(e) => setNewNotif({ ...newNotif, body: e.target.value })}
                  placeholder="e.g. Crystal voice quality, liquid-glass visual updates, and zero latency calls are now live."
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Delivery Channel</label>
                  <select
                    value={newNotif.channel}
                    onChange={(e) => setNewNotif({ ...newNotif, channel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="in-app">In-App Notification Bell</option>
                    <option value="push">Mobile PWA Push Notification</option>
                    <option value="email">Email Blast (via SMTP)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Target Segment</label>
                  <select
                    value={newNotif.targetAudience}
                    onChange={(e) => setNewNotif({ ...newNotif, targetAudience: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">All Registered Users (Global)</option>
                    <option value="active-users">Active in the last 24h</option>
                    <option value="new-users">New Users</option>
                    <option value="admins">Admin & Staff Only</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  Send Broadcast Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
