import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, Share2, Download, Copy, Check, X, Shield, Sparkles } from 'lucide-react';
import { generateQrMatrix } from '../../utils/qrCode';
import { UserProfile } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../ui/Avatar';

interface ProfileQRCodeProps {
  user: UserProfile;
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

export const ProfileQRCode: React.FC<ProfileQRCodeProps> = ({
  user,
  isOpen = true,
  onClose,
  isModal = true,
}) => {
  const { showToast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen) return null;

  const rovelaId = `@${user.username}`;
  const qrPayload = `https://rovela.app/u/${user.username}`;
  const matrix = generateQrMatrix(qrPayload);
  const matrixSize = matrix.length;

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rovelaId);
      setIsCopied(true);
      showToast('Rovela ID copied', rovelaId, 'success');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.display_name || user.name} on Rovela`,
          text: `Connect with me on Rovela: ${rovelaId}`,
          url: qrPayload,
        });
        showToast('Shared successfully', undefined, 'success');
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(qrPayload);
    showToast('Profile link copied to clipboard', qrPayload, 'info');
  };

  const handleSaveImage = () => {
    setIsSaving(true);
    try {
      const canvas = document.createElement('canvas');
      const scale = 4;
      const cardWidth = 360 * scale;
      const cardHeight = 480 * scale;
      canvas.width = cardWidth;
      canvas.height = cardHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context unavailable');
      }

      // 1. Draw rounded background card with gradient
      const gradient = ctx.createLinearGradient(0, 0, cardWidth, cardHeight);
      gradient.addColorStop(0, '#130e24');
      gradient.addColorStop(0.5, '#1e1438');
      gradient.addColorStop(1, '#0e0b17');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, cardWidth, cardHeight);

      // Accent border
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 4 * scale;
      ctx.strokeRect(10 * scale, 10 * scale, cardWidth - 20 * scale, cardHeight - 20 * scale);

      // Header: Rovela Brand
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('ROVELA IDENTITY', cardWidth / 2, 45 * scale);

      ctx.fillStyle = 'rgba(216, 180, 254, 0.8)';
      ctx.font = `${12 * scale}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(user.display_name || user.name, cardWidth / 2, 70 * scale);

      ctx.fillStyle = '#a855f7';
      ctx.font = `bold ${14 * scale}px monospace`;
      ctx.fillText(rovelaId, cardWidth / 2, 92 * scale);

      // White container for QR
      const qrBoxSize = 250 * scale;
      const qrBoxX = (cardWidth - qrBoxSize) / 2;
      const qrBoxY = 120 * scale;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 24 * scale);
      ctx.fill();

      // Render QR code modules inside white box
      const padding = 20 * scale;
      const cellSize = (qrBoxSize - padding * 2) / matrixSize;

      ctx.fillStyle = '#1e1035';
      for (let r = 0; r < matrixSize; r++) {
        for (let c = 0; c < matrixSize; c++) {
          if (matrix[r][c]) {
            ctx.fillRect(
              qrBoxX + padding + c * cellSize,
              qrBoxY + padding + r * cellSize,
              cellSize + 0.5,
              cellSize + 0.5
            );
          }
        }
      }

      // Center logo badge inside QR
      const logoBadgeSize = 44 * scale;
      const logoX = qrBoxX + (qrBoxSize - logoBadgeSize) / 2;
      const logoY = qrBoxY + (qrBoxSize - logoBadgeSize) / 2;
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath();
      ctx.roundRect(logoX, logoY, logoBadgeSize, logoBadgeSize, 12 * scale);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${22 * scale}px sans-serif`;
      ctx.fillText('R', logoX + logoBadgeSize / 2, logoY + logoBadgeSize / 2 + 8 * scale);

      // Footer
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = `${11 * scale}px system-ui, -apple-system, sans-serif`;
      ctx.fillText('Scan with Rovela or camera to start chatting', cardWidth / 2, 420 * scale);

      // Download
      const link = document.createElement('a');
      link.download = `rovela-qr-${user.username}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      showToast('QR Code saved to photos', 'PNG image downloaded', 'success');
    } catch (err) {
      showToast('Failed to save image', undefined, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const content = (
    <div className="relative w-full max-w-sm mx-auto p-6 rounded-3xl bg-[var(--rovela-surface)] border border-[var(--rovela-border)] shadow-2xl backdrop-blur-2xl flex flex-col items-center select-none text-[var(--rovela-text-primary)]">
      {/* Top Controls */}
      {isModal && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* User Branding Avatar & Badges */}
      <div className="flex flex-col items-center text-center mt-2 mb-4">
        <Avatar
          src={user.avatar_url}
          name={user.display_name || user.name}
          size="lg"
          className="ring-4 ring-purple-500/30 shadow-lg mb-2"
        />
        <h3 className="text-lg font-bold tracking-tight">
          {user.display_name || user.name}
        </h3>
        <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full mt-1">
          {rovelaId}
        </span>
      </div>

      {/* QR Code Container with Rovela Liquid Glass framing */}
      <div className="relative p-4 rounded-3xl bg-white shadow-xl ring-1 ring-black/5 flex items-center justify-center my-2">
        <svg
          viewBox={`0 0 ${matrixSize} ${matrixSize}`}
          className="w-56 h-56 block rounded-xl overflow-hidden"
          shapeRendering="crispEdges"
        >
          {matrix.map((row, r) =>
            row.map((cell, c) =>
              cell ? (
                <rect
                  key={`${r}-${c}`}
                  x={c}
                  y={r}
                  width="1.02"
                  height="1.02"
                  fill="#181126"
                />
              ) : null
            )
          )}
        </svg>

        {/* Center Logo Pill */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-extrabold text-lg">
            R
          </div>
        </div>
      </div>

      <p className="text-[11px] text-center text-[var(--rovela-text-secondary)] mt-2 mb-5 max-w-[220px]">
        Scan this QR code with any camera or Rovela scanner to connect instantly.
      </p>

      {/* Action Buttons: Show QR, Share, Save Image, Copy ID */}
      <div className="w-full grid grid-cols-3 gap-2">
        {/* Copy ID Button */}
        <button
          type="button"
          onClick={handleCopyId}
          className="flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] hover:bg-[var(--rovela-surface-hover)] active:scale-95 transition-all text-xs font-semibold cursor-pointer"
        >
          {isCopied ? (
            <Check className="w-4 h-4 text-emerald-500" />
          ) : (
            <Copy className="w-4 h-4 text-purple-500" />
          )}
          <span className="text-[10px]">{isCopied ? 'Copied' : 'Copy ID'}</span>
        </button>

        {/* Save Image Button */}
        <button
          type="button"
          onClick={handleSaveImage}
          disabled={isSaving}
          className="flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] hover:bg-[var(--rovela-surface-hover)] active:scale-95 transition-all text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-purple-500" />
          <span className="text-[10px]">{isSaving ? 'Saving...' : 'Save Image'}</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white active:scale-95 transition-all text-xs font-bold shadow-md shadow-purple-950/20 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-[10px]">Share</span>
        </button>
      </div>
    </div>
  );

  if (!isModal) {
    return content;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.18 }}
          className="w-full max-w-sm"
        >
          {content}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
