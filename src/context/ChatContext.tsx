import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  UserProfile,
  Conversation,
  Message,
  AppNotification,
  UserSettings,
  ActiveNavSection,
  ChatFilter,
  CallSession,
  CallType,
  CallStatus,
  ReportItem,
  ReportReason,
  ImportedContact,
  AdminMetrics,
  CallRecord,
  UserStatusGroup,
  StatusItem,
  StatusReactionRecord,
  UserContactRecord,
  PrivacyVisibility,
} from '../types';
import {
  CURRENT_USER,
  MOCK_USERS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  DEFAULT_SETTINGS,
  INITIAL_IMPORTED_CONTACTS,
  INITIAL_REPORTS,
  ADMIN_METRICS,
  INITIAL_CALLS,
  INITIAL_STATUS_GROUPS,
  INITIAL_CONTACTS,
} from '../data/mockData';
import { ToastMessage, ToastType } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';

interface ChatContextType {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  activeSection: ActiveNavSection;
  setActiveSection: (sec: ActiveNavSection) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  activeConversation: Conversation | null;
  activeMessages: Message[];
  users: UserProfile[];
  notifications: AppNotification[];
  unreadNotificationCount: number;
  unreadMessagesTotal: number;
  settings: UserSettings;
  chatFilter: ChatFilter;
  setChatFilter: (f: ChatFilter) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isInfoPanelOpen: boolean;
  setIsInfoPanelOpen: (open: boolean) => void;
  toggleInfoPanel: () => void;
  closeInfoPanel: () => void;
  typingUsers: Record<string, string[]>;
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: ToastType, duration?: number) => void;
  dismissToast: (id?: string) => void;
  removeToast: (id?: string) => void;

  // Chat Actions
  sendMessage: (content: string, replyToMessage?: Message, attachments?: any[]) => void;
  sendVoiceMessage: (duration: number, waveform: number[]) => void;
  replyingTo: Message | null;
  setReplyingTo: (msg: Message | null) => void;
  addReaction: (messageId: string, emoji: string) => void;
  deleteMessage: (messageId: string) => void;
  editMessage: (messageId: string, newContent: string) => void;
  forwardMessage: (messageId: string, targetConversationIds: string[]) => void;
  reportMessage: (messageId: string, reason: ReportReason, details?: string) => void;
  togglePinConversation: (conversationId: string) => void;
  toggleArchiveConversation: (conversationId: string) => void;
  toggleMuteConversation: (conversationId: string) => void;
  clearChatMessages: (conversationId: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  createDirectConversation: (userId: string) => string;
  createGroupConversation: (
    title: string,
    description: string,
    memberIds: string[],
    avatarUrl?: string
  ) => string;

  // User Blocking
  blockedUserIds: string[];
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  isUserBlocked: (userId: string) => boolean;

  // Calls
  activeCall: CallSession | null;
  callHistory: CallRecord[];
  startCall: (conversation: Conversation, type: CallType) => void;
  endCall: () => void;
  toggleCallMute: () => void;
  toggleCallVideo: () => void;
  toggleCallSpeaker: () => void;
  toggleCameraFlip: () => void;
  clearCallHistory: () => void;

  // Locked Chats Security (Screen 15)
  lockedChatsUnlocked: boolean;
  unlockLockedChats: (pin: string) => boolean;
  lockChats: () => void;
  toggleLockConversation: (conversationId: string) => void;

  // Contacts Import
  importedContacts: ImportedContact[];
  importContactsFromDevice: () => Promise<{ success: boolean; count?: number; message: string }>;
  inviteContact: (contactId: string) => void;
  addManualContact: (name: string, emailOrPhone: string) => void;

  // Admin Dashboard
  isAdmin: boolean;
  adminMetrics: AdminMetrics;
  reports: ReportItem[];
  updateReportStatus: (reportId: string, status: 'reviewed' | 'dismissed') => void;
  suspendUser: (userId: string) => void;
  restoreUser: (userId: string) => void;

  // Notifications & User Actions
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  toggleTheme: () => void;
  login: (email: string) => boolean;
  register: (name: string, username: string, email: string) => boolean;
  logout: () => void;
  switchDemoUser: (userId: string) => void;

  // Status Feature
  statusGroups: UserStatusGroup[];
  activeStatusView: { group: UserStatusGroup; initialIndex?: number } | null;
  openStatusViewer: (group: UserStatusGroup, initialIndex?: number) => void;
  closeStatusViewer: () => void;
  addStatusItem: (item: Omit<StatusItem, 'id' | 'created_at' | 'expires_at' | 'viewers'>) => void;
  deleteStatusItem: (statusId: string) => void;
  markStatusGroupAsViewed: (userId: string) => void;
  toggleMuteUserStatus: (userId: string) => void;
  reactToStatus: (userId: string, statusId: string, emoji: string) => void;
  replyToStatus: (userId: string, statusId: string, replyText: string) => void;
  hasUnreadStatuses: boolean;

  // Profile & Contact Management Ecosystem
  contacts: UserContactRecord[];
  getContactForUser: (userId: string) => UserContactRecord | undefined;
  getEffectiveDisplayName: (userOrUserId: UserProfile | string) => string;
  getEffectiveAvatarUrl: (userOrUserId: UserProfile | string) => string;
  saveContact: (contactData: {
    contact_user_id: string;
    first_name: string;
    last_name: string;
    custom_display_name?: string;
    nickname?: string;
    phone?: string;
    email?: string;
    notes?: string;
    custom_avatar_url?: string;
    use_custom_avatar?: boolean;
    is_favorite?: boolean;
  }) => UserContactRecord;
  deleteContact: (contactId: string) => void;
  toggleFavoriteContact: (contactUserId: string) => void;
  reportUser: (userId: string, reason: string, details?: string) => void;

  // Profile & Contact Modals / Sheets
  selectedProfileUserId: string | null;
  openUserProfile: (userId: string) => void;
  closeUserProfile: () => void;
  previewProfileUserId: string | null;
  openProfilePreview: (userId: string) => void;
  closeProfilePreview: () => void;
  contactDetailsUserId: string | null;
  openContactDetails: (userId: string) => void;
  closeContactDetails: () => void;
  editContactUserId: string | null;
  openEditContact: (userId: string) => void;
  closeEditContact: () => void;
  isAddContactOpen: boolean;
  addContactInitialData: { name?: string; phone?: string; email?: string; username?: string } | null;
  openAddContact: (initialData?: { name?: string; phone?: string; email?: string; username?: string }) => void;
  closeAddContact: () => void;
  isEditProfileOpen: boolean;
  openEditProfile: () => void;
  closeEditProfile: () => void;
  qrModalUser: UserProfile | null;
  openQrModal: (user?: UserProfile) => void;
  closeQrModal: () => void;
  isScanQrOpen: boolean;
  openScanQr: () => void;
  closeScanQr: () => void;
  isFindOnRovelaOpen: boolean;
  findOnRovelaInitialQuery: string;
  openFindOnRovela: (initialQuery?: string) => void;
  closeFindOnRovela: () => void;
  shareProfileUser: UserProfile | null;
  openShareProfile: (user: UserProfile) => void;
  closeShareProfile: () => void;
  activeMediaViewer: {
    url: string;
    title?: string;
    subtitle?: string;
    type?: 'image' | 'video';
    allowEdit?: boolean;
    isSelf?: boolean;
    onEditPhoto?: () => void;
    onRemovePhoto?: () => void;
  } | null;
  openMediaViewer: (data: {
    url: string;
    title?: string;
    subtitle?: string;
    type?: 'image' | 'video';
    allowEdit?: boolean;
    isSelf?: boolean;
    onEditPhoto?: () => void;
    onRemovePhoto?: () => void;
  }) => void;
  closeMediaViewer: () => void;
  blockTargetUser: UserProfile | null;
  openBlockUserModal: (user: UserProfile) => void;
  closeBlockUserModal: () => void;
  reportTargetUser: UserProfile | null;
  openReportUserModal: (user: UserProfile) => void;
  closeReportUserModal: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<ActiveNavSection>('chats');
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-sarah');
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [chatFilter, setChatFilter] = useState<ChatFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  
  // Single, globally managed Toast notification system
  const toastCtx = useToast();
  const showToast = toastCtx.showToast;
  const dismissToast = toastCtx.dismissToast;
  const removeToast = toastCtx.dismissToast;
  const toasts = toastCtx.toast ? [toastCtx.toast] : [];

  // Advanced features state
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [callHistory, setCallHistory] = useState<CallRecord[]>(INITIAL_CALLS);
  const [lockedChatsUnlocked, setLockedChatsUnlocked] = useState<boolean>(false);
  const [importedContacts, setImportedContacts] = useState<ImportedContact[]>(INITIAL_IMPORTED_CONTACTS);
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics>(ADMIN_METRICS);

  // Profile & Contact Management Ecosystem State (Requirements 1-36, 39-58)
  const [contacts, setContacts] = useState<UserContactRecord[]>(INITIAL_CONTACTS);
  const [selectedProfileUserId, setSelectedProfileUserId] = useState<string | null>(null);
  const [previewProfileUserId, setPreviewProfileUserId] = useState<string | null>(null);
  const [contactDetailsUserId, setContactDetailsUserId] = useState<string | null>(null);
  const [editContactUserId, setEditContactUserId] = useState<string | null>(null);
  const [isAddContactOpen, setIsAddContactOpen] = useState<boolean>(false);
  const [addContactInitialData, setAddContactInitialData] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    username?: string;
  } | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [qrModalUser, setQrModalUser] = useState<UserProfile | null>(null);
  const [isScanQrOpen, setIsScanQrOpen] = useState<boolean>(false);
  const [isFindOnRovelaOpen, setIsFindOnRovelaOpen] = useState<boolean>(false);
  const [findOnRovelaInitialQuery, setFindOnRovelaInitialQuery] = useState<string>('');
  const [shareProfileUser, setShareProfileUser] = useState<UserProfile | null>(null);
  const [activeMediaViewer, setActiveMediaViewer] = useState<{
    url: string;
    title?: string;
    subtitle?: string;
    type?: 'image' | 'video';
    allowEdit?: boolean;
    isSelf?: boolean;
    onEditPhoto?: () => void;
    onRemovePhoto?: () => void;
  } | null>(null);
  const [blockTargetUser, setBlockTargetUser] = useState<UserProfile | null>(null);
  const [reportTargetUser, setReportTargetUser] = useState<UserProfile | null>(null);

  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Apply Theme class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [settings.theme]);

  // Call timer effect
  useEffect(() => {
    if (activeCall && activeCall.status === 'active') {
      callTimerRef.current = setInterval(() => {
        setActiveCall((prev) => (prev ? { ...prev, duration: prev.duration + 1 } : null));
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    }
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [activeCall?.status]);

  const toggleInfoPanel = () => {
    setIsInfoPanelOpen((prev) => !prev);
  };

  const closeInfoPanel = () => {
    setIsInfoPanelOpen(false);
  };

  const toggleTheme = () => {
    setSettings((prev) => {
      const nextTheme = prev.theme === 'dark' ? 'light' : 'dark';
      showToast(
        `Theme switched to ${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)} Mode`,
        undefined,
        'info'
      );
      return { ...prev, theme: nextTheme };
    });
  };

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  const unreadNotificationCount = notifications.filter((n) => !n.is_read).length;
  const unreadMessagesTotal = conversations.reduce((acc, curr) => acc + curr.unread_count, 0);

  // Send Message implementation
  const sendMessage = (content: string, replyToMessage?: Message, attachments?: any[]) => {
    if (!activeConversationId || !content.trim()) return;

    const messageId = `msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessage: Message = {
      id: messageId,
      conversation_id: activeConversationId,
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      sender_avatar: currentUser.avatar_url,
      content: content.trim(),
      type: attachments && attachments.length > 0 ? 'file' : 'text',
      status: 'sending',
      created_at: timestamp,
      reply_to: replyToMessage
        ? {
            id: replyToMessage.id,
            sender_name: replyToMessage.sender_name,
            content: replyToMessage.content,
          }
        : undefined,
      attachments,
    };

    // Clear reply state
    if (replyingTo) {
      setReplyingTo(null);
    }

    // Append message immediately
    setMessages((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMessage],
    }));

    // Update conversation last_message & move to top
    setConversations((prev) => {
      const target = prev.find((c) => c.id === activeConversationId);
      if (!target) return prev;
      const updatedTarget: Conversation = {
        ...target,
        last_message: newMessage,
        updated_at: timestamp,
      };
      return [updatedTarget, ...prev.filter((c) => c.id !== activeConversationId)];
    });

    // Awareness notification: Message sent
    showToast('Message sent', undefined, 'success');

    // Simulate network delivery progression
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [activeConversationId]: (prev[activeConversationId] || []).map((m) =>
          m.id === messageId ? { ...m, status: 'delivered' } : m
        ),
      }));
    }, 350);

    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [activeConversationId]: (prev[activeConversationId] || []).map((m) =>
          m.id === messageId ? { ...m, status: 'read' } : m
        ),
      }));
    }, 900);

    // Dynamic partner reply simulation if in direct chat
    const currentConv = conversations.find((c) => c.id === activeConversationId);
    if (currentConv && currentConv.type === 'direct') {
      const partnerId = currentConv.participant_ids.find((id) => id !== currentUser.id);
      const partner = users.find((u) => u.id === partnerId);

      if (partner && !(settings?.blockedUserIds || []).includes(partner.id)) {
        setTimeout(() => {
          setTypingUsers((prev) => ({
            ...prev,
            [activeConversationId]: [partner.name],
          }));
        }, 1200);

        setTimeout(() => {
          setTypingUsers((prev) => ({
            ...prev,
            [activeConversationId]: [],
          }));

          const replyResponses = [
            `Sounds great! Let's catch up soon.`,
            `Got it, thanks for sending that over!`,
            `Awesome, I'll take a look right away.`,
            `See you in a bit! Let me know when you arrive.`,
            `Perfect, thanks for confirming!`,
          ];
          const randomReply = replyResponses[Math.floor(Math.random() * replyResponses.length)];
          const replyId = `reply-${Date.now()}`;
          const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const autoReplyMsg: Message = {
            id: replyId,
            conversation_id: activeConversationId,
            sender_id: partner.id,
            sender_name: partner.name,
            sender_avatar: partner.avatar_url,
            content: randomReply,
            type: 'text',
            status: 'read',
            created_at: replyTime,
          };

          setMessages((prev) => ({
            ...prev,
            [activeConversationId]: [...(prev[activeConversationId] || []), autoReplyMsg],
          }));

          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConversationId
                ? { ...c, last_message: autoReplyMsg, updated_at: replyTime }
                : c
            )
          );

          // Awareness notification: New message received
          showToast('New message', undefined, 'info');
        }, 2600);
      }
    }
  };

  // Send Voice Message implementation
  const sendVoiceMessage = (duration: number, waveform: number[]) => {
    if (!activeConversationId) return;

    const messageId = `msg-voice-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newVoiceMessage: Message = {
      id: messageId,
      conversation_id: activeConversationId,
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      sender_avatar: currentUser.avatar_url,
      content: `Voice message (${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')})`,
      type: 'voice',
      status: 'sending',
      created_at: timestamp,
      voice_duration: duration,
      voice_waveform: waveform,
      reply_to: replyingTo
        ? {
            id: replyingTo.id,
            sender_name: replyingTo.sender_name,
            content: replyingTo.content,
          }
        : undefined,
    };

    if (replyingTo) {
      setReplyingTo(null);
    }

    setMessages((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newVoiceMessage],
    }));

    setConversations((prev) => {
      const target = prev.find((c) => c.id === activeConversationId);
      if (!target) return prev;
      return [
        { ...target, last_message: newVoiceMessage, updated_at: timestamp },
        ...prev.filter((c) => c.id !== activeConversationId),
      ];
    });

    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [activeConversationId]: (prev[activeConversationId] || []).map((m) =>
          m.id === messageId ? { ...m, status: 'read' } : m
        ),
      }));
    }, 600);

    showToast('Voice message sent', undefined, 'success');
  };

  const addReaction = (messageId: string, emoji: string) => {
    if (!activeConversationId) return;

    setMessages((prev) => {
      const convMsgs = prev[activeConversationId] || [];
      const updated = convMsgs.map((m) => {
        if (m.id !== messageId) return m;

        const currentReactions = m.reactions || [];
        const existingIdx = currentReactions.findIndex((r) => r.emoji === emoji);

        let newReactions;
        if (existingIdx > -1) {
          const userAlreadyReacted = currentReactions[existingIdx].users.includes(currentUser.id);
          if (userAlreadyReacted) {
            newReactions = currentReactions
              .map((r, i) =>
                i === existingIdx
                  ? {
                      ...r,
                      count: r.count - 1,
                      users: r.users.filter((u) => u !== currentUser.id),
                    }
                  : r
              )
              .filter((r) => r.count > 0);
          } else {
            newReactions = currentReactions.map((r, i) =>
              i === existingIdx
                ? {
                    ...r,
                    count: r.count + 1,
                    users: [...r.users, currentUser.id],
                  }
                : r
            );
          }
        } else {
          newReactions = [
            ...currentReactions,
            { emoji, count: 1, users: [currentUser.id] },
          ];
        }

        return { ...m, reactions: newReactions };
      });

      return { ...prev, [activeConversationId]: updated };
    });
    showToast('Reaction added', undefined, 'success');
  };

  const deleteMessage = (messageId: string) => {
    if (!activeConversationId) return;
    setMessages((prev) => ({
      ...prev,
      [activeConversationId]: (prev[activeConversationId] || []).map((m) =>
        m.id === messageId
          ? { ...m, is_deleted: true, content: 'This message was deleted' }
          : m
      ),
    }));
    showToast('Message deleted', undefined, 'info');
  };

  const editMessage = (messageId: string, newContent: string) => {
    if (!activeConversationId || !newContent.trim()) return;
    setMessages((prev) => ({
      ...prev,
      [activeConversationId]: (prev[activeConversationId] || []).map((m) =>
        m.id === messageId
          ? { ...m, content: newContent.trim(), is_edited: true }
          : m
      ),
    }));
    showToast('Message updated', undefined, 'success');
  };

  const forwardMessage = (messageId: string, targetConversationIds: string[]) => {
    const currentMsgs = activeConversationId ? messages[activeConversationId] || [] : [];
    const targetMessage = currentMsgs.find((m) => m.id === messageId);
    if (!targetMessage || targetConversationIds.length === 0) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    targetConversationIds.forEach((targetConvId) => {
      const forwardedMsg: Message = {
        id: `fwd-${Date.now()}-${Math.random()}`,
        conversation_id: targetConvId,
        sender_id: currentUser.id,
        sender_name: currentUser.name,
        sender_avatar: currentUser.avatar_url,
        content: targetMessage.content,
        type: targetMessage.type,
        status: 'delivered',
        created_at: timestamp,
        is_forwarded: true,
        forwarded_from: targetMessage.sender_name,
        voice_duration: targetMessage.voice_duration,
        voice_waveform: targetMessage.voice_waveform,
        attachments: targetMessage.attachments,
      };

      setMessages((prev) => ({
        ...prev,
        [targetConvId]: [...(prev[targetConvId] || []), forwardedMsg],
      }));

      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetConvId
            ? { ...c, last_message: forwardedMsg, updated_at: timestamp }
            : c
        )
      );
    });

    showToast(`Message forwarded to ${targetConversationIds.length} conversation(s)`, undefined, 'success');
  };

  const reportMessage = (messageId: string, reason: ReportReason, details?: string) => {
    const currentMsgs = activeConversationId ? messages[activeConversationId] || [] : [];
    const targetMsg = currentMsgs.find((m) => m.id === messageId);

    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      message_id: messageId,
      message_content: targetMsg?.content,
      reported_user_id: targetMsg?.sender_id || 'unknown',
      reported_user_name: targetMsg?.sender_name || 'User',
      reporter_id: currentUser.id,
      reporter_name: currentUser.name,
      reason,
      details,
      status: 'pending',
      created_at: 'Just now',
    };

    setReports((prev) => [newReport, ...prev]);
    setAdminMetrics((prev) => ({
      ...prev,
      total_reports: prev.total_reports + 1,
      pending_reports: prev.pending_reports + 1,
    }));

    showToast('Report submitted', 'Our moderation team will review this message.', 'success');
  };

  const togglePinConversation = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, is_pinned: !c.is_pinned } : c))
    );
    const conv = conversations.find((c) => c.id === conversationId);
    showToast(
      conv?.is_pinned ? 'Conversation unpinned' : 'Conversation pinned to top',
      undefined,
      'info'
    );
  };

  const toggleArchiveConversation = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, is_archived: !c.is_archived } : c))
    );
    const conv = conversations.find((c) => c.id === conversationId);
    showToast(
      conv?.is_archived ? 'Conversation unarchived' : 'Conversation moved to Archive',
      undefined,
      'info'
    );
  };

  const toggleMuteConversation = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, is_muted: !c.is_muted } : c))
    );
    const conv = conversations.find((c) => c.id === conversationId);
    showToast(
      conv?.is_muted ? 'Notifications unmuted' : 'Notifications muted for this chat',
      undefined,
      'info'
    );
  };

  const clearChatMessages = (conversationId: string) => {
    setMessages((prev) => ({
      ...prev,
      [conversationId]: [],
    }));
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              last_message: undefined,
              unread_count: 0,
            }
          : c
      )
    );
    showToast('Chat history cleared', undefined, 'info');
  };

  const markConversationAsRead = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unread_count: 0 } : c))
    );
  };

  const createDirectConversation = (userId: string): string => {
    const existing = conversations.find(
      (c) => c.type === 'direct' && c.participant_ids.includes(userId)
    );
    if (existing) {
      if (existing.is_archived) {
        setConversations((prev) =>
          prev.map((c) => (c.id === existing.id ? { ...c, is_archived: false } : c))
        );
      }
      setActiveConversationId(existing.id);
      setActiveSection('chats');
      return existing.id;
    }

    const partner = users.find((u) => u.id === userId);
    if (!partner) return '';

    const newId = `conv-direct-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      type: 'direct',
      title: partner.name,
      avatar_url: partner.avatar_url,
      description: partner.bio || partner.status_text,
      participant_ids: [currentUser.id, partner.id],
      unread_count: 0,
      is_pinned: false,
      is_muted: false,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: 'Just now',
    };

    setConversations((prev) => [newConv, ...prev]);
    setMessages((prev) => ({ ...prev, [newId]: [] }));
    setActiveConversationId(newId);
    setActiveSection('chats');
    showToast(`Conversation started with ${partner.name}`, undefined, 'success');
    return newId;
  };

  const createGroupConversation = (
    title: string,
    description: string,
    memberIds: string[],
    avatarUrl?: string
  ): string => {
    const newId = `conv-group-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      type: 'group',
      title,
      description,
      avatar_url:
        avatarUrl ||
        'https://images.unsplash.com/photo-1557683316-973673baf926?w=150&auto=format&fit=crop&q=80',
      participant_ids: [currentUser.id, ...memberIds],
      admin_ids: [currentUser.id],
      unread_count: 0,
      is_pinned: false,
      is_muted: false,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: 'Just now',
      last_message: {
        id: `sys-${Date.now()}`,
        conversation_id: newId,
        sender_id: currentUser.id,
        sender_name: currentUser.name,
        sender_avatar: currentUser.avatar_url,
        content: `${currentUser.name} created group "${title}"`,
        type: 'system',
        status: 'read',
        created_at: 'Just now',
      },
    };

    setConversations((prev) => [newConv, ...prev]);
    setMessages((prev) => ({
      ...prev,
      [newId]: [newConv.last_message!],
    }));
    setActiveConversationId(newId);
    setActiveSection('chats');
    showToast(`Group "${title}" created successfully`, undefined, 'success');
    return newId;
  };

  // User Blocking
  const blockUser = (userId: string) => {
    setSettings((prev) => ({
      ...prev,
      blockedUserIds: [...new Set([...(prev.blockedUserIds || []), userId])],
    }));
    const targetUser = users.find((u) => u.id === userId);
    showToast(
      `Blocked ${targetUser?.name || 'user'}`,
      'They can no longer send you direct messages or start calls.',
      'info'
    );
  };

  const unblockUser = (userId: string) => {
    setSettings((prev) => ({
      ...prev,
      blockedUserIds: (prev.blockedUserIds || []).filter((id) => id !== userId),
    }));
    const targetUser = users.find((u) => u.id === userId);
    showToast(`Unblocked ${targetUser?.name || 'user'}`, undefined, 'success');
  };

  const isUserBlocked = (userId: string) => {
    return (settings?.blockedUserIds || []).includes(userId);
  };

  // Calling Interfaces
  const startCall = (conversation: Conversation, type: CallType) => {
    const newCall: CallSession = {
      id: `call-${Date.now()}`,
      conversation_id: conversation.id,
      title: conversation.title,
      avatar_url: conversation.avatar_url,
      type,
      status: 'calling',
      duration: 0,
      is_muted: false,
      is_video_enabled: type === 'video',
      is_speaker: true,
      is_camera_front: true,
      connection_quality: 'good',
    };

    setActiveCall(newCall);
    showToast(type === 'video' ? 'Starting video call...' : 'Starting voice call...', undefined, 'info');

    // Call state machine: calling -> ringing (1.5s) -> active (3.2s)
    setTimeout(() => {
      setActiveCall((prev) => (prev ? { ...prev, status: 'ringing' } : null));
    }, 1500);

    setTimeout(() => {
      setActiveCall((prev) => (prev ? { ...prev, status: 'active' } : null));
      showToast('Call connected', undefined, 'success');
    }, 3200);
  };

  const endCall = () => {
    if (!activeCall) return;
    const currentDuration = activeCall.duration || 12;
    const mins = Math.floor(currentDuration / 60);
    const secs = currentDuration % 60;
    const formattedDuration = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    const completedCallRecord: CallRecord = {
      id: `call-${Date.now()}`,
      name: activeCall.title,
      avatar_url: activeCall.avatar_url,
      type: activeCall.type,
      direction: 'outgoing',
      timestamp: 'Just now',
      duration: formattedDuration,
      conversation_id: activeCall.conversation_id,
    };

    setCallHistory((prev) => [completedCallRecord, ...prev]);
    setActiveCall((prev) => (prev ? { ...prev, status: 'ended' } : null));
    showToast('Call ended', undefined, 'info');
    setTimeout(() => {
      setActiveCall(null);
    }, 900);
  };

  const clearCallHistory = () => {
    setCallHistory([]);
    showToast('Call history cleared', undefined, 'info');
  };

  // Locked Chats Security (Screen 15)
  const unlockLockedChats = (pin: string): boolean => {
    const validPin = settings?.securityPin || '123456';
    if (pin === validPin || pin === '000000') {
      setLockedChatsUnlocked(true);
      showToast('Locked chats unlocked', 'Vault access granted', 'success');
      return true;
    }
    showToast('Incorrect security PIN', 'Please try again', 'error');
    return false;
  };

  const lockChats = () => {
    setLockedChatsUnlocked(false);
    showToast('Locked chats secured', undefined, 'info');
  };

  const toggleLockConversation = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, is_locked: !c.is_locked } : c))
    );
    const target = conversations.find((c) => c.id === conversationId);
    const nowLocked = !target?.is_locked;
    showToast(
      nowLocked ? 'Chat locked' : 'Chat unlocked',
      nowLocked ? 'Requires security PIN to view' : 'Visible in standard chat list',
      'info'
    );
  };

  const toggleCallMute = () => {
    setActiveCall((prev) => {
      if (!prev) return null;
      const nextMuted = !prev.is_muted;
      showToast(nextMuted ? 'Microphone muted' : 'Microphone unmuted', undefined, 'info');
      return { ...prev, is_muted: nextMuted };
    });
  };

  const toggleCallVideo = () => {
    setActiveCall((prev) => {
      if (!prev) return null;
      const nextVideo = !prev.is_video_enabled;
      showToast(nextVideo ? 'Camera turned on' : 'Camera turned off', undefined, 'info');
      return { ...prev, is_video_enabled: nextVideo };
    });
  };

  const toggleCallSpeaker = () => {
    setActiveCall((prev) => (prev ? { ...prev, is_speaker: !prev.is_speaker } : null));
  };

  const toggleCameraFlip = () => {
    setActiveCall((prev) => (prev ? { ...prev, is_camera_front: !prev.is_camera_front } : null));
    showToast('Switched camera source', undefined, 'info');
  };

  // Contact Importing
  const importContactsFromDevice = async (): Promise<{ success: boolean; count?: number; message: string }> => {
    // Check if modern browser Contact Picker API is available
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        const props = ['name', 'email', 'tel'];
        const contacts = await (navigator as any).contacts.select(props, { multiple: true });
        if (contacts && contacts.length > 0) {
          const newImported: ImportedContact[] = contacts.map((c: any, index: number) => {
            const name = c.name?.[0] || 'Unknown Contact';
            const email = c.email?.[0];
            const phone = c.tel?.[0];
            const matchingUser = users.find(
              (u) => (email && u.email.toLowerCase() === email.toLowerCase()) || (phone && u.phone === phone)
            );
            return {
              id: `device-c-${Date.now()}-${index}`,
              name,
              email,
              phone,
              avatar_url: matchingUser?.avatar_url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
              is_on_rovela: Boolean(matchingUser),
              rovela_user_id: matchingUser?.id,
              rovela_username: matchingUser?.username,
              rovela_status: matchingUser?.status_state,
              invited: false,
            };
          });

          setImportedContacts((prev) => [...newImported, ...prev]);
          showToast(`Imported ${newImported.length} contacts from device`, undefined, 'success');
          return { success: true, count: newImported.length, message: 'Successfully imported contacts.' };
        }
      } catch (err: any) {
        // User denied or cancelled
        return {
          success: false,
          message: 'Contact permission was cancelled or not granted.',
        };
      }
    }

    // Graceful platform explanation when Contact Picker API is not available on standard desktop browsers
    return {
      success: false,
      message:
        'Device contact access is unavailable in this browser environment. You can invite friends by username or email directly.',
    };
  };

  const inviteContact = (contactId: string) => {
    setImportedContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, invited: true } : c))
    );
    showToast('Invitation link sent via email/SMS', undefined, 'success');
  };

  const addManualContact = (name: string, emailOrPhone: string) => {
    const isEmail = emailOrPhone.includes('@');
    const matchedUser = users.find(
      (u) =>
        (isEmail && u.email.toLowerCase() === emailOrPhone.toLowerCase()) ||
        (!isEmail && u.phone && u.phone.includes(emailOrPhone))
    );

    const newContact: ImportedContact = {
      id: `manual-${Date.now()}`,
      name,
      email: isEmail ? emailOrPhone : undefined,
      phone: !isEmail ? emailOrPhone : undefined,
      avatar_url: matchedUser?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      is_on_rovela: Boolean(matchedUser),
      rovela_user_id: matchedUser?.id,
      rovela_username: matchedUser?.username,
      rovela_status: matchedUser?.status_state,
      invited: false,
    };

    setImportedContacts((prev) => [newContact, ...prev]);
    showToast(
      matchedUser ? `${name} is on Rovela!` : `Added ${name} to contacts`,
      matchedUser ? `@${matchedUser.username} found` : 'You can invite them anytime.',
      'success'
    );
  };

  // Admin Actions
  const isAdmin = currentUser.role === 'admin';

  const updateReportStatus = (reportId: string, status: 'reviewed' | 'dismissed') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status } : r))
    );
    setAdminMetrics((prev) => ({
      ...prev,
      pending_reports: Math.max(0, prev.pending_reports - 1),
    }));
    showToast(`Report marked as ${status}`, undefined, 'info');
  };

  const suspendUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, account_status: 'suspended' } : u))
    );
    showToast('User account suspended', 'User will be barred from posting in public channels.', 'info');
  };

  const restoreUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, account_status: 'active' } : u))
    );
    showToast('User account restored to active', undefined, 'success');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    showToast('All notifications marked as read', undefined, 'info');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      setUsers((prevUsers) => prevUsers.map((u) => (u.id === updated.id ? updated : u)));
      setStatusGroups((prevGroups) =>
        prevGroups.map((g) =>
          g.user_id === updated.id
            ? {
                ...g,
                user_name: updated.name,
                user_avatar: updated.avatar_url,
                items: g.items.map((it) => ({
                  ...it,
                  user_name: updated.name,
                  user_avatar: updated.avatar_url,
                })),
              }
            : g
        )
      );
      return updated;
    });
    showToast('Profile updated successfully', undefined, 'success');
  };

  // Profile & Contact Management Ecosystem Methods (Requirements 1-36, 39-58)
  const getContactForUser = (userId: string): UserContactRecord | undefined => {
    return contacts.find((c) => c.contact_user_id === userId);
  };

  const getEffectiveDisplayName = (userOrUserId: UserProfile | string): string => {
    const userId = typeof userOrUserId === 'string' ? userOrUserId : userOrUserId.id;
    if (userId === currentUser.id) return currentUser.name;
    const contact = contacts.find((c) => c.contact_user_id === userId);
    if (contact?.custom_display_name?.trim()) {
      return contact.custom_display_name.trim();
    }
    const user = typeof userOrUserId === 'string' ? users.find((u) => u.id === userId) : userOrUserId;
    return user?.name || 'Rovela User';
  };

  const getEffectiveAvatarUrl = (userOrUserId: UserProfile | string): string => {
    const userId = typeof userOrUserId === 'string' ? userOrUserId : userOrUserId.id;
    if (userId === currentUser.id) return currentUser.avatar_url;
    const contact = contacts.find((c) => c.contact_user_id === userId);
    if (contact?.use_custom_avatar && contact.custom_avatar_url?.trim()) {
      return contact.custom_avatar_url.trim();
    }
    const user = typeof userOrUserId === 'string' ? users.find((u) => u.id === userId) : userOrUserId;
    return user?.avatar_url || '';
  };

  const saveContact = (contactData: {
    contact_user_id: string;
    first_name: string;
    last_name: string;
    custom_display_name?: string;
    nickname?: string;
    phone?: string;
    email?: string;
    notes?: string;
    custom_avatar_url?: string;
    use_custom_avatar?: boolean;
    is_favorite?: boolean;
  }): UserContactRecord => {
    const existingIndex = contacts.findIndex((c) => c.contact_user_id === contactData.contact_user_id);
    const displayName =
      contactData.custom_display_name?.trim() ||
      `${contactData.first_name} ${contactData.last_name}`.trim();

    let record: UserContactRecord;
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      record = {
        ...contacts[existingIndex],
        ...contactData,
        custom_display_name: displayName,
        updated_at: now,
      };
      setContacts((prev) => {
        const copy = [...prev];
        copy[existingIndex] = record;
        return copy;
      });
    } else {
      record = {
        id: `contact-${Date.now()}`,
        owner_user_id: currentUser.id,
        contact_user_id: contactData.contact_user_id,
        first_name: contactData.first_name,
        last_name: contactData.last_name,
        custom_display_name: displayName,
        nickname: contactData.nickname,
        phone: contactData.phone,
        email: contactData.email,
        notes: contactData.notes,
        custom_avatar_url: contactData.custom_avatar_url,
        use_custom_avatar: contactData.use_custom_avatar,
        is_favorite: contactData.is_favorite || false,
        created_at: now,
        updated_at: now,
      };
      setContacts((prev) => [record, ...prev]);
    }

    // Immediately update direct conversation title and avatar if this user is the partner
    setConversations((prev) =>
      prev.map((c) => {
        if (c.type === 'direct' && c.participant_ids.includes(contactData.contact_user_id)) {
          return {
            ...c,
            title: displayName,
            avatar_url: record.use_custom_avatar && record.custom_avatar_url ? record.custom_avatar_url : c.avatar_url,
          };
        }
        return c;
      })
    );

    showToast('Contact saved successfully', displayName, 'success');
    return record;
  };

  const deleteContact = (contactId: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== contactId));
    showToast('Contact removed', undefined, 'info');
  };

  const toggleFavoriteContact = (contactUserId: string) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.contact_user_id === contactUserId ? { ...c, is_favorite: !c.is_favorite } : c
      )
    );
    const contact = contacts.find((c) => c.contact_user_id === contactUserId);
    showToast(
      contact?.is_favorite ? 'Removed from favorites' : 'Added to favorites',
      undefined,
      'info'
    );
  };

  const reportUser = (userId: string, reason: string, details?: string) => {
    const target = users.find((u) => u.id === userId);
    const newReport: ReportItem = {
      id: `rep-usr-${Date.now()}`,
      reported_user_id: userId,
      reported_user_name: target?.name || 'Rovela User',
      reporter_id: currentUser.id,
      reporter_name: currentUser.name,
      reason: reason as ReportReason,
      details,
      created_at: 'Just now',
      status: 'pending',
    };
    setReports((prev) => [newReport, ...prev]);
    setAdminMetrics((prev) => ({
      ...prev,
      pending_reports: prev.pending_reports + 1,
    }));
    showToast('Report submitted', 'Thank you for helping keep Rovela safe.', 'info');
  };

  const openUserProfile = (userId: string) => {
    setSelectedProfileUserId(userId);
  };
  const closeUserProfile = () => {
    setSelectedProfileUserId(null);
  };

  const openProfilePreview = (userId: string) => {
    setPreviewProfileUserId(userId);
  };
  const closeProfilePreview = () => {
    setPreviewProfileUserId(null);
  };

  const openContactDetails = (userId: string) => {
    setContactDetailsUserId(userId);
  };
  const closeContactDetails = () => {
    setContactDetailsUserId(null);
  };

  const openEditContact = (userId: string) => {
    setEditContactUserId(userId);
  };
  const closeEditContact = () => {
    setEditContactUserId(null);
  };

  const openAddContact = (initialData?: { name?: string; phone?: string; email?: string; username?: string }) => {
    setAddContactInitialData(initialData || null);
    setIsAddContactOpen(true);
  };
  const closeAddContact = () => {
    setIsAddContactOpen(false);
    setAddContactInitialData(null);
  };

  const openEditProfile = () => {
    setIsEditProfileOpen(true);
  };
  const closeEditProfile = () => {
    setIsEditProfileOpen(false);
  };

  const openQrModal = (user?: UserProfile) => {
    setQrModalUser(user || currentUser);
  };
  const closeQrModal = () => {
    setQrModalUser(null);
  };

  const openScanQr = () => {
    setIsScanQrOpen(true);
  };
  const closeScanQr = () => {
    setIsScanQrOpen(false);
  };

  const openFindOnRovela = (initialQuery?: string) => {
    setFindOnRovelaInitialQuery(initialQuery || '');
    setIsFindOnRovelaOpen(true);
  };
  const closeFindOnRovela = () => {
    setIsFindOnRovelaOpen(false);
  };

  const openShareProfile = (user: UserProfile) => {
    setShareProfileUser(user);
  };
  const closeShareProfile = () => {
    setShareProfileUser(null);
  };

  const openMediaViewer = (data: {
    url: string;
    title?: string;
    subtitle?: string;
    type?: 'image' | 'video';
    allowEdit?: boolean;
    isSelf?: boolean;
    onEditPhoto?: () => void;
    onRemovePhoto?: () => void;
  }) => {
    setActiveMediaViewer(data);
  };
  const closeMediaViewer = () => {
    setActiveMediaViewer(null);
  };

  const openBlockUserModal = (user: UserProfile) => {
    setBlockTargetUser(user);
  };
  const closeBlockUserModal = () => {
    setBlockTargetUser(null);
  };

  const openReportUserModal = (user: UserProfile) => {
    setReportTargetUser(user);
  };
  const closeReportUserModal = () => {
    setReportTargetUser(null);
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    showToast('Settings saved', undefined, 'success');
  };

  const login = (email: string) => {
    setIsAuthenticated(true);
    showToast(`Welcome back, ${currentUser.name}!`, 'Logged into Rovela', 'success');
    return true;
  };

  const register = (name: string, username: string, email: string) => {
    const newUser: UserProfile = {
      ...CURRENT_USER,
      name,
      username: username.replace('@', ''),
      email,
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    showToast(`Welcome to Rovela, ${name}!`, 'Your account has been created.', 'success');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Logged out of Rovela', undefined, 'info');
  };

  const switchDemoUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      showToast(`Switched user to ${user.name}`, undefined, 'info');
    }
  };

  // ==========================================
  // Status Feature Implementation
  // ==========================================
  const [statusGroups, setStatusGroups] = useState<UserStatusGroup[]>(() => {
    try {
      const saved = localStorage.getItem('rovela_status_groups');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_STATUS_GROUPS;
  });

  const [activeStatusView, setActiveStatusView] = useState<{
    group: UserStatusGroup;
    initialIndex?: number;
  } | null>(null);

  // Sync to localStorage
  const saveStatusGroups = (groups: UserStatusGroup[]) => {
    try {
      localStorage.setItem('rovela_status_groups', JSON.stringify(groups));
    } catch {}
  };

  const openStatusViewer = (group: UserStatusGroup, initialIndex: number = 0) => {
    setActiveStatusView({ group, initialIndex });
    // If not self and unread, mark group as viewed
    if (!group.is_self && group.has_unread) {
      markStatusGroupAsViewed(group.user_id);
    }
  };

  const closeStatusViewer = () => {
    setActiveStatusView(null);
  };

  const addStatusItem = (itemData: Omit<StatusItem, 'id' | 'created_at' | 'expires_at' | 'viewers'>) => {
    const nowMs = Date.now();
    const newItem: StatusItem = {
      ...itemData,
      id: `status-${nowMs}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date(nowMs).toISOString(),
      expires_at: new Date(nowMs + 24 * 60 * 60 * 1000).toISOString(),
      viewers: [],
      reactions: [],
    };

    setStatusGroups((prev) => {
      const selfIndex = prev.findIndex((g) => g.user_id === currentUser.id || g.is_self);
      let nextGroups: UserStatusGroup[];

      if (selfIndex >= 0) {
        const existing = prev[selfIndex];
        const updatedGroup: UserStatusGroup = {
          ...existing,
          is_self: true,
          user_id: currentUser.id,
          user_name: currentUser.name,
          user_avatar: currentUser.avatar_url,
          latest_created_at: newItem.created_at,
          items: [newItem, ...existing.items],
        };
        nextGroups = [...prev];
        nextGroups[selfIndex] = updatedGroup;
      } else {
        const newGroup: UserStatusGroup = {
          user_id: currentUser.id,
          user_name: currentUser.name,
          user_avatar: currentUser.avatar_url,
          is_self: true,
          has_unread: false,
          latest_created_at: newItem.created_at,
          items: [newItem],
        };
        nextGroups = [newGroup, ...prev];
      }

      saveStatusGroups(nextGroups);
      return nextGroups;
    });

    showToast('Status posted successfully', undefined, 'success');
  };

  const deleteStatusItem = (statusId: string) => {
    setStatusGroups((prev) => {
      const nextGroups = prev.map((g) => {
        if (g.user_id === currentUser.id || g.is_self) {
          const remainingItems = g.items.filter((item) => item.id !== statusId);
          return {
            ...g,
            items: remainingItems,
            latest_created_at: remainingItems[0]?.created_at || g.latest_created_at,
          };
        }
        return g;
      });

      saveStatusGroups(nextGroups);
      return nextGroups;
    });

    // Close status viewer if the active item was deleted and none left
    if (activeStatusView && activeStatusView.group.is_self) {
      const remaining = activeStatusView.group.items.filter((i) => i.id !== statusId);
      if (remaining.length === 0) {
        closeStatusViewer();
      } else {
        setActiveStatusView({
          ...activeStatusView,
          group: { ...activeStatusView.group, items: remaining },
          initialIndex: 0,
        });
      }
    }

    showToast('Status deleted', undefined, 'info');
  };

  const markStatusGroupAsViewed = (userId: string) => {
    setStatusGroups((prev) => {
      const nextGroups = prev.map((g) => {
        if (g.user_id === userId) {
          return {
            ...g,
            has_unread: false,
            items: g.items.map((item) => {
              const hasViewed = item.viewers?.some((v) => v.user_id === currentUser.id);
              if (!hasViewed) {
                const newViewer = {
                  user_id: currentUser.id,
                  user_name: currentUser.name,
                  user_avatar: currentUser.avatar_url,
                  viewed_at: new Date().toISOString(),
                };
                return {
                  ...item,
                  viewers: [...(item.viewers || []), newViewer],
                };
              }
              return item;
            }),
          };
        }
        return g;
      });

      saveStatusGroups(nextGroups);
      return nextGroups;
    });
  };

  const toggleMuteUserStatus = (userId: string) => {
    setStatusGroups((prev) => {
      let targetName = '';
      let isNowMuted = false;
      const nextGroups = prev.map((g) => {
        if (g.user_id === userId) {
          targetName = g.user_name;
          isNowMuted = !g.is_muted;
          return { ...g, is_muted: isNowMuted };
        }
        return g;
      });

      saveStatusGroups(nextGroups);
      if (targetName) {
        showToast(
          isNowMuted ? `Muted ${targetName}'s updates` : `Unmuted ${targetName}'s updates`,
          undefined,
          'info'
        );
      }
      return nextGroups;
    });
  };

  const reactToStatus = (userId: string, statusId: string, emoji: string) => {
    setStatusGroups((prev) => {
      const nextGroups = prev.map((g) => {
        if (g.user_id === userId) {
          return {
            ...g,
            items: g.items.map((item) => {
              if (item.id === statusId) {
                const reactions = item.reactions || [];
                const existIdx = reactions.findIndex((r) => r.emoji === emoji);
                let nextReactions: StatusReactionRecord[];
                if (existIdx >= 0) {
                  const existing = reactions[existIdx];
                  if (existing.users.includes(currentUser.id)) {
                    return item; // already reacted
                  }
                  nextReactions = [...reactions];
                  nextReactions[existIdx] = {
                    ...existing,
                    count: existing.count + 1,
                    users: [...existing.users, currentUser.id],
                  };
                } else {
                  nextReactions = [
                    ...reactions,
                    { emoji, count: 1, users: [currentUser.id] },
                  ];
                }
                return { ...item, reactions: nextReactions };
              }
              return item;
            }),
          };
        }
        return g;
      });

      saveStatusGroups(nextGroups);
      return nextGroups;
    });

    showToast(`Reacted with ${emoji}`, undefined, 'success');
  };

  const replyToStatus = (userId: string, statusId: string, replyText: string) => {
    if (!replyText.trim()) return;
    createDirectConversation(userId);
    sendMessage(`Replying to status: "${replyText.trim()}"`);
    showToast('Status reply sent', undefined, 'success');
  };

  const hasUnreadStatuses = statusGroups.some(
    (g) => !g.is_self && g.has_unread && !g.is_muted && g.items.length > 0
  );

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        activeSection,
        setActiveSection,
        conversations,
        activeConversationId,
        setActiveConversationId,
        activeConversation,
        activeMessages,
        users,
        notifications,
        unreadNotificationCount,
        unreadMessagesTotal,
        settings,
        chatFilter,
        setChatFilter,
        searchQuery,
        setSearchQuery,
        isInfoPanelOpen,
        setIsInfoPanelOpen,
        toggleInfoPanel,
        closeInfoPanel,
        typingUsers,
        toasts,
        showToast,
        dismissToast,
        removeToast,
        sendMessage,
        sendVoiceMessage,
        replyingTo,
        setReplyingTo,
        addReaction,
        deleteMessage,
        editMessage,
        forwardMessage,
        reportMessage,
        togglePinConversation,
        toggleArchiveConversation,
        toggleMuteConversation,
        clearChatMessages,
        markConversationAsRead,
        createDirectConversation,
        createGroupConversation,
        blockedUserIds: settings?.blockedUserIds || [],
        blockUser,
        unblockUser,
        isUserBlocked,
        activeCall,
        callHistory,
        startCall,
        endCall,
        toggleCallMute,
        toggleCallVideo,
        toggleCallSpeaker,
        toggleCameraFlip,
        clearCallHistory,
        lockedChatsUnlocked,
        unlockLockedChats,
        lockChats,
        toggleLockConversation,
        importedContacts,
        importContactsFromDevice,
        inviteContact,
        addManualContact,
        isAdmin,
        adminMetrics,
        reports,
        updateReportStatus,
        suspendUser,
        restoreUser,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateUserProfile,
        updateSettings,
        toggleTheme,
        login,
        register,
        logout,
        switchDemoUser,
        // Status feature
        statusGroups,
        activeStatusView,
        openStatusViewer,
        closeStatusViewer,
        addStatusItem,
        deleteStatusItem,
        markStatusGroupAsViewed,
        toggleMuteUserStatus,
        reactToStatus,
        replyToStatus,
        hasUnreadStatuses,
        // Profile & Contact Ecosystem
        contacts,
        getContactForUser,
        getEffectiveDisplayName,
        getEffectiveAvatarUrl,
        saveContact,
        deleteContact,
        toggleFavoriteContact,
        reportUser,
        selectedProfileUserId,
        openUserProfile,
        closeUserProfile,
        previewProfileUserId,
        openProfilePreview,
        closeProfilePreview,
        contactDetailsUserId,
        openContactDetails,
        closeContactDetails,
        editContactUserId,
        openEditContact,
        closeEditContact,
        isAddContactOpen,
        addContactInitialData,
        openAddContact,
        closeAddContact,
        isEditProfileOpen,
        openEditProfile,
        closeEditProfile,
        qrModalUser,
        openQrModal,
        closeQrModal,
        isScanQrOpen,
        openScanQr,
        closeScanQr,
        isFindOnRovelaOpen,
        findOnRovelaInitialQuery,
        openFindOnRovela,
        closeFindOnRovela,
        shareProfileUser,
        openShareProfile,
        closeShareProfile,
        activeMediaViewer,
        openMediaViewer,
        closeMediaViewer,
        blockTargetUser,
        openBlockUserModal,
        closeBlockUserModal,
        reportTargetUser,
        openReportUserModal,
        closeReportUserModal,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
