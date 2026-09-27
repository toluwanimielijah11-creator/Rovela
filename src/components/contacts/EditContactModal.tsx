import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar } from '../ui/Avatar';
import {
  X,
  User,
  Camera,
  Upload,
  Lock,
  Phone,
  Mail,
  FileText,
  Sparkles,
  Check,
  Star,
  Trash2,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { UserContactRecord, UserProfile } from '../../types';

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const EditContactModal: React.FC<EditContactModalProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const {
    users,
    contacts,
    saveContact,
    deleteContact,
    getContactForUser,
    showToast,
  } = useChat();

  const user = users.find((u) => u.id === userId);
  const existingContact = getContactForUser(userId);

  // Split existing display name if first/last not explicitly stored
  const defaultFirst = existingContact?.first_name || user?.name.split(' ')[0] || '';
  const defaultLast = existingContact?.last_name || user?.name.split(' ').slice(1).join(' ') || '';

  const [firstName, setFirstName] = useState(defaultFirst);
  const [lastName, setLastName] = useState(defaultLast);
  const [customDisplayName, setCustomDisplayName] = useState(
    existingContact?.custom_display_name || user?.name || ''
  );
  const [nickname, setNickname] = useState(existingContact?.nickname || '');
  const [phone, setPhone] = useState(existingContact?.phone || user?.phone || '');
  const [email, setEmail] = useState(existingContact?.email || user?.email || '');
  const [notes, setNotes] = useState(existingContact?.notes || '');
  const [useCustomAvatar, setUseCustomAvatar] = useState(
    existingContact?.use_custom_avatar || false
  );
  const [customAvatarUrl, setCustomAvatarUrl] = useState(
    existingContact?.custom_avatar_url || ''
  );
  const [isFavorite, setIsFavorite] = useState(existingContact?.is_favorite || false);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !user) return null;

  const handleCustomPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCustomAvatarUrl(reader.result);
          setUseCustomAvatar(true);
          showToast('Custom photo applied for this contact', undefined, 'info');
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() && !lastName.trim() && !customDisplayName.trim()) {
      showToast('Please enter a name for this contact', undefined, 'warning');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const finalDisplayName =
        customDisplayName.trim() || `${firstName.trim()} ${lastName.trim()}`.trim();

      saveContact({
        contact_user_id: user.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        custom_display_name: finalDisplayName,
        nickname: nickname.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        notes: notes.trim() || undefined,
        custom_avatar_url: customAvatarUrl || undefined,
        use_custom_avatar: useCustomAvatar,
        is_favorite: isFavorite,
      });

      setIsSaving(false);
      onClose();
    }, 350);
  };

  const handleDelete = () => {
    if (existingContact) {
      deleteContact(existingContact.id);
      onClose();
    }
  };

  const previewAvatar = useCustomAvatar && customAvatarUrl ? customAvatarUrl : user.avatar_url;

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
            <div>
              <h2 className="text-base font-extrabold text-[var(--rovela-text-primary)]">
                {existingContact ? 'Edit Contact' : 'Save Contact'}
              </h2>
              <p className="text-xs text-[var(--rovela-text-secondary)]">
                Personalize how this person appears across your Rovela
              </p>
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
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Avatar & Source Selection Card */}
            <div className="p-4 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] flex flex-col sm:flex-row items-center gap-4">
              <div className="relative shrink-0">
                <Avatar
                  src={previewAvatar}
                  name={customDisplayName || user.name}
                  size="lg"
                  className="w-20 h-20 text-xl ring-2 ring-purple-500/30 shadow-md rounded-2xl"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-md cursor-pointer"
                  title="Upload custom contact photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCustomPhotoSelect}
                />
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-left space-y-1.5">
                <span className="text-xs font-bold text-[var(--rovela-text-primary)] block">
                  Contact Photo Preference
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setUseCustomAvatar(false)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      !useCustomAvatar
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-[var(--rovela-surface)] border-[var(--rovela-border)] text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)]'
                    }`}
                  >
                    Use Rovela Profile Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!customAvatarUrl) {
                        fileInputRef.current?.click();
                      } else {
                        setUseCustomAvatar(true);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      useCustomAvatar
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-[var(--rovela-surface)] border-[var(--rovela-border)] text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)]'
                    }`}
                  >
                    Use Custom Photo
                  </button>
                </div>
                <p className="text-[11px] text-[var(--rovela-text-muted)]">
                  Custom photos are local to your account and never visible to others.
                </p>
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--rovela-text-secondary)]">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (!customDisplayName) {
                      setCustomDisplayName(`${e.target.value} ${lastName}`.trim());
                    }
                  }}
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
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (!customDisplayName) {
                      setCustomDisplayName(`${firstName} ${e.target.value}`.trim());
                    }
                  }}
                  placeholder="Last name"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-sm font-semibold text-[var(--rovela-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Custom Display Name & Nickname */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--rovela-text-secondary)]">
                  Personal Display Name
                </label>
                <input
                  type="text"
                  value={customDisplayName}
                  onChange={(e) => setCustomDisplayName(e.target.value)}
                  placeholder="How you want to see them"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-sm font-semibold text-[var(--rovela-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--rovela-text-secondary)]">
                  Nickname (Optional)
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Work Buddy, Bro"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-sm font-semibold text-[var(--rovela-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Official Rovela Identity Reference */}
            <div className="px-3.5 py-2.5 rounded-2xl bg-purple-500/5 border border-purple-500/20 flex items-center justify-between text-xs">
              <span className="text-[var(--rovela-text-secondary)]">
                Official Rovela Profile:
              </span>
              <span className="font-bold text-purple-400">
                {user.name} (@{user.username})
              </span>
            </div>

            {/* Contact Details (Phone & Email) */}
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
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-xs text-[var(--rovela-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact Notes (Requirement 10) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[var(--rovela-text-secondary)] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  Private Contact Notes
                </label>
                <span className="text-[10px] font-semibold text-purple-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Only visible to you
                </span>
              </div>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add private reminders, context, or meeting notes about this person..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-xs text-[var(--rovela-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <p className="text-[11px] text-[var(--rovela-text-muted)]">
                Notes are confidential and never shared with the contact or anyone else.
              </p>
            </div>

            {/* Favorite toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)]">
              <div className="flex items-center gap-2.5">
                <Star
                  className={`w-4 h-4 ${
                    isFavorite ? 'text-amber-400 fill-amber-400' : 'text-[var(--rovela-text-muted)]'
                  }`}
                />
                <div>
                  <span className="text-xs font-bold text-[var(--rovela-text-primary)] block">
                    Favorite Contact
                  </span>
                  <span className="text-[11px] text-[var(--rovela-text-muted)]">
                    Pin at the top of your contacts list
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[var(--rovela-border)] flex items-center justify-between">
              {existingContact ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Contact</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-2xl text-xs font-bold text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/30 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Contact'}</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
