import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { Avatar } from '../ui/Avatar';
import {
  Users,
  Smartphone,
  Shield,
  Search,
  UserPlus,
  Mail,
  CheckCircle2,
  Sparkles,
  Info,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const ContactImporter: React.FC = () => {
  const {
    importedContacts,
    importContactsFromDevice,
    inviteContact,
    addManualContact,
    createDirectConversation,
  } = useChat();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'on_rovela' | 'to_invite'>('all');
  const [manualName, setManualName] = useState('');
  const [manualEmailOrPhone, setManualEmailOrPhone] = useState('');
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [permissionNotice, setPermissionNotice] = useState<string | null>(null);

  const handleDeviceImport = async () => {
    setIsImporting(true);
    setPermissionNotice(null);
    const result = await importContactsFromDevice();
    setIsImporting(false);
    if (!result.success) {
      setPermissionNotice(result.message);
    }
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualEmailOrPhone.trim()) return;
    addManualContact(manualName.trim(), manualEmailOrPhone.trim());
    setManualName('');
    setManualEmailOrPhone('');
    setIsAddingManual(false);
  };

  const filteredContacts = importedContacts.filter((c) => {
    const s = search.toLowerCase();
    const matchesSearch =
      (c.name && c.name.toLowerCase().includes(s)) ||
      (c.rovela_username && c.rovela_username.toLowerCase().includes(s)) ||
      (c.email && c.email.toLowerCase().includes(s)) ||
      (c.phone && c.phone.includes(search));

    if (!matchesSearch) return false;
    if (filterType === 'on_rovela') return c.is_on_rovela;
    if (filterType === 'to_invite') return !c.is_on_rovela;
    return true;
  });

  const onRovelaCount = importedContacts.filter((c) => c.is_on_rovela).length;
  const inviteCount = importedContacts.filter((c) => !c.is_on_rovela).length;

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--rovela-surface)] overflow-y-auto select-none">
      {/* Header Banner */}
      <div className="p-6 md:p-8 border-b border-[var(--rovela-border)] bg-[var(--rovela-surface)]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Contact Directory & Synchronization
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[var(--rovela-text-primary)] tracking-tight">
              People & Contacts
            </h2>
            <p className="text-xs md:text-sm text-[var(--rovela-text-secondary)] mt-1 max-w-xl">
              Find colleagues and friends on Rovela by importing your address book securely or inviting them directly.
            </p>
          </div>

          {/* Prominent Import Action Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDeviceImport}
              disabled={isImporting}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-950/30 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Smartphone className="w-4 h-4" />
              <span>{isImporting ? 'Requesting Device...' : 'Import Contacts'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddingManual(!isAddingManual)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[var(--rovela-surface-secondary)] text-[var(--rovela-text-primary)] text-xs font-bold border border-[var(--rovela-border)] transition-all hover:bg-[var(--rovela-surface-hover)] active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-purple-500" />
              <span>Add Manually</span>
            </button>
          </div>
        </div>

        {/* Privacy Assurance Notice */}
        <div className="max-w-4xl mx-auto mt-6 p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-[var(--rovela-text-secondary)] text-xs flex items-start gap-3">
          <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-[var(--rovela-text-primary)]">Privacy First Contact Verification</p>
            <p className="text-[var(--rovela-text-secondary)] leading-relaxed text-[11px]">
              Rovela only uses phone numbers and emails to check if your acquaintances are registered. Your address book data is never sold, shared, or used for spam.
            </p>
          </div>
        </div>

        {/* Device Permission Feedback Notice (if unsupported or denied) */}
        {permissionNotice && (
          <div className="max-w-4xl mx-auto mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-[11px] leading-relaxed">
              <span className="font-bold">Browser Environment Note: </span>
              {permissionNotice} You can easily add contacts below using their name and email/phone.
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
        {/* Manual Add Contact Expandable Form */}
        {isAddingManual && (
          <form
            onSubmit={handleAddManual}
            className="p-5 rounded-3xl bg-[var(--rovela-surface-secondary)] border border-purple-500/30 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--rovela-text-primary)] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-500" />
                Add Contact by Username, Email, or Phone
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingManual(false)}
                className="text-xs text-[var(--rovela-text-muted)] hover:text-[var(--rovela-text-primary)]"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[var(--rovela-text-secondary)] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] text-xs text-[var(--rovela-text-primary)] placeholder:[var(--rovela-text-muted)] focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[var(--rovela-text-secondary)] block mb-1">
                  Email address or Phone number
                </label>
                <input
                  type="text"
                  value={manualEmailOrPhone}
                  onChange={(e) => setManualEmailOrPhone(e.target.value)}
                  placeholder="jordan@example.com or +1 (555) 012-3456"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] text-xs text-[var(--rovela-text-primary)] placeholder:[var(--rovela-text-muted)] focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingManual(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-950/20"
              >
                Save Contact
              </button>
            </div>
          </form>
        )}

        {/* Filter and Search Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--rovela-text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts by name, email, or phone..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] text-xs text-[var(--rovela-text-primary)] placeholder:[var(--rovela-text-muted)] focus:outline-none focus:border-purple-500 transition-colors shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] w-full sm:w-auto justify-center">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)]'
              }`}
            >
              All ({importedContacts.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('on_rovela')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'on_rovela'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)]'
              }`}
            >
              On Rovela ({onRovelaCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('to_invite')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'to_invite'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)]'
              }`}
            >
              Invite ({inviteCount})
            </button>
          </div>
        </div>

        {/* Contacts Cards Grid */}
        {filteredContacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] flex items-center justify-between gap-3 transition-all hover:border-purple-500/30 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <Avatar
                      src={contact.avatar_url}
                      name={contact.name}
                      size="md"
                      status={contact.rovela_status}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[var(--rovela-text-primary)] truncate">
                        {contact.name}
                      </h4>
                      {contact.is_on_rovela && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold shrink-0">
                          On Rovela
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-[var(--rovela-text-secondary)] truncate">
                      {contact.rovela_username
                        ? `@${contact.rovela_username}`
                        : contact.email || contact.phone || 'Contact'}
                    </p>
                  </div>
                </div>

                {/* Direct Action: Message or Invite */}
                <div className="shrink-0">
                  {contact.is_on_rovela && contact.rovela_user_id ? (
                    <button
                      type="button"
                      onClick={() => createDirectConversation(contact.rovela_user_id!)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-sm shadow-purple-950/20 transition-all active:scale-95 cursor-pointer"
                    >
                      Chat
                    </button>
                  ) : contact.invited ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Invited
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => inviteContact(contact.id)}
                      className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[var(--rovela-surface)] text-purple-700 dark:text-purple-300 border border-purple-500/30 hover:bg-purple-500/10 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Invite</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 px-6 text-center rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/15 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[var(--rovela-text-primary)] mb-1">
              No contacts found
            </h3>
            <p className="text-xs text-[var(--rovela-text-secondary)] max-w-sm mb-6">
              Import your contacts or add someone by email or username to connect on Rovela.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDeviceImport}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-950/30"
              >
                Import Contacts
              </button>
              <button
                type="button"
                onClick={() => setIsAddingManual(true)}
                className="px-4 py-2 rounded-xl bg-[var(--rovela-surface)] text-[var(--rovela-text-primary)] border border-[var(--rovela-border)] text-xs font-bold"
              >
                Add Manually
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
