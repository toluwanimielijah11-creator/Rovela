import React from 'react';
import { Message, ResolvedMessageType } from '../../../types';
import { getResolvedMessageType } from '../../../utils/mediaUtils';
import { VoiceNoteMessage } from './VoiceNoteMessage';
import { VideoMessage } from './VideoMessage';
import { TextMessage } from './TextMessage';
import { ImageMessage } from './ImageMessage';
import { DocumentMessage } from './DocumentMessage';
import { CallEventMessage } from './CallEventMessage';

interface MessageRendererProps {
  message: Message;
  isCurrentUser: boolean;
  onRetry?: (messageId: string) => void;
}

export const MessageRenderer: React.FC<MessageRendererProps> = ({
  message,
  isCurrentUser,
  onRetry,
}) => {
  const resolvedType: ResolvedMessageType = getResolvedMessageType(message);

  switch (resolvedType) {
    case 'VOICE_NOTE':
      return (
        <VoiceNoteMessage
          message={message}
          isCurrentUser={isCurrentUser}
          onRetry={onRetry}
        />
      );

    case 'VIDEO':
      return (
        <VideoMessage
          message={message}
          isCurrentUser={isCurrentUser}
          onRetry={onRetry}
        />
      );

    case 'IMAGE':
      return (
        <ImageMessage
          message={message}
          isCurrentUser={isCurrentUser}
        />
      );

    case 'DOCUMENT':
      return (
        <DocumentMessage
          message={message}
          isCurrentUser={isCurrentUser}
        />
      );

    case 'CALL_EVENT':
      return (
        <CallEventMessage
          message={message}
          isCurrentUser={isCurrentUser}
        />
      );

    case 'SYSTEM':
      return (
        <div className="flex justify-center my-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--rovela-surface-secondary)] text-[var(--rovela-text-secondary)] border border-[var(--rovela-border)]">
            {message.content}
          </span>
        </div>
      );

    case 'TEXT':
    default:
      return (
        <TextMessage
          message={message}
          isCurrentUser={isCurrentUser}
        />
      );
  }
};
