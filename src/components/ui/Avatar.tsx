import React, { useState } from 'react';
import { UserStatus } from '../../types';
import { Users } from 'lucide-react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: UserStatus;
  showStatus?: boolean;
  isGroup?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status,
  showStatus = false,
  isGroup = false,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  const statusDotSizes = {
    xs: 'w-2 h-2 ring-1.5',
    sm: 'w-2.5 h-2.5 ring-2',
    md: 'w-3 h-3 ring-2',
    lg: 'w-3.5 h-3.5 ring-2.5',
    xl: 'w-4 h-4 ring-2.5',
  };

  const statusColors = {
    online: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.65)]',
    away: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.55)]',
    busy: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.55)]',
    offline: 'bg-slate-400/80 dark:bg-slate-500/80',
  };

  // Generate fallback initials
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  const hasValidSrc = Boolean(src && typeof src === 'string' && src.trim() !== '');

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-2xl overflow-hidden flex items-center justify-center font-bold select-none border border-white/20 dark:border-white/10 shadow-sm bg-gradient-to-br from-violet-600/30 to-purple-800/40 text-purple-200 dark:text-purple-100 backdrop-blur-sm transition-transform duration-150`}
      >
        {hasValidSrc && !imageError ? (
          <img
            src={src}
            alt={name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : isGroup ? (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-700 to-indigo-800 text-white">
            <Users className={size === 'xs' ? 'w-3.5 h-3.5' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
          </div>
        ) : (
          <span className="tracking-wider">{initials}</span>
        )}
      </div>

      {/* Online / Activity Status Badge */}
      {showStatus && status && !isGroup && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-white dark:ring-[#0A0812] ${
            statusDotSizes[size]
          } ${statusColors[status]}`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};
