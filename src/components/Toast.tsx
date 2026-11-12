'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 border border-zinc-700 dark:border-zinc-300 text-white dark:text-zinc-950 text-xs font-mono shadow-xl animate-in slide-in-from-bottom-2 fade-in duration-200">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
      <span className="font-semibold">{message}</span>
      <button
        onClick={onClose}
        className="p-1 -mr-1 rounded hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-400 dark:text-zinc-600 hover:text-white dark:hover:text-zinc-950 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

