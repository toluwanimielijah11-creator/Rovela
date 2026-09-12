import React from 'react';

interface RovelaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const RovelaLogo: React.FC<RovelaLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-base font-bold tracking-tight',
    md: 'text-xl font-extrabold tracking-tight',
    lg: 'text-2xl font-black tracking-tight',
    xl: 'text-3xl font-black tracking-tight',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Original Rovela Liquid-Glass Geometric Emblem */}
      <div
        className={`relative ${iconSizes[size]} flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 via-violet-600/30 to-purple-900/40 border border-purple-400/30 shadow-[0_0_20px_rgba(124,58,237,0.25)] backdrop-blur-md overflow-hidden transition-all duration-300 group-hover:border-purple-400/50 group-hover:shadow-[0_0_28px_rgba(168,85,247,0.4)]`}
      >
        {/* Soft fluid illumination inside emblem */}
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/40 via-transparent to-purple-400/30 opacity-70 pointer-events-none" />

        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5 relative z-10 drop-shadow-[0_2px_8px_rgba(124,58,237,0.5)]"
        >
          {/* Fluid interlocking harmonic paths representing conversation and seamless connection */}
          <path
            d="M9 14.5C9 9.80558 12.8056 6 17.5 6C22.1944 6 26 9.80558 26 14.5C26 18.2435 23.5855 21.4234 20.218 22.5283L18.423 27.886C18.1517 28.6967 17.0673 28.7618 16.7027 27.9904L15.3411 25.1054C11.6669 23.7712 9 20.228 9 14.5Z"
            fill="url(#rovela-grad-primary)"
          />
          <path
            d="M14 18C14 15.7909 15.7909 14 18 14C20.2091 14 22 15.7909 22 18C22 20.2091 20.2091 22 18 22C15.7909 22 14 20.2091 14 18Z"
            fill="white"
            fillOpacity="0.95"
          />
          <circle cx="18" cy="18" r="2.2" fill="#5B21B6" />
          <defs>
            <linearGradient id="rovela-grad-primary" x1="9" y1="6" x2="26" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A855F7" />
              <stop offset="0.5" stopColor="#7C3AED" />
              <stop offset="1" stopColor="#5B21B6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`${textSizes[size]} text-slate-900 dark:text-white tracking-wide font-sans`}
            >
              ROVELA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#A855F7]" />
          </div>
          {showTagline && (
            <span className="text-[11px] font-medium tracking-wider text-purple-600 dark:text-purple-300/80 uppercase mt-0.5">
              Connect. Chat. Belong.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
