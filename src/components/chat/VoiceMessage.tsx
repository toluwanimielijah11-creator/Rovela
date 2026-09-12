import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface VoiceMessageProps {
  duration?: number; // duration in seconds
  waveform?: number[];
  isOutgoing?: boolean;
}

export const VoiceMessage: React.FC<VoiceMessageProps> = ({
  duration = 18,
  waveform = [25, 40, 75, 90, 60, 45, 80, 95, 70, 50, 65, 85, 40, 30, 60, 75, 50, 30],
  isOutgoing = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0); // 0 to 100
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const stepMs = (duration * 1000) / 100;
      progressTimerRef.current = setInterval(() => {
        setCurrentProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, stepMs);
    } else {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    }
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [isPlaying, duration]);

  const togglePlay = () => {
    if (currentProgress >= 100) {
      setCurrentProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (totalSec: number) => {
    const elapsed = Math.floor((currentProgress / 100) * totalSec);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTimeStr = `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`;

  return (
    <div className="flex items-center gap-3 py-1 px-1 min-w-[220px] sm:min-w-[260px] select-none">
      {/* Play / Pause button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform active:scale-90 cursor-pointer shadow-md ${
          isOutgoing
            ? 'bg-white text-violet-700 hover:bg-slate-100 shadow-purple-950/20'
            : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 shadow-purple-900/30'
        }`}
        aria-label={isPlaying ? 'Pause voice message' : 'Play voice message'}
      >
        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
      </button>

      {/* Waveform track */}
      <div className="flex-1 flex flex-col gap-1.5 justify-center">
        <div className="flex items-center gap-1 h-8 px-1">
          {waveform.map((heightPct, idx) => {
            const barProgress = (idx / waveform.length) * 100;
            const isPlayed = barProgress <= currentProgress;

            return (
              <div
                key={idx}
                onClick={() => setCurrentProgress(barProgress)}
                style={{ height: `${Math.max(15, Math.min(100, heightPct))}%` }}
                className={`w-1 sm:w-1.5 rounded-full transition-all duration-150 cursor-pointer hover:opacity-100 ${
                  isPlayed
                    ? isOutgoing
                      ? 'bg-white'
                      : 'bg-purple-600 dark:bg-purple-400'
                    : isOutgoing
                    ? 'bg-white/35'
                    : 'bg-[var(--rovela-border)]'
                } ${isPlaying && isPlayed ? 'scale-y-110' : ''}`}
              />
            );
          })}
        </div>

        {/* Timer status */}
        <div className="flex items-center justify-between text-[11px] font-semibold tracking-tight px-1">
          <span className={isOutgoing ? 'text-white/80' : 'text-[var(--rovela-text-secondary)]'}>
            {isPlaying ? formatTime(duration) : totalTimeStr}
          </span>
          <span className={`text-[10px] uppercase tracking-wider flex items-center gap-1 ${
            isOutgoing ? 'text-white/60' : 'text-[var(--rovela-text-muted)]'
          }`}>
            <Volume2 className="w-3 h-3" /> Voice
          </span>
        </div>
      </div>
    </div>
  );
};
