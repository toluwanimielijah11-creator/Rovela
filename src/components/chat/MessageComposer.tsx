import React, { useState, useRef, useEffect } from 'react';
import { Message, MessageAttachment } from '../../types';
import { useChat } from '../../context/ChatContext';
import { IconButton } from '../ui/IconButton';
import {
  Paperclip,
  Smile,
  Send,
  X,
  FileText,
  Image as ImageIcon,
  Mic,
  Trash2,
  Check,
} from 'lucide-react';

interface MessageComposerProps {
  replyingTo: Message | null;
  onCancelReply: () => void;
  onSent?: () => void;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  replyingTo,
  onCancelReply,
  onSent,
}) => {
  const { sendMessage, sendVoiceMessage, settings, showToast } = useChat();
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<MessageAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojis = ['😀', '😍', '🔥', '🚀', '💜', '👍', '🎉', '✨', '🙌', '💯', '👏', '⚡', '💡', '👌', '❤️', '🤩', '👋', '☕', '🌟', '🎯'];

  // Auto-grow textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  // Focus input when replying
  useEffect(() => {
    if (replyingTo) {
      inputRef.current?.focus();
    }
  }, [replyingTo]);

  // Close emoji picker on outside click
  useEffect(() => {
    if (!showEmojiPicker) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  const handleSend = () => {
    if (!text.trim() && pendingAttachments.length === 0) return;

    sendMessage(
      text,
      replyingTo || undefined,
      pendingAttachments.length > 0 ? pendingAttachments : undefined
    );

    setText('');
    setPendingAttachments([]);
    onCancelReply();
    setShowEmojiPicker(false);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    onSent?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (settings.enterToSend) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  const handleAddMockAttachment = (type: 'pdf' | 'img') => {
    const newAtt: MessageAttachment =
      type === 'pdf'
        ? {
            id: `att-${Date.now()}`,
            name: 'Rovela-Product-Specs.pdf',
            type: 'application/pdf',
            url: '#',
            size: '2.4 MB',
          }
        : {
            id: `att-${Date.now()}`,
            name: 'interface-mockup.png',
            type: 'image/png',
            url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
            size: '1.1 MB',
          };

    setPendingAttachments((prev) => [...prev, newAtt]);
    showToast(type === 'img' ? 'Photo uploaded' : 'File uploaded', undefined, 'success');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImg = file.type.startsWith('image/');
    const newAtt: MessageAttachment = {
      id: `att-${Date.now()}`,
      name: file.name,
      type: file.type || (isImg ? 'image/png' : 'application/pdf'),
      url: URL.createObjectURL(file),
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    };
    setPendingAttachments((prev) => [...prev, newAtt]);
    showToast(isImg ? 'Photo uploaded' : 'File uploaded', undefined, 'success');
    e.target.value = '';
  };

  const handleSelectEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  // Voice message handlers
  const startRecording = () => {
    setIsRecording(true);
  };

  const cancelRecording = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const finishAndSendVoice = () => {
    const duration = Math.max(2, recordingSeconds);
    // Generate realistic waveform
    const sampleWaveform = Array.from({ length: 18 }, () => Math.floor(Math.random() * 70) + 25);
    sendVoiceMessage(duration, sampleWaveform);
    setIsRecording(false);
    setRecordingSeconds(0);
    onCancelReply();
    onSent?.();
  };

  const formatRecTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const canSend = text.trim().length > 0 || pendingAttachments.length > 0;

  return (
    <div className="relative p-3 sm:p-4 bg-[var(--rovela-surface)] border-t border-[var(--rovela-border)] shrink-0">
      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-full left-4 mb-2 p-3 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] shadow-2xl z-30 flex flex-wrap gap-1.5 max-w-[280px] animate-in fade-in zoom-in-95 duration-150"
        >
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleSelectEmoji(emoji)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-lg hover:bg-[var(--rovela-surface-hover)] hover:scale-125 active:scale-95 transition-transform cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Replying Banner */}
      {replyingTo && (
        <div className="mb-2.5 px-3.5 py-2 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-purple-500/30 flex items-center justify-between text-xs animate-in slide-in-from-bottom-2">
          <div className="min-w-0 pr-2">
            <span className="font-bold text-purple-600 dark:text-purple-400">
              Replying to {replyingTo.sender_name}
            </span>
            <p className="text-[var(--rovela-text-secondary)] truncate text-[11px] mt-0.5 font-medium">
              {replyingTo.content}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancelReply}
            className="p-1 rounded-lg text-[var(--rovela-text-muted)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] active:scale-90 transition-all cursor-pointer"
            aria-label="Cancel reply"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Pending Attachments preview */}
      {pendingAttachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2.5">
          {pendingAttachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-xs text-[var(--rovela-text-primary)]"
            >
              <FileText className="w-3.5 h-3.5 text-purple-500" />
              <span className="max-w-[150px] truncate font-medium">{att.name}</span>
              <button
                type="button"
                onClick={() =>
                  setPendingAttachments((prev) => prev.filter((a) => a.id !== att.id))
                }
                className="text-[var(--rovela-text-muted)] hover:text-rose-500 cursor-pointer active:scale-90 p-0.5 rounded transition-all"
                aria-label="Remove attachment"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Voice Recording Active Mode */}
      {isRecording ? (
        <div className="flex items-center justify-between gap-3 bg-rose-500/10 dark:bg-rose-950/30 border border-rose-500/30 rounded-2xl p-2 sm:p-2.5 animate-in fade-in">
          <div className="flex items-center gap-3">
            {/* Pulsing record light */}
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping ml-1" />
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
              Recording · {formatRecTime(recordingSeconds)}
            </span>

            {/* Simulated live waveform pulse */}
            <div className="hidden sm:flex items-center gap-1 h-5 ml-2">
              {[12, 20, 32, 24, 16, 28, 36, 18, 22].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}px` }}
                  className="w-1 bg-rose-500 rounded-full animate-pulse"
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Cancel record button */}
            <button
              type="button"
              onClick={cancelRecording}
              className="p-2 rounded-xl text-[var(--rovela-text-secondary)] hover:text-rose-600 hover:bg-rose-500/15 transition-all cursor-pointer"
              title="Cancel recording"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Send voice note */}
            <button
              type="button"
              onClick={finishAndSendVoice}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-purple-950/20 active:scale-95 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Send Audio</span>
            </button>
          </div>
        </div>
      ) : (
        /* Normal Composer Box */
        <div className="flex items-end gap-2 bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] rounded-2xl p-1.5 sm:p-2 focus-within:border-purple-500/40 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
          {/* Attachment & Emoji options (Section 12: LEFT: Attach, Emoji) */}
          <div className="relative flex items-center gap-0.5">
            {/* 📎 Attach Button with popover */}
            <div className="relative">
              <IconButton
                icon={<Paperclip className="w-4.5 h-4.5 text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300" />}
                label="Attach"
                variant="ghost"
                size="sm"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
              />

              {showAttachMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-11 left-0 z-30 w-44 rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] shadow-2xl p-1.5 text-xs text-[var(--rovela-text-primary)] animate-in fade-in zoom-in-95 duration-100 space-y-0.5"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowAttachMenu(false);
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = 'image/*,video/*';
                        fileInputRef.current.click();
                      } else {
                        handleAddMockAttachment('img');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-purple-500" />
                    <span>Photos & Videos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAttachMenu(false);
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = '.pdf,.doc,.docx,.txt,.zip';
                        fileInputRef.current.click();
                      } else {
                        handleAddMockAttachment('pdf');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl flex items-center gap-2.5 hover:bg-[var(--rovela-surface-hover)] text-left transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-purple-500" />
                    <span>Document</span>
                  </button>
                </div>
              )}
            </div>

            {/* Hidden native file input for real uploads */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* 😄 Emoji / Sticker */}
            <IconButton
              icon={<Smile className="w-4.5 h-4.5 text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-300" />}
              label="Emoji / Sticker"
              variant="ghost"
              size="sm"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
          </div>

          {/* CENTER: Type a message... */}
          <textarea
            ref={inputRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            className="flex-1 max-h-32 min-h-[36px] py-1.5 px-2 bg-transparent text-sm text-[var(--rovela-text-primary)] placeholder-[var(--rovela-text-muted)] focus:outline-none resize-none leading-relaxed"
          />

          {/* RIGHT: Voice Note OR Send (Section 12) */}
          {canSend ? (
            <button
              type="button"
              onClick={handleSend}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center transition-all duration-150 shrink-0 cursor-pointer bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-white shadow-md hover:scale-105 active:scale-95"
              aria-label="Send message"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center transition-all duration-150 shrink-0 cursor-pointer text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-400 hover:bg-[var(--rovela-surface-hover)] active:scale-95"
              title="Record voice note"
              aria-label="Record voice note"
            >
              <Mic className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
