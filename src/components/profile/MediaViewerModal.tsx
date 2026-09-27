import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Share2, ZoomIn, ExternalLink } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  isOpen,
  onClose,
  url,
  title = 'Media Viewer',
}) => {
  const { showToast } = useChat();

  if (!isOpen || !url || url.trim() === '') return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '_')}_rovela.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Image download started', undefined, 'success');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch {
        // Ignored or cancelled
      }
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast('Image link copied to clipboard', undefined, 'success');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-xl select-none">
        {/* Top Floating Control Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs font-semibold">
            <span>{title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer backdrop-blur-md"
              title="Share photo"
              aria-label="Share photo"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer backdrop-blur-md"
              title="Download photo"
              aria-label="Download photo"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/10 hover:bg-rose-500/30 text-white transition-all cursor-pointer backdrop-blur-md"
              title="Close viewer"
              aria-label="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Image Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-2xl max-h-[80vh] flex items-center justify-center overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={url}
            alt={title}
            className="max-w-full max-h-[80vh] object-contain rounded-2xl"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Bottom Hint */}
        <div className="absolute bottom-6 text-white/50 text-xs">
          Click outside or press Close to dismiss
        </div>
      </div>
    </AnimatePresence>
  );
};
