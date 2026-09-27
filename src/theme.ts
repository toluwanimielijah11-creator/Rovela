/**
 * ROVELA CENTRALIZED SEMANTIC DESIGN SYSTEM
 * 
 * Provides semantic tokens and CSS variable mappings for both Light and Dark modes.
 * Adheres strictly to the Rovela Brand Identity:
 * - Obsidian: #0D0B12
 * - Deep Purple: #5B21B6
 * - Primary Violet: #7C3AED
 * - Electric Purple: #A855F7
 * - Soft Lavender: #C4B5FD
 * - Crisp Off-White: #F8F7FA
 * 
 * Golden Rule:
 * LIGHT MODE = DARK TEXT ON LIGHT SURFACES
 * DARK MODE = LIGHT TEXT ON DARK SURFACES
 */

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  surfaceElevated: string;
  surfaceGlass: string;
  surfaceHover: string;
  surfaceActive: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textDisabled: string;

  border: string;
  borderSubtle: string;

  brandPrimary: string;
  brandSecondary: string;
  brandGlow: string;
  brandSoft: string;
  brandActive: string;

  // Semantic Status Scale with guaranteed accessible contrast
  status: {
    success: {
      bg: string;
      text: string;
      border: string;
      icon: string;
    };
    warning: {
      bg: string;
      text: string;
      border: string;
      icon: string;
    };
    danger: {
      bg: string;
      text: string;
      border: string;
      icon: string;
    };
    info: {
      bg: string;
      text: string;
      border: string;
      icon: string;
    };
  };

  message: {
    incomingBg: string;
    incomingText: string;
    incomingSubtext: string;
    outgoingBg: string;
    outgoingText: string;
    outgoingSubtext: string;
  };

  input: {
    bg: string;
    text: string;
    placeholder: string;
    border: string;
  };
}

export const lightThemeTokens: ThemeColors = {
  background: '#F8F7FA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  surfaceElevated: '#FFFFFF',
  surfaceGlass: 'rgba(255, 255, 255, 0.94)',
  surfaceHover: 'rgba(15, 23, 42, 0.04)',
  surfaceActive: 'rgba(124, 58, 237, 0.12)',

  textPrimary: '#0D0B12',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textDisabled: '#94A3B8',

  border: '#E2E8F0',
  borderSubtle: '#F1F5F9',

  brandPrimary: '#7C3AED',
  brandSecondary: '#5B21B6',
  brandGlow: '#A855F7',
  brandSoft: '#C4B5FD',
  brandActive: '#7C3AED',

  status: {
    success: {
      bg: '#DCFCE7', // soft mint-green
      text: '#14532D', // dark forest green for > 7:1 contrast ratio
      border: '#86EFAC',
      icon: '#16A34A',
    },
    warning: {
      bg: '#FEF3C7', // soft amber
      text: '#78350F', // deep amber brown for > 7:1 contrast ratio
      border: '#FDE68A',
      icon: '#D97706',
    },
    danger: {
      bg: '#FEE2E2', // soft rose
      text: '#7F1D1D', // deep crimson red for > 7:1 contrast ratio
      border: '#FCA5A5',
      icon: '#DC2626',
    },
    info: {
      bg: '#E0E7FF', // soft indigo
      text: '#312E81', // deep indigo navy for > 7:1 contrast ratio
      border: '#A5B4FC',
      icon: '#4F46E5',
    },
  },

  message: {
    incomingBg: '#F1F5F9',
    incomingText: '#0D0B12',
    incomingSubtext: '#475569',
    outgoingBg: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #6366F1 100%)',
    outgoingText: '#FFFFFF',
    outgoingSubtext: 'rgba(255, 255, 255, 0.88)',
  },

  input: {
    bg: '#FFFFFF',
    text: '#0D0B12',
    placeholder: '#64748B',
    border: '#CBD5E1',
  },
};

