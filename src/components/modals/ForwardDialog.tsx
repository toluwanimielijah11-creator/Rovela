import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Conversation } from '../../types';
import { Avatar } from '../ui/Avatar';
import { useChat } from '../../context/ChatContext';
import { Search, Forward, Check, MessageSquare, Users } from 'lucide-react';

interface ForwardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
  messageSnippet?: string;
}

export const ForwardDialog: React.FC<ForwardDialogProps> = ({
  isOpen,
  onClose,
  messageId,
  messageSnippet,
}) => {
  const { conversations, forwardMessage } = useChat();
  const [selectedConvIds, setSelectedConvIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const activeConversations = conversations.filter((c) => !c.is_archived);

  const filtered = activeConversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedConvIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleForward = () => {
    if (selectedConvIds.length === 0) return;
    forwardMessage(messageId, selectedConvIds);
    setSelectedConvIds([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Forward Message" maxWidth="md">
      <div className="flex flex-col gap-4 select-none">
        {/* Message preview snippet */}
        {messageSnippet && (
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/30 text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2.5">
            <Forward className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <p className="line-clamp-2 italic font-medium">{messageSnippet}</p>
          </div>
        )}

        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people or groups..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Destination List */}
        <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
          {filtered.length > 0 ? (
            filtered.map((conv) => {
              const isSelected = selectedConvIds.includes(conv.id);
              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => toggleSelect(conv.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-purple-500/15 border border-purple-500/30 dark:bg-purple-500/20'
                      : 'hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={conv.avatar_url}
                      name={conv.title}
                      size="sm"
                      isGroup={conv.type === 'group'}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {conv.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        {conv.type === 'group' ? (
                          <>
                            <Users className="w-3 h-3 text-purple-500" /> Group Channel
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-3 h-3 text-slate-400" /> Direct Message
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'border-slate-300 dark:border-white/20 bg-transparent'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No conversations match your search.
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {selectedConvIds.length} destination{selectedConvIds.length === 1 ? '' : 's'} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selectedConvIds.length === 0}
              onClick={handleForward}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold shadow-md shadow-purple-950/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
            >
              <Forward className="w-3.5 h-3.5" />
              <span>Forward Message</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
