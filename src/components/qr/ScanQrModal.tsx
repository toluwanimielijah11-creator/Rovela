import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Flashlight,
  Image as ImageIcon,
  Search,
  Camera,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';

interface ScanQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScanQrModal: React.FC<ScanQrModalProps> = ({ isOpen, onClose }) => {
  const { openProfilePreview, openFindOnRovela, showToast } = useChat();
  const [flashOn, setFlashOn] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [isDetected, setIsDetected] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      setIsDetected(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateScan = (targetUserId: string, username: string) => {
    setIsScanning(false);
    setIsDetected(true);
    showToast('QR Code Recognized', `@${username}`, 'success');

    setTimeout(() => {
      onClose();
      openProfilePreview(targetUserId);
    }, 600);
  };

  const handleManualSearch = () => {
    onClose();
    openFindOnRovela();
  };

  const handlePickFromGallery = () => {
    // Simulate detecting a friend from a photo
    handleSimulateScan('user-sarah', 'sarahw');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-[#0e0b18] border border-purple-500/20 rounded-[32px] overflow-hidden shadow-2xl flex flex-col relative text-white"
        >
          {/* Top Bar */}
          <div className="px-6 py-4 flex items-center justify-between z-10">
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close scanner"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300">
              Scan Rovela QR
            </h3>
            <button
              type="button"
              onClick={() => setFlashOn((f) => !f)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                flashOn ? 'bg-amber-400 text-black' : 'text-white/70 hover:bg-white/10'
              }`}
              aria-label="Toggle flashlight"
            >
              <Flashlight className="w-5 h-5" />
            </button>
          </div>

          {/* Viewfinder Stage */}
          <div className="relative h-80 bg-black flex flex-col items-center justify-center overflow-hidden">
            {/* Camera Viewport Simulation */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#18112c] via-[#0d0a17] to-[#18112c] opacity-90" />

            {/* Viewfinder Target Box */}
            <div className="relative w-60 h-60 rounded-3xl border-2 border-purple-500/40 flex items-center justify-center overflow-hidden">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-400 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-400 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-400 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-400 rounded-br-2xl" />

              {/* Animated Laser Scanning Line */}
              {isScanning && (
                <motion.div
                  animate={{ y: [-110, 110, -110] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  className="absolute w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.9)]"
                />
              )}

              {/* Detected state animation */}
              {isDetected && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-2 bg-black/80 px-6 py-4 rounded-2xl border border-emerald-400/50"
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
                  <span className="text-xs font-bold text-emerald-300">Rovela ID Found!</span>
                </motion.div>
              )}
            </div>

            <p className="text-xs text-white/70 font-medium z-10 mt-4">
              Align QR Code within the frame to scan
            </p>
          </div>

          {/* Interactive Testing & Fallback Buttons */}
          <div className="p-6 bg-[#0a0713] border-t border-white/10 space-y-3">
            <div className="text-[11px] font-semibold text-purple-300/80 flex items-center gap-1.5 justify-center">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tap to simulate scanning instant test cards:</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSimulateScan('user-sarah', 'sarahw')}
                className="py-2.5 px-3 rounded-2xl bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/30 text-xs font-bold text-purple-200 transition-all cursor-pointer text-center truncate"
              >
                Scan @sarahw
              </button>
              <button
                type="button"
                onClick={() => handleSimulateScan('user-marcus', 'marcusv')}
                className="py-2.5 px-3 rounded-2xl bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/30 text-xs font-bold text-purple-200 transition-all cursor-pointer text-center truncate"
              >
                Scan @marcusv
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-white/5">
              <button
                type="button"
                onClick={handlePickFromGallery}
                className="flex items-center gap-1.5 text-xs font-bold text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-blue-400" />
                <span>Upload from Gallery</span>
              </button>

              <button
                type="button"
                onClick={handleManualSearch}
                className="flex items-center gap-1.5 text-xs font-bold text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 text-purple-400" />
                <span>Enter ID Manually</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
