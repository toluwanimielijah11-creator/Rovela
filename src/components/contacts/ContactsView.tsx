import React, { useState, useMemo } from 'react';
import { useChat } from '../../context/ChatContext';
import { Avatar } from '../ui/Avatar';
import { EmptyState } from '../common/EmptyState';
import { ContactImporter } from './ContactImporter';
import {
  UserPlus,
  MessageSquare,
  Search,
  Smartphone,
  Users,
  Phone,
  Video,
  Share2,
  QrCode,
  ScanLine,
  AtSign,
  Star,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Lock,
  FileText,
  UserCheck,
} from 'lucide-react';

interface ContactsViewProps {
  onOpenNewChat: () => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({ onOpenNewChat }) => {
  const {
    users,
    currentUser,
    contacts,
    getContactForUser,
    getEffectiveDisplayName,
    getEffectiveAvatarUrl,
    createDirectConversation,
    startCall,
    toggleFavoriteContact,
    openContactDetails,
    openEditContact,
    openAddContact,
    openScanQr,
    openFindOnRovela,
    openRovelaQr,
    openUserProfile,
    showToast,
  } = useChat();

  const [activeTab, setActiveTab] = useState<'directory' | 'import'>('directory');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'favorites' | 'online'>('all');

  // Prepare list of other users (excluding currentUser)
  const contactItems = useMemo(() => {
    return users
      .filter((u) => u.id !== currentUser.id)
      .map((user) => {
        const contactRecord = getContactForUser(user.id);
        const displayName = getEffectiveDisplayName(user);
        const avatarUrl = getEffectiveAvatarUrl(user);
        const isFavorite = contactRecord?.is_favorite || false;

        return {
          user,
          contactRecord,
          displayName,
          avatarUrl,
          isFavorite,
        };
      });
  }, [users, currentUser.id, contacts, getContactForUser, getEffectiveDisplayName, getEffectiveAvatarUrl]);

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    return contactItems.filter(({ user, contactRecord, displayName, isFavorite }) => {
      if (statusFilter === 'favorites' && !isFavorite) return false;
      if (statusFilter === 'online' && user.status_state !== 'online') return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase().replace('@', '');
      return (
        displayName.toLowerCase().includes(q) ||
        user.name.toLowerCase().includes(q) ||
        user.username.toLowerCase().includes(q) ||
        (contactRecord?.nickname && contactRecord.nickname.toLowerCase().includes(q)) ||
        (contactRecord?.notes && contactRecord.notes.toLowerCase().includes(q)) ||
        (user.phone && user.phone.toLowerCase().includes(q)) ||
        (contactRecord?.phone && contactRecord.phone.toLowerCase().includes(q))
      );
    });
  }, [contactItems, statusFilter, search]);

  // Split into favorites and regular
  const favoriteContacts = useMemo(
    () => filteredContacts.filter((c) => c.isFavorite),
    [filteredContacts]
  );

  const regularContacts = useMemo(() => {
    const list = statusFilter === 'favorites' ? [] : filteredContacts;
    // Sort alphabetically by displayName
    return [...list].sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [filteredContacts, statusFilter]);

  // Group regular contacts by letter
  const groupedContacts = useMemo(() => {
    const groups: { [letter: string]: typeof regularContacts } = {};
    for (const item of regularContacts) {
      const letter = item.displayName.charAt(0).toUpperCase() || '#';
      const key = /[A-Z]/.test(letter) ? letter : '#';
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [regularContacts]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--rovela-surface)] overflow-hidden select-none">
      {/* Top Header */}
      <div className="p-4 sm:p-6 border-b border-[var(--rovela-border)] bg-[var(--rovela-surface)] flex flex-col gap-4 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[var(--rovela-text-primary)]">
              Contacts & Rovela ID
            </h2>
            <p className="text-xs text-[var(--rovela-text-secondary)] mt-0.5">
              People, saved contacts, and unique @usernames ({contactItems.length} available)
            </p>
          </div>

          {/* Top Quick Actions: Find on Rovela, Scan QR, My QR, Add Contact */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={openFindOnRovela}
              className="px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-xs font-bold text-purple-400 hover:bg-purple-500/20 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Search Rovela IDs (@username)"
            >
              <AtSign className="w-3.5 h-3.5" />
              <span>Find by ID</span>
            </button>

            <button
              type="button"
              onClick={openScanQr}
              className="px-3 py-1.5 rounded-xl border border-[var(--rovela-border)] text-xs font-semibold text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Scan QR Code"
            >
              <ScanLine className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>

            <button
              type="button"
              onClick={openRovelaQr}
              className="px-3 py-1.5 rounded-xl border border-[var(--rovela-border)] text-xs font-semibold text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="My QR Code"
            >
              <QrCode className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">My QR</span>
            </button>

            <button
              type="button"
              onClick={() => openAddContact()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/30 transition-all active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Contact</span>
            </button>
          </div>
        </div>

        {/* 🔍 Search contacts */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by saved name, @username, nickname, phone, or notes..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] focus:border-purple-500 focus:outline-none text-[var(--rovela-text-primary)] placeholder:[var(--rovela-text-muted)] transition-all"
          />
        </div>

        {/* Filters & Tabs */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'directory'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-[var(--rovela-surface-secondary)] text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Contacts ({contactItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('import')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'import'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-[var(--rovela-surface-secondary)] text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Address Book Import</span>
            </button>
          </div>

          {activeTab === 'directory' && (
            <div className="flex items-center gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2 py-0.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'text-purple-600 dark:text-purple-300 bg-purple-500/10'
                    : 'text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)]'
                }`}
              >
                All
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('favorites')}
                className={`px-2 py-0.5 rounded-lg font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  statusFilter === 'favorites'
                    ? 'text-amber-400 bg-amber-500/10 font-bold'
                    : 'text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)]'
                }`}
              >
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>Favorites</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('online')}
                className={`px-2 py-0.5 rounded-lg font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  statusFilter === 'online'
                    ? 'text-emerald-500 bg-emerald-500/10 font-bold'
                    : 'text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Online</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'import' ? (
        <ContactImporter />
      ) : (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-6">
          {filteredContacts.length > 0 ? (
            <>
              {/* Favorites Section */}
              {statusFilter !== 'favorites' && favoriteContacts.length > 0 && !search && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 px-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>Favorite Contacts ({favoriteContacts.length})</span>
                  </h3>
                  <div className="divide-y divide-[var(--rovela-border)] rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] overflow-hidden">
                    {favoriteContacts.map(({ user, contactRecord, displayName, avatarUrl }) => (
                      <ContactRow
                        key={`fav-${user.id}`}
                        user={user}
                        contactRecord={contactRecord}
                        displayName={displayName}
                        avatarUrl={avatarUrl}
                        isFavorite={true}
                        onToggleFavorite={() => toggleFavoriteContact(user.id)}
                        onMessage={() => createDirectConversation(user.id)}
                        onVoice={() => startCall(user.id, 'voice')}
                        onVideo={() => startCall(user.id, 'video')}
                        onOpenDetails={() => openContactDetails(user.id)}
                        onEdit={() => openEditContact(user.id)}
                        onOpenProfile={() => openUserProfile(user.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Grouped Alphabetical List */}
              {groupedContacts.map(([letter, items]) => (
                <div key={letter} className="space-y-2">
                  <div className="sticky top-0 z-10 px-2 py-0.5 rounded-lg bg-[var(--rovela-surface)]/90 backdrop-blur-sm text-xs font-black text-purple-400 w-fit">
                    {letter}
                  </div>
                  <div className="divide-y divide-[var(--rovela-border)] rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] overflow-hidden">
                    {items.map(({ user, contactRecord, displayName, avatarUrl, isFavorite }) => (
                      <ContactRow
                        key={user.id}
                        user={user}
                        contactRecord={contactRecord}
                        displayName={displayName}
                        avatarUrl={avatarUrl}
                        isFavorite={isFavorite}
                        onToggleFavorite={() => toggleFavoriteContact(user.id)}
                        onMessage={() => createDirectConversation(user.id)}
                        onVoice={() => startCall(user.id, 'voice')}
                        onVideo={() => startCall(user.id, 'video')}
                        onOpenDetails={() => openContactDetails(user.id)}
                        onEdit={() => openEditContact(user.id)}
                        onOpenProfile={() => openUserProfile(user.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <EmptyState
              icon={<Search className="w-7 h-7" />}
              title="No contacts found"
              description={
                search
                  ? `No contact matched "${search}". Try searching by @username or use Find by ID.`
                  : 'No contacts available in this view.'
              }
              actionLabel="Find on Rovela"
              onAction={openFindOnRovela}
            />
          )}
        </div>
      )}
    </div>
  );
};

interface ContactRowProps {
  user: any;
  contactRecord: any;
  displayName: string;
  avatarUrl: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onMessage: () => void;
  onVoice: () => void;
  onVideo: () => void;
  onOpenDetails: () => void;
  onEdit: () => void;
  onOpenProfile: () => void;
}

const ContactRow: React.FC<ContactRowProps> = ({
  user,
  contactRecord,
  displayName,
  avatarUrl,
  isFavorite,
  onToggleFavorite,
  onMessage,
  onVoice,
  onVideo,
  onOpenDetails,
  onEdit,
  onOpenProfile,
}) => {
  const isCustomName = displayName !== user.name;
  const hasNotes = Boolean(contactRecord?.notes);

  return (
    <div className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-[var(--rovela-surface-hover)] transition-colors group">
      {/* Left: Avatar & Contact Details */}
      <button
        type="button"
        onClick={onOpenDetails}
        className="flex items-center gap-3.5 min-w-0 flex-1 text-left cursor-pointer focus:outline-none"
      >
        <div className="relative shrink-0">
          <Avatar
            src={avatarUrl}
            name={displayName}
            size="md"
            className="ring-2 ring-purple-500/20 rounded-2xl"
          />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[var(--rovela-surface)] ${
              user.status_state === 'online'
                ? 'bg-emerald-500'
                : user.status_state === 'busy'
                ? 'bg-amber-500'
                : 'bg-zinc-400'
            }`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-sm font-bold truncate leading-tight text-[var(--rovela-text-primary)] group-hover:text-purple-400 transition-colors">
              {displayName}
            </h4>

            {contactRecord?.nickname && (
              <span className="text-xs text-purple-400 font-semibold">
                "{contactRecord.nickname}"
              </span>
            )}

            <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />

            {contactRecord && (
              <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold shrink-0">
                Contact
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium truncate mt-0.5">
            <span>@{user.username}</span>
            {isCustomName && (
              <span className="text-[11px] text-[var(--rovela-text-muted)] truncate">
                (Official: {user.name})
              </span>
            )}
          </div>

          {/* Status text or private note preview */}
          <div className="flex items-center gap-2 mt-0.5">
            {hasNotes && (
              <span className="text-[11px] text-purple-300/90 flex items-center gap-1 truncate font-medium">
                <Lock className="w-2.5 h-2.5" />
                <span className="truncate italic">&quot;{contactRecord.notes}&quot;</span>
              </span>
            )}
            {!hasNotes && user.status_text && (
              <span className="text-[11px] text-[var(--rovela-text-secondary)] italic truncate">
                &quot;{user.status_text}&quot;
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Right Actions: Favorite, Edit, Message, Call */}
      <div className="flex items-center gap-1.5 shrink-0 ml-2">
        <button
          type="button"
          onClick={onToggleFavorite}
          className="w-8 h-8 rounded-xl hover:bg-[var(--rovela-surface-hover)] text-[var(--rovela-text-muted)] flex items-center justify-center transition-colors cursor-pointer"
          title={isFavorite ? 'Remove favorite' : 'Add to favorites'}
        >
          <Star
            className={`w-4 h-4 ${
              isFavorite ? 'fill-amber-400 text-amber-400' : 'hover:text-amber-400'
            }`}
          />
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="w-8 h-8 rounded-xl hover:bg-[var(--rovela-surface-hover)] text-[var(--rovela-text-muted)] hover:text-purple-400 flex items-center justify-center transition-colors cursor-pointer"
          title="Edit contact"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onMessage}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer"
          title="Send message"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Message</span>
        </button>

        <button
          type="button"
          onClick={onVoice}
          className="w-8 h-8 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          title="Voice call"
          aria-label="Voice call"
        >
          <Phone className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onVideo}
          className="w-8 h-8 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          title="Video call"
          aria-label="Video call"
        >
          <Video className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
