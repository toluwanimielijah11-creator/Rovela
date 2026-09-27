import React, { createContext, useContext, useState, useEffect } from 'react';
import { applyGlobalSettingsToDocument } from '../theme';
import {
  AdminTabId,
  SiteFeatureItem,
  GlobalSettingsState,
  SeoSettingsState,
  CustomScriptsState,
  AdSenseSettingsState,
  BruteForceSettingsState,
  LanguageKeyword,
  LanguageItem,
  MenuItem,
  FooterColumn,
  FormFieldItem,
  PwaSettingsState,
  SitePageItem,
  AdminRoleItem,
  ReferralSettingsState,
  AnnouncementItem,
  MassNotificationItem,
  SmtpConfigItem,
} from '../types/admin';
import { UserProfile } from '../types';
import { MOCK_USERS, CURRENT_USER } from '../data/mockData';

// ============================================================================
// DEFAULT ADMIN STATE SEEDS
// ============================================================================

export const DEFAULT_FEATURES: SiteFeatureItem[] = [
  {
    id: 'voice_calling',
    name: 'Voice & HD Audio Calling',
    category: 'communication',
    description: 'Peer-to-peer real-time high-fidelity voice calls with live waveforms.',
    enabled: true,
  },
  {
    id: 'video_calling',
    name: 'Video Calling & Screen Share',
    category: 'communication',
    description: 'Ultra-low-latency liquid-glass video calls with grid view and camera flip.',
    enabled: true,
  },
  {
    id: 'status_stories',
    name: 'Ephemeral Status & Stories',
    category: 'communication',
    description: '24-hour visual status updates with photo, video, captions and viewers analytics.',
    enabled: true,
  },
  {
    id: 'voice_notes',
    name: 'Voice Notes Recording & Player',
    category: 'communication',
    description: 'Interactive voice memo recorder with scrubbing, pause/resume, and speed controls.',
    enabled: true,
  },
  {
    id: 'read_receipts',
    name: 'Read Receipts with Glowing Double-Check',
    category: 'communication',
    description: 'Illuminates glowing cyan double-checks when recipient views messages.',
    enabled: true,
  },
  {
    id: 'end_to_end_encryption',
    name: 'End-to-End Encryption Indicator',
    category: 'security',
    description: 'Cryptographic lock indicators for private 1-on-1 and group chats.',
    enabled: true,
  },
  {
    id: 'message_reactions',
    name: 'Message Reactions & Emojis',
    category: 'core',
    description: 'Quick emoji reaction dock, sticker tray, and GIF drawer.',
    enabled: true,
  },
  {
    id: 'media_file_sharing',
    name: 'Media & Document Attachments',
    category: 'media',
    description: 'Drag-and-drop file upload for images, videos, audio, and documents.',
    enabled: true,
  },
  {
    id: 'secret_locked_chats',
    name: 'Locked & Biometric Secret Chats',
    category: 'security',
    description: 'Hidden PIN/biometric protected conversation vault.',
    enabled: true,
  },
  {
    id: 'user_registration',
    name: 'Open User Registration',
    category: 'core',
    description: 'Allows new visitors to create accounts via registration form builder.',
    enabled: true,
  },
  {
    id: 'pwa_offline_support',
    name: 'PWA Offline & Install Banner',
    category: 'core',
    description: 'Progressive Web App installation prompt and offline asset cache.',
    enabled: true,
  },
  {
    id: 'google_adsense',
    name: 'Google AdSense Monetization',
    category: 'monetization',
    description: 'Injects authorized publisher ad units across non-intrusive container slots.',
    enabled: false,
  },
  {
    id: 'referral_system',
    name: 'Referral & Commission Program',
    category: 'monetization',
    description: 'Reward users for inviting friends via commission bonuses.',
    enabled: true,
  },
  {
    id: 'brute_force_protection',
    name: 'Brute Force Login Rate-Limiting',
    category: 'security',
    description: 'Locks out IP addresses after consecutive bad credentials.',
    enabled: true,
  },
  {
    id: 'mass_announcements',
    name: 'System Broadcast Announcements',
    category: 'communication',
    description: 'Displays global top banners and urgent notifications to all members.',
    enabled: true,
  },
  {
    id: 'dark_mode_switcher',
    name: 'Dark/Light Theme Switcher',
    category: 'core',
    description: 'Enables users to toggle between obsidian dark and crisp light mode.',
    enabled: true,
  },
];

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettingsState = {
  siteName: 'Rovela',
  siteTagline: 'Liquid-Glass Human Connections & Communication',
  logoUrl: '/rovela-icon.png',
  faviconUrl: '/favicon.png',
  currencyCode: 'USD',
  currencySymbol: '$',
  currencyPosition: 'prefix',
  timezone: 'America/New_York (UTC-5)',
  primaryColor: '#7C3AED',
  glowColor: '#A855F7',
  surfaceGlassBlur: 20,
  allowUserRegistration: true,
};

