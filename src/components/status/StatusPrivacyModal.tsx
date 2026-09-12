import React, { useState } from 'react';
import { StatusPrivacy } from '../../types';
import { Shield, Check, X, Users, UserX, UserCheck } from 'lucide-react';

interface StatusPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrivacy: StatusPrivacy;
  onSave: (privacy: StatusPrivacy) => void;
}

export const StatusPrivacyModal: React.FC<StatusPrivacyModalProps> = ({
  isOpen,
  onClose,
  currentPrivacy,
  onSave,
}) => {
  const [selected, setSelected] = useState<StatusPrivacy>(currentPrivacy);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  const options: {
    id: StatusPrivacy;
    title: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'contacts',
      title: 'My Contacts',
      description: 'All your saved contacts on Rovela can view your status updates.',
      icon: <Users className="w-5 h-5 text-purple-500" />,
    },
    {
      id: 'contacts_except',
      title: 'Contacts Except...',
      description: 'Share with all contacts except specific people you choose to exclude.',
      icon: <UserX className="w-5 h-5 text-amber-500" />,
    },
    {
      id: 'only_share_with',
      title: 'Only Share With...',
      description: 'Only specific selected contacts will be able to see this status update.',
      icon: <UserCheck className="w-5 h-5 text-emerald-500" />,
    },
  ];

  return (
    <div
      id="status-privacy-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="status-privacy-modal"
        className="w-full max-w-md bg-[var(--rovela-surface)] rounded-3xl border border-[var(--rovela-border)] p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-[var(--rovela-text-primary)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[var(--rovela-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Status Privacy</h3>
              <p className="text-xs text-[var(--rovela-text-secondary)]">
                Control who can view your updates
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-muted)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <p className="text-xs text-[var(--rovela-text-secondary)] px-1">
            Changes to your privacy settings will apply to future status updates you post.
          </p>

          <div className="space-y-2">
            {options.map((opt) => {
              const isSelected = selected === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelected(opt.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-purple-500/60 bg-purple-500/10 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                      : 'border-[var(--rovela-border)] hover:bg-[var(--rovela-surface-hover)]'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{opt.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[var(--rovela-text-primary)]">
                        {opt.title}
                      </h4>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-purple-600 bg-purple-600 text-white'
                            : 'border-[var(--rovela-border)]'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-[var(--rovela-text-secondary)] mt-0.5 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--rovela-border)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 shadow-md shadow-purple-500/20 active:scale-95 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
