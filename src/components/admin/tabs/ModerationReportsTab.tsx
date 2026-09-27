import React, { useState } from 'react';
import { useChat } from '../../../context/ChatContext';
import { useAdmin } from '../../../context/AdminContext';
import {
  AlertTriangle,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Filter,
  UserX,
  Clock,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { ReportReason, ReportItem } from '../../../types';

export const ModerationReportsTab: React.FC = () => {
  const { reports, updateReportStatus } = useChat();
  const { banUser, suspendUser, setActiveAdminTab } = useAdmin();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'dismissed'>('all');
  const [reasonFilter, setReasonFilter] = useState<string>('all');

  // Modals state for enforcement
  const [banModalReport, setBanModalReport] = useState<ReportItem | null>(null);
  const [banReason, setBanReason] = useState('Severe community guidelines / safety violation');
  const [suspendModalReport, setSuspendModalReport] = useState<ReportItem | null>(null);
  const [suspendDays, setSuspendDays] = useState<number>(7);
  const [suspendReason, setSuspendReason] = useState('Safety review policy enforcement');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const reviewedCount = reports.filter((r) => r.status === 'reviewed').length;
  const dismissedCount = reports.filter((r) => r.status === 'dismissed').length;

  const filteredReports = reports.filter((report) => {
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesReason = reasonFilter === 'all' || report.reason === reasonFilter;
    const term = search.toLowerCase();
    const matchesSearch =
      report.reported_user_name.toLowerCase().includes(term) ||
      report.reporter_name.toLowerCase().includes(term) ||
      report.reason.toLowerCase().includes(term) ||
      (report.message_content && report.message_content.toLowerCase().includes(term)) ||
      (report.details && report.details.toLowerCase().includes(term));

    return matchesStatus && matchesReason && matchesSearch;
  });

  const getReasonColor = (reason: ReportReason | string) => {
    switch (reason) {
      case 'harassment':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'scam':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'inappropriate':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'spam':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const handleConfirmBan = () => {
    if (!banModalReport) return;
    banUser(banModalReport.reported_user_id, banReason);
    updateReportStatus(banModalReport.id, 'reviewed');
    triggerNotice(`Permanently banned user "${banModalReport.reported_user_name}" and marked report reviewed.`);
    setBanModalReport(null);
  };

  const handleConfirmSuspend = () => {
    if (!suspendModalReport) return;
    suspendUser(suspendModalReport.reported_user_id, suspendReason, suspendDays);
    updateReportStatus(suspendModalReport.id, 'reviewed');
    triggerNotice(`Suspended "${suspendModalReport.reported_user_name}" for ${suspendDays} days.`);
    setSuspendModalReport(null);
  };

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-indigo-600/20 border border-purple-500/30 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Trust & Safety Moderation Desk
            </h3>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold animate-pulse">
                {pendingCount} Pending Action
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Review reported messages, investigate harassment or spam complaints, and enact immediate enforcement:
            temporary account suspension, permanent banning, or clearing false reports.
          </p>
        </div>

        {/* Telemetry quick counters */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-[#140F24] border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Pending</span>
            <span className="text-sm font-extrabold text-amber-300">{pendingCount}</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#140F24] border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Resolved</span>
            <span className="text-sm font-extrabold text-emerald-300">{reviewedCount}</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#140F24] border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Dismissed</span>
            <span className="text-sm font-extrabold text-slate-400">{dismissedCount}</span>
          </div>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Multi-Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports by user, reporter, reason, or content..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#140F24] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#140F24] border border-white/10 text-xs">
          {(['all', 'pending', 'reviewed', 'dismissed'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Violation Reason Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold uppercase tracking-wider shrink-0">
          <Filter className="w-3.5 h-3.5 text-purple-400" /> Reason:
        </span>
        {[
          { id: 'all', label: 'All Violations' },
          { id: 'spam', label: 'Spam' },
          { id: 'harassment', label: 'Harassment' },
          { id: 'scam', label: 'Scam / Phishing' },
          { id: 'inappropriate', label: 'Inappropriate' },
          { id: 'other', label: 'Other' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setReasonFilter(item.id)}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
              reasonFilter === item.id
                ? 'bg-purple-500/20 text-purple-200 border border-purple-500/40'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className={`p-5 sm:p-6 rounded-2xl border transition-all space-y-4 shadow-sm ${
              report.status === 'pending'
                ? 'bg-[#140F24]/90 border-purple-500/30'
                : 'bg-[#100C1C]/60 border-white/10 opacity-75'
            }`}
          >
            {/* Top row: Reason, Reporter, Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider ${getReasonColor(
                    report.reason
                  )}`}
                >
                  {report.reason}
                </span>
                <span className="text-xs text-slate-400">
                  Reported by <strong className="text-white">{report.reporter_name}</strong> ·{' '}
                  <span className="font-mono text-slate-500">{report.created_at}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                    report.status === 'pending'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : report.status === 'reviewed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-700/50 text-slate-300 border border-white/10'
                  }`}
                >
                  {report.status}
                </span>
              </div>
            </div>

            {/* Target Reported User Information */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-xs">
                  {report.reported_user_name[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Reported Target User:</span>
                  <span className="text-sm font-bold text-white">{report.reported_user_name}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveAdminTab('users')}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold cursor-pointer self-start sm:self-auto"
              >
                <span>Inspect in User Directory</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quoted Offending Message Content */}
            {report.message_content && (
              <div className="p-3.5 rounded-xl bg-black/50 border border-rose-500/20 text-xs text-slate-200 font-mono space-y-1">
                <span className="text-[10px] text-rose-400/80 font-bold uppercase tracking-wider block flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> Flagged Message Payload
                </span>
                <p className="leading-relaxed whitespace-pre-wrap">"{report.message_content}"</p>
              </div>
            )}

            {/* Additional Context Note from Reporter */}
            {report.details && (
              <div className="text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Reporter Explanatory Memo
                </span>
                <p className="italic text-slate-300">"{report.details}"</p>
              </div>
            )}

            {/* Enforcement Actions Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
              <span className="text-[11px] text-slate-400">
                Action Policy: Enforce sanctions or dismiss if harmless.
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {/* Penalties: Suspend & Ban */}
                <button
                  type="button"
                  onClick={() => setSuspendModalReport(report)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Suspend Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBanModalReport(report)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <UserX className="w-3.5 h-3.5 text-rose-400" />
                  <span>Ban Account</span>
                </button>

                {/* Status transitions */}
                {report.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        updateReportStatus(report.id, 'dismissed');
                        triggerNotice('Report dismissed as non-violating.');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateReportStatus(report.id, 'reviewed');
                        triggerNotice('Report marked as reviewed and resolved.');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Mark Reviewed
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <div className="p-12 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">No Flagged Reports Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search || statusFilter !== 'all' || reasonFilter !== 'all'
                ? 'No reports match your active filter settings.'
                : 'All moderation items have been reviewed! Your platform is in safe standing.'}
            </p>
            {(search || statusFilter !== 'all' || reasonFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setReasonFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal: Suspend User from Report */}
      {suspendModalReport && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#140F24] border border-amber-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Suspend Reported User
              </h4>
              <button
                type="button"
                onClick={() => setSuspendModalReport(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Temporarily restrict access for{' '}
              <strong className="text-white">{suspendModalReport.reported_user_name}</strong> for safety
              investigation.
            </p>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Duration (Days)</label>
              <input
                type="number"
                min="1"
                max="90"
                value={suspendDays}
                onChange={(e) => setSuspendDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Reason / Policy Reference</label>
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
                onClick={() => setSuspendModalReport(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspend}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white shadow-md cursor-pointer"
              >
                Suspend Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Permanent Ban from Report */}
      {banModalReport && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#140F24] border border-rose-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <UserX className="w-4 h-4 text-rose-400" />
                Permanent Account Ban
              </h4>
              <button
                type="button"
                onClick={() => setBanModalReport(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Immediately revoke access and blacklist{' '}
              <strong className="text-white">{banModalReport.reported_user_name}</strong> across the network.
            </p>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Ban Reason</label>
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
                onClick={() => setBanModalReport(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBan}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-md cursor-pointer"
              >
                Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
