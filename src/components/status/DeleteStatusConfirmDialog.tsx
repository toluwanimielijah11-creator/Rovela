import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteStatusConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteStatusConfirmDialog: React.FC<DeleteStatusConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="delete-status-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="delete-status-dialog"
        className="w-full max-w-sm bg-[var(--rovela-surface)] rounded-3xl border border-[var(--rovela-border)] p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-[var(--rovela-text-primary)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3">
          <div className="w-10 h-10 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-muted)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-2">
          <h3 className="text-base font-bold text-[var(--rovela-text-primary)]">
            Delete this status update?
          </h3>
          <p className="text-xs text-[var(--rovela-text-secondary)] mt-1.5 leading-relaxed">
            This status will be permanently removed from your active updates and will no longer be visible to your contacts.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-5 mt-2 border-t border-[var(--rovela-border)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