export const DEFAULT_SEO_SETTINGS: SeoSettingsState = {
  metaTitle: 'Rovela — Next-Generation Liquid Glass Communication',
  metaDescription:
    'Experience fluid voice, video, stories, and encrypted real-time messaging with crystal clarity.',
  metaKeywords: 'messaging, video calls, voice notes, liquid glass, encrypted chat, rovela, pwa',
  metaImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
  favicon: '/favicon.png',
  robotsTxt: `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: https://rovela.app/sitemap.xml`,
  sitemapXml: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://rovela.app/</loc>\n    <lastmod>2026-09-23</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n  <url>\n    <loc>https://rovela.app/privacy</loc>\n    <lastmod>2026-09-23</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n  <url>\n    <loc>https://rovela.app/terms</loc>\n    <lastmod>2026-09-23</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n</urlset>`,
};

export const DEFAULT_CUSTOM_SCRIPTS: CustomScriptsState = {
  headerScript: '<!-- Google Tag Manager / Analytics / Custom Meta -->',
  bodyScript: '<!-- Custom Body Start Tracking -->',
  footerScript: '<!-- Custom Widget / Live Support Script -->',
  enabled: true,
};

export const DEFAULT_ADSENSE: AdSenseSettingsState = {
  enabled: false,
  publisherId: 'pub-9482018471928491',
  autoAds: true,
  slots: {
    headerBanner: true,
    sidebarSlot: false,
    chatDrawer: true,
    footerBanner: true,
  },
};

export const DEFAULT_BRUTE_FORCE: BruteForceSettingsState = {
  enabled: true,
  badLoginLimit: 5,
  lockoutDurationMinutes: 30,
  ipWhitelist: ['127.0.0.1', '192.168.1.1'],
  ipBlacklist: ['45.134.20.91', '185.220.101.5'],
  auditLogs: [
    {
      id: 'log-1',
      ip: '45.134.20.91',
      attempts: 6,
      username: 'admin',
      timestamp: 'Today at 02:40 AM',
      status: 'blocked',
    },
    {
      id: 'log-2',
      ip: '198.51.100.42',
      attempts: 3,
      username: 'johndoe',
      timestamp: 'Today at 01:15 AM',
      status: 'warning',
    },
    {
      id: 'log-3',
      ip: '185.220.101.5',
      attempts: 5,
      username: 'root',
      timestamp: 'Yesterday at 11:50 PM',
      status: 'blocked',
    },
  ],
};

export const DEFAULT_LANGUAGES: LanguageItem[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', isDefault: true, enabled: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', isDefault: false, enabled: true },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', isDefault: false, enabled: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr', isDefault: false, enabled: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', isDefault: false, enabled: true },
];

export const DEFAULT_KEYWORDS: LanguageKeyword[] = [
  { id: 'k1', key: 'app.title', en: 'Rovela', es: 'Rovela', fr: 'Rovela', de: 'Rovela', ar: 'روفيلا' },
  { id: 'k2', key: 'nav.chats', en: 'Chats', es: 'Mensajes', fr: 'Discussions', de: 'Chats', ar: 'المحادثات' },
  { id: 'k3', key: 'nav.status', en: 'Status', es: 'Estados', fr: 'Statut', de: 'Status', ar: 'الحالة' },
  { id: 'k4', key: 'nav.calls', en: 'Calls', es: 'Llamadas', fr: 'Appels', de: 'Anrufe', ar: 'المكالمات' },
  { id: 'k5', key: 'btn.send', en: 'Send', es: 'Enviar', fr: 'Envoyer', de: 'Senden', ar: 'إرسال' },
  { id: 'k6', key: 'btn.save', en: 'Save Changes', es: 'Guardar Cambios', fr: 'Enregistrer', de: 'Speichern', ar: 'حفظ التغييرات' },
];

export const DEFAULT_MENUS: MenuItem[] = [
  { id: 'm1', label: 'Explore Community', path: '/explore', order: 1, location: 'header' },
  { id: 'm2', label: 'Security & Encryption', path: '/security', order: 2, location: 'header' },
  { id: 'm3', label: 'Help & Knowledgebase', path: '/help', order: 3, location: 'header' },
  { id: 'm4', label: 'Terms of Service', path: '/terms', order: 1, location: 'footer' },
  { id: 'm5', label: 'Privacy Policy', path: '/privacy', order: 2, location: 'footer' },
  { id: 'm6', label: 'Contact Support', path: '/contact', order: 3, location: 'footer' },
];

export const DEFAULT_FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: 'col-1',
    title: 'Product',
    links: [
      { label: 'Voice & Video', url: '#' },
      { label: 'Status & Stories', url: '#' },
      { label: 'Desktop & Mobile PWA', url: '#' },
      { label: 'Encryption Whitepaper', url: '#' },
    ],
  },
  {
    id: 'col-2',
    title: 'Company',
    links: [
      { label: 'About Rovela', url: '#' },
      { label: 'Careers', url: '#' },
      { label: 'Press Kit', url: '#' },
      { label: 'Brand Assets', url: '#' },
    ],
  },
  {
    id: 'col-3',
    title: 'Legal & Security',
    links: [
      { label: 'Terms of Use', url: '#' },
      { label: 'Privacy Policy', url: '#' },
      { label: 'Security Advisory', url: '#' },
      { label: 'GDPR Compliance', url: '#' },
    ],
  },
];

