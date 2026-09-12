import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pill' | 'underline' | 'glass';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pill',
  className = '',
}) => {
  if (variant === 'pill') {
    return (
      <div
        className={`flex items-center gap-1 p-1 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] overflow-x-auto no-scrollbar select-none ${className}`}
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(124,58,237,0.35)]'
                  : 'text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)]'
              }`}
            >
              {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold leading-none ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-purple-500/20 text-purple-700 dark:text-purple-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-6 border-b border-[var(--rovela-border)] ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer active:scale-95 ${
              isActive
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
