import React, { useState } from 'react';
import { Message } from '../../../types';
import { useChat } from '../../../context/ChatContext';
import { formatRelativeMessageTime } from '../../../utils/dateUtils';
import { ReadReceipt } from '../ReadReceipt';

interface TextMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

export const TextMessage: React.FC<TextMessageProps> = ({
  message,
  isCurrentUser,
}) => {
  const { editMessage } = useChat();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== message.content) {
      editMessage(message.id, editText.trim());
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 p-2 bg-[var(--rovela-surface-secondary)] border border-purple-500/40 rounded-2xl w-full max-w-md">
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          rows={2}
          className="w-full p-2 bg-transparent text-sm text-[var(--rovela-text-primary)] focus:outline-none resize-none"
          autoFocus
        />
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-2.5 py-1 text-xs text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveEdit}
            className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-500 transition-colors cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative px-4 py-2.5 rounded-2xl break-words leading-relaxed text-sm select-text shadow-sm transition-all ${
        isCurrentUser
          ? 'bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-white shadow-purple-950/20'
          : 'bg-[var(--rovela-surface)] border border-[var(--rovela-border)] text-[var(--rovela-text-primary)]'
      } max-w-full`}
    >
      <div className="whitespace-pre-wrap">{message.content}</div>

      {(() => {
        const timeObj = formatRelativeMessageTime(message.created_at);
        return (
          <div
            className={`flex items-center justify-end gap-1.5 pt-1 text-[10.5px] select-none ${
              isCurrentUser
                ? 'text-white/75 font-medium tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]'
                : 'text-[var(--rovela-text-secondary)] dark:text-slate-400 font-medium tracking-tight'
            }`}
          >
            {message.is_edited && <span className="italic opacity-80">edited</span>}
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
