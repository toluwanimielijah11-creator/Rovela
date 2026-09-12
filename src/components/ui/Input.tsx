import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, rightAction, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold tracking-wide text-[var(--rovela-text-secondary)] select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-[var(--rovela-text-muted)] pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full h-10 rounded-xl bg-[var(--rovela-surface)] border text-[var(--rovela-text-primary)] placeholder-[var(--rovela-text-muted)] text-sm transition-all duration-200 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              icon ? 'pl-9' : 'pl-3.5'
            } ${rightAction ? 'pr-10' : 'pr-3.5'} ${
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30'
                : 'border-[var(--rovela-border)] hover:border-purple-400/40'
            } ${className}`}
            {...props}
          />
          {rightAction && <div className="absolute right-3 flex items-center">{rightAction}</div>}
        </div>
        {error ? (
          <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[var(--rovela-text-secondary)] mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
