import React from 'react';
import { useChat } from '../../context/ChatContext';
import { Avatar } from '../ui/Avatar';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Volume2,
  VolumeX,
  SwitchCamera,
  Signal,
  ShieldCheck,
  Minimize2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CallInterface: React.FC = () => {
  const {
    activeCall,
    endCall,
    toggleCallMute,
    toggleCallVideo,
    toggleCallSpeaker,
    toggleCameraFlip,
  } = useChat();

  if (!activeCall) return null;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isVideo = activeCall.type === 'video';
  const isActive = activeCall.status === 'active';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl select-none"
      >
        <div className="relative w-full max-w-4xl h-full max-h-[85vh] sm:max-h-[750px] rounded-3xl glass-3-dark border border-purple-500/30 overflow-hidden flex flex-col shadow-2xl">
          {/* Top Status Bar */}
          <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rovela E2EE</span>
              <span className="text-white/40">·</span>
              <span className="flex items-center gap-1 text-emerald-300">
                <Signal className="w-3 h-3" /> {activeCall.connection_quality === 'good' ? 'HD' : 'Reconnecting'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold font-mono">
                {activeCall.status === 'active'
                  ? formatTime(activeCall.duration)
                  : activeCall.status === 'ringing'
                  ? 'Ringing...'
                  : activeCall.status === 'calling'
                  ? 'Calling...'
                  : 'Call Ended'}
              </span>
            </div>
          </div>

          {/* Main Call Stage */}
          <div className="flex-1 relative flex flex-col items-center justify-center p-6 overflow-hidden">
            {isVideo ? (
              /* Video Stream Stage */
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-white/10">
                {/* Remote Video Stream Simulation */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-950/40 via-slate-900 to-[#0A0713] flex flex-col items-center justify-center">
                  <div className="relative mb-4">
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-purple-500/50 shadow-2xl shadow-purple-900/50">
                      <img
                        src={activeCall.avatar_url}
                        alt={activeCall.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Simulated Speaking Ring */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-30 pointer-events-none" />
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {activeCall.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {isActive ? 'Live Video Connected · 1080p 60fps' : 'Connecting HD camera stream...'}
                  </p>
                </div>

                {/* Local Video Preview (Picture-in-Picture) */}
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-28 h-40 sm:w-36 sm:h-52 rounded-2xl overflow-hidden glass-3-dark border border-purple-400/40 shadow-2xl flex flex-col items-center justify-center z-10">
                  {activeCall.is_video_enabled ? (
                    <div className="relative w-full h-full bg-slate-800 flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                        alt="Your preview"
                        className={`w-full h-full object-cover ${activeCall.is_camera_front ? 'scale-x-[-1]' : ''}`}
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] text-white font-medium">
                        You
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-2">
                      <VideoOff className="w-6 h-6 text-rose-400 mb-1" />
                      <span className="text-[10px] text-slate-300 font-semibold">Camera Off</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Voice Call Stage */
              <div className="flex flex-col items-center text-center justify-center my-auto">
                <div className="relative mb-6">
                  {/* Glowing Animated Ring */}
                  <div className="absolute inset-0 rounded-full bg-purple-600/30 blur-2xl animate-pulse" />
                  <div className="relative z-10 p-3 rounded-full border-2 border-purple-500/40 bg-purple-950/40">
                    <Avatar
                      src={activeCall.avatar_url}
                      name={activeCall.title}
                      size="xl"
                      className="w-24 h-24 sm:w-32 sm:h-32 text-2xl shadow-2xl"
                    />
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {activeCall.title}
                </h3>
                <p className="text-sm font-medium text-purple-300 mt-2">
                  {isActive ? 'High Definition Audio' : activeCall.status === 'ringing' ? 'Ringing...' : 'Calling...'}
                </p>

                {/* Animated Voice Activity Indicator */}
                {isActive && (
                  <div className="flex items-center gap-1.5 mt-6 h-8">
                    {[16, 28, 40, 24, 36, 48, 30, 18, 44, 26].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}px` }}
                        className="w-1.5 bg-gradient-to-t from-violet-500 to-purple-400 rounded-full wave-bar"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Call Action Dock */}
          <div className="p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent border-t border-white/10 flex items-center justify-center gap-3 sm:gap-6 z-20">
            {/* Microphone toggle */}
            <button
              type="button"
              onClick={toggleCallMute}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                activeCall.is_muted
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              }`}
              title={activeCall.is_muted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {activeCall.is_muted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            {/* Video toggle */}
            <button
              type="button"
              onClick={toggleCallVideo}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                !activeCall.is_video_enabled
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              }`}
              title={activeCall.is_video_enabled ? 'Turn off camera' : 'Turn on camera'}
            >
              {activeCall.is_video_enabled ? <Video className="w-5 h-5 sm:w-6 sm:h-6" /> : <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            {/* Camera switch / Flip (Video only) */}
            {isVideo && (
              <button
                type="button"
                onClick={toggleCameraFlip}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all active:scale-95 cursor-pointer"
                title="Switch Camera (Front/Back)"
              >
                <SwitchCamera className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Speaker toggle */}
            <button
              type="button"
              onClick={toggleCallSpeaker}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                !activeCall.is_speaker
                  ? 'bg-white/5 text-slate-400 border border-white/10'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              }`}
              title={activeCall.is_speaker ? 'Switch to earpiece' : 'Switch to speaker'}
            >
              {activeCall.is_speaker ? <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            {/* End Call Button */}
            <button
              type="button"
              onClick={endCall}
              className="w-14 h-12 sm:w-20 sm:h-14 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-950/50 transition-transform active:scale-95 cursor-pointer font-bold gap-2"
              title="End Call"
            >
              <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
