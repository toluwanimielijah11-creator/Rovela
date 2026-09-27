import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ToastContext, ToastMessage, ToastType } from './ToastContext';
import { Toast } from '../components/ui/Toast';

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const dismissToast = useCallback(
    (id?: string) => {
      clearTimer();
      // Schedule toast state update to avoid calling setState during another component's render
      setTimeout(() => {
        setToast((current) => {
          if (!id || (current && current.id === id)) {
            return null;
          }
          return current;
        });
      }, 0);
    },
    [clearTimer]
  );

  const showToast = useCallback(
    (
      title: string,
      description?: string,
      type: ToastType = 'info',
      duration: number = 2800
    ) => {
      clearTimer();
      const newToast: ToastMessage = {
        id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type,
        title,
        description,
        duration,
      };

      // Enforce strictly ONE toast at a time: replaces active notification immediately.
      // Scheduled asynchronously to prevent React render-cycle conflicts (e.g. setState in render).
      setTimeout(() => {
        setToast(newToast);
      }, 0);

      timeoutRef.current = setTimeout(() => {
        setToast((current) => (current?.id === newToast.id ? null : current));
      }, duration);
    },
    [clearTimer]
  );

  const success = useCallback(
    (title: string, description?: string, duration?: number) => {
      showToast(title, description, 'success', duration);
    },
    [showToast]
  );

  const info = useCallback(
    (title: string, description?: string, duration?: number) => {
      showToast(title, description, 'info', duration);
    },
    [showToast]
  );

  const warning = useCallback(
    (title: string, description?: string, duration?: number) => {
      showToast(title, description, 'warning', duration);
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, description?: string, duration?: number) => {
      showToast(title, description, 'error', duration);
    },
    [showToast]
  );

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return (
    <ToastContext.Provider
      value={{
        toast,
        showToast,
        success,
        info,
        warning,
        error,
        dismissToast,
      }}
    >
      {children}
      {/* Globally mounted single liquid-glass notification component */}
      <Toast toast={toast} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};
