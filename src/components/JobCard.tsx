'use client';

import React from 'react';
import { Job } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Calendar, DownloadCloud, GraduationCap } from 'lucide-react';

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  onSelect: () => void;
  onMarkApplied?: (e: React.MouseEvent) => void;
  onCopyPitch?: (e: React.MouseEvent) => void;
  copiedPitch?: boolean;
}

export function JobCard({
  job,
  isSelected,
  onSelect,
  onMarkApplied,
  onCopyPitch,
  copiedPitch,
}: JobCardProps) {
  const isApplied = job.status === 'Applied';
  const isRecruiterPost = job.type === 'Recruiter Post';

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-xl border p-4 transition-all cursor-pointer font-sans ${
        isSelected
          ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-400 dark:border-zinc-700 shadow-sm ring-1 ring-zinc-400 dark:ring-zinc-600'
          : 'bg-white dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700'
      }`}
    >
      {/* Top: Company, Level Badge, Match Score */}
      <div className="flex items-center justify-between gap-2 mb-1.5 text-xs font-mono">
        <div className="flex items-center gap-1.5 truncate">
          {isApplied && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Applied" />
          )}
          <span className="font-extrabold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider truncate text-[11px]">
            {job.company}
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          
          {/* Entry Level vs Mid-Senior Pill */}
          {job.isEntryLevel ? (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 flex items-center gap-0.5">
              <span>🎓</span> Entry Level
            </span>
          ) : (
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              {job.experienceLevel || 'Mid-Senior'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-mono text-xs font-extrabold text-zinc-900 dark:text-zinc-100 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            {job.matchScore}%
          </span>
        </div>
      </div>

      {/* Middle: Title (Bold, High Contrast, Readable) */}
      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug">
        {job.title}
      </h3>

      {/* Location, Salary, Type */}
      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-zinc-600 dark:text-zinc-400 font-mono">
        <span>{job.location}</span>
        {job.salarySnippet && (
          <>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{job.salarySnippet}</span>
          </>
        )}
        {job.isStemOptFriendly !== false && (
          <>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">F-1 STEM OPT</span>
          </>
        )}
        {isRecruiterPost && (
          <>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-purple-600 dark:text-purple-300 font-semibold">Recruiter Post 🎯</span>
          </>
        )}
      </div>

      {/* Posted Date & Fetched Date */}
      <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-900 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-zinc-400" />
          <span><strong>Posted:</strong> {formatDate(job.datePosted || job.dateFound || '')}</span>
        </span>
        <span className="text-zinc-300 dark:text-zinc-700">•</span>
        <span className="flex items-center gap-1">
          <DownloadCloud className="w-3 h-3 text-zinc-400" />
          <span><strong>Fetched:</strong> {formatDate(job.dateFetched || job.dateFound || '')}</span>
        </span>
      </div>
    </div>
  );
}
