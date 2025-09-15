import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

export type ToastVariant = 'info' | 'success' | 'error' | 'warning';

export type Toast = {
  id: string;
  message: string;
  variant?: ToastVariant;
  durationMs?: number;
};

type ToastContextValue = {
  show: (message: string, options?: { variant?: ToastVariant; durationMs?: number }) => void;
  remove: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider />');
  return ctx;
};

const variantToAlertClass: Record<ToastVariant, string> = {
  info: 'alert-info',
  success: 'alert-success',
  error: 'alert-error',
  warning: 'alert-warning',
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeouts = useRef<Record<string, any>>({});

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timeouts.current[id]) {
      clearTimeout(timeouts.current[id]);
      delete timeouts.current[id];
    }
  }, []);

  const show = useCallback(
    (message: string, options?: { variant?: ToastVariant; durationMs?: number }) => {
      const id = Math.random().toString(36).slice(2);
      const variant = options?.variant ?? 'info';
      const durationMs = options?.durationMs ?? 3000;
      const toast: Toast = { id, message, variant, durationMs };
      setToasts((prev) => [...prev, toast]);
      timeouts.current[id] = setTimeout(() => remove(id), durationMs);
    },
    [remove],
  );

  const value = useMemo(() => ({ show, remove }), [show, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast toast-end z-50">
        {toasts.map((t) => (
          <div key={t.id} className={`alert ${variantToAlertClass[t.variant ?? 'info']} shadow`}>
            <div className="flex items-center gap-2">
              <span>{t.message}</span>
              <button className="btn btn-xs" onClick={() => remove(t.id)}>OK</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
