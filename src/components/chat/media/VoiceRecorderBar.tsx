import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trash2,
  Pause,
  Play,
  Mic,
  Send,
  Square,
  AlertCircle,
  RotateCcw,
  Check,
} from 'lucide-react';
import { formatMediaDuration, generateRealisticWaveform, voiceFeedback } from '../../../utils/mediaUtils';

export type RecordingState =
  | 'IDLE'
  | 'RECORDING'
  | 'PAUSED'
  | 'PREVIEW'
  | 'SENDING'
  | 'SENT'
  | 'FAILED';

interface VoiceRecorderBarProps {
  onCancel: () => void;
  onSend: (duration: number, waveform: number[]) => void;
}

export const VoiceRecorderBar: React.FC<VoiceRecorderBarProps> = ({
  onCancel,
  onSend,
}) => {
  const [recordState, setRecordState] = useState<RecordingState>('RECORDING');
  const [duration, setDuration] = useState(0);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [recordedWaveform, setRecordedWaveform] = useState<number[]>([]);
  const [liveAmplitudes, setLiveAmplitudes] = useState<number[]>([]);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previewTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize live waveform bars
  useEffect(() => {
    // Generate base waveform
    const baseWave = generateRealisticWaveform(28);
    setRecordedWaveform(baseWave);
    setLiveAmplitudes(baseWave.slice(0, 10));

    // Try requesting mic or simulate gracefully
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          // Stop immediate tracks for prototype
          stream.getTracks().forEach((track) => track.stop());
        })
        .catch((err) => {
          // If explicitly denied by browser permission:
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            // keep graceful, let user try again or test
          }
        });
    }
  }, []);

  // Duration timer while in RECORDING
  useEffect(() => {
    if (recordState === 'RECORDING') {
      durationTimerRef.current = setInterval(() => {
        setDuration((prev) => {
          const next = prev + 1;
          // Dynamically animate live waveform
          setLiveAmplitudes((amps) => {
            const newBar = Math.round(20 + Math.random() * 75);
            return [...amps.slice(-20), newBar];
          });
          return next;
        });
      }, 1000);
    } else {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
    }

    return () => {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, [recordState]);

  // Preview playback simulation
  useEffect(() => {
    if (recordState === 'PREVIEW' && isPreviewPlaying) {
      const stepInterval = 100;
      const totalSteps = Math.max(1, duration * 10);
      previewTimerRef.current = setInterval(() => {
        setPreviewProgress((prev) => {
          if (prev >= 1) {
            setIsPreviewPlaying(false);
            return 0;
          }
          voiceFeedback.playVoiceTone(360, 80);
          return prev + 1 / totalSteps;
        });
      }, stepInterval);
    } else {
      if (previewTimerRef.current) clearInterval(previewTimerRef.current);
    }

    return () => {
      if (previewTimerRef.current) clearInterval(previewTimerRef.current);
    };
  }, [recordState, isPreviewPlaying, duration]);

  const handlePause = () => {
    setRecordState('PAUSED');
  };

  const handleResume = () => {
    setRecordState('RECORDING');
  };

  const handleStopAndPreview = () => {
    setRecordState('PREVIEW');
    setIsPreviewPlaying(false);
    setPreviewProgress(0);
    // finalize recorded waveform
    setRecordedWaveform(generateRealisticWaveform(28));
  };

  const togglePreviewPlay = () => {
    setIsPreviewPlaying((prev) => !prev);
  };

  const handleSeekPreview = (idx: number, total: number) => {
    const fraction = idx / total;
    setPreviewProgress(fraction);
    if (!isPreviewPlaying) {
      setIsPreviewPlaying(true);
    }
  };

  const handleSend = () => {
    const finalDuration = Math.max(1, duration);
    const finalWaveform = recordedWaveform.length > 0 ? recordedWaveform : generateRealisticWaveform(28);
    setRecordState('SENDING');
    setTimeout(() => {
      setRecordState('SENT');
      onSend(finalDuration, finalWaveform);
    }, 400);
  };

  if (permissionDenied) {
    return (
      <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500">
        <div className="flex items-center gap-2.5 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Microphone access is required to record a voice note.</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPermissionDenied(false)}
            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
          >
            Try Again
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-2.5 py-1 rounded-lg hover:bg-rose-500/10 text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] shadow-sm animate-in fade-in duration-150 select-none min-h-[52px]"
      role="region"
      aria-label="Voice Note Recorder"
    >
      {/* 1. Left Action: Discard / Trash */}
      <button
        type="button"
        onClick={onCancel}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-500 hover:text-rose-600 hover:bg-rose-500/15 transition-all active:scale-90 cursor-pointer shrink-0"
        title="Discard recording"
        aria-label="Discard recording"
      >
        <Trash2 className="w-4.5 h-4.5" />
      </button>

      {/* 2. Center: Live recording or Preview Player */}
      <div className="flex-1 flex items-center gap-3 px-2 min-w-0">
        {recordState === 'PREVIEW' ? (
          /* PREVIEW STATE PLAYER */
          <div className="flex-1 flex items-center gap-2.5 min-w-0">
            {/* Play/Pause Preview Button */}
            <button
              type="button"
              onClick={togglePreviewPlay}
              className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-500 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
              title={isPreviewPlaying ? 'Pause preview' : 'Play preview'}
              aria-label={isPreviewPlaying ? 'Pause preview' : 'Play preview'}
            >
              {isPreviewPlaying ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white ml-0.5" />
              )}
            </button>

            {/* Preview Waveform */}
            <div className="flex-1 flex items-center gap-[3px] h-7 cursor-pointer overflow-hidden py-1">
              {recordedWaveform.map((height, i) => {
                const fraction = i / recordedWaveform.length;
                const isPlayed = fraction <= previewProgress;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSeekPreview(i, recordedWaveform.length)}
                    className="h-full flex-1 flex items-center justify-center focus:outline-none cursor-pointer"
                    title={`Seek to ${formatMediaDuration(duration * fraction)}`}
                    aria-label={`Seek to ${formatMediaDuration(duration * fraction)}`}
                  >
                    <span
                      style={{ height: `${Math.max(16, height)}%` }}
                      className={`w-full rounded-full transition-colors duration-100 ${
                        isPlayed
                          ? 'bg-purple-600 dark:bg-purple-400'
                          : 'bg-purple-200 dark:bg-white/20 hover:bg-purple-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Preview Time Readout */}
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-300 shrink-0">
              {formatMediaDuration(Math.round(duration * previewProgress))} / {formatMediaDuration(duration)}
            </span>
          </div>
        ) : (
          /* LIVE RECORDING / PAUSED STATE */
          <div className="flex-1 flex items-center gap-2.5 min-w-0">
            {/* Pulsing Recording Indicator */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="relative flex h-3 w-3">
                {recordState === 'RECORDING' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    recordState === 'RECORDING' ? 'bg-rose-500' : 'bg-amber-500'
                  }`}
                />
              </span>
              <span className="text-xs font-mono font-bold text-[var(--rovela-text-primary)]">
                {formatMediaDuration(duration)}
              </span>
            </div>

            {/* Dynamic Live Waveform Bars */}
            <div className="flex-1 flex items-center gap-[3px] h-6 overflow-hidden px-1">
              {liveAmplitudes.map((amp, i) => (
                <span
                  key={i}
                  style={{ height: `${Math.max(20, amp)}%` }}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    recordState === 'RECORDING'
                      ? 'bg-purple-500 dark:bg-purple-400'
                      : 'bg-amber-500 opacity-60'
                  }`}
                />
              ))}
            </div>

            {/* State Label */}
            <span className="text-[11px] font-medium text-[var(--rovela-text-muted)] hidden sm:inline shrink-0">
              {recordState === 'RECORDING' ? 'Recording…' : 'Paused'}
            </span>
          </div>
        )}
      </div>

      {/* 3. Right Action Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        {recordState === 'RECORDING' && (
          <>
            {/* Pause recording */}
            <button
              type="button"
              onClick={handlePause}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] transition-all cursor-pointer"
              title="Pause recording"
              aria-label="Pause voice recording"
            >
              <Pause className="w-4 h-4" />
            </button>
            {/* Stop & Preview */}
            <button
              type="button"
              onClick={handleStopAndPreview}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-400 hover:bg-[var(--rovela-surface-hover)] transition-all cursor-pointer"
              title="Stop and preview"
              aria-label="Stop recording and preview"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          </>
        )}

        {recordState === 'PAUSED' && (
          <>
            {/* Resume recording */}
            <button
              type="button"
              onClick={handleResume}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-all cursor-pointer"
              title="Resume recording"
              aria-label="Resume voice recording"
            >
              <Mic className="w-4 h-4" />
            </button>
            {/* Preview */}
            <button
              type="button"
              onClick={handleStopAndPreview}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--rovela-text-secondary)] hover:text-purple-600 dark:hover:text-purple-400 hover:bg-[var(--rovela-surface-hover)] transition-all cursor-pointer"
              title="Preview recording"
              aria-label="Preview recorded voice note"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          </>
        )}

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={duration < 1 && recordState !== 'PREVIEW'}
          className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl flex items-center gap-1.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-900/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Send voice note"
          aria-label="Send recorded voice note"
        >
          <span className="hidden sm:inline">Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
