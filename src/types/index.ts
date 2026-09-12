export type UserStatus = 'online' | 'away' | 'offline' | 'busy';

export type PrivacyVisibility = 'everyone' | 'contacts' | 'nobody';

export interface UserProfile {
  id: string;
  name: string;
  username: string; // Rovela ID (@username)
  email: string;
  avatar_url: string;
  bio?: string;
  status_text?: string;
  status_state: UserStatus;
  last_seen?: string;
  phone?: string;
  joined_at: string;
  is_blocked?: boolean;
  role?: 'user' | 'admin';
  account_status?: 'active' | 'suspended' | 'blocked';
  // Profile Privacy Controls (Requirement 7)
  photo_privacy?: PrivacyVisibility;
  about_privacy?: PrivacyVisibility;
  online_privacy?: PrivacyVisibility;
  last_seen_privacy?: PrivacyVisibility;
}

// User Contact Record (Requirement 10 & 35 - distinctly separates local contact from UserProfile)
export interface UserContactRecord {
  id: string;
  owner_user_id: string; // The current user who saved this contact
  contact_user_id: string; // UserProfile id reference
  first_name: string;
  last_name: string;
  custom_display_name: string; // Custom saved name e.g. "Sarah — Design Team"
  nickname?: string; // e.g. "Sarah"
  phone?: string;
  email?: string;
  notes?: string; // Private note visible only to current user
  custom_avatar_url?: string;
  use_custom_avatar?: boolean; // false = use user's Rovela profile photo
  is_favorite?: boolean;
  created_at: string;
  updated_at: string;
}

// Shared media inside profile/contact (Requirement 13)
export type SharedMediaType = 'photo' | 'video' | 'file' | 'link';
export interface SharedMediaItem {
  id: string;
  type: SharedMediaType;
  url: string;
  thumbnail?: string;
  title: string;
  subtitle?: string;
  size?: string;
  date: string;
  sender_name?: string;
}

export type MessageStatus = 'sending' | 'delivered' | 'read' | 'failed';
export type MessageType = 'text' | 'image' | 'file' | 'audio' | 'voice' | 'system';

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  created_at: string;
  is_edited?: boolean;
  is_deleted?: boolean;
  reply_to?: {
    id: string;
    sender_name: string;
    content: string;
  };
  reactions?: MessageReaction[];
  attachments?: MessageAttachment[];
  // Voice message enhancements
  voice_duration?: number; // duration in seconds
  voice_waveform?: number[]; // amplitude levels for visualization (0-100)
  // Forwarding enhancements
  is_forwarded?: boolean;
  forwarded_from?: string; // original sender name or chat title
}

export type ConversationType = 'direct' | 'group';

export interface Conversation {
  id: string;
  type: ConversationType;
  title: string;
  avatar_url: string;
  description?: string;
  participant_ids: string[];
  admin_ids?: string[];
  last_message?: Message;
  unread_count: number;
  is_pinned?: boolean;
  is_muted?: boolean;
  is_archived?: boolean;
  is_locked?: boolean;
  created_at: string;
  updated_at: string;
}

export type NotificationType = 'message' | 'group_activity' | 'connection' | 'mention' | 'call' | 'security';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  is_read: boolean;
  created_at: string;
  sender_avatar?: string;
  conversation_id?: string;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  fontSize: 'compact' | 'standard' | 'spacious';
  soundEnabled: boolean;
  desktopNotifications: boolean;
  readReceipts: boolean;
  lastSeenVisible: boolean;
  enterToSend: boolean;
  activeStatusVisible: boolean;
  bubbleDensity: 'comfortable' | 'compact';
  // Advanced Privacy & Security Settings
  whoCanContactMe: 'everyone' | 'contacts' | 'nobody';
  profileVisibility: 'everyone' | 'contacts' | 'nobody';
  twoFactorEnabled: boolean;
  blockedUserIds: string[];
  // Security PIN & Biometric & Two-Step Verification
  securityPin?: string;
  twoStepEnabled?: boolean;
  twoStepPin?: string;
  recoveryEmail?: string;
  biometricEnabled?: boolean;
  themePreference?: 'light' | 'dark' | 'system';
}

export type ActiveNavSection =
  | 'chats'
  | 'calls'
  | 'contacts'
  | 'groups'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'admin'
  | 'locked-chats'
  | 'status';
export type ChatFilter = 'all' | 'unread' | 'direct' | 'groups' | 'pinned' | 'archived';

// ==========================================
// Status Feature Types
// ==========================================
export type StatusType = 'IMAGE' | 'VIDEO' | 'TEXT';
export type StatusPrivacy = 'contacts' | 'contacts_except' | 'only_share_with';

export interface StatusViewerRecord {
  user_id: string;
  user_name: string;
  user_avatar: string;
  viewed_at: string;
}

export interface StatusReactionRecord {
  emoji: string;
  count: number;
  users: string[]; // user IDs
}

export interface StatusItem {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  type: StatusType;
  media_url?: string;
  thumbnail_url?: string;
  text_content?: string;
  caption?: string;
  background_style?: string; // id of background preset
  text_alignment?: 'left' | 'center' | 'right';
  text_size?: 'normal' | 'large' | 'title';
  created_at: string;
  expires_at: string;
  privacy: StatusPrivacy;
  viewers: StatusViewerRecord[];
  reactions?: StatusReactionRecord[];
}

export interface UserStatusGroup {
  user_id: string;
  user_name: string;
  user_avatar: string;
  is_self?: boolean;
  items: StatusItem[];
  has_unread: boolean;
  latest_created_at: string;
  is_muted?: boolean;
}

export interface TextStatusBackgroundPreset {
  id: string;
  name: string;
  bgClass: string;
  styleObject?: Record<string, string | number>;
  textColor: string;
  isDark: boolean;
}

// ==========================================
// Advanced Feature Types
// ==========================================

// Call History Record for Screen 10 (Calls)
export interface CallRecord {
  id: string;
  name: string;
  avatar_url: string;
  type: 'voice' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration?: string;
  user_id?: string;
  conversation_id?: string;
}

// 1. Calling Interfaces
export type CallType = 'voice' | 'video';
export type CallStatus = 'calling' | 'ringing' | 'connecting' | 'active' | 'ended' | 'missed';

export interface CallSession {
  id: string;
  conversation_id: string;
  title: string;
  avatar_url: string;
  type: CallType;
  status: CallStatus;
  duration: number; // in seconds
  is_muted: boolean;
  is_video_enabled: boolean;
  is_speaker: boolean;
  is_camera_front?: boolean;
  connection_quality: 'good' | 'poor' | 'reconnecting';
}

// 2. Message Reporting
export type ReportReason = 'spam' | 'harassment' | 'inappropriate' | 'scam' | 'other';

export interface ReportItem {
  id: string;
  message_id?: string;
  message_content?: string;
  reported_user_id: string;
  reported_user_name: string;
  reporter_id: string;
  reporter_name: string;
  reason: ReportReason;
  details?: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  created_at: string;
}

// 3. Contact Importing
export interface ImportedContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar_url: string;
  is_on_rovela: boolean;
  rovela_user_id?: string;
  rovela_username?: string;
  rovela_status?: UserStatus;
  invited?: boolean;
}

// 4. Admin Dashboard Metrics
export interface AdminMetrics {
  total_users: number;
  active_users_24h: number;
  total_messages: number;
  total_groups: number;
  total_reports: number;
  pending_reports: number;
  system_health: 'optimal' | 'degraded' | 'maintenance';
}
