import { Job, JobStatus } from './types';

export interface SheetRowData {
  dateFound: string;
  roleTitle: string;
  company: string;
  type: string;
  location: string;
  jobUrl: string;
  status: string;
  tailoredOutreach: string;
  matchScore: number;
  notes?: string;
}

export function formatJobForSheet(job: Job): SheetRowData {
  return {
    dateFound: job.dateFound || job.datePosted || new Date().toISOString().split('T')[0],
    roleTitle: job.title,
    company: job.company,
    type: job.type,
    location: job.location + (job.isRemote ? ' (Remote)' : job.isRaleighHybrid ? ' (Raleigh Hybrid)' : ''),
    jobUrl: job.url,
    status: job.status,
    tailoredOutreach: job.outreachDraft || (job.tailoredPitch ? job.tailoredPitch.join(' | ') : ''),
    matchScore: job.matchScore,
    notes: job.notes || '',
  };
}

export async function syncJobStatusToGoogleSheet(
  jobId: string, 
  newStatus: JobStatus, 
  webhookUrl?: string
): Promise<{ success: boolean; message: string }> {
  const url = webhookUrl || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;

  if (!url || url.includes('YOUR_SCRIPT_ID')) {
    // Return mock success if not configured yet, so the UI updates smoothly with optimistic updates
    return {
      success: true,
      message: 'Updated locally (Configure Google Sheet Webhook URL in Settings for remote sync)'
    };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'UPDATE_STATUS',
        id: jobId,
        status: newStatus,
        appliedDate: newStatus === 'Applied' ? new Date().toISOString().split('T')[0] : undefined
      }),
      mode: 'cors'
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    return {
      success: true,
      message: `Synced status "${newStatus}" to Google Sheet successfully`
    };
  } catch (err: any) {
    console.warn('Google Sheet sync error (falling back to local state):', err);
    return {
      success: false,
      message: `Failed to sync to Google Sheet: ${err.message || 'Network issue'}`
    };
  }
}

export async function appendJobToGoogleSheet(
  job: Job, 
  webhookUrl?: string
): Promise<{ success: boolean; message: string }> {
  const url = webhookUrl || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;

  if (!url || url.includes('YOUR_SCRIPT_ID')) {
    return {
      success: true,
      message: 'Saved locally in browser storage'
    };
  }

  try {
    const row = formatJobForSheet(job);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'APPEND_JOB',
        job: {
          id: job.id,
          ...row
        }
      }),
      mode: 'cors'
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    return {
      success: true,
      message: 'Appended listing to Google Sheet database'
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Google Sheet append failed: ${err.message}`
    };
  }
}

export async function fetchJobsFromGoogleSheet(webhookUrl?: string): Promise<Job[]> {
  const url = webhookUrl || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url || url.includes('YOUR_SCRIPT_ID')) return [];

  try {
    const res = await fetch(`${url}?action=GET_JOBS`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    });

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.jobs) ? data.jobs : [];
  } catch (e) {
    console.error('Failed to fetch from Google Sheet:', e);
    return [];
  }
}

