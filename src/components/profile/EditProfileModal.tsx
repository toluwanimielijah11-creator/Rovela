import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Camera,
  Upload,
  Trash2,
  Check,
  Sparkles,
  AtSign,
  User,
  Info,
  Phone,
  Mail,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { PhotoCropModal } from './PhotoCropModal';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, updateUserProfile, showToast, openMediaViewer } = useChat();

  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [about, setAbout] = useState(currentUser.status_text || currentUser.bio || '');
  const [phone, setPhone] = useState(currentUser.phone || '+1 (555) 234-5678');
  const [email, setEmail] = useState(currentUser.email || 'alex.morgan@rovela.io');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar_url);

  const [pendingCropImage, setPendingCropImage] = useState<string | null>(null);
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Check if anything changed
  const hasChanges =
    name.trim() !== currentUser.name ||
    username.trim().toLowerCase().replace('@', '') !== currentUser.username.toLowerCase().replace('@', '') ||
    about.trim() !== (currentUser.status_text || currentUser.bio || '') ||
    phone.trim() !== (currentUser.phone || '+1 (555) 234-5678') ||
    email.trim() !== currentUser.email ||
    avatarUrl !== currentUser.avatar_url;

  const validateUsername = (value: string): boolean => {
    const clean = value.replace('@', '').trim();
    if (clean.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }
    if (clean.length > 20) {
      setUsernameError('Username cannot exceed 20 characters');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(clean)) {
      setUsernameError('Letters, numbers, and underscores only');
      return false;
    }
    setUsernameError(null);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPendingCropImage(reader.result);
          setIsPhotoMenuOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
    // reset input
    e.target.value = '';
  };

  const handleTakePhoto = () => {
    // Realistic photo capture preset for instant demo
    const sampleSelfies = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    ];
    const picked = sampleSelfies[Math.floor(Math.random() * sampleSelfies.length)];
    setPendingCropImage(picked);
    setIsPhotoMenuOpen(false);
    showToast('Camera capture simulated', 'You can adjust and crop your photo.', 'info');
  };

  const handleRemovePhoto = () => {
    // Set to default Rovela avatar placeholder
    const defaultPlaceholder = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';
    setAvatarUrl(defaultPlaceholder);
    setIsPhotoMenuOpen(false);
    showToast('Profile photo removed', undefined, 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty', undefined, 'warning');
      return;
    }
    if (!validateUsername(username)) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const cleanUsername = username.replace('@', '').trim().toLowerCase();
      updateUserProfile({
        name: name.trim(),
        username: cleanUsername,
        status_text: about.trim(),
        bio: about.trim(),
        phone: phone.trim(),
        email: email.trim(),
        avatar_url: avatarUrl,
      });
      setIsSubmitting(false);
      onClose();
    }, 450);
  };

  return (
    <>
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
                  Edit Profile
                </h2>
                <p className="text-xs text-[var(--rovela-text-secondary)]">
                  Manage your public Rovela identity and details
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-all cursor-pointer"
                aria-label="Close edit profile"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Photo Section */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-purple-500/30 shadow-xl bg-purple-900/20">
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Photo action button */}
                  <button
                    type="button"
                    onClick={() => setIsPhotoMenuOpen((prev) => !prev)}
                    className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-900/40 border-2 border-[var(--rovela-surface)] transition-all cursor-pointer active:scale-95"
                    aria-label="Change photo options"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu for Photo */}
                  <AnimatePresence>
                    {isPhotoMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 8 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-[var(--rovela-surface)] border border-[var(--rovela-border)] rounded-2xl shadow-xl py-1.5 z-20"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setIsPhotoMenuOpen(false);
                            openMediaViewer({
                              url: avatarUrl,
                              title: name,
                              subtitle: `@${username} • Profile Photo`,
                              isSelf: true,
                              onEditPhoto: () => fileInputRef.current?.click(),
                              onRemovePhoto: handleRemovePhoto,
                            });
                          }}
                          className="w-full px-3.5 py-2 text-left text-xs font-medium text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-purple-400" />
                          View Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full px-3.5 py-2 text-left text-xs font-medium text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Upload className="w-4 h-4 text-blue-400" />
                          Choose from Device
                        </button>
                        <button
                          type="button"
                          onClick={handleTakePhoto}
                          className="w-full px-3.5 py-2 text-left text-xs font-medium text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Camera className="w-4 h-4 text-emerald-400" />
                          Take Photo
                        </button>
                        <div className="h-px bg-[var(--rovela-border)] my-1" />
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="w-full px-3.5 py-2 text-left text-xs font-medium text-rose-500 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove Photo
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="text-center">
                  <p className="text-xs font-semibold text-[var(--rovela-text-primary)]">
                    Profile Photo
                  </p>
                  <p className="text-[11px] text-[var(--rovela-text-muted)]">
                    Visible to everyone or according to your privacy settings
                  </p>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-name"
                  className="block text-xs font-bold uppercase tracking-wider text-[var(--rovela-text-secondary)]"
                >
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-4 h-4 text-[var(--rovela-text-muted)]" />
                  <input
                    id="profile-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-sm font-semibold text-[var(--rovela-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              {/* Rovela ID / Username */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="profile-username"
                    className="block text-xs font-bold uppercase tracking-wider text-[var(--rovela-text-secondary)]"
                  >
                    Rovela ID (@username) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-purple-400 font-medium">
                    Unique identifier
                  </span>
                </div>
                <div className="relative flex items-center">
                  <AtSign className="absolute left-3.5 w-4 h-4 text-purple-400" />
                  <input
                    id="profile-username"
                    type="text"
                    required
                    value={username.replace('@', '')}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                      setUsername(val);
                      validateUsername(val);
                    }}
                    placeholder="username"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border ${
                      usernameError
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-[var(--rovela-border)] focus:ring-purple-500'
                    } text-sm font-bold text-[var(--rovela-text-primary)] focus:outline-none focus:ring-2 transition-all`}
                  />
                </div>
                {usernameError ? (
                  <p className="text-[11px] text-rose-500 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {usernameError}
                  </p>
                ) : (
                  <p className="text-[11px] text-[var(--rovela-text-muted)]">
                    People can search and add you using @{username.replace('@', '')}
                  </p>
                )}
              </div>

              {/* About / Bio */}
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-about"
                  className="block text-xs font-bold uppercase tracking-wider text-[var(--rovela-text-secondary)]"
                >
                  About / Status Text
                </label>
                <div className="relative flex items-start">
                  <Info className="absolute left-3.5 top-3 w-4 h-4 text-[var(--rovela-text-muted)]" />
                  <textarea
                    id="profile-about"
                    rows={2}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Available for great conversations ✨"
                    maxLength={140}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-xs font-medium text-[var(--rovela-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[var(--rovela-text-muted)]">
                  <span>Shown on your profile and contact card</span>
                  <span>{about.length}/140</span>
                </div>
              </div>

              {/* Phone & Email (Contact Coordinates) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="profile-phone"
                    className="block text-xs font-bold uppercase tracking-wider text-[var(--rovela-text-secondary)]"
                  >
                    Phone Number
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3.5 w-4 h-4 text-[var(--rovela-text-muted)]" />
                    <input
                      id="profile-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-xs font-medium text-[var(--rovela-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="profile-email"
                    className="block text-xs font-bold uppercase tracking-wider text-[var(--rovela-text-secondary)]"
                  >
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 w-4 h-4 text-[var(--rovela-text-muted)]" />
                    <input
                      id="profile-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-xs font-medium text-[var(--rovela-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-[var(--rovela-border)] flex items-center justify-end gap-2.5">
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
                  disabled={!hasChanges || isSubmitting || Boolean(usernameError)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-purple-900/30 transition-all active:scale-95 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Saving changes...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Crop / Adjust Preview Modal */}
      {pendingCropImage && (
        <PhotoCropModal
          isOpen={Boolean(pendingCropImage)}
          onClose={() => setPendingCropImage(null)}
          imageUrl={pendingCropImage}
          onSaveCrop={(cropped) => {
            setAvatarUrl(cropped);
            setPendingCropImage(null);
            showToast('Photo adjusted and selected', 'Click Save Profile to commit.', 'info');
          }}
        />
      )}
    </>
  );
};
