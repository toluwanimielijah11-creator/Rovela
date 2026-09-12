import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
}) => {
  const variantClasses = {
    text: 'rounded-md h-3.5 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-2xl',
  };

  return (
    <div
      style={{ width, height }}
      className={`shimmer-animated bg-slate-200/60 dark:bg-white/[0.05] border border-slate-200/30 dark:border-white/[0.03] ${variantClasses[variant]} ${className}`}
    />
  );
};

export const ChatItemSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl glass-1-light dark:glass-1-dark">
      <Skeleton variant="circular" className="w-11 h-11 shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3.5 w-24 sm:w-32" />
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
};

export const MessageBubbleSkeleton: React.FC<{ isOutgoing?: boolean }> = ({ isOutgoing = false }) => {
  return (
    <div className={`flex items-end gap-2.5 my-3 ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
      {!isOutgoing && <Skeleton variant="circular" className="w-7 h-7 shrink-0 mb-1" />}
      <div className={`space-y-1 max-w-[70%] ${isOutgoing ? 'items-end' : 'items-start'}`}>
        <Skeleton
          className={`h-12 rounded-2xl ${isOutgoing ? 'w-48 sm:w-64 rounded-br-sm bg-purple-500/10' : 'w-40 sm:w-56 rounded-bl-sm'}`}
        />
        <Skeleton className="h-2.5 w-12 ml-1" />
      </div>
    </div>
  );
};

export const ContactItemSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-2xl glass-1-light dark:glass-1-dark">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-8 w-16 rounded-xl" />
    </div>
  );
};
