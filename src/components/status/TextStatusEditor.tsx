import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { STATUS_BACKGROUND_PRESETS } from '../../data/mockData';
import { StatusPrivacy } from '../../types';
import {
  ArrowLeft,
  Send,
  Lock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Loader2,
  Check,
} from 'lucide-react';
import { StatusPrivacyModal } from './StatusPrivacyModal';

interface TextStatusEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onPublished: () => void;
}

export const TextStatusEditor: React.FC<TextStatusEditorProps> = ({
  isOpen,
  onClose,
  onPublished,
}) => {
  const { addStatusItem, showToast, currentUser } = useChat();
  const [text, setText] = useState<string>('');
  const [selectedBgId, setSelectedBgId] = useState<string>('deep-purple');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'title'>('large');
  const [privacy, setPrivacy] = useState<StatusPrivacy>('contacts');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentBgPreset =
    STATUS_BACKGROUND_PRESETS.find((p) => p.id === selectedBgId) ||
    STATUS_BACKGROUND_PRESETS[1];

  const handlePublish = async () => {
    if (!text.trim()) {
      showToast('Please type a message', 'Text status cannot be empty', 'error');
      return;
    }

    setIsPublishing(true);
    try {
      addStatusItem({
        user_id: currentUser.id,
        user_name: currentUser.name,
        user_avatar: currentUser.avatar_url,
        type: 'TEXT',
        text_content: text.trim(),
        background_style: selectedBgId,
        text_alignment: alignment,
        text_size: textSize,
        privacy,
      });

      setIsPublishing(false);
      onPublished();
      onClose();
    } catch {
      setIsPublishing(false);
      showToast('Failed to post status', 'Please try again', 'error');
    }
  };

  const insertEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
  };

  // Font size classes
  const getSizeClass = () => {
    switch (textSize) {
      case 'normal':
        return 'text-lg md:text-xl font-normal leading-relaxed';
      case 'large':
        return 'text-2xl md:text-3xl font-semibold leading-snug';
      case 'title':
        return 'text-3xl md:text-4xl font-extrabold tracking-tight leading-tight';
    }
  };

  return (
    <>
      <StatusPrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        currentPrivacy={privacy}
        onSave={(p) => setPrivacy(p)}
      />

      <div
        id="text-status-editor"
        className={`fixed inset-0 z-50 flex flex-col transition-colors duration-300 ${currentBgPreset.bgClass}`}
        style={currentBgPreset.styleObject}
      >
        {/* Top Bar Controls */}
        <div className="flex items-center justify-between p-4 z-20">
          <button
            type="button"
            onClick={onClose}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md active:scale-95 transition-all cursor-pointer ${
              currentBgPreset.isDark
                ? 'bg-black/30 text-white border border-white/10 hover:bg-black/50'
                : 'bg-white/60 text-gray-900 border border-black/10 hover:bg-white/80'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Formatting tools */}
          <div className="flex items-center gap-2">
            {/* Alignment Toggle */}
            <div
              className={`flex items-center p-1 rounded-full backdrop-blur-md border ${
                currentBgPreset.isDark
                  ? 'bg-black/30 border-white/10 text-white'
                  : 'bg-white/60 border-black/10 text-gray-900'
              }`}
            >
              <button
                type="button"
                onClick={() => setAlignment('left')}
                className={`p-1.5 rounded-full transition-colors ${
                  alignment === 'left' ? 'bg-purple-600 text-white' : 'hover:bg-white/10'
                }`}
                title="Align left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setAlignment('center')}
                className={`p-1.5 rounded-full transition-colors ${
                  alignment === 'center' ? 'bg-purple-600 text-white' : 'hover:bg-white/10'
                }`}
                title="Align center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setAlignment('right')}
                className={`p-1.5 rounded-full transition-colors ${
                  alignment === 'right' ? 'bg-purple-600 text-white' : 'hover:bg-white/10'
                }`}
                title="Align right"
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>

            {/* Size Toggle */}
            <div
              className={`flex items-center p-1 rounded-full backdrop-blur-md border ${
                currentBgPreset.isDark
                  ? 'bg-black/30 border-white/10 text-white'
                  : 'bg-white/60 border-black/10 text-gray-900'
              }`}
            >
              {(['normal', 'large', 'title'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTextSize(s)}
                  className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize transition-colors ${
                    textSize === s ? 'bg-purple-600 text-white' : 'hover:bg-white/10'
                  }`}
                >
                  {s[0].toUpperCase()}
                </button>
              ))}
            </div>

            {/* Privacy */}
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs active:scale-95 transition-all cursor-pointer ${
                currentBgPreset.isDark
                  ? 'bg-black/30 text-white border-white/10 hover:bg-black/50'
                  : 'bg-white/60 text-gray-900 border-black/10 hover:bg-white/80'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-[11px] font-medium capitalize hidden sm:inline">
                {privacy.replace('_', ' ')}
              </span>
            </button>
          </div>
        </div>

        {/* Center Editing Canvas */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            maxLength={350}
            autoFocus
            style={{
              color: currentBgPreset.textColor,
              textAlign: alignment,
            }}
            className={`w-full max-w-2xl bg-transparent resize-none border-none focus:outline-none placeholder-opacity-50 ${getSizeClass()} ${
              currentBgPreset.isDark ? 'placeholder-white/40' : 'placeholder-black/30'
            }`}
          />
        </div>

        {/* Bottom Bar: Palette + Emojis + Post */}
        <div className="p-4 pb-6 z-20 flex flex-col gap-3">
          {/* Quick Emojis */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
            {['✨', '💜', '🔥', '🎉', '☕', '💡', '💭', '🚀', '🙌', '🌸'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => insertEmoji(emoji)}
                className={`px-3 py-1.5 rounded-full text-base backdrop-blur-md active:scale-95 transition-all cursor-pointer ${
                  currentBgPreset.isDark
                    ? 'bg-black/30 hover:bg-black/50 text-white border border-white/10'
                    : 'bg-white/60 hover:bg-white/80 text-gray-900 border border-black/10'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Rovela Background Color Palette */}
          <div className="flex items-center justify-between gap-3 max-w-2xl mx-auto w-full">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 flex-1">
              <div
                className={`p-1.5 rounded-xl flex items-center gap-1.5 backdrop-blur-md border ${
                  currentBgPreset.isDark
                    ? 'bg-black/40 border-white/10'
                    : 'bg-white/70 border-black/10'
                }`}
              >
                {STATUS_BACKGROUND_PRESETS.map((preset) => {
                  const isCurrent = preset.id === selectedBgId;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedBgId(preset.id)}
                      title={preset.name}
                      style={preset.styleObject}
                      className={`w-8 h-8 rounded-full border transition-transform cursor-pointer relative flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? 'ring-2 ring-purple-500 scale-110 border-white'
                          : 'border-white/20 hover:scale-105'
                      }`}
                    >
                      {isCurrent && (
                        <Check
                          className={`w-4 h-4 stroke-[3] ${
                            preset.isDark ? 'text-white' : 'text-gray-900'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Post Status Action Button */}
            <button
              type="button"
              disabled={isPublishing || !text.trim()}
              onClick={handlePublish}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 active:scale-95 transition-all disabled:opacity-40 cursor-pointer shrink-0"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <span>Post Status</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
