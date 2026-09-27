/**
 * Rovela Date & Timestamp Utilities
 * Provides human-readable relative and formatted timestamps tailored for the
 * liquid-glass messaging design system.
 */

export interface FormattedTimestamp {
  /** Concise human-readable relative label: "Just now", "2m ago", "1h ago", "Yesterday" */
  relative: string;
  /** Complete localized time string for tooltips: "10:42 AM" */
  full: string;
  /** Full date and time description */
  tooltip: string;
}

export function formatRelativeMessageTime(
  timestamp?: string | number | Date
): FormattedTimestamp {
  if (!timestamp) {
    return { relative: 'Just now', full: 'Just now', tooltip: 'Just now' };
  }

  // If already relative mock string
  if (typeof timestamp === 'string') {
    const trimmed = timestamp.trim();
    if (trimmed.toLowerCase() === 'just now') {
      return { relative: 'Just now', full: 'Just now', tooltip: 'Just now' };
    }
  }

  let date: Date | null = null;

  if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else if (typeof timestamp === 'string') {
    const parsed = Date.parse(timestamp);
    if (!isNaN(parsed)) {
      date = new Date(parsed);
    } else {
      // Check for time strings such as "10:42 AM" or "1:05 PM"
      const match = timestamp.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
      if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const meridian = match[4]?.toUpperCase();

        if (meridian === 'PM' && hours < 12) hours += 12;
        if (meridian === 'AM' && hours === 12) hours = 0;

        const d = new Date();
        d.setHours(hours, minutes, 0, 0);
        date = d;
      }
    }
  }

  if (!date || isNaN(date.getTime())) {
    const raw = String(timestamp);
    return {
      relative: raw,
      full: raw,
      tooltip: raw,
    };
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  const fullTime = date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const fullDateTime = `${date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  })}, ${fullTime}`;

  // If sent within the last 45 seconds or minor clock drift
  if (diffSec < 45 && diffSec >= -30) {
    return { relative: 'Just now', full: fullTime, tooltip: fullDateTime };
  }

  // Minutes ago (e.g. 1m ago .. 59m ago)
  if (diffMin < 60 && diffMin >= 1) {
    return { relative: `${diffMin}m ago`, full: fullTime, tooltip: fullDateTime };
  }

  // Hours ago (e.g. 1h ago .. 23h ago)
  if (diffHours < 24 && diffHours >= 1) {
    const isSameDay = now.getDate() === date.getDate() && now.getMonth() === date.getMonth();
    if (isSameDay) {
      return { relative: `${diffHours}h ago`, full: fullTime, tooltip: fullDateTime };
    }
    return { relative: 'Yesterday', full: fullTime, tooltip: fullDateTime };
  }

  if (diffDays === 1) {
    return { relative: 'Yesterday', full: fullTime, tooltip: fullDateTime };
  }

  if (diffDays > 1 && diffDays < 7) {
    return { relative: `${diffDays}d ago`, full: fullTime, tooltip: fullDateTime };
  }

  // Older dates
  return {
    relative: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
    full: fullTime,
    tooltip: fullDateTime,
  };
}