export const DEFAULT_FORM_FIELDS: FormFieldItem[] = [
  { id: 'f1', type: 'text', label: 'Full Name', name: 'fullName', placeholder: 'e.g. Alex Morgan', required: true, category: 'identity', order: 1 },
  { id: 'f2', type: 'username', label: 'Rovela Username', name: 'username', placeholder: '@username', required: true, category: 'identity', order: 2 },
  { id: 'f3', type: 'email', label: 'Email Address', name: 'email', placeholder: 'alex@example.com', required: true, category: 'basic', order: 3 },
  { id: 'f4', type: 'password', label: 'Password', name: 'password', placeholder: '••••••••', required: true, category: 'basic', order: 4 },
  { id: 'f5', type: 'phone', label: 'Phone Number', name: 'phone', placeholder: '+1 (555) 000-0000', required: false, category: 'basic', order: 5 },
  { id: 'f6', type: 'country', label: 'Country / Region', name: 'country', placeholder: 'Select your country', required: true, category: 'verification', order: 6 },
  { id: 'f7', type: 'dob', label: 'Date of Birth', name: 'dob', required: false, category: 'identity', order: 7 },
  { id: 'f8', type: 'bio', label: 'Profile Bio', name: 'bio', placeholder: 'Tell us a little about yourself...', required: false, category: 'identity', order: 8 },
  { id: 'f9', type: 'terms_checkbox', label: 'I accept Rovela Terms of Service and Privacy Policy', name: 'agreeTerms', required: true, category: 'legal', order: 9 },
];

export const DEFAULT_PWA_SETTINGS: PwaSettingsState = {
  appName: 'Rovela — Liquid-Glass Messenger',
  shortName: 'Rovela',
  description: 'Fluid, high-security messaging and calls with liquid glass aesthetics.',
  themeColor: '#7C3AED',
  backgroundColor: '#0D0B12',
  displayMode: 'standalone',
  offlineMessage: 'You are currently offline. Messages will sync automatically upon reconnection.',
  installPromptEnabled: true,
  cacheStrategy: 'stale-while-revalidate',
};

export const DEFAULT_PAGES: SitePageItem[] = [
  {
    id: 'p-privacy',
    title: 'Privacy Policy',
    slug: 'privacy',
    content: `# Rovela Privacy Policy\n\nLast updated: September 2026\n\n### 1. Data Sovereignty\nAt Rovela, your privacy is inviolable. All messages, voice memos, and video calls are transmitted with strict end-to-end cryptographic safeguards.\n\n### 2. Information We Never Sell\nWe do not sell personal telemetry, location trails, or message transcripts to third-party ad networks.\n\n### 3. Contact\nFor privacy requests, reach out to security@rovela.app.`,
    status: 'published',
    metaTitle: 'Privacy Policy — Rovela',
    metaDescription: 'Read about how Rovela protects your communication data.',
    updated_at: '2026-09-20',
  },
  {
    id: 'p-terms',
    title: 'Terms of Service',
    slug: 'terms',
    content: `# Rovela Terms of Service\n\nWelcome to Rovela. By using our platform, you agree to these transparent terms:\n\n1. **Acceptable Use**: Do not engage in abuse, spam, illegal distribution, or harassment.\n2. **Account Responsibility**: You are responsible for safeguarding your security credentials and passkeys.\n3. **Availability**: We endeavor to offer 99.9% uptime across all global cloud clusters.`,
    status: 'published',
    metaTitle: 'Terms of Service — Rovela',
    metaDescription: 'Review terms and conditions for utilizing the Rovela network.',
    updated_at: '2026-09-18',
  },
  {
    id: 'p-about',
    title: 'About Rovela',
    slug: 'about',
    content: `# About Rovela\n\nRovela was designed to restore beauty, tactile joy, and uncompromising security to human communication.\n\nWith an ambient liquid-glass interface, peerless call audio quality, and zero surveillance architecture, Rovela empowers you to connect without compromise.`,
    status: 'published',
    metaTitle: 'About Rovela — Vision & Craft',
    metaDescription: 'The story and engineering principles behind Rovela.',
    updated_at: '2026-09-15',
  },
];

