'use client';

import React from 'react';
import { 
  RotateCw, 
  Plus, 
  Database, 
  Sun, 
  Moon,
  Sparkles
} from 'lucide-react';
import { MANAV_PROFILE } from '@/lib/candidateProfile';

interface HeaderProps {
  onIngestClick: () => void;
  isIngesting: boolean;
  onOpenSettings: () => void;
  onAddJobClick: () => void;
  sheetConnected: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Header({
  onIngestClick,
  isIngesting,
  onOpenSettings,
  onAddJobClick,
  sheetConnected,
  isDark,
  onToggleTheme
}: HeaderProps) {
  return (
    <header className="h-14 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Brand & Profile Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold text-xs tracking-wider uppercase text-zinc-900 dark:text-zinc-100 font-mono">
            Job_Copilot
          </span>
        </div>

        <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">/</span>

        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-mono">
          <span className="text-zinc-900 dark:text-zinc-200 font-bold">{MANAV_PROFILE.name}</span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span>NC State MEM (3.67 GPA)</span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span>Ex-Times Algo MD</span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-purple-600 dark:text-purple-400 font-medium">Lenovo AI Search (GEO)</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 text-xs font-mono">
        {/* Light / Dark Mode Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
        </button>

        {/* Fetch new roles */}
        <button
          onClick={onIngestClick}
          disabled={isIngesting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all disabled:opacity-50"
          title="Fetch live active listings"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isIngesting ? 'animate-spin text-cyan-500' : 'text-zinc-500'}`} />
          <span>{isIngesting ? 'Fetching...' : 'Fetch Live Roles'}</span>
        </button>

        {/* Google Sheet Sync */}
        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all ${
            sheetConnected
              ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 hover:border-emerald-600'
              : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
          title="Google Sheet Database Connection"
        >
          <Database className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{sheetConnected ? 'Sheets: Synced' : 'Sheets'}</span>
        </button>

        {/* Add Role */}
        <button
          onClick={onAddJobClick}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-bold transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>
    </header>
  );
}
