import React from 'react';
import { FileText, Download, Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import { Message } from '../../../types';
import { useChat } from '../../../context/ChatContext';
import { formatRelativeMessageTime } from '../../../utils/dateUtils';
import { ReadReceipt } from '../ReadReceipt';

interface DocumentMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

export const DocumentMessage: React.FC<DocumentMessageProps> = ({
  message,
  isCurrentUser,
}) => {
  const { showToast } = useChat();

  const attachment = message.attachments?.[0] || {
    id: 'att-fallback',
    name: message.content || 'Document.pdf',
    url: '#',
    type: 'application/pdf',
    size: '1.2 MB',
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(`Downloading ${attachment.name}`, undefined, 'info');
  };

  return (
    <div
      className={`flex flex-col gap-2 p-3 sm:p-3.5 rounded-2xl w-[260px] sm:w-[300px] max-w-full select-none shadow-sm transition-all ${
        isCurrentUser
          ? 'bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-white shadow-purple-950/20'
          : 'bg-[var(--rovela-surface)] border border-[var(--rovela-border)] text-[var(--rovela-text-primary)]'
      }`}
      role="region"
      aria-label="Document Attachment"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isCurrentUser ? 'bg-white/20 text-white' : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
          }`}
        >
          <FileText className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold truncate">{attachment.name}</p>
          <p className={`text-[11px] ${isCurrentUser ? 'text-white/80' : 'text-[var(--rovela-text-secondary)]'}`}>
            {attachment.size}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
            isCurrentUser ? 'hover:bg-white/20 text-white' : 'hover:bg-[var(--rovela-surface-hover)] text-purple-600 dark:text-purple-400'
          }`}
          title="Download file"
          aria-label={`Download ${attachment.name}`}
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {(() => {
        const timeObj = formatRelativeMessageTime(message.created_at);
        return (
          <div
            className={`flex items-center justify-end gap-1.5 text-[10.5px] select-none pt-1 ${
              isCurrentUser
                ? 'text-white/75 font-medium tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]'
                : 'text-[var(--rovela-text-secondary)] dark:text-slate-400 font-medium tracking-tight'
            }`}
          >
            <span
              title={timeObj.tooltip || timeObj.full}
              className="cursor-default hover:underline decoration-dotted decoration-1"
            >
              {timeObj.relative}
            </span>
            <ReadReceipt status={message.status} isCurrentUser={isCurrentUser} />
          </div>
        );
      })()}
    </div>
  );
};
