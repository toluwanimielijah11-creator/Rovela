import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, ShieldAlert, Check } from 'lucide-react';
import { UserProfile, ReportReason } from '../../types';
import { useChat } from '../../context/ChatContext';

interface ReportUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

const REPORT_REASONS: { key: ReportReason; label: string; desc: string }[] = [
  { key: 'spam', label: 'Spam or unsolicited messages', desc: 'Commercial advertising, repeated messages, or bots' },
  { key: 'harassment', label: 'Harassment or bullying', desc: 'Threats, abusive language, or persistent targeting' },
  { key: 'inappropriate', label: 'Inappropriate content', desc: 'Explicit or offensive media or status content' },
  { key: 'scam', label: 'Impersonation or fraud', desc: 'Pretending to be another person or financial scam' },
  { key: 'other', label: 'Other issue', desc: 'Something else violating Rovela community guidelines' },
];

export const ReportUserModal: React.FC<ReportUserModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { reportUser } = useChat();
  const [selectedReason, setSelectedReason] = useState<ReportReason>('spam');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      reportUser(user.id, selectedReason, details.trim() || undefined);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-[var(--rovela-surface)] border border-[var(--rovela-border)] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[var(--rovela-border)] flex items-center justify-between bg-[var(--rovela-surface-secondary)]">
            <div className="flex items-center gap-2 text-rose-500">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-base font-extrabold text-[var(--rovela-text-primary)]">
                Report {user.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-xs text-[var(--rovela-text-secondary)]">
              Help us understand what happened with <span className="font-bold text-[var(--rovela-text-primary)]">@{user.username}</span>. Your report is confidential and reviewed by Rovela Trust & Safety.
            </p>

            {/* Reasons Radio List */}
            <div className="space-y-2">
              {REPORT_REASONS.map((r) => {
                const isSelected = selectedReason === r.key;
                return (
                  <label
                    key={r.key}
                    onClick={() => setSelectedReason(r.key)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-[var(--rovela-border)] bg-[var(--rovela-surface-secondary)] hover:bg-[var(--rovela-surface-hover)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      checked={isSelected}
                      onChange={() => setSelectedReason(r.key)}
                      className="mt-1 accent-purple-600 cursor-pointer"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[var(--rovela-text-primary)]">
                        {r.label}
                      </p>
                      <p className="text-[11px] text-[var(--rovela-text-muted)] mt-0.5">
                        {r.desc}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Additional details */}
            <div className="space-y-1.5 pt-1">
              <label
                htmlFor="report-details"
                className="block text-xs font-bold text-[var(--rovela-text-secondary)]"
              >
                Additional Details (Optional)
              </label>
              <textarea
                id="report-details"
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Include any specific messages, context, or timestamps..."
                maxLength={300}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-xs text-[var(--rovela-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[var(--rovela-border)] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-900/30 transition-all cursor-pointer"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
