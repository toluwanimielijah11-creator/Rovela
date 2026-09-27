import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { Mail, Plus, Trash2, Edit2, Check, Sparkles, X, Server, ShieldCheck, RefreshCw, Send } from 'lucide-react';
import { SmtpConfigItem } from '../../../types/admin';

export const EmailSmtpTab: React.FC = () => {
  const { smtpConfigs, addSmtpConfig, updateSmtpConfig, deleteSmtpConfig, setDefaultSmtp, testSmtpConnection } = useAdmin();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<SmtpConfigItem | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; msg: string } | null>(null);

  // New SMTP Form
  const [newSmtp, setNewSmtp] = useState<{
    name: string;
    host: string;
    port: number;
    security: 'ssl' | 'tls' | 'none';
    username: string;
    password: string;
    fromEmail: string;
    fromName: string;
    isDefault: boolean;
  }>({
    name: '',
    host: '',
    port: 587,
    security: 'tls',
    username: '',
    password: '',
    fromEmail: 'noreply@rovela.app',
    fromName: 'Rovela System',
    isDefault: false,
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSmtp.name.trim() || !newSmtp.host.trim()) return;
    addSmtpConfig(newSmtp);
    setNewSmtp({
      name: '',
      host: '',
      port: 587,
      security: 'tls',
      username: '',
      password: '',
      fromEmail: 'noreply@rovela.app',
      fromName: 'Rovela System',
      isDefault: false,
    });
    setShowAddModal(false);
  };

  const handleTestConnection = async (config: SmtpConfigItem) => {
    setTestingId(config.id);
    setTestResult(null);
    try {
      const res = await testSmtpConnection(config.id);
      setTestResult({ id: config.id, success: res.success, msg: res.message });
    } catch {
      setTestResult({ id: config.id, success: false, msg: 'Connection timeout or handshake failed.' });
    } finally {
      setTestingId(null);
      setTimeout(() => setTestResult(null), 4000);
    }
  };

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-indigo-600/20 border border-purple-500/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              SMTP Relay & Transactional Mail Architecture
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Configure secure mail transport servers (SendGrid, Mailgun, Amazon SES, Postmark, custom Postfix) for
            account verification, 2FA OTP codes, and payment receipts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom SMTP</span>
        </button>
      </div>

      {/* Test Result Toast */}
      {testResult && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between animate-fadeIn ${
            testResult.success
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>{testResult.msg}</span>
          </div>
          <button onClick={() => setTestResult(null)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SMTP Servers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {smtpConfigs.map((smtp) => (
          <div
            key={smtp.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              smtp.isDefault
                ? 'bg-[#140F24]/90 border-purple-500/40 shadow-lg'
                : 'bg-[#100C1C]/70 border-white/10'
            }`}
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {smtp.name}
                      {smtp.isDefault && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          Primary Default
                        </span>
                      )}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      {smtp.host}:{smtp.port} ({smtp.security.toUpperCase()})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingConfig(smtp)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                    title="Edit SMTP"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete SMTP profile "${smtp.name}"?`)) {
                        deleteSmtpConfig(smtp.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 cursor-pointer"
                    title="Delete SMTP"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Server Details */}
              <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sender Identity:</span>
                  <span className="font-medium text-white">{smtp.fromName} &lt;{smtp.fromEmail}&gt;</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Auth Username:</span>
                  <span className="font-mono text-purple-300">{smtp.username}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
              {!smtp.isDefault ? (
                <button
                  type="button"
                  onClick={() => setDefaultSmtp(smtp.id)}
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300 cursor-pointer"
                >
                  Set as Default Relay
                </button>
              ) : (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" /> In-use Relay
                </span>
              )}

              <button
                type="button"
                onClick={() => handleTestConnection(smtp)}
                disabled={testingId === smtp.id}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {testingId === smtp.id ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3 text-purple-400" />
                    <span>Test Ping</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Custom SMTP */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#140F24] border border-purple-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                Add Custom SMTP Server
              </h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Profile Name</label>
                  <input
                    type="text"
                    value={newSmtp.name}
                    onChange={(e) => setNewSmtp({ ...newSmtp, name: e.target.value })}
                    placeholder="e.g. AWS SES Production"
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Host (FQDN)</label>
                  <input
                    type="text"
                    value={newSmtp.host}
                    onChange={(e) => setNewSmtp({ ...newSmtp, host: e.target.value })}
                    placeholder="email-smtp.us-east-1.amazonaws.com"
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Port</label>
                  <input
                    type="number"
                    value={newSmtp.port}
                    onChange={(e) => setNewSmtp({ ...newSmtp, port: Number(e.target.value) })}
                    placeholder="587"
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Security / Encryption</label>
                  <select
                    value={newSmtp.security}
                    onChange={(e) => setNewSmtp({ ...newSmtp, security: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="tls">TLS (STARTTLS)</option>
                    <option value="ssl">SSL</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">SMTP Username</label>
                  <input
                    type="text"
                    value={newSmtp.username}
                    onChange={(e) => setNewSmtp({ ...newSmtp, username: e.target.value })}
                    placeholder="AKIAIOSFODNN7EXAMPLE"
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">SMTP Password / Key</label>
                  <input
                    type="password"
                    value={newSmtp.password}
                    onChange={(e) => setNewSmtp({ ...newSmtp, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">From Email Address</label>
                  <input
                    type="email"
                    value={newSmtp.fromEmail}
                    onChange={(e) => setNewSmtp({ ...newSmtp, fromEmail: e.target.value })}
                    placeholder="noreply@rovela.app"
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">From Sender Name</label>
                  <input
                    type="text"
                    value={newSmtp.fromName}
                    onChange={(e) => setNewSmtp({ ...newSmtp, fromName: e.target.value })}
                    placeholder="Rovela Platform"
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
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
                  Save SMTP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit SMTP */}
      {editingConfig && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#140F24] border border-purple-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-purple-400" />
                Edit SMTP Profile: {editingConfig.name}
              </h4>
              <button onClick={() => setEditingConfig(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Name</label>
                  <input
                    type="text"
                    value={editingConfig.name}
                    onChange={(e) => setEditingConfig({ ...editingConfig, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Host</label>
                  <input
                    type="text"
                    value={editingConfig.host}
                    onChange={(e) => setEditingConfig({ ...editingConfig, host: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Port</label>
                  <input
                    type="number"
                    value={editingConfig.port}
                    onChange={(e) => setEditingConfig({ ...editingConfig, port: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Security / Encryption</label>
                  <select
                    value={editingConfig.security}
                    onChange={(e) => setEditingConfig({ ...editingConfig, security: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">From Email</label>
                  <input
                    type="email"
                    value={editingConfig.fromEmail}
                    onChange={(e) => setEditingConfig({ ...editingConfig, fromEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">From Sender Name</label>
                  <input
                    type="text"
                    value={editingConfig.fromName}
                    onChange={(e) => setEditingConfig({ ...editingConfig, fromName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingConfig(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateSmtpConfig(editingConfig.id, editingConfig);
                    setEditingConfig(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  Update SMTP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