export const darkThemeTokens: ThemeColors = {
  background: '#0D0B12',
  surface: '#130F22',
  surfaceSecondary: '#1A152E',
  surfaceElevated: '#211B3A',
  surfaceGlass: 'rgba(19, 15, 34, 0.92)',
  surfaceHover: 'rgba(255, 255, 255, 0.06)',
  surfaceActive: 'rgba(124, 58, 237, 0.25)',

  textPrimary: '#FFFFFF',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  textDisabled: '#64748B',

  border: 'rgba(255, 255, 255, 0.10)',
  borderSubtle: 'rgba(255, 255, 255, 0.05)',

  brandPrimary: '#7C3AED',
  brandSecondary: '#5B21B6',
  brandGlow: '#A855F7',
  brandSoft: '#C4B5FD',
  brandActive: '#A855F7',

  status: {
    success: {
      bg: 'rgba(34, 197, 94, 0.18)',
      text: '#4ADE80', // high-contrast light green
      border: 'rgba(74, 222, 128, 0.35)',
      icon: '#22C55E',
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.18)',
      text: '#FCD34D', // high-contrast warm yellow
      border: 'rgba(251, 191, 36, 0.35)',
      icon: '#F59E0B',
    },
    danger: {
      bg: 'rgba(239, 68, 68, 0.18)',
      text: '#FCA5A5', // high-contrast light red
      border: 'rgba(248, 113, 113, 0.35)',
      icon: '#EF4444',
    },
    info: {
      bg: 'rgba(99, 102, 241, 0.18)',
      text: '#A5B4FC', // high-contrast light indigo
      border: 'rgba(129, 140, 248, 0.35)',
      icon: '#818CF8',
    },
  },

  message: {
    incomingBg: 'rgba(26, 21, 46, 0.95)',
    incomingText: '#F8FAFC',
    incomingSubtext: '#94A3B8',
    outgoingBg: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #6366F1 100%)',
    outgoingText: '#FFFFFF',
    outgoingSubtext: 'rgba(255, 255, 255, 0.88)',
  },

  input: {
    bg: 'rgba(26, 21, 46, 0.85)',
    text: '#FFFFFF',
    placeholder: '#94A3B8',
    border: 'rgba(255, 255, 255, 0.14)',
  },
};

/**
 * Returns CSS variable declaration object for runtime injection if needed
 */
export function getCssVariablesForTheme(isDark: boolean): Record<string, string> {
  const tokens = isDark ? darkThemeTokens : lightThemeTokens;

  return {
    '--background': tokens.background,
    '--surface': tokens.surface,
    '--surface-secondary': tokens.surfaceSecondary,
    '--surface-elevated': tokens.surfaceElevated,
    '--surface-glass': tokens.surfaceGlass,
    '--surface-hover': tokens.surfaceHover,
    '--surface-active': tokens.surfaceActive,

    '--text-primary': tokens.textPrimary,
    '--text-secondary': tokens.textSecondary,
    '--text-muted': tokens.textMuted,
    '--text-disabled': tokens.textDisabled,

    '--border': tokens.border,
    '--border-subtle': tokens.borderSubtle,

    '--brand-primary': tokens.brandPrimary,
    '--brand-secondary': tokens.brandSecondary,
    '--brand-glow': tokens.brandGlow,
    '--brand-soft': tokens.brandSoft,
    '--brand-active': tokens.brandActive,

    // Aliased Rovela design tokens
    '--rovela-bg': tokens.background,
    '--rovela-surface': tokens.surface,
    '--rovela-surface-secondary': tokens.surfaceSecondary,
    '--rovela-surface-elevated': tokens.surfaceElevated,
    '--rovela-surface-glass': tokens.surfaceGlass,
    '--rovela-surface-hover': tokens.surfaceHover,
    '--rovela-surface-active': tokens.surfaceActive,

    '--rovela-text-primary': tokens.textPrimary,
    '--rovela-text-secondary': tokens.textSecondary,
    '--rovela-text-muted': tokens.textMuted,
    '--rovela-text-disabled': tokens.textDisabled,

    '--rovela-border': tokens.border,
    '--rovela-border-subtle': tokens.borderSubtle,

    '--rovela-brand-primary': tokens.brandPrimary,
    '--rovela-brand-secondary': tokens.brandSecondary,
    '--rovela-brand-glow': tokens.brandGlow,
    '--rovela-brand-soft': tokens.brandSoft,
    '--rovela-brand-active': tokens.brandActive,

    // Status Tokens
    '--status-success-bg': tokens.status.success.bg,
    '--status-success-text': tokens.status.success.text,
    '--status-success-border': tokens.status.success.border,
    '--status-success-icon': tokens.status.success.icon,

    '--status-warning-bg': tokens.status.warning.bg,
    '--status-warning-text': tokens.status.warning.text,
    '--status-warning-border': tokens.status.warning.border,
    '--status-warning-icon': tokens.status.warning.icon,

    '--status-danger-bg': tokens.status.danger.bg,
    '--status-danger-text': tokens.status.danger.text,
    '--status-danger-border': tokens.status.danger.border,
    '--status-danger-icon': tokens.status.danger.icon,

    '--status-info-bg': tokens.status.info.bg,
    '--status-info-text': tokens.status.info.text,
    '--status-info-border': tokens.status.info.border,
    '--status-info-icon': tokens.status.info.icon,

    // Aliased Rovela Status Tokens
    '--rovela-status-success-bg': tokens.status.success.bg,
    '--rovela-status-success-text': tokens.status.success.text,
    '--rovela-status-success-border': tokens.status.success.border,
    '--rovela-status-success-icon': tokens.status.success.icon,

    '--rovela-status-warning-bg': tokens.status.warning.bg,
    '--rovela-status-warning-text': tokens.status.warning.text,
    '--rovela-status-warning-border': tokens.status.warning.border,
    '--rovela-status-warning-icon': tokens.status.warning.icon,

    '--rovela-status-danger-bg': tokens.status.danger.bg,
    '--rovela-status-danger-text': tokens.status.danger.text,
    '--rovela-status-danger-border': tokens.status.danger.border,
    '--rovela-status-danger-icon': tokens.status.danger.icon,

    '--rovela-status-info-bg': tokens.status.info.bg,
    '--rovela-status-info-text': tokens.status.info.text,
    '--rovela-status-info-border': tokens.status.info.border,
    '--rovela-status-info-icon': tokens.status.info.icon,

    // Input Tokens
    '--rovela-input-bg': tokens.input.bg,
    '--rovela-input-text': tokens.input.text,
    '--rovela-input-placeholder': tokens.input.placeholder,
    '--rovela-input-border': tokens.input.border,

    // Messaging Tokens
    '--rovela-msg-incoming-bg': tokens.message.incomingBg,
    '--rovela-msg-incoming-text': tokens.message.incomingText,
    '--rovela-msg-incoming-subtext': tokens.message.incomingSubtext,
    '--rovela-msg-outgoing-bg': tokens.message.outgoingBg,
    '--rovela-msg-outgoing-text': tokens.message.outgoingText,
    '--rovela-msg-outgoing-subtext': tokens.message.outgoingSubtext,
  };
}