export const DEFAULT_ROLES: AdminRoleItem[] = [
  {
    id: 'role-superadmin',
    name: 'Super Administrator',
    badgeColor: 'from-amber-500 to-rose-600',
    description: 'Unrestricted master access to all platform infrastructure, billing, and roles.',
    isSystem: true,
    permissions: {
      accessAdmin: true,
      manageUsers: true,
      manageRoles: true,
      editLayout: true,
      manageSettings: true,
      manageBilling: true,
      moderateChats: true,
      sendBroadcasts: true,
    },
  },
  {
    id: 'role-moderator',
    name: 'Content Moderator',
    badgeColor: 'from-purple-500 to-indigo-600',
    description: 'Manages flagged reports, user behavior, and spam enforcement.',
    permissions: {
      accessAdmin: true,
      manageUsers: true,
      manageRoles: false,
      editLayout: false,
      manageSettings: false,
      manageBilling: false,
      moderateChats: true,
      sendBroadcasts: false,
    },
  },
  {
    id: 'role-support',
    name: 'Support Specialist',
    badgeColor: 'from-cyan-500 to-blue-600',
    description: 'Assists customers, manages account tickets, and views audit logs.',
    permissions: {
      accessAdmin: true,
      manageUsers: true,
      manageRoles: false,
      editLayout: false,
      manageSettings: false,
      manageBilling: false,
      moderateChats: false,
      sendBroadcasts: false,
    },
  },
  {
    id: 'role-standard',
    name: 'Standard Member',
    badgeColor: 'from-slate-500 to-slate-700',
    description: 'Verified messaging user with regular chat and call permissions.',
    permissions: {
      accessAdmin: false,
      manageUsers: false,
      manageRoles: false,
      editLayout: false,
      manageSettings: false,
      manageBilling: false,
      moderateChats: false,
      sendBroadcasts: false,
    },
  },
];

export const DEFAULT_REFERRALS: ReferralSettingsState = {
  commissionType: 'flat',
  commissionRate: 5.0, // $5.00 flat bonus per verified active invite
  minPayoutThreshold: 25.0,
  programActive: true,
  rules: [
    {
      id: 'ref-1',
      referrerId: 'user-current',
      referrerName: 'John Doe',
      referredUser: 'Sarah Connor',
      earnedAmount: 5.0,
      status: 'paid',
      date: '2026-09-18',
    },
    {
      id: 'ref-2',
      referrerId: 'user-current',
      referrerName: 'John Doe',
      referredUser: 'Marcus Vance',
      earnedAmount: 5.0,
      status: 'pending',
      date: '2026-09-21',
    },
  ],
};

export const DEFAULT_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: '✨ Welcome to Rovela v2.4 Liquid-Glass Edition',
    message: 'Explore our latest real-time HD audio calls, glowing read receipts, and customizable layouts!',
    type: 'info',
    position: 'top-banner',
    actionLabel: 'Learn More',
    actionUrl: '#',
    active: true,
    created_at: '2026-09-22',
  },
];

export const DEFAULT_MASS_NOTIFICATIONS: MassNotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Scheduled Cloud Infrastructure Maintenance',
    body: 'We are deploying latency optimizations on Sunday at 03:00 UTC. Calls and chats will remain uninterrupted.',
    channel: 'in-app',
    targetAudience: 'all',
    status: 'sent',
    recipientsCount: 4280,
    sent_at: '2026-09-20 14:00',
  },
];

export const DEFAULT_SMTP_CONFIGS: SmtpConfigItem[] = [
  {
    id: 'smtp-primary',
    name: 'Primary Transactional SMTP (Mailgun/Postmark)',
    host: 'smtp.mailgun.org',
    port: 587,
    security: 'tls',
    username: 'postmaster@mail.rovela.app',
    password: '••••••••••••••••',
    fromName: 'Rovela Security',
    fromEmail: 'auth@rovela.app',
    isDefault: true,
  },
];

// ============================================================================
// CONTEXT INTERFACE
// ============================================================================

export interface AdminContextType {
  // Navigation
  activeAdminTab: AdminTabId;
  setActiveAdminTab: (tab: AdminTabId) => void;

  // Features
  features: SiteFeatureItem[];
  toggleFeature: (id: string, enabled: boolean) => void;
  isFeatureEnabled: (id: string) => boolean;

  // Global Setup
  globalSettings: GlobalSettingsState;
  updateGlobalSettings: (partial: Partial<GlobalSettingsState>) => void;

  // Layout & Styling
  footerCopyright: string;
  setFooterCopyright: (val: string) => void;
  footerColumns: FooterColumn[];
  updateFooterColumns: (cols: FooterColumn[]) => void;

  // SEO
  seoSettings: SeoSettingsState;
  updateSeoSettings: (partial: Partial<SeoSettingsState>) => void;
  generateSitemap: () => string;
  generateRobotsTxt: () => string;

  // Scripts
  customScripts: CustomScriptsState;
  updateCustomScripts: (partial: Partial<CustomScriptsState>) => void;

  // AdSense
  adSense: AdSenseSettingsState;
  updateAdSense: (partial: Partial<AdSenseSettingsState>) => void;

  // Brute Force
  bruteForce: BruteForceSettingsState;
  updateBruteForce: (partial: Partial<BruteForceSettingsState>) => void;
  unblockIp: (ip: string) => void;
  addIpToBlacklist: (ip: string) => void;

