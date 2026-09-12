import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { NavigationSidebar } from './NavigationSidebar';
import { ChatList } from '../chat/ChatList';
import { ConversationHeader } from '../chat/ConversationHeader';
import { MessageStream } from '../chat/MessageStream';
import { MessageComposer } from '../chat/MessageComposer';
import { ChatInfoPanel } from '../chat/ChatInfoPanel';
import { ContactsView } from '../contacts/ContactsView';
import { GroupsView } from '../groups/GroupsView';
import { NotificationsView } from '../notifications/NotificationsView';
import { ProfileView } from '../profile/ProfileView';
import { SettingsView } from '../settings/SettingsView';
import { AdminDashboard } from '../admin/AdminDashboard';
import { CallInterface } from '../calling/CallInterface';
import { CallsView } from '../calling/CallsView';
import { LockedChatsView } from '../security/LockedChatsView';
import { StatusView } from '../status/StatusView';
import { StatusViewerModal } from '../status/StatusViewerModal';
import { NewChatModal } from '../modals/NewChatModal';
import { CreateGroupModal } from '../modals/CreateGroupModal';
import { MediaViewerModal } from '../profile/MediaViewerModal';
import { EditProfileModal } from '../profile/EditProfileModal';
import { ShareProfileModal } from '../profile/ShareProfileModal';
import { RovelaQrModal } from '../qr/RovelaQrModal';
import { ScanQrModal } from '../qr/ScanQrModal';
import { FindOnRovelaModal } from '../qr/FindOnRovelaModal';
import { ProfilePreviewSheet } from '../profile/ProfilePreviewSheet';
import { OtherUserProfileModal } from '../profile/OtherUserProfileModal';
import { ContactDetailsModal } from '../contacts/ContactDetailsModal';
import { EditContactModal } from '../contacts/EditContactModal';
import { AddContactModal } from '../contacts/AddContactModal';
import { ReportUserModal } from '../modals/ReportUserModal';
import { BlockUserDialog } from '../modals/BlockUserDialog';
import { Message } from '../../types';
import { RovelaLogo } from '../ui/RovelaLogo';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Users } from 'lucide-react';

