import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { useChat } from '../../context/ChatContext';
import { Users, Check } from 'lucide-react';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose }) => {
  const { users, currentUser, createGroupConversation } = useChat();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const otherUsers = users.filter((u) => u.id !== currentUser.id);

  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide a group title.');
      return;
    }

    if (selectedUserIds.length === 0) {
      setError('Please select at least one member.');
      return;
    }

    createGroupConversation(title.trim(), selectedUserIds, description.trim() || undefined);
    onClose();
    setTitle('');
    setDescription('');
    setSelectedUserIds([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Group Channel" maxWidth="md">
      <form onSubmit={handleCreate} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs">
            {error}
          </div>
        )}

        <Input
          label="Channel / Group Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Design Systems & Tokens"
          icon={<Users className="w-4 h-4" />}
          required
        />

        <Input
          label="Topic or Description (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this channel about?"
        />

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
            Select Participants ({selectedUserIds.length} selected)
          </label>

          <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 border border-slate-200 dark:border-white/10 rounded-2xl p-2 bg-slate-50/50 dark:bg-white/[0.02]">
            {otherUsers.map((user) => {
              const isSelected = selectedUserIds.includes(user.id);
              return (
                <div
                  key={user.id}
                  onClick={() => toggleUser(user.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-purple-500/20 border border-purple-500/40 text-purple-900 dark:text-purple-100'
                      : 'hover:bg-slate-200/50 dark:hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      src={user.avatar_url}
                      name={user.name}
                      size="sm"
                      status={user.status_state}
                      showStatus
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        @{user.username}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'border-slate-300 dark:border-white/20'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button variant="secondary" size="md" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit">
            Create Channel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
