import React from 'react';
import { MessageStatus } from '../../types';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';

interface StatusIndicatorProps {
  status: MessageStatus;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'sending':
      return (
        <span
          title="Sending..."
          className={`inline-flex items-center text-purple-300 dark:text-purple-300/80 animate-pulse ${className}`}
        >
          <Clock className="w-3 h-3" />
        </span>
      );
    case 'sent':
      return (
        <span
          title="Sent"
          className={`inline-flex items-center text-slate-300 dark:text-slate-400 ${className}`}
        >
          <Check className="w-3 h-3 stroke-[2]" />
        </span>
      );
    case 'delivered':
      return (
        <span
          title="Delivered"
          className={`inline-flex items-center text-slate-300 dark:text-slate-300 ${className}`}
        >
          <CheckCheck className="w-3.5 h-3.5 stroke-[2]" />
        </span>
      );
    case 'read':
      return (
        <span
          title="Read"
          className={`inline-flex items-center text-purple-300 dark:text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.7)] ${className}`}
        >
          <CheckCheck className="w-3.5 h-3.5 stroke-[2.5]" />
        </span>
      );
    case 'failed':
      return (
        <span
          title="Failed to send"
          className={`inline-flex items-center text-rose-500 ${className}`}
        >
          <AlertCircle className="w-3 h-3" />
        </span>
      );
    default:
      return (
        <span
          title="Sent"
          className={`inline-flex items-center text-slate-400 ${className}`}
        >
          <Check className="w-3 h-3" />
        </span>
      );
  }
};
