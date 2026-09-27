import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Edit2,
  UserCheck,
  UserX,
  LogIn,
  DollarSign,
  X,
  Check,
  Clock,
} from 'lucide-react';
import { UserProfile } from '../../../types';

export interface AdminUserDisplay extends UserProfile {
  status: 'active' | 'suspended' | 'banned';
  balance: number;
  statusNote?: string;
}

export const UsersManagementTab: React.FC = () => {
  const {
    adminUsers,
    addUser,
    updateUser,
    deleteUser,
    banUser,
    suspendUser,
    unbanUser,
    creditUser,
    loginAsUser,
    impersonatedUser,
    revertToAdmin,
  } = useAdmin();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'banned'>('all');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [creditModalUser, setCreditModalUser] = useState<AdminUserDisplay | null>(null);
  const [creditAmount, setCreditAmount] = useState<number>(50);
  const [suspendModalUser, setSuspendModalUser] = useState<AdminUserDisplay | null>(null);
  const [suspendDays, setSuspendDays] = useState<number>(7);
  const [suspendReason, setSuspendReason] = useState('Terms of service violation review');
  const [banModalUser, setBanModalUser] = useState<AdminUserDisplay | null>(null);
  const [banReason, setBanReason] = useState('Severe harassment / spam policy violation');
  const [editingUser, setEditingUser] = useState<AdminUserDisplay | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    role: 'user',
    balance: 0,
  });

  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    const cleanUsername = newUser.username.replace('@', '') || newUser.name.toLowerCase().replace(/\s+/g, '');
    addUser({
      name: newUser.name,
      username: cleanUsername,
      email: newUser.email,
      role: newUser.role === 'admin' ? 'admin' : 'user',
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
      joined_at: 'Today',
      status_state: 'online',
      account_status: 'active',
    });
    setNewUser({ name: '', username: '', email: '', role: 'user', balance: 0 });
    setShowAddModal(false);
    triggerNotice('New user created and registered in directory');
  };

  // Convert raw UserProfile to display model
  const usersDisplayList: AdminUserDisplay[] = adminUsers.map((u) => {
    const rawStatus = u.account_status || (u.is_blocked ? 'blocked' : 'active');
    const status: 'active' | 'suspended' | 'banned' =
      rawStatus === 'blocked' ? 'banned' : rawStatus === 'suspended' ? 'suspended' : 'active';
    return {
      ...u,
      status,
      balance: 120.0,
      statusNote: u.status_text,
    };
  });

  const filteredUsers = usersDisplayList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-indigo-600/20 border border-purple-500/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              User & Identity Governance Directory
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Ban or suspend malicious accounts, issue wallet balances and token credits, edit permissions, or
            impersonate user sessions directly to troubleshoot issues.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Action Banner Notification */}
      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Impersonation Warning Banner */}
      {impersonatedUser && (
        <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogIn className="w-4 h-4 text-amber-400" />
            <span>
              Currently impersonating <strong className="text-white">{impersonatedUser.name}</strong> (@{impersonatedUser.username}). Actions will be logged in security audit.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              revertToAdmin();
              triggerNotice('Exited user impersonation session');
            }}
            className="px-3 py-1 rounded-lg bg-amber-500 text-black font-bold text-xs cursor-pointer"
          >
            End Impersonation
          </button>
        </div>
      )}

      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, handle, or email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#140F24] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'active', 'suspended', 'banned'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === filter
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 px-4">
              <th className="py-3.5 pl-4 font-semibold">User</th>
              <th className="pb-3 font-semibold">Role</th>
              <th className="pb-3 font-semibold">Balance</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Joined</th>
              <th className="py-3.5 pr-4 font-semibold text-right">Administrative Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="text-slate-300 group hover:bg-white/[0.02]">
                {/* User Info */}
                <td className="py-3 pl-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-purple-500/30"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
                      }}
                    />
                    <div>
                      <span className="font-bold text-white block">{user.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        @{user.username} • {user.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 font-semibold text-[11px] capitalize">
                    {user.role || 'user'}
                  </span>
                </td>

                {/* Balance */}
                <td className="py-3">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <span className="text-emerald-400">${user.balance.toFixed(2)}</span>
                    <button
                      type="button"
                      onClick={() => setCreditModalUser(user)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-emerald-400 cursor-pointer"
                      title="Credit User"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      user.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : user.status === 'suspended'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {user.status}
                  </span>
                  {user.statusNote && (
                    <span className="text-[10px] text-slate-400 block truncate max-w-[140px] mt-0.5">
                      {user.statusNote}
                    </span>
                  )}
                </td>

                {/* Created Date */}
                <td className="py-3 text-slate-400 text-[11px] font-mono">{user.joined_at}</td>

                {/* Administrative Actions */}
                <td className="py-3 pr-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Login to User Account (Impersonate) */}
                    <button
                      type="button"
                      onClick={() => {
                        loginAsUser(user);
                        triggerNotice(`Logged in as @${user.username}`);
                      }}
                      className="p-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 cursor-pointer"
                      title="Login to User Account (Impersonate)"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                    </button>

                    {/* Credit User */}
                    <button
                      type="button"
                      onClick={() => setCreditModalUser(user)}
                      className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 cursor-pointer"
                      title="Credit User Balance"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit User */}
                    <button
                      type="button"
                      onClick={() => setEditingUser(user)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                      title="Edit User Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Suspend or Ban / Restore */}
                    {user.status === 'active' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setSuspendModalUser(user)}
                          className="p-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 cursor-pointer"
                          title="Suspend User"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setBanModalUser(user)}
                          className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 cursor-pointer"
                          title="Ban User"
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          unbanUser(user.id);
                          triggerNotice(`Restored user @${user.username} to active status`);
                        }}
                        className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 cursor-pointer"
                        title="Unban / Restore User"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Delete User */}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Permanently delete @${user.username}?`)) {
                          deleteUser(user.id);
                          triggerNotice(`Deleted user @${user.username}`);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 cursor-pointer"
                      title="Delete User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Credit User */}
      {creditModalUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#140F24] border border-purple-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Credit User Account
              </h4>
              <button onClick={() => setCreditModalUser(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Grant balance credits directly to <strong className="text-white">@{creditModalUser.username}</strong>
            </p>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Amount to Add ($ USD)</label>
              <input
                type="number"
                min="1"
                max="5000"
                value={creditAmount}
                onChange={(e) => setCreditAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-sm font-bold text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCreditModalUser(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  creditUser(creditModalUser.id, creditAmount);
                  triggerNotice(`Successfully credited $${creditAmount} to @${creditModalUser.username}`);
                  setCreditModalUser(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md cursor-pointer"
              >
                Credit User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Suspend User */}
      {suspendModalUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#140F24] border border-amber-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Suspend User Account
              </h4>
              <button onClick={() => setSuspendModalUser(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Temporarily lock access for <strong className="text-white">@{suspendModalUser.username}</strong>
            </p>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Duration (Days)</label>
              <input
                type="number"
                min="1"
                max="365"
                value={suspendDays}
                onChange={(e) => setSuspendDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Suspension Reason</label>
              <input
                type="text"
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSuspendModalUser(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  suspendUser(suspendModalUser.id, suspendReason, suspendDays);
                  triggerNotice(`Suspended @${suspendModalUser.username} for ${suspendDays} days`);
                  setSuspendModalUser(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white shadow-md cursor-pointer"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Ban User */}
      {banModalUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#140F24] border border-rose-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <UserX className="w-4 h-4 text-rose-400" />
                Permanent User Ban
              </h4>
              <button onClick={() => setBanModalUser(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Immediately terminate and blacklist account <strong className="text-white">@{banModalUser.username}</strong>
            </p>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Ban Reason / Policy</label>
              <input
                type="text"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setBanModalUser(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  banUser(banModalUser.id, banReason);
                  triggerNotice(`Permanently banned @${banModalUser.username}`);
                  setBanModalUser(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-md cursor-pointer"
              >
                Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New User */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#140F24] border border-purple-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                Add New User Account
              </h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Username Handle</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="jordanh"
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="jordan@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Role Assignment</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="user">User (Member)</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  Register User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit User */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#140F24] border border-purple-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-purple-400" />
                Edit User Details
              </h4>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Role</label>
                <select
                  value={editingUser.role || 'user'}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="user">User (Member)</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateUser(editingUser.id, {
                      name: editingUser.name,
                      email: editingUser.email,
                      role: editingUser.role,
                    });
                    triggerNotice(`Updated user @${editingUser.username}`);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  Save User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
