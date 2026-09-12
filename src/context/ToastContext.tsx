import { createContext } from 'react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

export interface ToastContextType {
  toast: ToastMessage | null;
  showToast: (
    title: string,
    description?: string,
    type?: ToastType,
    duration?: number
  ) => void;
  success: (title: string, description?: string, duration?: number) => void;
  info: (title: string, description?: string, duration?: number) => void;
  warning: (title: string, description?: string, duration?: number) => void;
  error: (title: string, description?: string, duration?: number) => void;
  dismissToast: (id?: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