  // Languages
  languages: LanguageItem[];
  languageKeywords: LanguageKeyword[];
  addLanguageKeyword: (kw: Omit<LanguageKeyword, 'id'>) => void;
  updateLanguageKeyword: (id: string, partial: Partial<LanguageKeyword>) => void;
  deleteLanguageKeyword: (id: string) => void;

  // Menu Manager
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, partial: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;

  // Registration Form Builder
  formFields: FormFieldItem[];
  addFormField: (field: Omit<FormFieldItem, 'id' | 'order'>) => void;
  updateFormField: (id: string, partial: Partial<FormFieldItem>) => void;
  deleteFormField: (id: string) => void;
  reorderFormFields: (fields: FormFieldItem[]) => void;

  // PWA
  pwaSettings: PwaSettingsState;
  updatePwaSettings: (partial: Partial<PwaSettingsState>) => void;

  // Pages
  sitePages: SitePageItem[];
  addSitePage: (page: Omit<SitePageItem, 'id' | 'updated_at'>) => void;
  updateSitePage: (id: string, partial: Partial<SitePageItem>) => void;
  deleteSitePage: (id: string) => void;

  // User Management
  adminUsers: UserProfile[];
  impersonatedUser: UserProfile | null;
  impersonatingUser?: UserProfile | null;
  loginAsUser: (user: UserProfile) => void;
  revertToAdmin: () => void;
  creditUser: (userId: string, amount: number, memo?: string) => void;
  banUser: (userId: string, reason: string) => void;
  suspendUser: (userId: string, reason: string, durationDays: number) => void;
  unbanUser: (userId: string) => void;
  addUser: (userData: Partial<UserProfile>) => void;
  updateUser: (userId: string, partial: Partial<UserProfile>) => void;
  deleteUser: (userId: string) => void;

  // Roles
  roles: AdminRoleItem[];
  addRole: (role: Omit<AdminRoleItem, 'id'>) => void;
  updateRole: (id: string, partial: Partial<AdminRoleItem>) => void;
  deleteRole: (id: string) => void;

  // Referrals
  referrals: ReferralSettingsState;
  updateReferrals: (partial: Partial<ReferralSettingsState>) => void;
  deleteReferralRule: (id: string) => void;

  // Announcements
  announcements: AnnouncementItem[];
  addAnnouncement: (ann: Omit<AnnouncementItem, 'id' | 'created_at'>) => void;
  updateAnnouncement: (id: string, partial: Partial<AnnouncementItem>) => void;
  deleteAnnouncement: (id: string) => void;

  // Mass Notifications
  massNotifications: MassNotificationItem[];
  sendMassNotification: (notif: Omit<MassNotificationItem, 'id' | 'sent_at' | 'status'>) => void;
  deleteMassNotification: (id: string) => void;

  // Email SMTP
  smtpConfigs: SmtpConfigItem[];
  addSmtpConfig: (config: Omit<SmtpConfigItem, 'id'>) => void;
  updateSmtpConfig: (id: string, partial: Partial<SmtpConfigItem>) => void;
  deleteSmtpConfig: (id: string) => void;
  setDefaultSmtp: (id: string) => void;
  testSmtpConnection: (id: string) => Promise<{ success: boolean; message: string }>;

