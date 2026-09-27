import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, AlertCircle, RotateCcw, Check, CheckCheck, Clock } from 'lucide-react';
import { Message } from '../../../types';
import { formatMediaDuration, voiceFeedback } from '../../../utils/mediaUtils';
import { formatRelativeMessageTime } from '../../../utils/dateUtils';
import { ReadReceipt } from '../ReadReceipt';
import { useChat } from '../../../context/ChatContext';

interface VoiceNoteMessageProps {
  message: Message;
  isCurrentUser: boolean;
  onRetry?: (messageId: string) => void;
}

export const VoiceNoteMessage: React.FC<VoiceNoteMessageProps> = ({
  message,
  isCurrentUser,
  onRetry,
}) => {
  const { deleteMessage, showToast } = useChat();

  // Extract metadata
  const duration =
    message.voice_data?.duration || message.voice_duration || 14;
  const rawWaveform =
    message.voice_data?.waveform ||
    message.voice_waveform ||
    [40, 55, 70, 85, 90, 75, 60, 45, 65, 80, 95, 85, 65, 50, 40, 60, 75, 85, 70, 50, 40, 35];

  // Limit waveform to ~26 bars for clean proportional density
  const waveform = rawWaveform.slice(0, 28);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0); // 0 to 1
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1, 1.5, 2
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isFailed = message.status === 'failed' || message.voice_data?.is_failed;
  const isLoading = message.voice_data?.is_loading;

  // Real or synthesized playback progress
  useEffect(() => {
    if (isPlaying) {
      const stepInterval = 100; // ms
      const totalSteps = Math.max(1, (duration * 1000) / (stepInterval * playbackSpeed));

      playbackTimerRef.current = setInterval(() => {
        setCurrentProgress((prev) => {
          if (prev >= 1) {
            setIsPlaying(false);
            return 0;
          }
          // gentle audio feedback
          if (Math.random() > 0.6) {
            voiceFeedback.playVoiceTone(320 + Math.random() * 80, 70);
          }
          return prev + 1 / totalSteps;
        });
      }, stepInterval);
    } else {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    }

    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [isPlaying, duration, playbackSpeed]);

  const togglePlay = () => {
    if (isFailed || isLoading) return;
    setIsPlaying((prev) => !prev);
  };

  const handleSeek = (index: number) => {
    if (isFailed || isLoading) return;
    const fraction = index / waveform.length;
    setCurrentProgress(fraction);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const cycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const speeds = [1, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    showToast(`Speed set to ${nextSpeed}×`, undefined, 'info', 1200);
  };

  const currentSeconds = Math.round(duration * currentProgress);

  // 1. Loading Skeleton
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] w-64 animate-pulse select-none">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-purple-500/20 rounded w-3/4" />
          <div className="h-2 bg-purple-500/10 rounded w-1/2" />
        </div>
      </div>
    );
  }

  // 2. Failed State
  if (isFailed) {
    return (
      <div className="flex flex-col gap-2 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 select-none max-w-xs">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>Couldn't send voice note</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-rose-500/20">
          <button
            type="button"
            onClick={() => onRetry?.(message.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Retry</span>
          </button>
          <button
            type="button"
            onClick={() => deleteMessage(message.id)}
            className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-xs font-medium transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  // 3. Normal Native Voice Note Component
  return (
    <div
      className={`relative flex flex-col gap-1.5 p-3 sm:p-3.5 rounded-2xl select-none transition-all ${
        isCurrentUser
          ? 'bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/20'
          : 'bg-[var(--rovela-surface)] border border-[var(--rovela-border)] text-[var(--rovela-text-primary)] shadow-sm'
      } w-[280px] sm:w-[320px] max-w-full`}
      role="region"
      aria-label="Voice Note Player"
    >
      {/* Player Header: Play Button + Waveform + Speed */}
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all active:scale-90 cursor-pointer ${
            isCurrentUser
              ? 'bg-white text-purple-700 hover:bg-white/90'
              : 'bg-gradient-to-tr from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500'
          }`}
          title={isPlaying ? 'Pause voice note' : 'Play voice note'}
          aria-label={isPlaying ? 'Pause voice note' : 'Play voice note'}
        >
          {isPlaying ? (
            <Pause className="w-4.5 h-4.5 fill-current" />
          ) : (
            <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
          )}
        </button>

        {/* Waveform Scrubber Bars */}
        <div className="flex-1 flex items-center gap-[2.5px] h-8 py-1 cursor-pointer overflow-hidden group/wave">
          {waveform.map((height, idx) => {
            const barFraction = idx / waveform.length;
            const isPlayed = barFraction <= currentProgress;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSeek(idx)}
                className="h-full flex-1 flex items-center justify-center focus:outline-none cursor-pointer py-0.5"
                title={`Seek to ${formatMediaDuration(duration * barFraction)}`}
                aria-label={`Seek to ${formatMediaDuration(duration * barFraction)}`}
              >
                <span
                  style={{ height: `${Math.max(20, height)}%` }}
                  className={`w-full rounded-full transition-all duration-100 ${
                    isCurrentUser
                      ? isPlayed
                        ? 'bg-white shadow-sm'
                        : 'bg-white/35 group-hover/wave:bg-white/50'
                      : isPlayed
                      ? 'bg-purple-600 dark:bg-purple-400'
                      : 'bg-purple-200 dark:bg-white/20 group-hover/wave:bg-purple-300 dark:group-hover/wave:bg-white/35'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Speed Control Pill */}
        <button
          type="button"
          onClick={cycleSpeed}
          className={`px-2 py-0.5 rounded-full text-[11px] font-bold tracking-tight shrink-0 transition-colors cursor-pointer ${
            isCurrentUser
              ? 'bg-white/20 hover:bg-white/30 text-white'
              : 'bg-[var(--rovela-surface-secondary)] hover:bg-[var(--rovela-surface-hover)] text-purple-600 dark:text-purple-300 border border-[var(--rovela-border)]'
          }`}
          title="Change playback speed"
          aria-label={`Current playback speed: ${playbackSpeed}x. Click to change.`}
        >
          {playbackSpeed}×
        </button>
      </div>

      {/* Footer info: Elapsed / Total duration on left, Timestamp + Delivery Status on right */}
      <div
        className={`flex items-center justify-between text-[11px] font-medium px-1 ${
          isCurrentUser ? 'text-white/80' : 'text-[var(--rovela-text-secondary)]'
        }`}
      >
        <span className="font-mono">
          {isPlaying
            ? `${formatMediaDuration(currentSeconds)} / ${formatMediaDuration(duration)}`
            : formatMediaDuration(duration)}
        </span>

        {(() => {
          const timeObj = formatRelativeMessageTime(message.created_at);
          return (
            <div
              className={`flex items-center gap-1.5 select-none ${
                isCurrentUser
                  ? 'text-white/75 font-medium tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]'
                  : 'text-[var(--rovela-text-secondary)] dark:text-slate-400 font-medium tracking-tight'
              }`}
            >
              <span
                title={timeObj.tooltip || timeObj.full}
                className="cursor-default hover:underline decoration-dotted decoration-1 text-[10.5px]"
              >
                {timeObj.relative}
              </span>
              <ReadReceipt status={message.status} isCurrentUser={isCurrentUser} />
            </div>
          );
        })()}
      </div>
    </div>
  );
};
