import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:opacity-45 disabled:pointer-events-none select-none active:scale-[0.96] cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5 min-h-[34px]',
    md: 'text-sm px-4.5 py-2.5 gap-2 min-h-[40px]',
    lg: 'text-base px-6 py-3 gap-2.5 min-h-[46px]',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_4px_16px_rgba(124,58,237,0.3)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_6px_22px_rgba(168,85,247,0.4)] border border-purple-400/30',
    secondary:
      'bg-purple-500/10 hover:bg-purple-500/18 text-purple-700 dark:text-purple-300 border border-purple-500/25 dark:border-purple-500/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-purple-500/40',
    glass:
      'bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-[var(--rovela-text-primary)] hover:border-purple-500/30 hover:bg-[var(--rovela-surface-hover)] shadow-sm',
    ghost:
      'bg-transparent hover:bg-[var(--rovela-surface-hover)] text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300',
    danger:
      'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/25 hover:border-rose-500/40',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
