import React from 'react';

export type GlassLevel = 'level-1' | 'level-2' | 'level-3' | 'subtle' | 'surface' | 'elevated' | 'card' | 'interactive';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassLevel;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  children: React.ReactNode;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  variant = 'level-2',
  padding = 'md',
  rounded = '2xl',
  children,
  className = '',
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const roundedClasses = {
    none: 'rounded-none',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-2xl',
    '2xl': 'rounded-3xl',
    '3xl': 'rounded-[2rem]',
  };

  // Glass Levels mapping: Level 1 (Subtle), Level 2 (Standard), Level 3 (Elevated)
  const variantClasses: Record<GlassLevel, string> = {
    'level-1':
      'glass-1-light dark:glass-1-dark',
    subtle:
      'glass-1-light dark:glass-1-dark',
    'level-2':
      'glass-2-light dark:glass-2-dark',
    surface:
      'glass-2-light dark:glass-2-dark',
    card:
      'glass-2-light dark:glass-2-dark glass-interactive-light dark:glass-interactive-dark cursor-pointer',
    'level-3':
      'glass-3-light dark:glass-3-dark',
    elevated:
      'glass-3-light dark:glass-3-dark',
    interactive:
      'glass-1-light dark:glass-1-dark glass-interactive-light dark:glass-interactive-dark cursor-pointer',
  };

  return (
    <div
      className={`${variantClasses[variant]} ${paddingClasses[padding]} ${roundedClasses[rounded]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
