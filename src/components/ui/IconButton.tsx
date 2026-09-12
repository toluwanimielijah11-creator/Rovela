import React from 'react';
import { Tooltip } from './Tooltip';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string; // Accessible aria-label and tooltip text
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  showTooltip?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  tooltipPosition = 'top',
  showTooltip = true,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 sm:w-8 sm:h-8 min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 text-xs p-1.5',
    md: 'w-10 h-10 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 text-sm p-2',
    lg: 'w-12 h-12 min-w-[48px] min-h-[48px] text-base p-2.5',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-tr from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_14px_rgba(124,58,237,0.3)] border border-purple-400/30',
    secondary:
      'bg-purple-500/12 hover:bg-purple-500/22 text-purple-700 dark:text-purple-300 border border-purple-500/25',
    glass:
      'bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] shadow-sm',
    ghost:
      'bg-transparent hover:bg-[var(--rovela-surface-hover)] text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300',
    danger:
      'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/25',
  };

  const button = (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );

  if (showTooltip && label) {
    return (
      <Tooltip content={label} position={tooltipPosition}>
        {button}
      </Tooltip>
    );
  }

  return button;
};
