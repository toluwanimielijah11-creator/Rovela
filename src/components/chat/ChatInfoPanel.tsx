import React, { useState } from 'react';
import { Conversation, UserProfile } from '../../types';
import { useChat } from '../../context/ChatContext';
import { Avatar } from '../ui/Avatar';
import { IconButton } from '../ui/IconButton';
import { BlockUserDialog } from '../modals/BlockUserDialog';
import { ReportMessageDialog } from '../modals/ReportMessageDialog';
import {
  X,
  ArrowLeft,
  Bell,
  BellOff,
  Pin,
  Search,
  UserPlus,
  Shield,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  Trash2,
  UserX,
  LogOut,
  Mail,
  Phone,
  Video,
  Calendar,
  Archive,
  Flag,
  Lock,
  Unlock,
  KeyRound,
  ExternalLink,
} from 'lucide-react';

interface ChatInfoPanelProps {
  conversation: Conversation;
  onClose: () => void;
  onOpenAddMember?: () => void;
}

export const ChatInfoPanel: React.FC<ChatInfoPanelProps> = ({
  conversation,
  onClose,
  onOpenAddMember,
}) => {
  const {
    currentUser,
    users,
    togglePinConversation,
    toggleMuteConversation,
    toggleArchiveConversation,
    toggleLockConversation,
    clearChatMessages,
    startCall,
    showToast,
  } = useChat();

  const [activeTab, setActiveTab] = useState<'details' | 'media' | 'members'>(
    conversation.type === 'group' ? 'members' : 'details'
  );
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showVerifySecurityCode, setShowVerifySecurityCode] = useState(false);

  // Identify partner if direct conversation
  let partnerUser: UserProfile | undefined;
  if (conversation.type === 'direct') {
    const partnerId = conversation.participant_ids.find((id) => id !== currentUser.id);
    partnerUser = users.find((u) => u.id === partnerId);
  }

  // Get members if group conversation
  const groupMembers = conversation.participant_ids
    .map((id) => (id === currentUser.id ? currentUser : users.find((u) => u.id === id)))
    .filter(Boolean) as UserProfile[];

  return (
    <>
      <aside className="fixed inset-0 z-50 w-full h-[100dvh] md:relative md:inset-auto md:w-80 lg:w-88 md:h-full md:z-20 flex flex-col bg-[var(--rovela-surface)] border-l border-[var(--rovela-border)] select-none shrink-0 overflow-y-auto">
        {/* Top Header */}
        <div className="p-4 border-b border-[var(--rovela-border)] flex items-center justify-between bg-[var(--rovela-surface-secondary)] md:bg-transparent">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="md:hidden p-1.5 -ml-1 rounded-full text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] cursor-pointer"
              aria-label="Back to chat"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-[var(--rovela-text-primary)]">
              {conversation.type === 'group' ? 'Group Details' : 'Contact Information'}
            </h3>
          </div>
          <IconButton
            icon={<X className="w-4 h-4" />}
            label="Close panel"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hidden md:flex"
          />
        </div>

        {/* Profile Overview Card (Section 9: Large Avatar, Name, Phone / Member Count) */}
        <div className="p-6 flex flex-col items-center text-center border-b border-[var(--rovela-border)]">
          <Avatar
            src={conversation.avatar_url}
            name={conversation.title}
            size="xl"
            status={partnerUser?.status_state}
            showStatus={conversation.type === 'direct'}
            isGroup={conversation.type === 'group'}
            className="mb-3 shadow-md"
          />

          <h4 className="text-lg font-bold text-[var(--rovela-text-primary)] leading-tight">
            {conversation.title}
          </h4>

          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1">
            {conversation.type === 'group'
              ? `${conversation.participant_ids.length} Participants`
              : partnerUser?.phone
              ? partnerUser.phone
              : partnerUser?.username
              ? `@${partnerUser.username}`
              : 'Rovela User'}
          </p>

          {conversation.description && (
            <p className="text-xs text-[var(--rovela-text-secondary)] mt-2 max-w-xs leading-relaxed">
              {conversation.description}
            </p>
          )}

          {/* PRIMARY ACTIONS (Section 9: Audio Call, Video Call, Search in Chat, Mute) */}
          <div className="grid grid-cols-4 gap-2 w-full mt-5">
            <button
              type="button"
              onClick={() => startCall(conversation, 'voice')}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 transition-all cursor-pointer active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span className="text-[11px] font-semibold">Audio</span>
            </button>

            <button
              type="button"
              onClick={() => startCall(conversation, 'video')}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 transition-all cursor-pointer active:scale-95"
            >
              <Video className="w-4 h-4" />
              <span className="text-[11px] font-semibold">Video</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Search activated in current chat', undefined, 'info')}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] hover:bg-[var(--rovela-surface-hover)] text-[var(--rovela-text-primary)] transition-all cursor-pointer active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span className="text-[11px] font-semibold">Search</span>
            </button>

            <button
              type="button"
              onClick={() => toggleMuteConversation(conversation.id)}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition-all cursor-pointer active:scale-95 ${
                conversation.is_muted
                  ? 'bg-rose-500/15 text-rose-500'
                  : 'bg-[var(--rovela-surface-secondary)] hover:bg-[var(--rovela-surface-hover)] text-[var(--rovela-text-primary)]'
              }`}
            >
              {conversation.is_muted ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              <span className="text-[11px] font-semibold">
                {conversation.is_muted ? 'Unmute' : 'Mute'}
              </span>
            </button>
          </div>
        </div>

        {/* PANEL SECTIONS (Section 9) */}
        <div className="flex-1 space-y-4 p-4">
          {/* Encryption Verification Section */}
          <div className="p-3.5 rounded-2xl bg-purple-500/[0.06] border border-purple-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300">
                <ShieldCheck className="w-4 h-4 text-purple-500" />
                <span>End-to-End Encryption</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                Verified
              </span>
            </div>
            <p className="text-[11px] text-[var(--rovela-text-secondary)] leading-relaxed">
              Messages and calls are secured with 256-bit elliptic-curve cryptography. No third parties can read or listen.
            </p>
            <button
              type="button"
              onClick={() => setShowVerifySecurityCode(!showVerifySecurityCode)}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer pt-1"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{showVerifySecurityCode ? 'Hide 60-digit code' : 'Verify security code'}</span>
            </button>

            {showVerifySecurityCode && (
              <div className="p-2.5 rounded-xl bg-[var(--rovela-surface-secondary)] font-mono text-[10px] text-center tracking-widest text-[var(--rovela-text-primary)] select-all border border-purple-500/20">
                39102 48192 01928 47192<br />
                82910 49102 38102 91823<br />
                19283 01928 47102 94810
              </div>
            )}
          </div>

          {/* Shared Media / Docs / Links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--rovela-text-secondary)] uppercase tracking-wider">
                Shared Media & Docs
              </span>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">4 files</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[var(--rovela-surface-secondary)] text-xs text-[var(--rovela-text-primary)]">
                <FileText className="w-4 h-4 text-purple-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">rovela-system-specs.pdf</p>
                  <p className="text-[10px] text-[var(--rovela-text-secondary)]">2.4 MB · Today</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[var(--rovela-surface-secondary)] text-xs text-[var(--rovela-text-primary)]">
                <ImageIcon className="w-4 h-4 text-purple-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">liquid-glass-blueprint.png</p>
                  <p className="text-[10px] text-[var(--rovela-text-secondary)]">1.8 MB · Yesterday</p>
                </div>
              </div>
            </div>
          </div>

          {/* Group members (if group) */}
          {conversation.type === 'group' && (
            <div className="space-y-2 pt-2 border-t border-[var(--rovela-border)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--rovela-text-secondary)] uppercase tracking-wider">
                  Channel Members ({groupMembers.length})
                </span>
                {onOpenAddMember && (
                  <button
                    type="button"
                    onClick={onOpenAddMember}
                    className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {groupMembers.map((member) => {
                  const isAdmin = conversation.admin_ids?.includes(member.id);
                  const isSelf = member.id === currentUser.id;

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--rovela-surface-hover)] transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar
                          src={member.avatar_url}
                          name={member.name}
                          size="sm"
                          status={member.status_state}
                          showStatus
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[var(--rovela-text-primary)] truncate">
                            {member.name} {isSelf && <span className="text-purple-500">(You)</span>}
                          </p>
                          <p className="text-[10px] text-[var(--rovela-text-secondary)] truncate">
                            @{member.username}
                          </p>
                        </div>
                      </div>

                      {isAdmin && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20 flex items-center gap-1">
                          <Shield className="w-2.5 h-2.5" />
                          Admin
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Destructive Actions (bottom) per Section 9: Clear Chat, Block Contact, Report Contact */}
        <div className="p-4 border-t border-[var(--rovela-border)] space-y-1 text-xs mt-auto">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all messages in this chat?')) {
                clearChatMessages(conversation.id);
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl text-[var(--rovela-text-secondary)] hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>Clear Chat</span>
          </button>

          {conversation.type === 'direct' && partnerUser && (
            <>
              <button
                type="button"
                onClick={() => setIsBlockModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl text-rose-600 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <UserX className="w-4 h-4" />
                <span>Block Contact</span>
              </button>

              <button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Flag className="w-4 h-4" />
                <span>Report Contact</span>
              </button>
            </>
          )}

          {conversation.type === 'group' && (
            <button
              type="button"
              onClick={() => showToast('Left group conversation', undefined, 'info')}
              className="w-full py-2.5 px-3 rounded-xl text-rose-600 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Leave Group</span>
            </button>
          )}
        </div>
      </aside>

      {/* Block Dialog */}
      {partnerUser && (
        <BlockUserDialog
          isOpen={isBlockModalOpen}
          onClose={() => setIsBlockModalOpen(false)}
          userId={partnerUser.id}
          userName={partnerUser.name}
        />
      )}

      {/* Report Dialog */}
      <ReportMessageDialog
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        messageId={`conv-${conversation.id}`}
        messageContent={`Entire conversation thread: ${conversation.title}`}
      />
    </>
  );
};
