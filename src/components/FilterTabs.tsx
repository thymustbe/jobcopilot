'use client';

import React from 'react';
import { Search, X, MapPin, GraduationCap, ShieldCheck, Ban, ChevronDown } from 'lucide-react';
import { Job } from '@/lib/types';

interface FilterTabsProps {
  jobs: Job[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilter: string; // 'all' | 'recruiter' | 'entry' | 'product' | 'growth' | 'applied'
  onSelectFilter: (filter: string) => void;
  experienceFilter: string; // 'all' | 'entry' | 'mid' | 'lead'
  onSelectExperience: (filter: string) => void;
  onlyRemoteOrRaleigh: boolean;
  onToggleRemoteOrRaleigh: () => void;
  onlyStemOpt: boolean;
  onToggleStemOpt: () => void;
  excludeInternships: boolean;
  onToggleExcludeInternships: () => void;
}

export function FilterTabs({
  jobs,
  searchQuery,
  onSearchChange,
  activeFilter,
  onSelectFilter,
  experienceFilter,
  onSelectExperience,
  onlyRemoteOrRaleigh,
  onToggleRemoteOrRaleigh,
  onlyStemOpt,
  onToggleStemOpt,
  excludeInternships,
  onToggleExcludeInternships
}: FilterTabsProps) {
  // Count statistics based on current active jobs
  const validJobs = jobs.filter(j => {
    if (excludeInternships) {
      const lower = j.title.toLowerCase();
      if (lower.includes('intern') || lower.includes('co-op') || lower.includes('coop')) return false;
    }
    return true;
  });

  const total = validJobs.length;
  const recruiterCount = validJobs.filter(j => j.type === 'Recruiter Post').length;
  const entryCount = validJobs.filter(j => j.isEntryLevel).length;
  const appliedCount = validJobs.filter(j => j.status === 'Applied').length;
  const productCount = validJobs.filter(j => ['Product Manager', 'Technical PM', 'Associate PM', 'Program Manager'].includes(j.roleCategory)).length;
  const growthCount = validJobs.filter(j => ['GEO / AI Search', 'Product Marketing'].includes(j.roleCategory)).length;

  return (
    <div className="space-y-3 font-sans text-xs">
      {/* 1. Full-Width Search Input (Clean, modern, prominent) */}
      <div className="relative w-full">
        <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search roles, companies, tech (e.g. 'APM', 'LLM', 'GEO')..."
          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-9 py-2 text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-xs focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-all font-sans"
        />
        {searchQuery ? (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded font-mono">
            /
          </span>
        )}
      </div>

      {/* 2. Sleek Dual Dropdown Controls (Prevents horizontal overflow & clipping) */}
      <div className="grid grid-cols-2 gap-2">
        {/* Role Category Dropdown */}
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider block">
            Role Type
          </label>
          <div className="relative">
            <select
              value={activeFilter}
              onChange={(e) => onSelectFilter(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-900 dark:text-zinc-200 text-xs font-semibold focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 cursor-pointer appearance-none pr-7 truncate"
            >
              <option value="all">All Roles ({total})</option>
              <option value="product">Product & TPM ({productCount})</option>
              <option value="growth">Growth & GEO ({growthCount})</option>
              <option value="recruiter">Recruiter Posts 🎯 ({recruiterCount})</option>
              <option value="applied">Applied ({appliedCount})</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Experience Level Dropdown */}
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider block">
            Experience
          </label>
          <div className="relative">
            <select
              value={experienceFilter}
              onChange={(e) => onSelectExperience(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-900 dark:text-zinc-200 text-xs font-semibold focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 cursor-pointer appearance-none pr-7 truncate"
            >
              <option value="all">All Levels</option>
              <option value="entry">🎓 Entry Level / Early ({entryCount})</option>
              <option value="mid">Mid-Senior Level</option>
              <option value="lead">Lead / Executive</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. Fast Toggle Pills (Remote, Entry Level, F-1 STEM OPT, No Internships) */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        {/* Remote / Raleigh Toggle */}
        <button
          onClick={onToggleRemoteOrRaleigh}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${
            onlyRemoteOrRaleigh
              ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-400 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 font-bold'
              : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
          title="Filter for Remote or Raleigh / RTP Hybrid roles"
        >
          <MapPin className="w-3 h-3" />
          <span>Remote / Raleigh</span>
        </button>

        {/* Quick Entry Level Toggle */}
        <button
          onClick={() => onSelectExperience(experienceFilter === 'entry' ? 'all' : 'entry')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${
            experienceFilter === 'entry'
              ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold'
              : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
          title="Toggle only Entry Level / Early Career roles"
        >
          <GraduationCap className="w-3 h-3 text-amber-500" />
          <span>Entry Level</span>
        </button>

        {/* F-1 STEM OPT Work Auth Filter Toggle */}
        <button
          onClick={onToggleStemOpt}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${
            onlyStemOpt
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold'
              : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
          title="F-1 STEM OPT Eligible (Excludes US Citizen only, Security Clearance, and non-US roles)"
        >
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>F-1 STEM OPT</span>
        </button>

        {/* Exclude Internships / Co-ops Toggle */}
        <button
          onClick={onToggleExcludeInternships}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${
            excludeInternships
              ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-400 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold'
              : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
          title="Toggle excluding internships and co-ops (Permanent full-time roles only)"
        >
          <Ban className="w-3 h-3 text-purple-500" />
          <span>No Intern/Co-op</span>
        </button>
      </div>
    </div>
  );
}
