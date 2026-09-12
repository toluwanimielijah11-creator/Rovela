import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { Avatar } from '../ui/Avatar';
import { CallRecord, CallType } from '../../types';
import {
  Phone,
  Video,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react';

interface CallsViewProps {
  onStartNewCall?: () => void;
}

export const CallsView: React.FC<CallsViewProps> = () => {
  const {
    callHistory,
    startCall,
    clearCallHistory,
    conversations,
    users,
    currentUser,
    showToast,
  } = useChat();

  const [activeFilter, setActiveFilter] = useState<'all' | 'missed' | 'incoming' | 'outgoing'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialerOpen, setIsDialerOpen] = useState(false);

  // Filter calls
  const filteredCalls = callHistory.filter((call) => {
    if (activeFilter === 'missed' && call.direction !== 'missed') return false;
    if (activeFilter === 'incoming' && call.direction !== 'incoming') return false;
    if (activeFilter === 'outgoing' && call.direction !== 'outgoing') return false;
    if (searchQuery.trim()) {
      return call.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleCallContact = (call: CallRecord, type: CallType) => {
    // Find matching conversation or first participant
    const targetConv =
      conversations.find((c) => c.id === call.conversation_id) ||
      conversations.find((c) => c.title.toLowerCase() === call.name.toLowerCase()) ||
      conversations[0];

    if (targetConv) {
      startCall(targetConv, type);
    } else {
      showToast(`Starting ${type} call with ${call.name}...`, undefined, 'info');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--rovela-bg)] text-[var(--rovela-text-primary)] overflow-hidden select-none relative">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[var(--rovela-border)] bg-[var(--rovela-surface)] flex flex-col gap-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[var(--rovela-text-primary)]">
              Calls
            </h2>
            <p className="text-xs text-[var(--rovela-text-secondary)] mt-0.5">
              High-definition voice and video calls with end-to-end encryption.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {callHistory.length > 0 && (
              <button
                type="button"
                onClick={clearCallHistory}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--rovela-text-secondary)] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 border border-[var(--rovela-border)] transition-all flex items-center gap-1.5 cursor-pointer"
                title="Clear call history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear History</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsDialerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Call</span>
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[var(--rovela-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search calls and contacts..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 focus:outline-none text-[var(--rovela-text-primary)] placeholder:text-[var(--rovela-text-muted)] transition-all"
          />
        </div>

        {/* Filter Pills matching Screen 10 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'missed', label: 'Missed' },
              { id: 'incoming', label: 'Incoming' },
              { id: 'outgoing', label: 'Outgoing' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calls Log List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-4xl mx-auto w-full">
        {filteredCalls.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-14 h-14 rounded-3xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--rovela-text-primary)]">
              No {activeFilter !== 'all' ? activeFilter : ''} calls yet
            </h3>
            <p className="text-xs text-[var(--rovela-text-secondary)] max-w-xs mt-1">
              Start crystal-clear audio or video calls with your Rovela contacts anytime.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--rovela-border-subtle)] rounded-2xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] shadow-xs overflow-hidden">
            {filteredCalls.map((call) => {
              const isMissed = call.direction === 'missed';
              const isIncoming = call.direction === 'incoming';

              return (
                <div
                  key={call.id}
                  className="flex items-center justify-between p-4 hover:bg-[var(--rovela-surface-hover)] transition-colors"
                >
                  {/* Left: Avatar & Details */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Avatar
                      src={call.avatar_url}
                      name={call.name}
                      size="md"
                    />

                    <div className="min-w-0">
                      <h4
                        className={`text-sm font-bold truncate leading-tight ${
                          isMissed ? 'text-rose-600 dark:text-rose-400' : 'text-[var(--rovela-text-primary)]'
                        }`}
                      >
                        {call.name}
                      </h4>

                      <div className="flex items-center gap-2 mt-1.5 text-xs text-[var(--rovela-text-secondary)] flex-wrap">
                        {/* Call direction semantic badge */}
                        {isMissed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold status-pill-danger">
                            <PhoneMissed className="w-3 h-3 shrink-0" />
                            <span>Missed</span>
                          </span>
                        ) : isIncoming ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold status-pill-success">
                            <PhoneIncoming className="w-3 h-3 shrink-0" />
                            <span>Incoming</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold status-pill-info">
                            <PhoneOutgoing className="w-3 h-3 shrink-0" />
                            <span>Outgoing</span>
                          </span>
                        )}

                        <span className="text-[var(--rovela-text-muted)]">•</span>
                        <span className="text-[var(--rovela-text-secondary)]">{call.timestamp}</span>
                        {call.duration && (
                          <>
                            <span className="text-[var(--rovela-text-muted)]">•</span>
                            <span className="text-[11px] font-mono font-medium text-[var(--rovela-text-secondary)]">{call.duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick action buttons to recall */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCallContact(call, 'voice')}
                      className="w-9 h-9 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs"
                      title="Start voice call"
                      aria-label="Start voice call"
                    >
                      <Phone className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCallContact(call, 'video')}
                      className="w-9 h-9 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs"
                      title="Start video call"
                      aria-label="Start video call"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button for New Call (Mobile Friendly) */}
      <button
        type="button"
        onClick={() => setIsDialerOpen(true)}
        className="md:hidden absolute bottom-20 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-xl shadow-purple-900/40 flex items-center justify-center cursor-pointer active:scale-95 z-30"
        aria-label="Start Call"
      >
        <PhoneCall className="w-6 h-6" />
      </button>

      {/* Quick Call Contact Selector Modal */}
      {isDialerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] shadow-2xl p-5 select-none text-[var(--rovela-text-primary)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[var(--rovela-text-primary)]">
                Start New Call
              </h3>
              <button
                type="button"
                onClick={() => setIsDialerOpen(false)}
                className="text-xs font-semibold text-[var(--rovela-text-secondary)] hover:text-[var(--rovela-text-primary)] px-2 py-1 rounded-lg hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-colors"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-[var(--rovela-text-secondary)] mb-3">
              Choose a contact or group to call:
            </p>

            <div className="max-h-72 overflow-y-auto space-y-1.5 divide-y divide-[var(--rovela-border-subtle)]">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className="pt-1.5 flex items-center justify-between hover:bg-[var(--rovela-surface-hover)] p-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar src={conv.avatar_url} name={conv.title} size="sm" isGroup={conv.type === 'group'} />
                    <span className="text-xs font-semibold text-[var(--rovela-text-primary)] truncate">
                      {conv.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDialerOpen(false);
                        startCall(conv, 'voice');
                      }}
                      className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 cursor-pointer transition-all"
                      title="Audio call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDialerOpen(false);
                        startCall(conv, 'video');
                      }}
                      className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 cursor-pointer transition-all"
                      title="Video call"
                    >
                      <Video className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
