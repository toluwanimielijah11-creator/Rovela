import React from 'react';

interface TypingCapsuleProps {
  names?: string[];
  className?: string;
  size?: 'sm' | 'md';
}

export const TypingCapsule: React.FC<TypingCapsuleProps> = ({
  names = [],
  className = '',
  size = 'md',
}) => {
  const displayText = names.length > 0 
    ? names.length === 1 
      ? `${names[0]} is typing` 
      : `${names.slice(0, 2).join(', ')} are typing`
    : 'Typing';

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-1-light dark:glass-1-dark border border-purple-500/25 shadow-sm text-purple-600 dark:text-purple-300 ${
        size === 'sm' ? 'text-[11px] py-1 px-2.5' : 'text-xs'
      } ${className}`}
    >
      {/* 3 Waving / Pulsing Dots */}
      <div className="flex items-center gap-1 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400 animate-bounce" />
      </div>
      <span className="font-medium tracking-tight truncate">{displayText}</span>
    </div>
  );
};
