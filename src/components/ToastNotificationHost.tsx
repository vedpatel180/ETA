import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bell, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { InAppToast, subscribeToToasts } from '../utils/notifications';

export const ToastNotificationHost: React.FC = () => {
  const [toasts, setToasts] = useState<InAppToast[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToToasts((toast) => {
      setToasts((prev) => [toast, ...prev.slice(0, 4)]);
      // Auto-dismiss after 6.5s
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 6500);
    });
    return unsubscribe;
  }, []);

  const handleDismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <aside aria-label="Notification alerts" className="fixed top-24 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let borderColor = 'border-slate-200';
          let bgColor = 'bg-white';
          let icon = <Info className="w-5 h-5 text-[#003399] shrink-0" />;

          if (toast.type === 'arrival') {
            borderColor = 'border-green-300 shadow-green-100';
            bgColor = 'bg-white';
            icon = <Bell className="w-5 h-5 text-green-700 shrink-0 animate-bounce" />;
          } else if (toast.type === 'platform') {
            borderColor = 'border-amber-300 shadow-amber-100';
            bgColor = 'bg-white';
            icon = <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />;
          } else if (toast.type === 'delay') {
            borderColor = 'border-red-300 shadow-red-100';
            bgColor = 'bg-white';
            icon = <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />;
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              id={`toast-${toast.id}`}
              className={`pointer-events-auto p-4 rounded-2xl border-2 ${borderColor} ${bgColor} shadow-2xl text-[#111111] flex items-start justify-between gap-3`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  {icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black uppercase text-[#111111] leading-tight">{toast.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">{toast.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">{toast.body}</p>
                </div>
              </div>
              <button
                onClick={() => handleDismiss(toast.id)}
                className="text-slate-400 hover:text-black p-1 rounded-md transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </aside>
  );
};
