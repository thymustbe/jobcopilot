'use client';

import React from 'react';
import { 
  Briefcase, 
  Send, 
  CheckCircle, 
  Calendar, 
  Flame, 
  MessageSquare
} from 'lucide-react';
import { Job } from '@/lib/types';

interface StatsBarProps {
  jobs: Job[];
}

export function StatsBar({ jobs }: StatsBarProps) {
  const total = jobs.length;
  const recruiterPosts = jobs.filter(j => j.type === 'Recruiter Post').length;
  const applied = jobs.filter(j => j.status === 'Applied').length;
  const interview = jobs.filter(j => j.status === 'Interview').length;
  const highMatch = jobs.filter(j => j.matchScore >= 90).length;

  const stats = [
    {
      label: 'Tracked Listings',
      value: total,
      icon: Briefcase,
      color: 'text-slate-200',
      bgColor: 'bg-slate-800/40',
      borderColor: 'border-slate-800',
    },
    {
      label: 'Recruiter Posts',
      value: recruiterPosts,
      sublabel: 'Hidden Jobs',
      icon: MessageSquare,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/30',
      borderColor: 'border-cyan-900/40',
    },
    {
      label: 'High Match (90%+)',
      value: highMatch,
      sublabel: 'Top Alignment',
      icon: Flame,
      color: 'text-purple-400',
      bgColor: 'bg-purple-950/30',
      borderColor: 'border-purple-900/40',
    },
    {
      label: 'Applied',
      value: applied,
      sublabel: `${total ? Math.round((applied / total) * 100) : 0}% velocity`,
      icon: Send,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/30',
      borderColor: 'border-emerald-900/40',
    },
    {
      label: 'Interview Pipeline',
      value: interview,
      sublabel: 'Active Rounds',
      icon: Calendar,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/30',
      borderColor: 'border-amber-900/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`p-3.5 rounded-lg border ${stat.borderColor} ${stat.bgColor} flex items-center justify-between transition-all hover:border-slate-700`}
          >
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                {stat.label}
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-2xl font-bold font-mono ${stat.color}`}>
                  {stat.value}
                </span>
                {stat.sublabel && (
                  <span className="text-[11px] font-mono text-slate-500">
                    {stat.sublabel}
                  </span>
                )}
              </div>
            </div>
            <div className={`p-2 rounded-md bg-background/50 ${stat.color}`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

