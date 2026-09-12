import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Message, Conversation } from '../../types';
import { MessageBubble } from './MessageBubble';
import { useChat } from '../../context/ChatContext';
import { EmptyState } from '../common/EmptyState';
import { TypingCapsule } from '../common/TypingCapsule';
import { Sparkles, MessageSquare, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MessageStreamProps {
  conversation: Conversation;
  messages: Message[];
  onReply: (message: Message) => void;
}

export const MessageStream: React.FC<MessageStreamProps> = ({
  conversation,
  messages,
  onReply,
}) => {
  const { currentUser, typingUsers } = useChat();
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [unreadBelow, setUnreadBelow] = useState(false);

  const typers = typingUsers[conversation.id] || [];

  // Scroll handler to detect if user has scrolled away from bottom
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    const scrolledAway = distanceToBottom > 150;
    setIsScrolledUp(scrolledAway);
    if (!scrolledAway) {
      setUnreadBelow(false);
    }
  }, []);

  // Handle new incoming messages
  useEffect(() => {
    if (isScrolledUp) {
      setUnreadBelow(true);
    } else {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isScrolledUp]);

  // Scroll to bottom when typers change if user is at bottom
  useEffect(() => {
    if (!isScrolledUp && typers.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [typers.length, isScrolledUp]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsScrolledUp(false);
    setUnreadBelow(false);
  };

  const handleJumpToReply = (replyId: string) => {
    const el = document.getElementById(`msg-${replyId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-purple-500', 'ring-offset-2', 'dark:ring-offset-[#0E0B16]');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-purple-500', 'ring-offset-2', 'dark:ring-offset-[#0E0B16]');
      }, 1500);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-2 select-text"
      >
        {/* Welcome Banner at start of chat */}
        <div className="text-center py-6 border-b border-[var(--rovela-border)] mb-4 select-none">
          <div className="w-12 h-12 mx-auto mb-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[var(--rovela-text-primary)]">
            This is the start of your conversation with {conversation.title}
          </h4>
          <p className="text-xs text-[var(--rovela-text-secondary)] mt-1 max-w-sm mx-auto leading-relaxed">
            Encrypted in transit with liquid glass visual depth.
          </p>
        </div>

        {/* Message List */}
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isCurrentUser = msg.sender_id === currentUser.id;
            const showSender = conversation.type === 'group' && !isCurrentUser;

            return (
              <motion.div
                key={msg.id}
                id={`msg-${msg.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
              >
                <MessageBubble
                  message={msg}
                  isCurrentUser={isCurrentUser}
                  showSenderName={showSender}
                  onReply={onReply}
                  onJumpToReply={handleJumpToReply}
                />
              </motion.div>
            );
          })
        ) : (
          <div className="py-16">
            <EmptyState
              icon={<MessageSquare className="w-7 h-7" />}
              title="No messages yet"
              description="Say hello to start the conversation!"
            />
          </div>
        )}

        {/* Floating Typing Indicator */}
        {typers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="flex items-center gap-2 my-2 select-none"
          >
            <TypingCapsule names={typers} />
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Floating Scroll to Bottom Jump Button */}
      <AnimatePresence>
        {isScrolledUp && (
          <motion.button
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            onClick={scrollToBottom}
            className="absolute bottom-4 right-6 z-20 flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--rovela-surface)] text-xs font-bold text-purple-700 dark:text-purple-300 shadow-xl border border-purple-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>{unreadBelow ? 'New messages' : 'Jump to bottom'}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
