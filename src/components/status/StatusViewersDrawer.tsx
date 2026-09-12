import React from 'react';
import { StatusViewerRecord } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Eye, X, Clock, Users } from 'lucide-react';

interface StatusViewersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  viewers: StatusViewerRecord[];
  createdAt: string;
}

export const StatusViewersDrawer: React.FC<StatusViewersDrawerProps> = ({
  isOpen,
  onClose,
  viewers,
  createdAt,
}) => {
  if (!isOpen) return null;

  const formatViewedTime = (timestamp: string) => {
    try {
      const diffMs = Date.now() - new Date(timestamp).getTime();
      const diffMins = Math.floor(diffMs / (60 * 1000));
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return 'Yesterday';
    } catch {
      return 'Recently';
    }
  };

  return (
    <div
      id="status-viewers-overlay"
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center items-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 p-0 md:p-4"
      onClick={onClose}
    >
      <div
        id="status-viewers-panel"
        className="w-full md:max-w-md bg-[var(--rovela-surface)] rounded-t-3xl md:rounded-3xl border border-[var(--rovela-border)] max-h-[80vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200 text-[var(--rovela-text-primary)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--rovela-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--rovela-text-primary)]">
                Status Views
              </h3>
              <p className="text-xs text-[var(--rovela-text-secondary)]">
                {viewers.length} {viewers.length === 1 ? 'contact viewed' : 'contacts viewed'}
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

        {/* List of Viewers */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-[var(--rovela-border)]/40">
          {viewers.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center px-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                No views yet
              </h4>
              <p className="text-xs text-[var(--rovela-text-secondary)] mt-1 max-w-xs leading-relaxed">
                When your contacts view your status update, their names and view times will appear here.
              </p>
            </div>
          ) : (
            viewers.map((viewer, index) => (
              <div
                key={viewer.user_id || index}
                className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-[var(--rovela-surface-hover)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={viewer.user_avatar}
                    name={viewer.user_name}
                    size="sm"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[var(--rovela-text-primary)]">
                      {viewer.user_name}
                    </h4>
                    <span className="text-[11px] text-[var(--rovela-text-muted)] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      Viewed {formatViewedTime(viewer.viewed_at)}
                    </span>
                  </div>
                </div>

                <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--rovela-border)] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 active:scale-95 transition-all cursor-pointer text-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
