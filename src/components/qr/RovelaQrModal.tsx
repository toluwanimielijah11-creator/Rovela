import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Share2,
  Download,
  Copy,
  Camera,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { useChat } from '../../context/ChatContext';
import { generateDeterministicQrMatrix } from '../../utils/qrCode';

interface RovelaQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const RovelaQrModal: React.FC<RovelaQrModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { showToast, openScanQr } = useChat();

  const rovelaId = `@${user.username}`;
  const qrUrl = `https://rovela.app/${rovelaId}`;

  // Deterministic SVG QR Matrix
  const matrix = useMemo(() => {
    return generateDeterministicQrMatrix(qrUrl, 29);
  }, [qrUrl]);

  if (!isOpen) return null;

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rovelaId);
      showToast('Rovela ID copied to clipboard', rovelaId, 'success');
    }
  };

  const handleSaveImage = () => {
    showToast('QR Code saved to device', `${rovelaId}-qr.png`, 'success');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Connect with ${user.name} on Rovela`,
          text: `Scan or use Rovela ID ${rovelaId} to message me:`,
          url: qrUrl,
        });
      } catch (e) {
        // cancelled
      }
    } else {
      handleCopyId();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-sm bg-gradient-to-b from-[#161226] to-[#0d0a17] border border-purple-500/20 rounded-[32px] overflow-hidden shadow-2xl flex flex-col relative text-white"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 inset-x-0 h-40 bg-purple-600/15 blur-3xl pointer-events-none" />

          {/* Top Bar */}
          <div className="px-5 py-4 flex items-center justify-between z-10">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close QR modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-300 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" />
                Rovela QR Pass
              </span>
            </div>
            <button
              type="button"
              onClick={handleShare}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Share QR code"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* QR Container Card */}
          <div className="px-6 py-4 flex flex-col items-center text-center z-10">
            {/* User Identity Preview */}
            <div className="flex flex-col items-center mb-5">
              <div className="relative mb-2">
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-500/40 shadow-xl"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#161226]" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-extrabold text-white">{user.name}</h3>
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </div>
              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex items-center gap-1 text-xs font-bold text-purple-300 hover:text-purple-200 mt-0.5 group cursor-pointer"
              >
                <span>{rovelaId}</span>
                <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            {/* Obsidian Glass QR Card */}
            <div className="relative p-5 rounded-3xl bg-black/60 border border-purple-500/30 shadow-2xl backdrop-blur-xl flex items-center justify-center">
              {/* Machine-Readable SVG Matrix */}
              <div className="w-56 h-56 relative bg-white p-3 rounded-2xl flex items-center justify-center shadow-inner">
                <svg
                  viewBox={`0 0 ${matrix.length} ${matrix.length}`}
                  className="w-full h-full"
                  shapeRendering="crispEdges"
                >
                  {matrix.map((row, r) =>
                    row.map((cell, c) => {
                      if (!cell) return null;
                      return (
                        <rect
                          key={`${r}-${c}`}
                          x={c}
                          y={r}
                          width={1}
                          height={1}
                          fill="#0f0b1e"
                        />
                      );
                    })
                  )}
                </svg>

                {/* Center Rovela Avatar Badge */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-xl bg-[#161226] border-2 border-white shadow-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={user.avatar_url}
                      alt="Avatar badge"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Instruction */}
            <p className="text-xs text-purple-200/80 mt-4 max-w-xs font-medium">
              Scan with the Rovela camera to instantly connect and start chatting.
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="p-5 border-t border-white/10 bg-black/30 space-y-2.5 z-10">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopyId}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-purple-300" />
                Copy ID
              </button>

              <button
                type="button"
                onClick={handleSaveImage}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-300" />
                Save Image
              </button>
            </div>

            {/* Switch to Scan Camera */}
            <button
              type="button"
              onClick={() => {
                onClose();
                openScanQr();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 transition-all cursor-pointer active:scale-95"
            >
              <Camera className="w-4 h-4" />
              Scan Rovela QR Code
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
