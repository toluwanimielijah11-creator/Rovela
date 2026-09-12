import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { Avatar } from '../ui/Avatar';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Fingerprint,
  KeyRound,
  ArrowLeft,
  X,
  MessageSquare,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface LockedChatsViewProps {
  onBack?: () => void;
}

export const LockedChatsView: React.FC<LockedChatsViewProps> = ({ onBack }) => {
  const {
    conversations,
    setActiveConversationId,
    setActiveSection,
    lockedChatsUnlocked,
    unlockLockedChats,
    lockChats,
    toggleLockConversation,
    settings,
    showToast,
  } = useChat();

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [pinError, setPinError] = useState(false);

  // Filter locked conversations
  const lockedConversations = conversations.filter((c) => !!c.is_locked);

  const handleKeypadPress = (digit: string) => {
    setPinError(false);
    const nextEmptyIndex = pinDigits.findIndex((d) => d === '');
    if (nextEmptyIndex !== -1) {
      const updated = [...pinDigits];
      updated[nextEmptyIndex] = digit;
      setPinDigits(updated);

      // If completing 6th digit, test unlock
      if (nextEmptyIndex === 5) {
        const fullPin = updated.join('');
        const success = unlockLockedChats(fullPin);
        if (success) {
          setIsPinModalOpen(false);
          setPinDigits(['', '', '', '', '', '']);
        } else {
          setPinError(true);
          setTimeout(() => {
            setPinDigits(['', '', '', '', '', '']);
          }, 600);
        }
      }
    }
  };

  const handleKeypadBackspace = () => {
    setPinError(false);
    const lastFilled = [...pinDigits].reverse().findIndex((d) => d !== '');
    if (lastFilled !== -1) {
      const actualIndex = 5 - lastFilled;
      const updated = [...pinDigits];
      updated[actualIndex] = '';
      setPinDigits(updated);
    }
  };

  const handleBiometricUnlock = () => {
    // Simulate instantaneous biometric sensor check
    showToast('Biometric verified', 'Face ID matched', 'success');
    unlockLockedChats(settings?.securityPin || '123456');
  };

  const handleOpenConversation = (id: string) => {
    setActiveConversationId(id);
    setActiveSection('chats');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--rovela-surface)] overflow-y-auto select-none relative font-sans">
      {/* Top Header matching reference */}
      <div className="p-4 sm:p-6 border-b border-[var(--rovela-border)] bg-[var(--rovela-surface)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-500" />
              <h2 className="text-xl font-extrabold tracking-tight text-[var(--rovela-text-primary)]">
                Locked Chats
              </h2>
            </div>
            <p className="text-xs text-[var(--rovela-text-secondary)]">
              Biometric & PIN-encrypted vault for sensitive conversations.
            </p>
          </div>
        </div>

        {lockedChatsUnlocked && (
          <button
            type="button"
            onClick={lockChats}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 border border-rose-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Vault</span>
          </button>
        )}
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 max-w-lg mx-auto w-full">
        {!lockedChatsUnlocked ? (
          /* Locked State Screen 15 */
          <div className="w-full flex flex-col items-center text-center my-auto">
            {/* Glowing Shield / Lock Badge Artwork */}
            <div className="relative mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-purple-600/25 blur-3xl scale-150 pointer-events-none" />
              <div className="w-32 h-32 rounded-full border-2 border-purple-500/40 bg-gradient-to-b from-purple-500/15 to-transparent flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-purple-900/30 border border-purple-400/30 flex items-center justify-center shadow-lg shadow-purple-950/40">
                  <Lock className="w-10 h-10 text-purple-400" />
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-extrabold text-[var(--rovela-text-primary)] tracking-tight mb-2">
              Locked Chats
            </h3>
            <p className="text-xs sm:text-sm text-[var(--rovela-text-secondary)] max-w-xs leading-relaxed mb-8">
              Your protected conversations are secured behind hardware-backed encryption.
            </p>

            {/* Action Buttons matching Screen 15 */}
            <div className="w-full flex flex-col gap-3 max-w-xs">
              <button
                type="button"
                onClick={() => setIsPinModalOpen(true)}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(124,58,237,0.45)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Unlock with PIN</span>
              </button>

              <button
                type="button"
                onClick={handleBiometricUnlock}
                className="w-full py-3 px-6 rounded-2xl bg-[var(--rovela-surface-secondary)] hover:bg-[var(--rovela-surface-hover)] border border-[var(--rovela-border)] active:scale-[0.98] text-[var(--rovela-text-primary)] font-semibold text-xs tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Fingerprint className="w-4 h-4 text-purple-400" />
                <span>Use biometric</span>
              </button>
            </div>

            <p className="text-xs text-[var(--rovela-text-muted)] mt-6 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-purple-400" />
              <span>Default PIN for demonstration is <code className="font-mono font-bold text-purple-400">123456</code></span>
            </p>
          </div>
        ) : (
          /* Unlocked Vault: List of Protected Conversations */
          <div className="w-full">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Vault Unlocked
                  </h4>
                  <p className="text-[11px] text-[var(--rovela-text-secondary)]">
                    {lockedConversations.length} secured conversation{lockedConversations.length === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={lockChats}
                className="text-xs font-bold text-[var(--rovela-text-secondary)] hover:text-rose-500 cursor-pointer"
              >
                Lock Now
              </button>
            </div>

            {lockedConversations.length === 0 ? (
              <div className="text-center py-12 p-6 rounded-3xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)]">
                <MessageSquare className="w-10 h-10 text-purple-400 mx-auto mb-3 opacity-60" />
                <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
                  No locked conversations
                </h4>
                <p className="text-xs text-[var(--rovela-text-secondary)] max-w-xs mx-auto mt-1">
                  You can lock any conversation from its chat menu to keep it completely hidden in this vault.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {lockedConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="p-4 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] shadow-sm flex items-center justify-between hover:border-purple-500/60 transition-all cursor-pointer"
                    onClick={() => handleOpenConversation(conv.id)}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Avatar
                        src={conv.avatar_url}
                        name={conv.title}
                        size="md"
                        isGroup={conv.type === 'group'}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[var(--rovela-text-primary)] truncate">
                            {conv.title}
                          </h4>
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
                            Locked
                          </span>
                        </div>
                        <p className="text-xs text-[var(--rovela-text-secondary)] truncate mt-0.5">
                          {conv.last_message?.content || 'No messages yet'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLockConversation(conv.id);
                        }}
                        className="p-2 rounded-xl text-[var(--rovela-text-muted)] hover:text-purple-600 dark:hover:text-purple-300 hover:bg-[var(--rovela-surface-hover)]"
                        title="Unlock chat (remove from vault)"
                      >
                        <Unlock className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive PIN Unlock Modal with 6 Indicator Circles & Keypad */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[var(--rovela-surface-secondary)] border border-purple-500/30 shadow-2xl p-6 select-none text-center">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Security Verification
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsPinModalOpen(false);
                  setPinDigits(['', '', '', '', '', '']);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-xl font-extrabold text-[var(--rovela-text-primary)] mb-1">
              Enter Security PIN
            </h3>
            <p className="text-xs text-[var(--rovela-text-secondary)] mb-6">
              Enter your 6-digit PIN to access locked chats.
            </p>

            {/* 6 circular indicators */}
            <div
              className={`flex justify-center items-center gap-3.5 mb-6 ${
                pinError ? 'animate-shake' : ''
              }`}
            >
              {pinDigits.map((digit, idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                    digit
                      ? 'bg-purple-500 scale-125 shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                      : pinError
                      ? 'border-2 border-rose-500 bg-rose-500/20'
                      : 'border-2 border-[var(--rovela-border)] bg-transparent'
                  }`}
                />
              ))}
            </div>

            {pinError && (
              <p className="text-xs font-semibold text-rose-500 mb-4">
                Incorrect PIN. Please try again.
              </p>
            )}

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto mb-2 w-full">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="h-12 rounded-xl bg-[var(--rovela-surface)] hover:bg-[var(--rovela-surface-hover)] active:bg-purple-600/30 border border-[var(--rovela-border)] text-lg font-bold text-[var(--rovela-text-primary)] transition-all cursor-pointer flex items-center justify-center"
                >
                  {digit}
                </button>
              ))}
              <div className="h-12" />
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="h-12 rounded-xl bg-[var(--rovela-surface)] hover:bg-[var(--rovela-surface-hover)] active:bg-purple-600/30 border border-[var(--rovela-border)] text-lg font-bold text-[var(--rovela-text-primary)] transition-all cursor-pointer flex items-center justify-center"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleKeypadBackspace}
                className="h-12 rounded-xl bg-[var(--rovela-surface)] hover:bg-[var(--rovela-surface-hover)] active:bg-purple-600/30 border border-[var(--rovela-border)] text-xs font-semibold text-[var(--rovela-text-secondary)] transition-all cursor-pointer flex items-center justify-center"
              >
                ⌫
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