export const AppShell: React.FC = () => {
  const {
    activeSection,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    activeMessages,
    isInfoPanelOpen,
    closeInfoPanel,
    toasts,
    removeToast,
    startCall,
    activeStatusView,
    closeStatusViewer,
    currentUser,
    activeMediaViewer,
    closeMediaViewer,
    isEditProfileOpen,
    closeEditProfile,
    shareProfileUser,
    closeShareProfile,
    qrModalUser,
    closeQrModal,
    isScanQrOpen,
    closeScanQr,
    isFindOnRovelaOpen,
    findOnRovelaInitialQuery,
    closeFindOnRovela,
    previewProfileUserId,
    closeProfilePreview,
    selectedProfileUserId,
    closeUserProfile,
    contactDetailsUserId,
    closeContactDetails,
    editContactUserId,
    closeEditContact,
    isAddContactOpen,
    addContactInitialData,
    closeAddContact,
    reportTargetUser,
    closeReportUserModal,
    blockTargetUser,
    closeBlockUserModal,
  } = useChat();

  // Modals state
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  // Active message reply
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  const handleStartCall = (type: 'audio' | 'video') => {
    if (activeConversation) {
      startCall(activeConversation, type === 'video' ? 'video' : 'voice');
    }
  };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[var(--rovela-bg)] text-[var(--rovela-text-primary)] antialiased selection:bg-purple-500/30">
      {/* Living Ambient Background Auras */}
      <div className="pointer-events-none fixed -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-purple-600/10 via-violet-500/08 to-transparent blur-3xl ambient-aura-1 z-0" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-indigo-600/10 via-purple-700/08 to-transparent blur-3xl ambient-aura-2 z-0" />

      {/* Full-Screen Liquid Glass Call Interface */}
      <CallInterface />

      {/* Global Modals */}
      <StatusViewerModal
        isOpen={!!activeStatusView}
        group={activeStatusView?.group || null}
        initialIndex={activeStatusView?.initialIndex || 0}
        onClose={closeStatusViewer}
      />

      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
      />

      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
      />

      {/* Profile & Contact Modals */}
      {activeMediaViewer && (
        <MediaViewerModal
          isOpen={Boolean(activeMediaViewer)}
          url={activeMediaViewer.url}
          title={activeMediaViewer.title || 'Media Viewer'}
          onClose={closeMediaViewer}
        />
      )}

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={closeEditProfile}
      />

      {shareProfileUser && (
        <ShareProfileModal
          isOpen={Boolean(shareProfileUser)}
          user={shareProfileUser}
          onClose={closeShareProfile}
        />
      )}

      {qrModalUser && (
        <RovelaQrModal
          isOpen={Boolean(qrModalUser)}
          user={qrModalUser}
          onClose={closeQrModal}
        />
      )}

      <ScanQrModal
        isOpen={isScanQrOpen}
        onClose={closeScanQr}
      />

      <FindOnRovelaModal
        isOpen={isFindOnRovelaOpen}
        initialQuery={findOnRovelaInitialQuery}
        onClose={closeFindOnRovela}
      />

      <ProfilePreviewSheet
        userId={previewProfileUserId}
        onClose={closeProfilePreview}
      />

      <OtherUserProfileModal
        userId={selectedProfileUserId}
        onClose={closeUserProfile}
      />

      <ContactDetailsModal
        userId={contactDetailsUserId}
        onClose={closeContactDetails}
      />

      {editContactUserId && (
        <EditContactModal
          isOpen={Boolean(editContactUserId)}
          userId={editContactUserId}
          onClose={closeEditContact}
        />
      )}

      <AddContactModal
        isOpen={isAddContactOpen}
        initialData={addContactInitialData}
        onClose={closeAddContact}
      />

      {reportTargetUser && (
        <ReportUserModal
          isOpen={Boolean(reportTargetUser)}
          user={reportTargetUser}
          onClose={closeReportUserModal}
        />
      )}

      {blockTargetUser && (
        <BlockUserDialog
          isOpen={Boolean(blockTargetUser)}
          userId={blockTargetUser.id}
          userName={blockTargetUser.name}
          onClose={closeBlockUserModal}
        />
      )}

      {/* Main Structural Dock (Desktop Sidebar / Mobile Bottom Nav) */}
      <NavigationSidebar />

      {/* Primary Content Container */}
      <main className="flex-1 flex overflow-hidden relative pb-16 md:pb-0 z-10" role="main">
        <AnimatePresence mode="wait">
          {activeSection === 'chats' && (
            <motion.div
              key="section-chats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex overflow-hidden w-full h-full"
            >
              {/* Conversation List Column (Hidden on mobile if a conversation is open) */}
              <div
                className={`w-full md:w-80 lg:w-92 h-full shrink-0 flex flex-col ${
                  activeConversationId ? 'hidden md:flex' : 'flex'
                }`}
              >
                <ChatList
                  onOpenNewChat={() => setIsNewChatOpen(true)}
                  onOpenCreateGroup={() => setIsCreateGroupOpen(true)}
                />
              </div>

              {/* Conversation Viewport (Hidden on mobile if no conversation is open) */}
              <div
                className={`flex-1 flex flex-col h-full overflow-hidden bg-[var(--rovela-surface)]/80 dark:bg-[var(--rovela-surface)]/90 backdrop-blur-md relative ${
                  !activeConversationId ? 'hidden md:flex' : 'flex'
                }`}
              >
                {activeConversation ? (
                  <motion.div
                    key={activeConversation.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 flex flex-col h-full overflow-hidden"
                  >
                    <ConversationHeader
                      conversation={activeConversation}
                      onBackMobile={() => setActiveConversationId(null)}
                      onStartCall={handleStartCall}
                      onToggleSearch={() => {}}
                    />

                    {/* Message Stream */}
                    <MessageStream
                      conversation={activeConversation}
                      messages={activeMessages}
                      onReply={(msg) => setReplyingTo(msg)}
                    />

                    {/* Message Composer */}
                    <MessageComposer
                      replyingTo={replyingTo}
                      onCancelReply={() => setReplyingTo(null)}
                    />
                  </motion.div>
                ) : (
                  /* Empty state when no conversation is selected on desktop */
                  <div className="hidden md:flex flex-col items-center justify-center h-full p-8 text-center select-none">
                    <div className="p-8 sm:p-10 rounded-3xl bg-[var(--rovela-surface)] max-w-md w-full shadow-2xl flex flex-col items-center border border-[var(--rovela-border)]">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 rounded-3xl bg-purple-500/20 blur-2xl pointer-events-none" />
                        <RovelaLogo size="lg" showTagline className="relative z-10" />
                      </div>
                      <h3 className="text-xl font-extrabold text-[var(--rovela-text-primary)] mb-2 tracking-tight">
                        Welcome to Rovela
                      </h3>
                      <p className="text-xs text-[var(--rovela-text-secondary)] mb-6 leading-relaxed">
                        Select a conversation from the sidebar or start a new direct chat with a teammate.
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsNewChatOpen(true)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_14px_rgba(124,58,237,0.35)] transition-all active:scale-95 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>New Message</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCreateGroupOpen(true)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] text-[var(--rovela-text-primary)] text-xs font-bold transition-all hover:bg-[var(--rovela-surface-hover)] active:scale-95 cursor-pointer border border-[var(--rovela-border)]"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Create Channel</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contextual Right Info Panel (Desktop & Tablet collapsible) */}
              {activeConversation && isInfoPanelOpen && (
                <ChatInfoPanel
                  conversation={activeConversation}
                  onClose={closeInfoPanel}
                  onOpenAddMember={() => setIsNewChatOpen(true)}
                />
              )}
            </motion.div>
          )}

          {/* Contacts Section */}
          {activeSection === 'contacts' && (
            <motion.div
              key="section-contacts"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex overflow-hidden w-full h-full"
            >
              <ContactsView onOpenNewChat={() => setIsNewChatOpen(true)} />
            </motion.div>
          )}

          {/* Calls Section (Screen 10) */}
          {activeSection === 'calls' && (
            <motion.div
              key="section-calls"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex overflow-hidden w-full h-full"
            >
              <CallsView onStartNewCall={() => setIsNewChatOpen(true)} />
            </motion.div>
          )}

          {/* Status Section */}
          {activeSection === 'status' && (
            <motion.div
              key="section-status"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex overflow-hidden w-full h-full"
            >
              <StatusView />
            </motion.div>
          )}

          {/* Locked Chats Vault Section (Screen 15) */}
          {activeSection === 'locked-chats' && (
            <motion.div
              key="section-locked-chats"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex overflow-hidden w-full h-full"
            >
              <LockedChatsView />
            </motion.div>
          )}

          {/* Groups Section */}
          {activeSection === 'groups' && (
            <motion.div
              key="section-groups"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex overflow-hidden w-full h-full"
            >
              <GroupsView onOpenCreateGroup={() => setIsCreateGroupOpen(true)} />
            </motion.div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <motion.div
              key="section-notifications"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex overflow-hidden w-full h-full"
            >
              <NotificationsView />
            </motion.div>
          )}

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <motion.div
              key="section-profile"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex overflow-hidden w-full h-full"
            >
              <ProfileView />
            </motion.div>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <motion.div
              key="section-settings"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex overflow-hidden w-full h-full"
            >
              <SettingsView />
            </motion.div>
          )}

          {/* Admin Dashboard Section */}
          {activeSection === 'admin' && (
            <motion.div
              key="section-admin"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex overflow-hidden w-full h-full"
            >
              <AdminDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
