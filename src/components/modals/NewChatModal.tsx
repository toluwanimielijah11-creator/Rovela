import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { SearchInput } from '../ui/SearchInput';
import { Avatar } from '../ui/Avatar';
import { useChat } from '../../context/ChatContext';
import { EmptyState } from '../common/EmptyState';
import { MessageSquarePlus, Search } from 'lucide-react';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose }) => {
  const { users, currentUser, createDirectConversation } = useChat();
  const [search, setSearch] = useState('');

  const otherUsers = users.filter((u) => u.id !== currentUser.id);

  const filtered = otherUsers.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      (u.bio && u.bio.toLowerCase().includes(q))
    );
  });

  const handleSelectUser = (userId: string) => {
    createDirectConversation(userId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Direct Message" maxWidth="md">
      <div className="space-y-4">
        <SearchInput
          value={search}
          onChangeValue={setSearch}
          placeholder="Search teammates by name or username..."
          autoFocus
        />

        <div className="max-h-80 overflow-y-auto space-y-1.5 pr-1">
          {filtered.length > 0 ? (
            filtered.map((user) => (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-purple-500/10 dark:hover:bg-white/[0.06] border border-transparent hover:border-purple-500/20 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar
                    src={user.avatar_url}
                    name={user.name}
                    size="md"
                    status={user.status_state}
                    showStatus
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">
                      @{user.username}
                    </p>
                    {user.status_text && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {user.status_text}
                      </p>
                    )}
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-300">
                  Message
                </span>
              </div>
            ))
          ) : (
            <EmptyState
              icon={<Search className="w-6 h-6" />}
              title="No contacts found"
              description={`No contact matching "${search}"`}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};
