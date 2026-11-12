'use client';

import React from 'react';
import { 
  Building2, 
  MapPin, 
  ExternalLink, 
  Copy, 
  Check, 
  Send, 
  MessageSquare,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { Job } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface JobTableProps {
  jobs: Job[];
  selectedJobId?: string;
  onSelectJob: (job: Job) => void;
  onMarkApplied: (job: Job, e: React.MouseEvent) => void;
  onCopyPitch: (job: Job, e: React.MouseEvent) => void;
  copiedId?: string | null;
}

export function JobTable({
  jobs,
  selectedJobId,
  onSelectJob,
  onMarkApplied,
  onCopyPitch,
  copiedId,
}: JobTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 font-mono text-xs border border-cardBorder rounded-xl bg-card">
        No jobs found matching your filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-cardBorder bg-card/80">
      <table className="w-full text-left text-xs font-mono">
        <thead className="bg-background/90 text-slate-400 border-b border-cardBorder uppercase text-[11px] tracking-wider">
          <tr>
            <th className="py-3 px-4">Role Title & Company</th>
            <th className="py-3 px-3">Type</th>
            <th className="py-3 px-3">Location</th>
            <th className="py-3 px-3">Match</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cardBorder/50">
          {jobs.map((job) => {
            const isSelected = job.id === selectedJobId;
            const isRecruiterPost = job.type === 'Recruiter Post';
            const isApplied = job.status === 'Applied';

            return (
              <tr
                key={job.id}
                onClick={() => onSelectJob(job)}
                className={`transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-panel border-l-2 border-cyan-400 text-slate-100'
                    : 'hover:bg-slate-900/60 text-slate-300'
                }`}
              >
                {/* Title & Company */}
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-200 hover:text-cyan-300 transition-colors">
                    {job.title}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="text-slate-300">{job.company}</span>
                    <span className="text-slate-600">•</span>
                    <span>{job.roleCategory}</span>
                  </div>
                </td>

                {/* Type */}
                <td className="py-3 px-3">
                  {isRecruiterPost ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-purple-950/70 text-purple-300 border border-purple-800/60">
                      <MessageSquare className="w-2.5 h-2.5" />
                      Recruiter
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-400">
                      Direct
                    </span>
                  )}
                </td>

                {/* Location */}
                <td className="py-3 px-3 text-slate-400">
                  {job.isRemote ? 'Remote' : job.location}
                </td>

                {/* Match */}
                <td className="py-3 px-3">
                  <span
                    className={`font-bold ${
                      job.matchScore >= 90 ? 'text-amber-400' : 'text-cyan-400'
                    }`}
                  >
                    {job.matchScore}%
                  </span>
                </td>

                {/* Status */}
                <td className="py-3 px-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                      isApplied
                        ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {job.status}
                  </span>
                </td>

                {/* Actions */}
                <td
                  className="py-3 px-4 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={(e) => onCopyPitch(job, e)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                      title="Copy 3-Bullet Pitch"
                    >
                      {copiedId === job.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => onMarkApplied(job, e)}
                      className={`p-1.5 rounded transition-colors ${
                        isApplied
                          ? 'text-emerald-400'
                          : 'hover:bg-slate-800 text-slate-400 hover:text-emerald-400'
                      }`}
                      title={isApplied ? 'Applied' : 'Mark as Applied'}
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Open Job URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