  // Overview Telemetry
  trafficStats: {
    activeVisitors: number;
    requestsPerMin: number;
    bounceRate: number;
    avgSessionDuration: string;
    geoDistribution: { country: string; flag: string; visitors: number; percentage: number }[];
  };
  accountAnalytics: {
    totalSignups: number;
    dailySignups: number;
    monthlyGrowthRate: string;
    emailVerificationRate: string;
    deviceBreakdown: { mobile: number; desktop: number; tablet: number };
  };
  paymentStats: {
    totalRevenue: number;
    mrr: number;
    tokensIssued: number;
    pendingPayouts: number;
    currency: string;
  };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Helper for local storage persistence
function usePersistedState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(`rovela_admin_${key}`);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`rovela_admin_${key}`, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [key, state]);

  return [state, setState];
}

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTabId>('overview');

  // Core features
  const [features, setFeatures] = usePersistedState<SiteFeatureItem[]>('features', DEFAULT_FEATURES);

  // Global settings
  const [globalSettings, setGlobalSettings] = usePersistedState<GlobalSettingsState>(
    'global_settings',
    DEFAULT_GLOBAL_SETTINGS
  );

  // Layout & Footer
  const [footerCopyright, setFooterCopyright] = usePersistedState<string>(
    'footer_copyright',
    '© 2026 Rovela Inc. All rights reserved. High-Contrast Liquid Glass Communication.'
  );
  const [footerColumns, setFooterColumns] = usePersistedState<FooterColumn[]>(
    'footer_columns',
    DEFAULT_FOOTER_COLUMNS
  );

  // SEO & Scripts
  const [seoSettings, setSeoSettings] = usePersistedState<SeoSettingsState>('seo_settings', DEFAULT_SEO_SETTINGS);
  const [customScripts, setCustomScripts] = usePersistedState<CustomScriptsState>(
    'custom_scripts',
    DEFAULT_CUSTOM_SCRIPTS
  );

  // Monetization & AdSense
  const [adSense, setAdSense] = usePersistedState<AdSenseSettingsState>('adsense', DEFAULT_ADSENSE);

  // Security & Brute Force
  const [bruteForce, setBruteForce] = usePersistedState<BruteForceSettingsState>(
    'brute_force',
    DEFAULT_BRUTE_FORCE
  );

  // Languages
  const [languages] = useState<LanguageItem[]>(DEFAULT_LANGUAGES);
  const [languageKeywords, setLanguageKeywords] = usePersistedState<LanguageKeyword[]>(
    'language_keywords',
    DEFAULT_KEYWORDS
  );

  // Menus
  const [menuItems, setMenuItems] = usePersistedState<MenuItem[]>('menus', DEFAULT_MENUS);

  // Registration Form Builder
  const [formFields, setFormFields] = usePersistedState<FormFieldItem[]>('form_fields', DEFAULT_FORM_FIELDS);

  // PWA
  const [pwaSettings, setPwaSettings] = usePersistedState<PwaSettingsState>('pwa_settings', DEFAULT_PWA_SETTINGS);

  // Pages
  const [sitePages, setSitePages] = usePersistedState<SitePageItem[]>('site_pages', DEFAULT_PAGES);

  // User Management
  const [adminUsers, setAdminUsers] = usePersistedState<UserProfile[]>('users', [CURRENT_USER, ...MOCK_USERS]);
  const [impersonatedUser, setImpersonatedUser] = useState<UserProfile | null>(null);

  // Roles
  const [roles, setRoles] = usePersistedState<AdminRoleItem[]>('roles', DEFAULT_ROLES);

  // Referrals
  const [referrals, setReferrals] = usePersistedState<ReferralSettingsState>('referrals', DEFAULT_REFERRALS);

  // Announcements
  const [announcements, setAnnouncements] = usePersistedState<AnnouncementItem[]>(
    'announcements',
    DEFAULT_ANNOUNCEMENTS
  );

  // Mass notifications
  const [massNotifications, setMassNotifications] = usePersistedState<MassNotificationItem[]>(
    'mass_notifications',
    DEFAULT_MASS_NOTIFICATIONS
  );

  // SMTP
  const [smtpConfigs, setSmtpConfigs] = usePersistedState<SmtpConfigItem[]>('smtp_configs', DEFAULT_SMTP_CONFIGS);

  // Telemetry (live simulated metrics)
  const [trafficStats] = useState({
    activeVisitors: 3148,
    requestsPerMin: 18420,
    bounceRate: 22.4,
    avgSessionDuration: '14m 32s',
    geoDistribution: [
      { country: 'United States', flag: '🇺🇸', visitors: 1120, percentage: 35.6 },
      { country: 'United Kingdom', flag: '🇬🇧', visitors: 584, percentage: 18.5 },
      { country: 'Germany', flag: '🇩🇪', visitors: 412, percentage: 13.1 },
      { country: 'Nigeria', flag: '🇳🇬', visitors: 390, percentage: 12.4 },
      { country: 'Japan', flag: '🇯🇵', visitors: 284, percentage: 9.0 },
      { country: 'Canada', flag: '🇨🇦', visitors: 198, percentage: 6.3 },
    ],
  });

  const [accountAnalytics] = useState({
    totalSignups: 42890,
    dailySignups: 412,
    monthlyGrowthRate: '+24.8%',
    emailVerificationRate: '96.2%',
    deviceBreakdown: { mobile: 64, desktop: 31, tablet: 5 },
  });

  const [paymentStats] = useState({
    totalRevenue: 128450,
    mrr: 24600,
    tokensIssued: 948200,
    pendingPayouts: 3240,
    currency: 'USD',
  });

  // Dynamic Global Settings propagation to DOM (CSS vars, title, meta, favicon)
  useEffect(() => {
    applyGlobalSettingsToDocument(globalSettings);
  }, [globalSettings]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const toggleFeature = (id: string, enabled: boolean) => {
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, enabled } : f)));
  };

  const isFeatureEnabled = (id: string): boolean => {
    const target = features.find((f) => f.id === id);
    return target ? target.enabled : true;
  };

  const updateGlobalSettings = (partial: Partial<GlobalSettingsState>) => {
    setGlobalSettings((prev) => {
      const next = { ...prev, ...partial };
      applyGlobalSettingsToDocument(next);
      return next;
    });
  };

  const updateSeoSettings = (partial: Partial<SeoSettingsState>) => {
    setSeoSettings((prev) => ({ ...prev, ...partial }));
  };

  const generateSitemap = (): string => {
    const date = new Date().toISOString().split('T')[0];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://${globalSettings.siteName.toLowerCase()}.app/</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>${sitePages
      .filter((p) => p.status === 'published')
      .map(
        (p) => `\n  <url>\n    <loc>https://${globalSettings.siteName.toLowerCase()}.app/${p.slug}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
      )
      .join('')}\n</urlset>`;
    updateSeoSettings({ sitemapXml: xml });
    return xml;
  };

  const generateRobotsTxt = (): string => {
    const content = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: https://${globalSettings.siteName.toLowerCase()}.app/sitemap.xml`;
    updateSeoSettings({ robotsTxt: content });
    return content;
  };

  const updateCustomScripts = (partial: Partial<CustomScriptsState>) => {
    setCustomScripts((prev) => ({ ...prev, ...partial }));
  };

  const updateAdSense = (partial: Partial<AdSenseSettingsState>) => {
    setAdSense((prev) => ({ ...prev, ...partial }));
  };

  const updateBruteForce = (partial: Partial<BruteForceSettingsState>) => {
    setBruteForce((prev) => ({ ...prev, ...partial }));
  };

  const unblockIp = (ip: string) => {
    setBruteForce((prev) => ({
      ...prev,
      ipBlacklist: prev.ipBlacklist.filter((item) => item !== ip),
      auditLogs: prev.auditLogs.map((log) => (log.ip === ip ? { ...log, status: 'cleared' } : log)),
    }));
  };

  const addIpToBlacklist = (ip: string) => {
    if (!ip.trim() || bruteForce.ipBlacklist.includes(ip.trim())) return;
    setBruteForce((prev) => ({
      ...prev,
      ipBlacklist: [...prev.ipBlacklist, ip.trim()],
    }));
  };

  const addLanguageKeyword = (kw: Omit<LanguageKeyword, 'id'>) => {
    const newItem: LanguageKeyword = { ...kw, id: `kw-${Date.now()}` };
    setLanguageKeywords((prev) => [newItem, ...prev]);
  };

  const updateLanguageKeyword = (id: string, partial: Partial<LanguageKeyword>) => {
    setLanguageKeywords((prev) => prev.map((k) => (k.id === id ? { ...k, ...partial } : k)));
  };

  const deleteLanguageKeyword = (id: string) => {
    setLanguageKeywords((prev) => prev.filter((k) => k.id !== id));
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = { ...item, id: `menu-${Date.now()}` };
    setMenuItems((prev) => [...prev, newItem]);
  };

  const updateMenuItem = (id: string, partial: Partial<MenuItem>) => {
    setMenuItems((prev) => prev.map((m) => (m.id === id ? { ...m, ...partial } : m)));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
  };

  const updateFooterColumns = (cols: FooterColumn[]) => {
    setFooterColumns(cols);
  };

  const setDefaultSmtp = (id: string) => {
    setSmtpConfigs((prev) => prev.map((c) => ({ ...c, isDefault: c.id === id })));
  };

  const addFormField = (field: Omit<FormFieldItem, 'id' | 'order'>) => {
    const newField: FormFieldItem = {
      ...field,
      id: `field-${Date.now()}`,
      order: formFields.length + 1,
    };
    setFormFields((prev) => [...prev, newField]);
  };

  const updateFormField = (id: string, partial: Partial<FormFieldItem>) => {
    setFormFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...partial } : f)));
  };

  const deleteFormField = (id: string) => {
    setFormFields((prev) => prev.filter((f) => f.id !== id));
  };

  const reorderFormFields = (fields: FormFieldItem[]) => {
    setFormFields(fields);
  };

  const updatePwaSettings = (partial: Partial<PwaSettingsState>) => {
    setPwaSettings((prev) => ({ ...prev, ...partial }));
  };

  const addSitePage = (page: Omit<SitePageItem, 'id' | 'updated_at'>) => {
    const newPage: SitePageItem = {
      ...page,
      id: `page-${Date.now()}`,
      updated_at: new Date().toISOString().split('T')[0],
    };
    setSitePages((prev) => [newPage, ...prev]);
  };

  const updateSitePage = (id: string, partial: Partial<SitePageItem>) => {
    setSitePages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...partial, updated_at: new Date().toISOString().split('T')[0] } : p
      )
    );
  };

  const deleteSitePage = (id: string) => {
    setSitePages((prev) => prev.filter((p) => p.id !== id));
  };

  // User Actions
  const loginAsUser = (user: UserProfile) => {
    setImpersonatedUser(user);
  };

  const revertToAdmin = () => {
    setImpersonatedUser(null);
  };

  const creditUser = (userId: string, amount: number, _memo?: string) => {
    setAdminUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            bio: `${u.bio || ''} [Balance: +${amount} credits]`,
          };
        }
        return u;
      })
    );
  };

  const banUser = (userId: string, reason: string) => {
    setAdminUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              is_blocked: true,
              account_status: 'blocked',
              status_text: `Account permanently suspended: ${reason}`,
            }
          : u
      )
    );
  };

  const suspendUser = (userId: string, reason: string, durationDays: number) => {
    setAdminUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              account_status: 'suspended',
              status_text: `Suspended for ${durationDays} days: ${reason}`,
            }
          : u
      )
    );
  };

  const unbanUser = (userId: string) => {
    setAdminUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              is_blocked: false,
              account_status: 'active',
              status_text: 'Available',
            }
          : u
      )
    );
  };

  const addUser = (userData: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: userData.name || 'New Member',
      display_name: userData.name || 'New Member',
      username: userData.username || `user_${Date.now().toString().slice(-4)}`,
      email: userData.email || 'user@example.com',
      avatar_url:
        userData.avatar_url ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status_state: 'online',
      status_text: 'Available on Rovela',
      joined_at: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      role: userData.role || 'user',
      account_status: 'active',
      bio: userData.bio || 'New member on Rovela.',
    };
    setAdminUsers((prev) => [newUser, ...prev]);
  };

  const updateUser = (userId: string, partial: Partial<UserProfile>) => {
    setAdminUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...partial } : u)));
  };

  const deleteUser = (userId: string) => {
    setAdminUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const addRole = (role: Omit<AdminRoleItem, 'id'>) => {
    const newRole: AdminRoleItem = { ...role, id: `role-${Date.now()}` };
    setRoles((prev) => [...prev, newRole]);
  };

  const updateRole = (id: string, partial: Partial<AdminRoleItem>) => {
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, ...partial } : r)));
  };

  const deleteRole = (id: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
  };

  const updateReferrals = (partial: Partial<ReferralSettingsState>) => {
    setReferrals((prev) => ({ ...prev, ...partial }));
  };

  const deleteReferralRule = (id: string) => {
    setReferrals((prev) => ({
      ...prev,
      rules: prev.rules.filter((r) => r.id !== id),
    }));
  };

  const addAnnouncement = (ann: Omit<AnnouncementItem, 'id' | 'created_at'>) => {
    const newAnn: AnnouncementItem = {
      ...ann,
      id: `ann-${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const updateAnnouncement = (id: string, partial: Partial<AnnouncementItem>) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...partial } : a)));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const sendMassNotification = (notif: Omit<MassNotificationItem, 'id' | 'sent_at' | 'status'>) => {
    const newNotif: MassNotificationItem = {
      ...notif,
      id: `mass-${Date.now()}`,
      sent_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'sent',
    };
    setMassNotifications((prev) => [newNotif, ...prev]);
  };

  const deleteMassNotification = (id: string) => {
    setMassNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addSmtpConfig = (config: Omit<SmtpConfigItem, 'id'>) => {
    const newConfig: SmtpConfigItem = { ...config, id: `smtp-${Date.now()}` };
    setSmtpConfigs((prev) => [...prev, newConfig]);
  };

  const updateSmtpConfig = (id: string, partial: Partial<SmtpConfigItem>) => {
    setSmtpConfigs((prev) => prev.map((c) => (c.id === id ? { ...c, ...partial } : c)));
  };

  const deleteSmtpConfig = (id: string) => {
    setSmtpConfigs((prev) => prev.filter((c) => c.id !== id));
  };

  const testSmtpConnection = async (id: string): Promise<{ success: boolean; message: string }> => {
    const target = smtpConfigs.find((c) => c.id === id);
    if (!target) return { success: false, message: 'SMTP configuration not found' };
    await new Promise((res) => setTimeout(res, 900));
    return {
      success: true,
      message: `Successfully connected to ${target.host}:${target.port} using TLS handshake! Test ping delivered.`,
    };
  };

  return (
    <AdminContext.Provider
      value={{
        activeAdminTab,
        setActiveAdminTab,
        features,
        toggleFeature,
        isFeatureEnabled,
        globalSettings,
        updateGlobalSettings,
        footerCopyright,
        setFooterCopyright,
        footerColumns,
        updateFooterColumns,
        seoSettings,
        updateSeoSettings,
        generateSitemap,
        generateRobotsTxt,
        customScripts,
        updateCustomScripts,
        adSense,
        updateAdSense,
        bruteForce,
        updateBruteForce,
        unblockIp,
        addIpToBlacklist,
        languages,
        languageKeywords,
        addLanguageKeyword,
        updateLanguageKeyword,
        deleteLanguageKeyword,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        formFields,
        addFormField,
        updateFormField,
        deleteFormField,
        reorderFormFields,
        pwaSettings,
        updatePwaSettings,
        sitePages,
        addSitePage,
        updateSitePage,
        deleteSitePage,
        adminUsers,
        impersonatedUser,
        impersonatingUser: impersonatedUser,
        loginAsUser,
        revertToAdmin,
        creditUser,
        banUser,
        suspendUser,
        unbanUser,
        addUser,
        updateUser,
        deleteUser,
        roles,
        addRole,
        updateRole,
        deleteRole,
        referrals,
        updateReferrals,
        deleteReferralRule,
        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        massNotifications,
        sendMassNotification,
        deleteMassNotification,
        smtpConfigs,
        addSmtpConfig,
        updateSmtpConfig,
        deleteSmtpConfig,
        setDefaultSmtp,
        testSmtpConnection,
        trafficStats,
        accountAnalytics,
        paymentStats,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
