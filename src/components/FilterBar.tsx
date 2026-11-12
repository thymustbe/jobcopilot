'use client';

import React from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  UserCheck, 
  LayoutGrid, 
  Table as TableIcon,
  X
} from 'lucide-react';
import { RoleCategory, JobStatus, JobType } from '@/lib/types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedRoles: RoleCategory[];
  onToggleRole: (role: RoleCategory) => void;
  selectedLocations: ('Remote' | 'Raleigh/Hybrid' | 'Onsite')[];
  onToggleLocation: (loc: 'Remote' | 'Raleigh/Hybrid' | 'Onsite') => void;
  selectedType: 'All' | JobType;
  onSelectType: (type: 'All' | JobType) => void;
  selectedStatus: 'All' | JobStatus;
  onSelectStatus: (status: 'All' | JobStatus) => void;
  viewMode: 'cards' | 'table';
  onViewModeChange: (mode: 'cards' | 'table') => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const ROLE_OPTIONS: RoleCategory[] = [
  'Product Manager',
  'Technical PM',
  'Associate PM',
  'Product Marketing',
  'Program Manager',
  'GEO / AI Search',
];

const LOCATION_OPTIONS: ('Remote' | 'Raleigh/Hybrid' | 'Onsite')[] = [
  'Remote',
  'Raleigh/Hybrid',
  'Onsite',
];

const STATUS_OPTIONS: ('All' | JobStatus)[] = [
  'All',
  'New',
  'Applied',
  'Interview',
  'Rejected',
];

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedRoles,
  onToggleRole,
  selectedLocations,
  onToggleLocation,
  selectedType,
  onSelectType,
  selectedStatus,
  onSelectStatus,
  viewMode,
  onViewModeChange,
  onClearFilters,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <div className="bg-card/70 border border-cardBorder rounded-xl p-4 space-y-3.5 backdrop-blur-sm shadow-sm">
      {/* Top row: Search input, Type filter, View mode toggler */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input with keyboard shortcut indicator */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search roles, companies, tech (e.g. 'LLM', 'GEO', 'Lenovo', 'Databricks')..."
            className="w-full bg-background border border-cardBorder rounded-lg pl-9 pr-12 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/40 transition-all"
          />
          <span className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-panel border border-cardBorder rounded">
            /
          </span>
        </div>

        {/* Listing Type Filter (Direct vs Recruiter Post) */}
        <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-cardBorder">
          {(['All', 'Recruiter Post', 'Direct'] as const).map((type) => {
            const active = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => onSelectType(type)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                  active
                    ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type === 'Recruiter Post' ? 'Recruiter Posts 🎯' : type}
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-cardBorder">
          <button
            onClick={() => onViewModeChange('cards')}
            className={`p-1.5 rounded transition-all ${
              viewMode === 'cards'
                ? 'bg-slate-800 text-slate-200'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Card View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-1.5 rounded transition-all ${
              viewMode === 'table'
                ? 'bg-slate-800 text-slate-200'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Table View"
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Second row: Multi-select pill filters for Roles, Locations, Status */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-cardBorder/60">
        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1 mr-1">
          <SlidersHorizontal className="w-3 h-3" />
          ROLES:
        </span>
        {ROLE_OPTIONS.map((role) => {
          const isSelected = selectedRoles.includes(role);
          return (
            <button
              key={role}
              onClick={() => onToggleRole(role)}
              className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all border ${
                isSelected
                  ? 'bg-purple-950/60 border-purple-700/60 text-purple-300 font-medium'
                  : 'bg-background/80 border-cardBorder text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {role}
            </button>
          );
        })}

        <div className="h-4 w-px bg-cardBorder mx-1 hidden sm:block" />

        {/* Location pills */}
        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1 mr-1">
          <MapPin className="w-3 h-3" />
          LOC:
        </span>
        {LOCATION_OPTIONS.map((loc) => {
          const isSelected = selectedLocations.includes(loc);
          return (
            <button
              key={loc}
              onClick={() => onToggleLocation(loc)}
              className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all border ${
                isSelected
                  ? 'bg-cyan-950/60 border-cyan-700/60 text-cyan-300 font-medium'
                  : 'bg-background/80 border-cardBorder text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {loc}
            </button>
          );
        })}

        <div className="h-4 w-px bg-cardBorder mx-1 hidden sm:block" />

        {/* Status Dropdown / Pills */}
        <span className="text-[11px] font-mono text-slate-500 mr-1">STATUS:</span>
        {STATUS_OPTIONS.map((st) => {
          const isSelected = selectedStatus === st;
          return (
            <button
              key={st}
              onClick={() => onSelectStatus(st)}
              className={`px-2 py-0.5 rounded text-xs font-mono transition-all ${
                isSelected
                  ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          );
        })}

        {/* Reset / Clear Filters button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="ml-auto text-xs font-mono text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

