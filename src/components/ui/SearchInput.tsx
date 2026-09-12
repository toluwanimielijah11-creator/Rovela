import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChangeValue: (val: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeValue,
  onClear,
  placeholder = 'Search messages, people, groups...',
  className = '',
  ...props
}) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="absolute left-3.5 w-4 h-4 text-purple-400 dark:text-purple-300/70 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-9 rounded-xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-[var(--rovela-text-primary)] placeholder-[var(--rovela-text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 backdrop-blur-md transition-all duration-200"
        {...props}
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChangeValue('');
            onClear?.();
          }}
          className="absolute right-2.5 p-1 rounded-md text-[var(--rovela-text-muted)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] transition-colors"
          aria-label="Clear search input"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : (
        <span className="absolute right-3 hidden sm:inline-block text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[var(--rovela-surface-hover)] text-[var(--rovela-text-muted)] select-none">
          ⌘K
        </span>
      )}
    </div>
  );
};
