import React from 'react';
import { useAdmin } from '../../context/AdminContext';

interface RovelaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
  useBrandIcon?: boolean;
}

export const RovelaLogo: React.FC<RovelaLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  className = '',
  useBrandIcon = true,
}) => {
  const [imgFailed, setImgFailed] = React.useState(false);

  let siteName = 'ROVELA';
  let siteTagline = 'Connect. Chat. Belong.';
  let logoUrl = '/rovela-icon.png';

  try {
    const admin = useAdmin();
    if (admin?.globalSettings) {
      if (admin.globalSettings.siteName) siteName = admin.globalSettings.siteName;
      if (admin.globalSettings.siteTagline) siteTagline = admin.globalSettings.siteTagline;
      if (admin.globalSettings.logoUrl) logoUrl = admin.globalSettings.logoUrl;
    }
  } catch {
    // If used outside of AdminProvider
  }

  const iconSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-16 h-16 rounded-2xl',
    '2xl': 'w-24 h-24 rounded-3xl',
  };

  const textSizes = {
    sm: 'text-base font-bold tracking-tight',
    md: 'text-xl font-extrabold tracking-tight',
    lg: 'text-2xl font-black tracking-tight',
    xl: 'text-3xl font-black tracking-tight',
    '2xl': 'text-4xl font-black tracking-tight',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Rovela Liquid-Glass Brand Icon / Emblem */}
      <div
        className={`relative ${iconSizes[size]} flex items-center justify-center bg-transparent overflow-hidden transition-all duration-300 shrink-0`}
      >
        {useBrandIcon && !imgFailed ? (
          <img
            src={logoUrl}
            alt={`${siteName} Logo`}
            className="w-full h-full object-cover rounded-[inherit]"
            onError={(e) => {
              // Try direct external link before falling back to svg
              const target = e.currentTarget;
              if (target.src !== 'https://i.ibb.co/WW403np7/file-000000007eb481f4add391e50c54ffd8.png') {
                target.src = 'https://i.ibb.co/WW403np7/file-000000007eb481f4add391e50c54ffd8.png';
              } else {
                setImgFailed(true);
              }
            }}
          />
        ) : (
          <>
            {/* Fallback fluid illumination inside emblem */}
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/40 via-purple-900/40 to-purple-400/30 opacity-80 pointer-events-none" />
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4/5 h-4/5 relative z-10 drop-shadow-[0_2px_10px_rgba(124,58,237,0.7)]"
            >
              {/* Rovela stylized fluid R ribbon */}
              <path
                d="M13 14C13 11.2386 15.2386 9 18 9H27C33.0751 9 38 13.9249 38 20C38 24.6294 35.1438 28.5912 31.0664 30.219L38.4526 40.0674C38.9328 40.7076 38.4759 41.625 37.6698 41.625H30.8256C30.2583 41.625 29.7259 41.3061 29.4527 40.8016L22.9565 28.8049C22.6105 28.1659 21.9363 27.7667 21.2113 27.7667H19.5V39.5C19.5 40.6046 18.6046 41.5 17.5 41.5H15C13.8954 41.5 13 40.6046 13 39.5V14Z"
                fill="url(#rovela-r-grad)"
              />
              <path
                d="M19.5 15.5H26.5C29.2614 15.5 31.5 17.7386 31.5 20.5C31.5 23.2614 29.2614 25.5 26.5 25.5H19.5V15.5Z"
                fill="#0D0B12"
              />
              <path
                d="M14 25C14 22 17 21 21 21C21 27 18 33 14 33C14 31 14 27 14 25Z"
                fill="url(#rovela-leaf-grad)"
              />
              <defs>
                <linearGradient id="rovela-r-grad" x1="13" y1="9" x2="38" y2="42" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#C4B5FD" />
                  <stop offset="0.4" stopColor="#A855F7" />
                  <stop offset="0.8" stopColor="#7C3AED" />
                  <stop offset="1" stopColor="#5B21B6" />
                </linearGradient>
                <linearGradient id="rovela-leaf-grad" x1="14" y1="21" x2="21" y2="33" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#A855F7" />
                  <stop offset="1" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>
          </>
        )}
      </div>

      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`${textSizes[size]} text-slate-900 dark:text-white tracking-wide font-sans font-bold uppercase`}
            >
              {siteName}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#A855F7]" />
          </div>
          {showTagline && (
            <span className="text-[11px] font-medium tracking-wider text-purple-600 dark:text-purple-300/80 uppercase mt-0.5">
              {siteTagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
