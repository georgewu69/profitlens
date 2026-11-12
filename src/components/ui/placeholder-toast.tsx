"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { SparklesIcon } from "@/components/ui/icons";

type ToastPayload = {
  title: string;
  description?: string;
};

type Notify = (payload: ToastPayload) => void;

const PlaceholderToastContext = createContext<Notify>(() => {});

export function usePlaceholderToast() {
  return useContext(PlaceholderToastContext);
}

export function PlaceholderToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<(ToastPayload & { id: number }) | null>(null);

  const notify = useCallback<Notify>((payload) => {
    setToast({ ...payload, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3600);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <PlaceholderToastContext.Provider value={notify}>
      {children}
      {toast && (
        <div
          className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
          role="status"
          aria-live="polite"
        >
          <div
            key={toast.id}
            className="animate-toast-in pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/95 px-4 py-3.5 shadow-2xl shadow-slate-900/30 backdrop-blur"
          >
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400">
              <SparklesIcon className="size-4" />
            </span>
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-white">{toast.title}</p>
              {toast.description && (
                <p className="text-xs leading-5 text-slate-400">{toast.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </PlaceholderToastContext.Provider>
  );
}
