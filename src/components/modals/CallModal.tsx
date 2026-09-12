import React, { useState, useEffect } from 'react';
import { Conversation } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Modal } from '../ui/Modal';
import { IconButton } from '../ui/IconButton';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2 } from 'lucide-react';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation;
  type: 'audio' | 'video';
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  conversation,
  type,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(type === 'video');

  useEffect(() => {
    if (!isOpen) {
      setSeconds(0);
      return;
    }
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm" showCloseButton={false}>
      <div className="flex flex-col items-center text-center py-4 select-none">
        {/* Calling / Active Status */}
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-6 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {type === 'audio' ? 'Rovela Encrypted Voice' : 'Rovela HD Video'} · {formatTime(seconds)}
        </span>

        {/* Liquid Avatar Pulse Ring */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-xl animate-pulse" />
          <div className="relative z-10 p-2 rounded-full border-2 border-purple-500/40">
            <Avatar
              src={conversation.avatar_url}
              name={conversation.title}
              size="xl"
              isGroup={conversation.type === 'group'}
            />
          </div>
        </div>

        <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
          {conversation.title}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {seconds > 2 ? 'Connected · High Fidelity' : 'Calling...'}
        </p>

        {/* Call Action Bar */}
        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-200/60 dark:border-white/10 w-full justify-center">
          {/* Mute Button */}
          <IconButton
            icon={isMuted ? <MicOff className="w-5 h-5 text-rose-500" /> : <Mic className="w-5 h-5" />}
            label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            variant={isMuted ? 'secondary' : 'glass'}
            size="lg"
            onClick={() => setIsMuted(!isMuted)}
          />

          {/* Video Toggle Button */}
          <IconButton
            icon={isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5 text-rose-500" />}
            label={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
            variant={!isVideoEnabled ? 'secondary' : 'glass'}
            size="lg"
            onClick={() => setIsVideoEnabled(!isVideoEnabled)}
          />

          {/* End Call Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-900/40 transition-transform active:scale-95 cursor-pointer"
            aria-label="End call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
