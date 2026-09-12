import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px] font-semibold min-w-4 h-4',
    md: 'px-2 py-0.5 text-xs font-semibold min-w-5 h-5',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]',
    secondary:
      'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/20',
    outline:
      'border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-300',
    success:
      'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    danger:
      'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full leading-none whitespace-nowrap select-none ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
