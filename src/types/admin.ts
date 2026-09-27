import { UserProfile } from './index';

export type AdminUser = UserProfile;

export type AdminTabId =
  | 'overview'
  | 'feature_manager'
  | 'global_setup'
  | 'seo'
  | 'custom_scripts'
  | 'adsense'
  | 'brute_force'
  | 'languages'
  | 'menu_manager'
  | 'form_builder'
  | 'pwa'
  | 'pages'
  | 'users'
  | 'roles'
  | 'referrals'
  | 'announcements'
  | 'mass_notifications'
  | 'smtp'
  | 'reports';

export interface SiteFeatureItem {
  id: string;
  name: string;
  category: 'core' | 'communication' | 'media' | 'security' | 'monetization' | 'experimental';
  description: string;
  enabled: boolean;
  requiresReload?: boolean;
}

export interface GlobalSettingsState {
  siteName: string;
  siteTagline: string;
  logoUrl: string;
  faviconUrl: string;
  currencyCode: string; // e.g. 'USD'
  currencySymbol: string; // e.g. '$'
  currencyPosition: 'prefix' | 'suffix';
  timezone: string; // e.g. 'UTC'
  primaryColor: string; // e.g. '#7C3AED'
  glowColor: string; // e.g. '#A855F7'
  surfaceGlassBlur: number; // e.g. 20
  allowUserRegistration: boolean;
}

export interface SeoSettingsState {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  metaImage: string;
  favicon: string;
  robotsTxt: string;
  sitemapXml: string;
}

export interface CustomScriptsState {
  headerScript: string;
  bodyScript: string;
  footerScript: string;
  enabled: boolean;
}

export interface AdSenseSettingsState {
  enabled: boolean;
  publisherId: string;
  autoAds: boolean;
  slots: {
    headerBanner: boolean;
    sidebarSlot: boolean;
    chatDrawer: boolean;
    footerBanner: boolean;
  };
}

export interface BruteForceSettingsState {
  enabled: boolean;
  badLoginLimit: number; // default: 5
  lockoutDurationMinutes: number; // default: 30
  ipWhitelist: string[];
  ipBlacklist: string[];
  auditLogs: {
    id: string;
    ip: string;
    attempts: number;
    username: string;
    timestamp: string;
    status: 'blocked' | 'warning' | 'cleared';
  }[];
}

export interface LanguageKeyword {
  id: string;
  key: string;
  en: string;
  es: string;
  fr: string;
  de: string;
  ar: string;
}

export interface LanguageItem {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  isDefault: boolean;
  enabled: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  iconName?: string;
  target?: '_self' | '_blank';
  order: number;
  location: 'header' | 'sidebar' | 'footer';
}

export interface FooterColumn {
  id: string;
  title: string;
  links: { label: string; url: string }[];
}

export interface FormFieldItem {
  id: string;
  type: string;
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  helpText?: string;
  category: 'basic' | 'identity' | 'verification' | 'preferences' | 'legal' | 'advanced';
  options?: string[];
  order: number;
}

export interface PwaSettingsState {
  appName: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  displayMode: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  offlineMessage: string;
  installPromptEnabled: boolean;
  cacheStrategy: 'network-first' | 'cache-first' | 'stale-while-revalidate';
}

export interface SitePageItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
  metaTitle?: string;
  metaDescription?: string;
  updated_at: string;
}

export interface AdminRoleItem {
  id: string;
  name: string;
  badgeColor: string;
  description: string;
  isSystem?: boolean;
  permissions: {
    accessAdmin: boolean;
    manageUsers: boolean;
    manageRoles: boolean;
    editLayout: boolean;
    manageSettings: boolean;
    manageBilling: boolean;
    moderateChats: boolean;
    sendBroadcasts: boolean;
  };
}

export interface ReferralSettingsState {
  commissionType: 'flat' | 'percentage';
  commissionRate: number; // e.g. 5 for $5 flat or 15 for 15%
  minPayoutThreshold: number; // e.g. 20
  programActive: boolean;
  rules: {
    id: string;
    referrerId: string;
    referrerName: string;
    referredUser: string;
    earnedAmount: number;
    status: 'paid' | 'pending';
    date: string;
  }[];
}

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'maintenance';
  position: 'top-banner' | 'modal' | 'toast';
  actionLabel?: string;
  actionUrl?: string;
  active: boolean;
  created_at: string;
  expires_at?: string;
}

export interface MassNotificationItem {
  id: string;
  title: string;
  body: string;
  channel: 'in-app' | 'email' | 'push';
  targetAudience: 'all' | 'active-users' | 'admins' | 'new-users';
  status: 'sent' | 'scheduled' | 'draft';
  recipientsCount: number;
  sent_at?: string;
}

export interface SmtpConfigItem {
  id: string;
  name: string;
  host: string;
  port: number;
  security: 'tls' | 'ssl' | 'none';
  username: string;
  password?: string;
  fromName: string;
  fromEmail: string;
  isDefault: boolean;
}
