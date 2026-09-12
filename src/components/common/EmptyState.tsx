import React from 'react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto ${className}`}
    >
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-600/15 to-purple-800/25 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(124,58,237,0.15)] backdrop-blur-md">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