export interface DynamicGlobalSettings {
  siteName?: string;
  siteTagline?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  glowColor?: string;
  surfaceGlassBlur?: number;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return { r, g, b };
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

export function adjustColorBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const adjust = (val: number) => Math.min(255, Math.max(0, Math.round(val + (val * percent) / 100)));
  const r = adjust(rgb.r).toString(16).padStart(2, '0');
  const g = adjust(rgb.g).toString(16).padStart(2, '0');
  const b = adjust(rgb.b).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

/**
 * Propagates admin system settings to the global site DOM:
 * - Dynamic CSS variables (--brand-primary, --rovela-primary, --brand-glow, --rovela-surface-glass-blur, etc.)
 * - Document title and OpenGraph metadata
 * - Favicon and Apple touch icons
 */
export function applyGlobalSettingsToDocument(settings: DynamicGlobalSettings) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // 1. Accent & Brand Colors
  if (settings.primaryColor) {
    const primary = settings.primaryColor;
    const glow = settings.glowColor || primary;
    const darker = adjustColorBrightness(primary, -25);
    const softer = adjustColorBrightness(primary, 40);
    const primaryRgb = hexToRgb(primary);
    const glowRgb = hexToRgb(glow);

    root.style.setProperty('--brand-primary', primary);
    root.style.setProperty('--rovela-brand-primary', primary);
    root.style.setProperty('--rovela-primary', primary);

    root.style.setProperty('--brand-glow', glow);
    root.style.setProperty('--rovela-brand-glow', glow);
    root.style.setProperty('--rovela-glow', glow);

    root.style.setProperty('--brand-secondary', darker);
    root.style.setProperty('--rovela-brand-secondary', darker);

    root.style.setProperty('--brand-soft', softer);
    root.style.setProperty('--rovela-brand-soft', softer);

    root.style.setProperty('--brand-active', primary);
    root.style.setProperty('--rovela-brand-active', primary);

    root.style.setProperty(
      '--rovela-msg-outgoing-bg',
      `linear-gradient(135deg, ${primary} 0%, ${glow} 100%)`
    );

    if (primaryRgb) {
      root.style.setProperty('--rovela-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
    }
    if (glowRgb) {
      root.style.setProperty('--rovela-glow-rgb', `${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}`);
    }
  }

  // 2. Liquid Glass Blur Radius
  if (typeof settings.surfaceGlassBlur === 'number') {
    const blur = Math.max(4, Math.min(40, settings.surfaceGlassBlur));
    root.style.setProperty('--rovela-surface-glass-blur', `${blur}px`);
  }

  // 3. Document Title & Head Branding
  if (settings.siteName) {
    const titleText = settings.siteTagline
      ? `${settings.siteName} — ${settings.siteTagline}`
      : `${settings.siteName} — Next-Generation Liquid Glass Communication`;
    document.title = titleText;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', settings.siteName);
  }

  // 4. Favicon & Apple Touch Icon
  if (settings.faviconUrl || settings.logoUrl) {
    const iconUrl = settings.faviconUrl || settings.logoUrl || '/rovela-icon.png';
    const favicons = document.querySelectorAll<HTMLLinkElement>('link[rel="icon"], link[rel="apple-touch-icon"]');
    favicons.forEach((el) => {
      el.href = iconUrl;
    });
  }
}
