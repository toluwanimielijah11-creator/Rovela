import React from 'react';
import { Phone, Video, PhoneMissed, PhoneIncoming, PhoneOutgoing } from 'lucide-react';
import { Message } from '../../../types';
import { useChat } from '../../../context/ChatContext';
import { formatRelativeMessageTime } from '../../../utils/dateUtils';

interface CallEventMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

export const CallEventMessage: React.FC<CallEventMessageProps> = ({ message }) => {
  const { startCall } = useChat();
  const callData = message.call_data || {
    type: 'voice' as const,
    direction: 'incoming' as const,
    duration: '2:14',
  };

  const isVideo = callData.type === 'video';
  const isMissed = callData.direction === 'missed';

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] shadow-sm select-none w-fit max-w-xs"
      role="status"
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
          isMissed
            ? 'bg-rose-500/10 text-rose-500'
            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
        }`}
      >
        {isMissed ? (
          <PhoneMissed className="w-4 h-4" />
        ) : isVideo ? (
          <Video className="w-4 h-4" />
        ) : callData.direction === 'outgoing' ? (
          <PhoneOutgoing className="w-4 h-4" />
        ) : (
          <PhoneIncoming className="w-4 h-4" />
        )}
      </div>

      <div className="min-w-0">
        <p
          className={`text-xs font-bold truncate ${
            isMissed ? 'text-rose-500' : 'text-[var(--rovela-text-primary)]'
          }`}
        >
          {isMissed ? (isVideo ? 'Missed video call' : 'Missed voice call') : isVideo ? 'Video call' : 'Voice call'}
        </p>
        {(() => {
          const timeObj = formatRelativeMessageTime(message.created_at);
          return (
            <p className="text-[11px] text-[var(--rovela-text-secondary)] dark:text-slate-400 font-medium tracking-tight">
              {isMissed ? (
                <span title={timeObj.tooltip || timeObj.full}>{timeObj.relative}</span>
              ) : (
                <span title={timeObj.tooltip || timeObj.full}>
                  {callData.duration || 'Ended'} • {timeObj.relative}
                </span>
              )}
            </p>
          );
        })()}
      </div>

      <button
        type="button"
        onClick={() => startCall(isVideo ? 'video' : 'voice')}
        className="ml-2 px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[11px] font-bold transition-colors cursor-pointer shrink-0"
        title="Call back"
        aria-label="Call back"
      >
        Call back
      </button>
    </div>
  );
};
