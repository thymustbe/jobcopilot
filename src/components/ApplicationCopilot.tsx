'use client';

import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  ArrowUpRight,
  Building2,
  MapPin,
  DollarSign,
  UserCheck,
  Calendar,
  DownloadCloud,
  GraduationCap,
  ShieldCheck,
  Flag,
  Mail,
  Send
} from 'lucide-react';
import { Job, CopilotAssets } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { generateTailoredCopilotAssets } from '@/lib/copilotEngine';

interface ApplicationCopilotProps {
  job: Job | null;
  onMarkApplied: (job: Job) => void;
  onReportDeadLink: (job: Job) => void;
  onToast: (msg: string) => void;
}

export function ApplicationCopilot({
  job,
  onMarkApplied,
  onReportDeadLink,
  onToast
}: ApplicationCopilotProps) {
  if (!job) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400 dark:text-zinc-500 font-mono text-xs">
        <p>Select a job from the list to view its tailored LinkedIn DM and Cover Letter.</p>
      </div>
    );
  }

  // Tones for LinkedIn DM and Cover Letter
  const [dmTone, setDmTone] = useState<'short' | 'metrics' | 'referral'>('short');
  const [clFlavor, setClFlavor] = useState<'standard' | 'product' | 'growth'>('standard');
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const [assets, setAssets] = useState<CopilotAssets>(() => 
    generateTailoredCopilotAssets(job)
  );

  useEffect(() => {
    setAssets(generateTailoredCopilotAssets(job));
  }, [job]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    onToast(`Copied ${label}`);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const isRecruiterPost = job.type === 'Recruiter Post';
  const recruiter = job.recruiterName || 'Hiring Lead';
  const isApplied = job.status === 'Applied';

  const currentDmText = assets.linkedinDMs[dmTone] || assets.linkedinDMs.short;
  const currentCoverLetterText = assets.coverLetters[clFlavor] || assets.coverLetters.standard;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-white dark:bg-zinc-950 font-sans transition-colors">
      {/* Sticky Action Navigation Bar */}
      <div className="sticky top-0 z-20 px-6 sm:px-8 py-3.5 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md flex items-center justify-between gap-4">
        {/* Breadcrumb & Match score */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate">
          <span className="text-zinc-900 dark:text-zinc-200 font-bold">{job.company}</span>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span className="truncate text-zinc-700 dark:text-zinc-300 font-medium">{job.title}</span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{job.matchScore}% Match</span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 font-mono text-xs shrink-0">
          {/* Report Dead Link Button */}
          <button
            onClick={() => onReportDeadLink(job)}
            className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-300 dark:hover:border-rose-900 text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all flex items-center gap-1.5"
            title="Report this post or link as dead, expired, or non-existent"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report Dead Link</span>
          </button>

          {/* Mark as Applied Button */}
          <button
            onClick={() => onMarkApplied(job)}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
              isApplied
                ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <span>{isApplied ? 'Applied ✓' : 'Mark as Applied'}</span>
          </button>

          {/* Direct Requisition Link */}
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>Open Job Page</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Canvas Body */}
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-8 space-y-8 w-full">
        {/* Title Header & Metadata */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-xs">
            {/* Entry Level Badge */}
            {job.isEntryLevel ? (
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 font-bold flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                Entry Level / Early Career
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold">
                {job.experienceLevel || 'Mid-Senior Level'}
              </span>
            )}

            {/* F-1 STEM OPT Eligible Badge */}
            <span className="px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800/60 text-cyan-800 dark:text-cyan-300 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              F-1 STEM OPT (3 Yrs)
            </span>

            {isRecruiterPost ? (
              <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800/40 text-purple-700 dark:text-purple-300 font-semibold">
                Recruiter Post 🎯
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                Direct Application
              </span>
            )}

            <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
              {job.roleCategory}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-zinc-600 dark:text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-200 font-bold">
              <Building2 className="w-3.5 h-3.5 text-zinc-400" />
              {job.company}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              {job.location}
            </span>
            {job.salarySnippet && (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                {job.salarySnippet}
              </span>
            )}
          </div>

          {/* Posted Date and Fetched Date Box */}
          <div className="flex flex-wrap items-center gap-4 mt-3.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span><strong>Date Role Posted:</strong> {formatDate(job.datePosted || job.dateFound || '')}</span>
            </span>
            <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <DownloadCloud className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span><strong>Date Listing Fetched:</strong> {formatDate(job.dateFetched || job.dateFound || '')}</span>
            </span>
          </div>
        </div>

        {/* Recruiter Callout (if Recruiter Post) */}
        {isRecruiterPost && (
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-zinc-900/70 border border-purple-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-purple-800 dark:text-purple-300 font-bold flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                {job.recruiterName || 'Recruiter'}
                {job.recruiterTitle && (
                  <span className="text-zinc-500 font-normal">({job.recruiterTitle})</span>
                )}
              </span>
              {job.recruiterProfileUrl && (
                <a
                  href={job.recruiterProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-700 dark:text-zinc-400 hover:underline flex items-center gap-1 text-[11px] font-semibold"
                >
                  <span>LinkedIn Profile</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
            </div>
            {job.recruiterPostSnippet && (
              <p className="text-xs text-zinc-800 dark:text-zinc-300 italic font-sans leading-relaxed">
                "{job.recruiterPostSnippet}"
              </p>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* OPTION 1: LINKEDIN DM */}
        {/* ============================================================== */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h2 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 font-mono uppercase tracking-wider">
                  LinkedIn DM
                </h2>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans mt-0.5">
                Targeted for {recruiter} (<span className="font-mono">under 70 words, high-conversion</span>)
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Tone Selectors */}
              <div className="flex rounded-lg p-0.5 bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-xs font-mono">
                {[
                  { id: 'short', label: 'Short (Standard)' },
                  { id: 'metrics', label: 'Metrics Focus' },
                  { id: 'referral', label: 'Guidance / Referral' },
                ].map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setDmTone(tone.id as any)}
                    className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                      dmTone === tone.id
                        ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>

              {/* Copy Button */}
              <button
                onClick={() => copyToClipboard(currentDmText, 'LinkedIn DM')}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm shrink-0"
              >
                {copiedLabel === 'LinkedIn DM' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Copy DM</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed shadow-sm">
            {currentDmText}
          </div>
        </section>

        {/* ============================================================== */}
        {/* OPTION 2: COVER LETTER / EMAIL */}
        {/* ============================================================== */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h2 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 font-mono uppercase tracking-wider">
                  Cover Letter / Email
                </h2>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans mt-0.5">
                Ready to paste into employer application portals or cold email
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Flavor Selectors */}
              <div className="flex rounded-lg p-0.5 bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-xs font-mono">
                {[
                  { id: 'standard', label: 'Standard / Hybrid' },
                  { id: 'product', label: 'Product & PM' },
                  { id: 'growth', label: 'Growth & PMM' },
                ].map((flavor) => (
                  <button
                    key={flavor.id}
                    onClick={() => setClFlavor(flavor.id as any)}
                    className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                      clFlavor === flavor.id
                        ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                    }`}
                  >
                    {flavor.label}
                  </button>
                ))}
              </div>

              {/* Copy Button */}
              <button
                onClick={() => copyToClipboard(currentCoverLetterText, 'Cover Letter')}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm shrink-0"
              >
                {copiedLabel === 'Cover Letter' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Copy Letter</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed shadow-sm">
            {currentCoverLetterText}
          </div>
        </section>

        {/* ============================================================== */}
        {/* REQUISITION DESCRIPTION & KEYWORDS */}
        {/* ============================================================== */}
        <section className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 font-mono uppercase tracking-wider">
              Requisition Description
            </h2>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Apply on Company Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-xs text-zinc-700 dark:text-zinc-400 font-sans leading-relaxed">
            {job.description}
          </p>

          {job.matchedKeywords && job.matchedKeywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {job.matchedKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  #{kw}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
