import React from 'react';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import { MessageStatus } from '../../types';

interface ReadReceiptProps {
  status?: MessageStatus;
  isCurrentUser: boolean;
  className?: string;
  glowEnabled?: boolean;
}

export const ReadReceipt: React.FC<ReadReceiptProps> = ({
  status = 'delivered',
  isCurrentUser,
  className = '',
  glowEnabled = true,
}) => {
  if (!isCurrentUser) return null;

  switch (status) {
    case 'sending':
      return (
        <span
          className={`inline-flex items-center justify-center text-white/60 animate-pulse ${className}`}
          title="Sending message..."
        >
          <Clock className="w-3 h-3" />
        </span>
      );

    case 'delivered':
      return (
        <span
          className={`inline-flex items-center justify-center text-white/75 ${className}`}
          title="Delivered to recipient"
        >
          <Check className="w-3.5 h-3.5 opacity-80" />
        </span>
      );

    case 'read':
      return (
        <span
          className={`relative inline-flex items-center justify-center transition-all duration-300 select-none ${className}`}
          title="Read by recipient (read receipt active)"
        >
          {glowEnabled && (
            <>
              {/* Subtle liquid-glass glow aura */}
              <span className="absolute -inset-0.5 rounded-full bg-cyan-400/20 blur-[3px] animate-pulse pointer-events-none" />
              {/* Ambient radial reflection */}
              <span className="absolute w-2.5 h-2.5 rounded-full bg-sky-400/30 blur-[2px] pointer-events-none" />
            </>
          )}
          {/* Glowing double-check icon */}
          <CheckCheck
            className="relative w-3.5 h-3.5 text-sky-200 dark:text-cyan-300 drop-shadow-[0_0_6px_rgba(56,189,248,0.95)]"
            strokeWidth={2.4}
          />
        </span>
      );

    case 'failed':
      return (
        <span
          className={`inline-flex items-center justify-center text-rose-300 ${className}`}
          title="Failed to deliver. Click to retry."
        >
          <AlertCircle className="w-3.5 h-3.5 animate-bounce" />
        </span>
      );

    default:
      return null;
  }
};
