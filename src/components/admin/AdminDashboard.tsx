import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { Avatar } from '../ui/Avatar';
import {
  ShieldAlert,
  Users,
  MessageSquare,
  Layers,
  Activity,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserX,
  UserCheck,
  Server,
  ArrowLeft,
  Filter,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    adminMetrics,
    reports,
    updateReportStatus,
    users,
    suspendUser,
    restoreUser,
    conversations,
    setActiveSection,
    currentUser,
  } = useChat();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports' | 'groups' | 'system'>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [reportFilter, setReportFilter] = useState<'all' | 'pending' | 'reviewed' | 'dismissed'>('all');

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredReports = reports.filter((r) =>
    reportFilter === 'all' ? true : r.status === reportFilter
  );

  const groups = conversations.filter((c) => c.type === 'group');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0E0A1A] text-slate-100 overflow-y-auto select-none">
      {/* Top Admin Header Bar */}
      <div className="p-6 border-b border-purple-500/20 bg-[#140F24] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-950/50">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Rovela Admin Console
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono uppercase tracking-wider font-bold">
                Role: {currentUser.role || 'Admin'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Platform administration, community moderation, and system telemetry.
            </p>
          </div>
        </div>

        {/* Back to Chat action */}
        <button
          type="button"
          onClick={() => setActiveSection('chats')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold border border-white/10 transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Admin View</span>
        </button>
      </div>

      {/* Admin Nav Tabs */}
      <div className="px-6 border-b border-white/10 bg-[#120E22] flex gap-2 overflow-x-auto py-2.5">
        {[
          { id: 'overview', label: 'Platform Overview', icon: <Activity className="w-4 h-4" /> },
          { id: 'reports', label: `Moderation Reports (${adminMetrics.pending_reports})`, icon: <AlertTriangle className="w-4 h-4 text-amber-400" /> },
          { id: 'users', label: 'User Accounts', icon: <Users className="w-4 h-4" /> },
          { id: 'groups', label: 'Channel Directory', icon: <Layers className="w-4 h-4" /> },
          { id: 'system', label: 'System Health', icon: <Server className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stat metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-[#171228] border border-white/10 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white">{adminMetrics.total_users.toLocaleString()}</div>
                <div className="text-[11px] text-emerald-400 mt-1 font-semibold">+14% new registrations this week</div>
              </div>

              <div className="p-5 rounded-3xl bg-[#171228] border border-white/10 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">24h Active Users</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">{adminMetrics.active_users_24h.toLocaleString()}</div>
                <div className="text-[11px] text-slate-400 mt-1 font-semibold">38.6% engagement ratio</div>
              </div>

              <div className="p-5 rounded-3xl bg-[#171228] border border-white/10 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Messages Logged</span>
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-white">{adminMetrics.total_messages.toLocaleString()}</div>
                <div className="text-[11px] text-slate-400 mt-1 font-semibold">E2EE real-time stream</div>
              </div>

              <div className="p-5 rounded-3xl bg-[#171228] border border-white/10 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Pending Reports</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-400">{adminMetrics.pending_reports}</div>
                <div className="text-[11px] text-slate-400 mt-1 font-semibold">Requires moderator review</div>
              </div>
            </div>

            {/* Quick moderation queue banner */}
            <div className="p-6 rounded-3xl bg-[#1A142E] border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">Active Moderation Queue</h3>
                <p className="text-xs text-slate-400 mt-1">
                  You have {adminMetrics.pending_reports} flagged messages awaiting resolution.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('reports')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md"
              >
                Review Flagged Content
              </button>
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-base font-bold text-white">Flagged Reports ({filteredReports.length})</h3>
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#171228] border border-white/10 text-xs">
                {(['all', 'pending', 'reviewed', 'dismissed'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setReportFilter(status)}
                    className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                      reportFilter === status ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="p-5 rounded-3xl bg-[#171228] border border-white/10 space-y-3 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase">
                        {report.reason}
                      </span>
                      <span className="text-xs text-slate-400">
                        Reported by <strong>{report.reporter_name}</strong> · {report.created_at}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                      report.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : report.status === 'reviewed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      Status: {report.status}
                    </span>
                  </div>

                  {report.message_content && (
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-xs text-slate-300 font-mono">
                      "{report.message_content}"
                    </div>
                  )}

                  {report.details && (
                    <p className="text-xs text-slate-400 italic">Note: {report.details}</p>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-xs text-slate-400">
                      Target User: <strong className="text-white">{report.reported_user_name}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      {report.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => updateReportStatus(report.id, 'dismissed')}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold"
                          >
                            Dismiss
                          </button>
                          <button
                            type="button"
                            onClick={() => updateReportStatus(report.id, 'reviewed')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                          >
                            Mark Reviewed
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="text-base font-bold text-white">Registered Users ({filteredUsers.length})</h3>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by name, username, or email..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#171228] border border-white/10 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="rounded-3xl bg-[#171228] border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1C1630] text-slate-400 uppercase font-bold border-b border-white/10">
                    <tr>
                      <th className="p-4">User</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Account State</th>
                      <th className="p-4 text-right">Administrative Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((u) => {
                      const isSuspended = u.account_status === 'suspended';
                      return (
                        <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <Avatar src={u.avatar_url} name={u.name} size="sm" />
                            <div>
                              <div className="font-bold text-white">{u.name}</div>
                              <div className="text-slate-400 text-[11px]">@{u.username} · {u.email}</div>
                            </div>
                          </td>
                          <td className="p-4 font-mono uppercase text-[11px] text-purple-300">
                            {u.role || 'user'}
                          </td>
                          <td className="p-4">
                            <span className="capitalize text-slate-300">{u.status_state}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              isSuspended
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}>
                              {u.account_status || 'active'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {isSuspended ? (
                              <button
                                type="button"
                                onClick={() => restoreUser(u.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30 text-xs font-bold"
                              >
                                <UserCheck className="w-3.5 h-3.5" /> Restore
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => suspendUser(u.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 text-rose-300 border border-rose-500/40 hover:bg-rose-600/30 text-xs font-bold"
                              >
                                <UserX className="w-3.5 h-3.5" /> Suspend
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* GROUPS TAB */}
        {activeTab === 'groups' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Channels & Public Groups ({groups.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map((grp) => (
                <div key={grp.id} className="p-5 rounded-3xl bg-[#171228] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={grp.avatar_url} name={grp.title} size="md" isGroup />
                    <div>
                      <h4 className="text-xs font-bold text-white">{grp.title}</h4>
                      <p className="text-[11px] text-slate-400">{grp.participant_ids.length} members · Created {grp.created_at.slice(0, 10)}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SYSTEM TAB */}
        {activeTab === 'system' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-[#171228] border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" /> Supabase Connection Architecture
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rovela is configured for zero-friction connection with Supabase. Client entities, schemas, and real-time state hooks are ready to bind with PostgreSQL RLS policies.
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">PostgreSQL Schema Target:</span>
                  <span className="text-purple-300">public (14 tables)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Realtime Protocol:</span>
                  <span className="text-emerald-300">WebSocket Broadcast</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Storage Buckets:</span>
                  <span className="text-purple-300">avatars, voice-notes, media</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#171228] border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> Real-Time Platform Status
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">WebSocket Latency</span>
                    <span className="text-emerald-400 font-bold">18ms</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-[94%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Voice Buffer Quality</span>
                    <span className="text-emerald-400 font-bold">99.8%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-[99%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
