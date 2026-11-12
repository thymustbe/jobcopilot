'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from '@/components/Header';
import { FilterTabs } from '@/components/FilterTabs';
import { JobCard } from '@/components/JobCard';
import { ApplicationCopilot } from '@/components/ApplicationCopilot';
import { SettingsModal } from '@/components/SettingsModal';
import { AddJobModal } from '@/components/AddJobModal';
import { Toast } from '@/components/Toast';
import { Job, JobStatus } from '@/lib/types';
import { generateTailoredCopilotAssets } from '@/lib/copilotEngine';
import { syncJobStatusToGoogleSheet, appendJobToGoogleSheet } from '@/lib/googleSheets';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isIngesting, setIsIngesting] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedPitchId, setCopiedPitchId] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [onlyRemoteOrRaleigh, setOnlyRemoteOrRaleigh] = useState(false);
  const [onlyStemOpt, setOnlyStemOpt] = useState(true); // F-1 STEM OPT filter (US/Remote only, no clearance)
  const [excludeInternships, setExcludeInternships] = useState(true); // Strictly exclude internships and co-ops

  // Theme state (Dark Mode / Light Mode)
  const [isDark, setIsDark] = useState(true);

  // Settings state
  const [webhookUrl, setWebhookUrl] = useState('');
  const [geminiKey, setGeminiKey] = useState('');

  // Initial load
  useEffect(() => {
    // Theme sync
    const savedTheme = localStorage.getItem('job_copilot_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = savedTheme !== null ? savedTheme === 'dark' : prefersDark;
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const savedWebhook = localStorage.getItem('job_copilot_webhook') || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL || '';
    const savedGemini = localStorage.getItem('job_copilot_gemini_key') || '';
    if (savedWebhook) setWebhookUrl(savedWebhook);
    if (savedGemini) setGeminiKey(savedGemini);

    async function loadJobs() {
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.jobs) && data.jobs.length > 0) {
            setJobs(data.jobs);
            setSelectedJob(data.jobs[0]);
            return;
          }
        }
      } catch (e) {}

      // Fallback to static seed
      try {
        const seedRes = await fetch('/data/seed_jobs.json');
        if (seedRes.ok) {
          const seedData = await seedRes.json();
          setJobs(seedData);
          if (seedData.length > 0) setSelectedJob(seedData[0]);
        }
      } catch (err) {}
    }

    loadJobs();
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('job_copilot_theme', next ? 'dark' : 'light');
        if (next) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return next;
    });
  }, []);

  // Keyboard navigation (J/K to move, A to apply, / to search, Esc to deselect)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      } else if (e.key === 'j' || e.key === 'ArrowDown') {
        if (filteredJobs.length > 0) {
          const currentIndex = filteredJobs.findIndex(j => j.id === selectedJob?.id);
          const nextIndex = (currentIndex + 1) % filteredJobs.length;
          setSelectedJob(filteredJobs[nextIndex]);
        }
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        if (filteredJobs.length > 0) {
          const currentIndex = filteredJobs.findIndex(j => j.id === selectedJob?.id);
          const prevIndex = currentIndex <= 0 ? filteredJobs.length - 1 : currentIndex - 1;
          setSelectedJob(filteredJobs[prevIndex]);
        }
      } else if (e.key === 'a' && selectedJob) {
        handleMarkApplied(selectedJob);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Filtered jobs list
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const titleLower = job.title.toLowerCase();
      const descLower = (job.description || '').toLowerCase();
      const locLower = (job.location || '').toLowerCase();

      // 1. Strictly exclude reported or archived dead links
      if (job.status === 'Reported' || job.status === 'Archived') {
        return false;
      }

      // 2. Strictly exclude internships and co-ops (Permanent full-time roles only)
      if (excludeInternships) {
        if (
          titleLower.includes('intern') || 
          titleLower.includes('internship') || 
          titleLower.includes('co-op') || 
          titleLower.includes('coop') ||
          titleLower.includes('fellow') ||
          titleLower.includes('part-time')
        ) {
          return false;
        }
      }

      // 3. F-1 STEM OPT filter (US only, exclude non-US locations and US-Citizen-only / clearance requirements)
      if (onlyStemOpt) {
        const nonUsKeywords = ['israel', 'germany', 'france', 'united kingdom', 'london', 'lisbon', 'tokyo', 'japan', 'singapore', 'australia', 'sydney', 'india', 'bangalore', 'berlin', 'paris', 'dublin', 'ireland', 'canada', 'toronto', 'vancouver', 'netherlands', 'amsterdam', 'spain', 'madrid', 'barcelona', 'belgrade', 'serbia', 'romania', 'bucharest', 'mexico', 'auckland', 'new zealand'];
        if (nonUsKeywords.some(k => locLower.includes(k))) return false;

        // Exclude US Citizen-only and Security Clearance mandates
        if (
          descLower.includes('us citizen only') ||
          descLower.includes('u.s. citizen only') ||
          descLower.includes('security clearance required') ||
          descLower.includes('secret clearance') ||
          descLower.includes('ts/sci') ||
          descLower.includes('itar')
        ) {
          return false;
        }
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const str = `${job.title} ${job.company} ${job.description} ${job.location}`.toLowerCase();
        if (!str.includes(q)) return false;
      }

      // 4. Role Category Filter
      if (activeFilter === 'entry' && !job.isEntryLevel) return false;
      if (activeFilter === 'recruiter' && job.type !== 'Recruiter Post') return false;
      if (activeFilter === 'applied' && job.status !== 'Applied') return false;
      if (activeFilter === 'product' && !['Product Manager', 'Technical PM', 'Associate PM', 'Program Manager'].includes(job.roleCategory)) return false;
      if (activeFilter === 'growth' && !['GEO / AI Search', 'Product Marketing'].includes(job.roleCategory)) return false;

      // 5. Experience Level Filter
      if (experienceFilter === 'entry' && !job.isEntryLevel) return false;
      if (experienceFilter === 'mid' && job.experienceLevel !== 'Mid-Senior') return false;
      if (experienceFilter === 'lead' && job.experienceLevel !== 'Lead / Executive') return false;

      // 6. Location Filter
      if (onlyRemoteOrRaleigh && !job.isRemote && !job.isRaleighHybrid) {
        return false;
      }

      return true;
    });
  }, [jobs, searchQuery, activeFilter, experienceFilter, onlyRemoteOrRaleigh, onlyStemOpt, excludeInternships]);

  // Action: Mark as Applied
  const handleMarkApplied = useCallback(async (job: Job, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStatus: JobStatus = job.status === 'Applied' ? 'New' : 'Applied';

    setJobs((prev) =>
      prev.map((j) =>
        j.id === job.id
          ? {
              ...j,
              status: newStatus,
              appliedDate: newStatus === 'Applied' ? new Date().toISOString().split('T')[0] : undefined,
            }
          : j
      )
    );

    if (selectedJob?.id === job.id) {
      setSelectedJob((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              appliedDate: newStatus === 'Applied' ? new Date().toISOString().split('T')[0] : undefined,
            }
          : null
      );
    }

    setToastMessage(newStatus === 'Applied' ? `Marked as Applied ✓` : `Reverted status to New`);

    try {
      await fetch('/api/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: job.id, status: newStatus }),
      });
      if (webhookUrl) {
        await syncJobStatusToGoogleSheet(job.id, newStatus, webhookUrl);
      }
    } catch (err) {}
  }, [selectedJob, webhookUrl]);

  // Action: Report Dead / Non-existent Link
  const handleReportDeadLink = useCallback(async (job: Job) => {
    const currentIndex = filteredJobs.findIndex((j) => j.id === job.id);
    const nextJob = filteredJobs[currentIndex + 1] || filteredJobs[currentIndex - 1] || null;

    setJobs((prev) =>
      prev.map((j) =>
        j.id === job.id ? { ...j, status: 'Reported', notes: 'Reported dead link' } : j
      )
    );

    if (selectedJob?.id === job.id) {
      setSelectedJob(nextJob);
    }

    setToastMessage(`Reported dead link for ${job.company} — removed from queue`);

    try {
      await fetch('/api/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: job.id, status: 'Reported', notes: 'Reported dead link' }),
      });
      if (webhookUrl) {
        await syncJobStatusToGoogleSheet(job.id, 'Reported', webhookUrl);
      }
    } catch (err) {}
  }, [filteredJobs, selectedJob, webhookUrl]);

  // Action: Copy LinkedIn DM
  const handleCopyPitch = useCallback((job: Job, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const assets = generateTailoredCopilotAssets(job);
    const text = assets.linkedinDMs.short;
    navigator.clipboard.writeText(text);

    setCopiedPitchId(job.id);
    setToastMessage(`Copied LinkedIn DM for ${job.company}`);
    setTimeout(() => setCopiedPitchId(null), 2000);
  }, []);

  // Action: Ingest new listings
  const handleIngest = async () => {
    setIsIngesting(true);
    setToastMessage('Fetching active job openings from ATS boards...');
    try {
      const res = await fetch('/api/ingest', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.jobs && data.jobs.length > 0) {
          setJobs((prev) => [...data.jobs, ...prev]);
          setToastMessage(`Discovered ${data.addedCount} new active roles!`);
        } else {
          setToastMessage('All active listings are up to date.');
        }
      }
    } catch (e) {
      setToastMessage('Fetch complete. Pipeline synchronized.');
    } finally {
      setIsIngesting(false);
    }
  };

  const handleAddJob = async (newJobData: Partial<Job>) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJobData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.job) {
          setJobs((prev) => [data.job, ...prev]);
          setSelectedJob(data.job);
          setToastMessage(`Added "${data.job.title}"`);
          if (webhookUrl) appendJobToGoogleSheet(data.job, webhookUrl);
        }
      }
    } catch (e) {}
  };

  return (
    <div className="h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans overflow-hidden transition-colors">
      {/* Top Navbar */}
      <Header
        onIngestClick={handleIngest}
        isIngesting={isIngesting}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onAddJobClick={() => setIsAddJobOpen(true)}
        sheetConnected={Boolean(webhookUrl && !webhookUrl.includes('YOUR_SCRIPT_ID'))}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main Two-Pane Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Filter & High-Density Role List */}
        <div className="w-full md:w-[380px] lg:w-[420px] shrink-0 border-r border-zinc-200 dark:border-zinc-800/80 flex flex-col h-full bg-white dark:bg-zinc-950/60 transition-colors">
          {/* Top Filter Controls */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/60 space-y-3">
            <FilterTabs
              jobs={jobs}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onSelectFilter={setActiveFilter}
              experienceFilter={experienceFilter}
              onSelectExperience={setExperienceFilter}
              onlyRemoteOrRaleigh={onlyRemoteOrRaleigh}
              onToggleRemoteOrRaleigh={() => setOnlyRemoteOrRaleigh(!onlyRemoteOrRaleigh)}
              onlyStemOpt={onlyStemOpt}
              onToggleStemOpt={() => setOnlyStemOpt(!onlyStemOpt)}
              excludeInternships={excludeInternships}
              onToggleExcludeInternships={() => setExcludeInternships(!excludeInternships)}
            />
          </div>

          {/* Scrollable Role Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={selectedJob?.id === job.id}
                onSelect={() => setSelectedJob(job)}
                onMarkApplied={(e) => handleMarkApplied(job, e)}
                onCopyPitch={(e) => handleCopyPitch(job, e)}
                copiedPitch={copiedPitchId === job.id}
              />
            ))}

            {filteredJobs.length === 0 && (
              <div className="p-8 text-center text-xs font-mono text-zinc-500">
                No roles match your search or filter.
              </div>
            )}
          </div>

          {/* Bottom Feed Status */}
          <div className="px-4 py-2 border-t border-zinc-200 dark:border-zinc-800/60 text-[11px] font-mono text-zinc-500 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/50">
            <span>{filteredJobs.length} roles shown</span>
            <span><kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">J</kbd>/<kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">K</kbd> to move</span>
          </div>
        </div>

        {/* Right Pane: Spacious Executive Dossier & Action Canvas */}
        <ApplicationCopilot
          job={selectedJob}
          onMarkApplied={handleMarkApplied}
          onReportDeadLink={handleReportDeadLink}
          onToast={setToastMessage}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialWebhookUrl={webhookUrl}
        initialGeminiKey={geminiKey}
        onSave={({ webhookUrl: url, geminiKey: key }) => {
          setWebhookUrl(url);
          setGeminiKey(key);
          localStorage.setItem('job_copilot_webhook', url);
          localStorage.setItem('job_copilot_gemini_key', key);
          setToastMessage('Settings saved');
        }}
      />

      {/* Add Job Modal */}
      <AddJobModal
        isOpen={isAddJobOpen}
        onClose={() => setIsAddJobOpen(false)}
        onAdd={handleAddJob}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
