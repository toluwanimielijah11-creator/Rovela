import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { ToastMessage, ToastType } from '../../context/ToastContext';

export type { ToastMessage, ToastType };

interface ToastProps {
  toast?: ToastMessage | null;
  onDismiss?: (id?: string) => void;
}

interface ToastContainerProps {
  toasts?: ToastMessage[];
  toast?: ToastMessage | null;
  onDismiss?: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  return (
    <div
      id="rovela-toast-portal"
      className="fixed inset-x-0 bottom-20 md:bottom-8 z-50 flex justify-center items-center pointer-events-none px-4"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        {toast && (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        )}
      </AnimatePresence>
    </div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  toast: singleToast,
  onDismiss,
}) => {
  // If singleToast provided, use it. Otherwise, pick the latest from toasts array.
  const activeToast =
    singleToast ||
    (toasts && toasts.length > 0 ? toasts[toasts.length - 1] : null);

  return (
    <div
      id="rovela-toast-container"
      className="fixed inset-x-0 bottom-20 md:bottom-8 z-50 flex justify-center items-center pointer-events-none px-4"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        {activeToast && (
          <ToastItem
            key={activeToast.id}
            toast={activeToast}
            onDismiss={onDismiss}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss?: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    // If auto-dismiss duration provided and onDismiss available
    if (toast.duration && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onDismiss]);

  // Contextual 16px icons
  const icons: Record<ToastType, React.ReactNode> = {
    success: <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-purple-300 shrink-0" />,
  };

  const borderAccents: Record<ToastType, string> = {
    success:
      'border-emerald-500/30 shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_16px_rgba(16,185,129,0.18)]',
    error:
      'border-rose-500/35 shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_16px_rgba(244,63,94,0.2)]',
    warning:
      'border-amber-500/35 shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_16px_rgba(245,158,11,0.2)]',
    info:
      'border-purple-500/30 shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_16px_rgba(139,92,246,0.22)]',
  };

  return (
    <motion.div
      id={`rovela-toast-${toast.id}`}
      role="status"
      initial={{ opacity: 0, y: 12, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{
        duration: 0.2, // 200ms enter/exit satisfies requirements
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2 min-h-[40px] max-h-[48px] max-w-[min(340px,calc(100vw-32px))] w-fit rounded-full bg-[#0D0B14]/94 backdrop-blur-xl border ${borderAccents[toast.type]} text-white select-none`}
    >
      {icons[toast.type]}
      <div className="flex items-center min-w-0 pr-0.5">
        <span className="text-[12.5px] sm:text-[13px] font-medium text-slate-100 tracking-tight whitespace-nowrap truncate">
          {toast.title}
        </span>
        {toast.description && (
          <span className="text-[11px] text-purple-300/80 ml-1.5 font-normal whitespace-nowrap truncate hidden xs:inline">
            · {toast.description}
          </span>
        )}
      </div>
    </motion.div>
  );
};
