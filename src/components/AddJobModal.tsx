'use client';

import React, { useState } from 'react';
import { X, Plus, Sparkles, MessageSquare, Building2, MapPin, GraduationCap } from 'lucide-react';
import { Job, RoleCategory, JobType } from '@/lib/types';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (job: Partial<Job>) => void;
}

export function AddJobModal({ isOpen, onClose, onAdd }: AddJobModalProps) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Remote');
  const [type, setType] = useState<JobType>('Direct');
  const [roleCategory, setRoleCategory] = useState<RoleCategory>('Product Manager');
  const [experienceLevel, setExperienceLevel] = useState<'Entry Level' | 'Mid-Senior' | 'Lead / Executive'>('Entry Level');
  const [url, setUrl] = useState('');
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterTitle, setRecruiterTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company) return;

    const today = new Date().toISOString().split('T')[0];

    onAdd({
      title,
      company,
      location,
      isRemote: location.toLowerCase().includes('remote'),
      isRaleighHybrid: location.toLowerCase().includes('raleigh'),
      type,
      roleCategory,
      experienceLevel,
      isEntryLevel: experienceLevel === 'Entry Level',
      datePosted: today,
      dateFetched: today,
      dateFound: today,
      url: url || 'https://linkedin.com',
      recruiterName: type === 'Recruiter Post' ? recruiterName : undefined,
      recruiterTitle: type === 'Recruiter Post' ? recruiterTitle : undefined,
      description: description || `${title} position at ${company}.`,
      status: 'New',
      source: type === 'Recruiter Post' ? 'Recruiter Post' : 'Manual',
      matchScore: 88,
      primaryProfile: ['GEO / AI Search', 'Product Marketing'].includes(roleCategory) ? 'Growth' : 'Product'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 dark:bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">
              Add New Job / Recruiter Post
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs font-mono">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-bold">Listing Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as JobType)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
              >
                <option value="Direct">Direct Requisition</option>
                <option value="Recruiter Post">Recruiter Post (LinkedIn)</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-bold">Role Category</label>
              <select
                value={roleCategory}
                onChange={(e) => setRoleCategory(e.target.value as RoleCategory)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
              >
                <option value="Product Manager">Product Manager</option>
                <option value="Technical PM">Technical PM</option>
                <option value="Associate PM">Associate PM</option>
                <option value="Product Marketing">Product Marketing</option>
                <option value="Program Manager">Program Manager</option>
                <option value="GEO / AI Search">GEO / AI Search</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-bold">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
              >
                <option value="Entry Level">🎓 Entry Level / Early</option>
                <option value="Mid-Senior">Mid-Senior Level</option>
                <option value="Lead / Executive">Lead / Executive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-zinc-700 dark:text-zinc-300 block mb-1 font-bold">Job Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Associate Product Manager - AI Tooling"
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-700 dark:text-zinc-300 block mb-1 font-bold">Company *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Cisco, Databricks, Pendo"
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
              />
            </div>
            <div>
              <label className="text-zinc-700 dark:text-zinc-300 block mb-1 font-bold">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Raleigh, NC (Hybrid) or Remote"
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
              />
            </div>
          </div>

          {type === 'Recruiter Post' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 rounded-lg">
              <div>
                <label className="text-purple-800 dark:text-purple-300 block mb-1 font-bold">Recruiter Name</label>
                <input
                  type="text"
                  value={recruiterName}
                  onChange={(e) => setRecruiterName(e.target.value)}
                  placeholder="e.g. Lauren Mitchell"
                  className="w-full bg-white dark:bg-zinc-950 border border-purple-200 dark:border-purple-900/60 rounded-lg px-2.5 py-1 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-purple-800 dark:text-purple-300 block mb-1 font-bold">Recruiter Title</label>
                <input
                  type="text"
                  value={recruiterTitle}
                  onChange={(e) => setRecruiterTitle(e.target.value)}
                  placeholder="e.g. Lead Early Career Talent"
                  className="w-full bg-white dark:bg-zinc-950 border border-purple-200 dark:border-purple-900/60 rounded-lg px-2.5 py-1 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-zinc-700 dark:text-zinc-300 block mb-1 font-bold">Direct Requisition URL *</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://jobs.company.com/jobs/..."
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
            />
          </div>

          <div>
            <label className="text-zinc-700 dark:text-zinc-300 block mb-1 font-bold">Description / Post Content</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste job details or recruiter post text here..."
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 font-sans"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-bold transition-all shadow-sm"
            >
              Add Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

