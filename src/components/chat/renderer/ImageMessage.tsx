import React from 'react';
import { Message } from '../../../types';
import { useChat } from '../../../context/ChatContext';
import { formatRelativeMessageTime } from '../../../utils/dateUtils';
import { ReadReceipt } from '../ReadReceipt';

interface ImageMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

export const ImageMessage: React.FC<ImageMessageProps> = ({
  message,
  isCurrentUser,
}) => {
  const { openMediaViewer } = useChat();

  const imageUrl =
    message.media_url ||
    message.attachments?.find((a) => a.type?.startsWith('image/'))?.url ||
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80';

  const caption = message.content && !message.content.startsWith('http') && !message.content.endsWith('.jpg') && !message.content.endsWith('.png') ? message.content : undefined;

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl w-[280px] sm:w-[320px] max-w-full select-none shadow-sm transition-all ${
        isCurrentUser
          ? 'bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-white shadow-purple-950/20'
          : 'bg-[var(--rovela-surface)] border border-[var(--rovela-border)] text-[var(--rovela-text-primary)]'
      }`}
      role="region"
      aria-label="Image Message"
    >
      <div
        onClick={() =>
          openMediaViewer({
            url: imageUrl,
            title: caption || 'Photo',
            type: 'image',
          })
        }
        className="relative w-full aspect-[4/3] bg-black/40 overflow-hidden cursor-pointer group"
      >
        <img
          src={imageUrl}
          alt={caption || 'Shared photo'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
      </div>

      {caption && (
        <div className="px-3.5 pt-2 pb-1 text-sm font-normal leading-relaxed break-words">
          {caption}
        </div>
      )}

      {(() => {
        const timeObj = formatRelativeMessageTime(message.created_at);
        return (
          <div
            className={`flex items-center justify-end gap-1.5 px-3 py-1.5 text-[10.5px] select-none ${
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
