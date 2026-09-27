import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar } from '../ui/Avatar';
import {
  X,
  User,
  Phone,
  Mail,
  AtSign,
  Check,
  Search,
  ShieldCheck,
  UserPlus,
  AlertCircle,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { MOCK_USERS } from '../../data/mockData';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    name?: string;
    phone?: string;
    email?: string;
    username?: string;
  } | null;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { users, currentUser, saveContact, showToast } = useChat();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      if (initialData.name) {
        const parts = initialData.name.trim().split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
      }
      if (initialData.phone) setPhone(initialData.phone);
      if (initialData.email) setEmail(initialData.email);
      if (initialData.username) setUsername(initialData.username.replace('@', ''));
    } else {
      setFirstName('');
      setLastName('');
      setPhone('');
      setEmail('');
      setUsername('');
      setNotes('');
    }
  }, [initialData, isOpen]);

  // Check if entered username matches a Rovela user
  const cleanUsername = username.replace('@', '').toLowerCase().trim();
  const matchedUser = cleanUsername
    ? users.find(
        (u) =>
          u.id !== currentUser.id &&
          u.username.toLowerCase() === cleanUsername
      )
    : null;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() && !lastName.trim() && !matchedUser) {
      showToast('Please enter a name or Rovela ID', undefined, 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const targetUserId = matchedUser ? matchedUser.id : `user-external-${Date.now()}`;
      const first = firstName.trim() || matchedUser?.name.split(' ')[0] || 'Contact';
      const last = lastName.trim() || matchedUser?.name.split(' ').slice(1).join(' ') || '';

      saveContact({
        contact_user_id: targetUserId,
        first_name: first,
        last_name: last,
        custom_display_name: `${first} ${last}`.trim(),
        phone: phone.trim() || matchedUser?.phone,
        email: email.trim() || matchedUser?.email,
        notes: notes.trim() || undefined,
        use_custom_avatar: false,
      });

      setIsSubmitting(false);
      onClose();
    }, 350);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg bg-[var(--rovela-surface)] border border-[var(--rovela-border)] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[var(--rovela-border)] flex items-center justify-between bg-[var(--rovela-surface-secondary)]">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-purple-400" />
              <div>
                <h2 className="text-base font-extrabold text-[var(--rovela-text-primary)]">
                  Add New Contact
                </h2>
                <p className="text-xs text-[var(--rovela-text-secondary)]">
                  Save a friend to your personal Rovela contact list
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Optional Rovela ID Matcher Card */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--rovela-text-secondary)]">
                Rovela ID (@username) (Optional)
              </label>
              <div className="relative flex items-center">
                <AtSign className="absolute left-3.5 w-4 h-4 text-purple-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace('@', ''))}
                  placeholder="e.g. sarahw or marcusv"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-sm font-semibold text-[var(--rovela-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Live Match Preview */}
              {matchedUser && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      src={matchedUser.avatar_url}
                      name={matchedUser.name}
                      size="sm"
                      className="w-10 h-10 ring-2 ring-purple-400 rounded-2xl"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[var(--rovela-text-primary)] truncate">
                          {matchedUser.name}
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      </div>
                      <span className="text-[11px] font-semibold text-purple-400 block truncate">
                        @{matchedUser.username}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-purple-600 text-white text-[10px] font-bold shrink-0">
                    Rovela User Verified
                  </span>
                </motion.div>
              )}

              {cleanUsername && !matchedUser && (
                <p className="text-[11px] text-[var(--rovela-text-muted)] flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  No active Rovela user found with @{cleanUsername}. You can still save them as a contact.
                </p>
              )}
            </div>

            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--rovela-text-secondary)]">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required={!matchedUser}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-sm font-semibold text-[var(--rovela-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--rovela-text-secondary)]">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-sm font-semibold text-[var(--rovela-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--rovela-text-secondary)]">
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3.5 w-4 h-4 text-[var(--rovela-text-muted)]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-xs text-[var(--rovela-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--rovela-text-secondary)]">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-[var(--rovela-text-muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="friend@domain.com"
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-xs text-[var(--rovela-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Private Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[var(--rovela-text-secondary)]">
                Private Note (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Where you met, company, or personal reminders..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-xs text-[var(--rovela-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[var(--rovela-border)] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/30 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? 'Adding...' : 'Add Contact'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
