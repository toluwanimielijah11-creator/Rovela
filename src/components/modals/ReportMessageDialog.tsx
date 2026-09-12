import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useChat } from '../../context/ChatContext';
import { ReportReason } from '../../types';
import { AlertTriangle, ShieldAlert, Check } from 'lucide-react';

interface ReportMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
  messageContent?: string;
}

const REPORT_REASONS: { id: ReportReason; label: string; description: string }[] = [
  { id: 'spam', label: 'Spam or Advertising', description: 'Repetitive messages, bulk bot promos, or unwanted promotional links.' },
  { id: 'harassment', label: 'Harassment or Bullying', description: 'Targeted hostility, intimidation, threats, or hate speech.' },
  { id: 'inappropriate', label: 'Inappropriate Content', description: 'NSFW media, sexually explicit content, or graphic violence.' },
  { id: 'scam', label: 'Scam or Phishing', description: 'Deceptive financial schemes, impersonation, or credential theft.' },
  { id: 'other', label: 'Other Violation', description: 'Any other behavior violating Rovela community safety guidelines.' },
];

export const ReportMessageDialog: React.FC<ReportMessageDialogProps> = ({
  isOpen,
  onClose,
  messageId,
  messageContent,
}) => {
  const { reportMessage } = useChat();
  const [selectedReason, setSelectedReason] = useState<ReportReason>('spam');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportMessage(messageId, selectedReason, details.trim() || undefined);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Message" maxWidth="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 select-none">
        {/* Warning header */}
        <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-amber-800 dark:text-amber-200 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p>
            Help keep Rovela safe. Reports are reviewed by human moderators in accordance with our Community Guidelines.
          </p>
        </div>

        {/* Quoted message snippet */}
        {messageContent && (
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Reported Message:
            </span>
            <p className="line-clamp-2 italic font-medium">{messageContent}</p>
          </div>
        )}

        {/* Select reason list */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Select a reason:
          </label>
          <div className="space-y-1">
            {REPORT_REASONS.map((reason) => {
              const isSelected = selectedReason === reason.id;
              return (
                <button
                  key={reason.id}
                  type="button"
                  onClick={() => setSelectedReason(reason.id)}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-purple-500/15 border border-purple-500/30 dark:bg-purple-500/20'
                      : 'hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border mt-0.5 shrink-0 transition-all ${
                      isSelected
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'border-slate-300 dark:border-white/20'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {reason.label}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {reason.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional details */}
        <div>
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
            Additional context (optional):
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={2}
            placeholder="Tell us what happened..."
            className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 resize-none transition-colors"
          />
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/20 transition-all active:scale-95 cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Submit Report</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
