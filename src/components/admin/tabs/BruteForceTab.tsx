import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { ShieldAlert, Check, Sparkles, AlertTriangle, Lock, UserX, Unlock, Plus, Trash2 } from 'lucide-react';

export const BruteForceTab: React.FC = () => {
  const { bruteForce, updateBruteForce, unblockIp, addIpToBlacklist } = useAdmin();
  const [form, setForm] = useState(bruteForce);
  const [isSaved, setIsSaved] = useState(false);
  const [newBlacklistIp, setNewBlacklistIp] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBruteForce(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2200);
  };

  const handleAddBlacklist = () => {
    if (!newBlacklistIp.trim()) return;
    addIpToBlacklist(newBlacklistIp.trim());
    setForm((prev) => ({
      ...prev,
      ipBlacklist: [...prev.ipBlacklist, newBlacklistIp.trim()],
    }));
    setNewBlacklistIp('');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 select-none pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-indigo-600/20 border border-purple-500/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Brute Force Detection & Bad Login Rate-Limiting
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Protect against credential stuffing, automated bots, and password dictionary attacks. Set maximum allowable
            bad login attempts before temporary or permanent IP lockout.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all active:scale-95 cursor-pointer"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
          <span>{isSaved ? 'Rules Saved!' : 'Save Security Rules'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Limits Configuration */}
        <div className="p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Lock className="w-4 h-4 text-purple-400" />
            Threshold & Lockout Policies
          </h4>

          {/* Bad Login Limit */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Bad Login Limit (Consecutive Failures)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="2"
                max="20"
                value={form.badLoginLimit}
                onChange={(e) => setForm({ ...form, badLoginLimit: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-sm font-bold text-white font-mono focus:outline-none focus:border-purple-500"
                required
              />
              <span className="text-xs text-slate-400 whitespace-nowrap">attempts</span>
            </div>
            <span className="text-[10.5px] text-slate-400 mt-1 block">
              Default recommended: 5 attempts before lockout
            </span>
          </div>

          {/* Lockout Duration */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Lockout Duration (Minutes)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="1440"
                value={form.lockoutDurationMinutes}
                onChange={(e) => setForm({ ...form, lockoutDurationMinutes: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-sm font-bold text-white font-mono focus:outline-none focus:border-purple-500"
                required
              />
              <span className="text-xs text-slate-400 whitespace-nowrap">mins</span>
            </div>
            <span className="text-[10.5px] text-slate-400 mt-1 block">
              IP is blocked for this duration (30 mins recommended)
            </span>
          </div>

          {/* Protection Toggle */}
          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-between">
            <span className="text-xs font-bold text-white">Enforce Rate-Limiter</span>
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
              className="w-4 h-4 rounded text-purple-600 accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Add Blacklist IP */}
          <div className="pt-2">
            <label className="text-xs font-semibold text-slate-300 block mb-1">Manual IP Blacklist</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newBlacklistIp}
                onChange={(e) => setNewBlacklistIp(e.target.value)}
                placeholder="e.g. 192.0.2.1"
                className="flex-1 px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={handleAddBlacklist}
                className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Blocked IP Audit Log */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Live Login Audit & Blocked Entities
              </h4>
              <p className="text-xs text-slate-400">Suspicious authentication attempts detected in the last 24 hours</p>
            </div>
            <span className="text-xs font-mono text-purple-300">Limit: {form.badLoginLimit} fails</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-2 font-semibold">IP Address</th>
                  <th className="pb-2 font-semibold">Target Account</th>
                  <th className="pb-2 font-semibold">Fail Count</th>
                  <th className="pb-2 font-semibold">Timestamp</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bruteForce.auditLogs.map((log) => (
                  <tr key={log.id} className="text-slate-300">
                    <td className="py-3 font-mono text-[11px] text-purple-300">{log.ip}</td>
                    <td className="py-3 text-white font-medium">@{log.username}</td>
                    <td className="py-3 font-bold text-amber-400">{log.attempts} fails</td>
                    <td className="py-3 text-slate-400 text-[11px]">{log.timestamp}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          log.status === 'blocked'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : log.status === 'warning'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {log.status === 'blocked' ? (
                        <button
                          type="button"
                          onClick={() => unblockIp(log.ip)}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Unlock className="w-3 h-3 text-emerald-400" />
                          <span>Unblock IP</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500">Normal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </form>
  );
};
