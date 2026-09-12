import React from 'react';
import { Modal } from '../ui/Modal';
import { useChat } from '../../context/ChatContext';
import { Ban, AlertCircle } from 'lucide-react';

interface BlockUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export const BlockUserDialog: React.FC<BlockUserDialogProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
}) => {
  const { blockUser } = useChat();

  const handleConfirm = () => {
    blockUser(userId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Block ${userName}?`} maxWidth="sm">
      <div className="flex flex-col gap-4 select-none">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-800 dark:text-rose-200 text-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <p>
            Are you sure you want to block <strong>{userName}</strong>?
          </p>
        </div>

        <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
          <li>They will not be able to message or call you on Rovela.</li>
          <li>They cannot see your online status or profile changes.</li>
          <li>Existing shared group channels will remain accessible.</li>
          <li>You can unblock this user anytime in Privacy Settings.</li>
        </ul>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/20 transition-all active:scale-95 cursor-pointer"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Block User</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
