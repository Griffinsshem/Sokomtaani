"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const STYLES = {
  success: { icon: CheckCircle, cls: "bg-green-700 text-white" },
  error: { icon: AlertCircle, cls: "bg-red-700 text-white" },
  info: { icon: Info, cls: "bg-gray-800 text-white" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message, type = "info", duration = 4000) => {
      const id = ++idRef.current;
      setToasts((list) => [...list.slice(-3), { id, message, type }]);
      if (duration) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  const api = useRef(null);
  if (!api.current) api.current = {};
  api.current.show = show;
  api.current.success = (m) => show(m, "success");
  api.current.error = (m) => show(m, "error", 6000);
  api.current.info = (m) => show(m, "info");

  return (
    <ToastContext.Provider value={api.current}>
      {children}
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const { icon: Icon, cls } = STYLES[t.type] || STYLES.info;
          return (
            <div key={t.id} className={`flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg ${cls}`}>
              <Icon size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
              <p className="flex-1 text-sm">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="shrink-0 rounded p-0.5 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                aria-label="Dismiss notification"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
