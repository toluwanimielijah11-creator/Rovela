import { Message, ResolvedMessageType } from '../types';

/**
 * Determine explicit message type according to Rovela Core Message Type Architecture:
 * TEXT | IMAGE | VIDEO | VOICE_NOTE | DOCUMENT | SYSTEM | CALL_EVENT
 */
export function getResolvedMessageType(message: Message): ResolvedMessageType {
  const typeLower = (message.type || '').toLowerCase();

  // 1. System events
  if (typeLower === 'system') {
    return 'SYSTEM';
  }

  // 2. Call events
  if (typeLower === 'call' || typeLower === 'call_event' || message.call_data) {
    return 'CALL_EVENT';
  }

  // 3. Voice Notes
  // Must be explicitly marked as voice, voice_note, or contain voice_data/voice_waveform
  if (
    typeLower === 'voice' ||
    typeLower === 'voice_note' ||
    message.voice_data ||
    (typeof message.voice_duration === 'number' && message.voice_duration > 0)
  ) {
    return 'VOICE_NOTE';
  }

  // 4. Video Messages
  // Explicitly marked as video or has video_data or video mime attachment not marked as document
  if (typeLower === 'video' || message.video_data) {
    return 'VIDEO';
  }
  const hasVideoAttachment = message.attachments?.some(
    (att) =>
      att.type?.startsWith('video/') ||
      att.url?.match(/\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i)
  );
  if (hasVideoAttachment && typeLower !== 'file' && typeLower !== 'document') {
    return 'VIDEO';
  }

  // 5. Image Messages
  if (typeLower === 'image') {
    return 'IMAGE';
  }
  const hasImageAttachment = message.attachments?.some(
    (att) =>
      att.type?.startsWith('image/') ||
      att.url?.match(/\.(jpeg|jpg|png|gif|webp|svg)(\?.*)?$/i)
  );
  if (hasImageAttachment && typeLower !== 'file' && typeLower !== 'document') {
    return 'IMAGE';
  }
  if (
    message.media_url &&
    (message.media_url.match(/\.(jpeg|jpg|png|gif|webp|svg)(\?.*)?$/i) ||
      message.media_url.includes('images.unsplash.com'))
  ) {
    return 'IMAGE';
  }

  // 6. Documents / File attachments
  if (
    typeLower === 'file' ||
    typeLower === 'document' ||
    (message.attachments && message.attachments.length > 0)
  ) {
    return 'DOCUMENT';
  }

  // 7. Default to Text
  return 'TEXT';
}

/**
 * Format seconds to M:SS (e.g. 18 -> "0:18", 124 -> "2:04")
 */
export function formatMediaDuration(seconds: number = 0): string {
  const s = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generate readable snippet for Quoted Reply and Forwarding
 */
export function formatMessagePreviewSnippet(message: Message): string {
  const resolved = getResolvedMessageType(message);

  switch (resolved) {
    case 'VOICE_NOTE': {
      const dur =
        message.voice_data?.duration || message.voice_duration || 14;
      return `🎙 Voice note · ${formatMediaDuration(dur)}`;
    }
    case 'VIDEO': {
      const dur =
        message.video_data?.duration || 18;
      const caption = message.video_data?.caption || message.content;
      return caption ? `▶ Video · ${caption}` : `▶ Video · ${formatMediaDuration(dur)}`;
    }
    case 'IMAGE': {
      return message.content ? `🖼 Photo · ${message.content}` : '🖼 Photo';
    }
    case 'DOCUMENT': {
      const firstAtt = message.attachments?.[0];
      return firstAtt ? `📄 Document: ${firstAtt.name}` : '📄 Document';
    }
    case 'CALL_EVENT': {
      const isVideo = message.call_data?.type === 'video';
      const isMissed = message.call_data?.direction === 'missed';
      return isMissed
        ? 'Missed call'
        : `${isVideo ? 'Video' : 'Voice'} call (${message.call_data?.duration || 'Call'})`;
    }
    case 'SYSTEM':
      return message.content;
    default:
      return message.content || 'Message';
  }
}

/**
 * Generate a randomized realistic voice note waveform of heights (0-100)
 */
export function generateRealisticWaveform(barsCount: number = 24): number[] {
  const waveform: number[] = [];
  let prev = 45;
  for (let i = 0; i < barsCount; i++) {
    // Smooth bell-shaped curve with voice chatter fluctuations
    const positionFactor = Math.sin((i / (barsCount - 1)) * Math.PI);
    const randomVariation = (Math.random() - 0.5) * 35;
    const height = Math.round(
      Math.max(18, Math.min(100, 20 + positionFactor * 55 + randomVariation))
    );
    prev = Math.round(prev * 0.3 + height * 0.7);
    waveform.push(prev);
  }
  return waveform;
}

/**
 * Lightweight browser audio feedback synthesizer (Web Audio API)
 * Plays a gentle, pleasant synthetic voice chime during playback so users get real audio feedback
 */
class VoiceFeedbackEngine {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx || this.ctx.state === 'closed') {
      try {
        this.ctx = new AudioCtx();
      } catch {
        return null;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playVoiceTone(freq: number = 320, durationMs: number = 200) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.08, ctx.currentTime + durationMs / 1000);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // Ignore audio policy restrictions
    }
  }
}

export const voiceFeedback = new VoiceFeedbackEngine();

/**
 * Safely plays HTMLMediaElement (video or audio) handling promises and suppressing
 * expected browser interruptions when pause() is called or media is removed from document.
 */
export function safePlayMedia(
  media: HTMLMediaElement | null,
  onPlaying?: () => void
): Promise<void> | undefined {
  if (!media) return undefined;
  try {
    const playPromise = media.play();
    if (playPromise !== undefined) {
      (media as any)._currentPlayPromise = playPromise;
      const wrapped = playPromise
        .then(() => {
          (media as any)._currentPlayPromise = null;
          onPlaying?.();
        })
        .catch((error: Error | DOMException | any) => {
          (media as any)._currentPlayPromise = null;
          // Expected AbortError / interruption when paused or removed from DOM
          const msg = error?.message || '';
          const name = error?.name || '';
          if (
            name === 'AbortError' ||
            name === 'NotAllowedError' ||
            msg.includes('interrupted') ||
            msg.includes('pause') ||
            msg.includes('removed')
          ) {
            return;
          }
        });
      return wrapped;
    }
  } catch {
    // Synchronous failure fallback
  }
  return undefined;
}

/**
 * Safely pauses HTMLMediaElement ensuring pending play promises do not throw unhandled rejections.
 */
export function safePauseMedia(
  media: HTMLMediaElement | null,
  playPromise?: Promise<void> | null,
  onPaused?: () => void
) {
  if (!media) return;
  const activePromise = playPromise || (media as any)._currentPlayPromise;
  if (activePromise && typeof activePromise.then === 'function') {
    activePromise
      .catch(() => {})
      .then(() => {
        try {
          media.pause();
          onPaused?.();
        } catch {}
      });
  } else {
    try {
      media.pause();
      onPaused?.();
    } catch {}
  }
}

/**
 * Safely stops and unloads media element before unmounting from DOM.
 */
export function safeStopAndCleanMedia(media: HTMLMediaElement | null) {
  if (!media) return;
  const activePromise = (media as any)._currentPlayPromise;
  if (activePromise && typeof activePromise.then === 'function') {
    activePromise
      .catch(() => {})
      .then(() => {
        try {
          media.pause();
          media.removeAttribute('src');
          media.load();
        } catch {}
      });
  } else {
    try {
      media.pause();
      media.removeAttribute('src');
      media.load();
    } catch {}
  }
}

