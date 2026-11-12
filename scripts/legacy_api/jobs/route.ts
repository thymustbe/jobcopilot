import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Job, JobStatus } from '@/lib/types';
import { syncJobStatusToGoogleSheet } from '@/lib/googleSheets';

const SEED_PATH = path.join(process.cwd(), 'public', 'data', 'seed_jobs.json');

function readJobsFromFile(): Job[] {
  try {
    if (fs.existsSync(SEED_PATH)) {
      const data = fs.readFileSync(SEED_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading jobs file:', e);
  }
  return [];
}

function writeJobsToFile(jobs: Job[]) {
  try {
    const dir = path.dirname(SEED_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SEED_PATH, JSON.stringify(jobs, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving jobs file:', e);
  }
}

export async function GET(req: NextRequest) {
  const jobs = readJobsFromFile();
  return NextResponse.json({ success: true, jobs });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const jobs = readJobsFromFile();

    const today = new Date().toISOString().split('T')[0];
    const isEntry = body.isEntryLevel ?? (body.experienceLevel === 'Entry Level' || (body.title || '').toLowerCase().includes('associate') || (body.title || '').toLowerCase().includes('junior'));
    const expLevel = body.experienceLevel || (isEntry ? 'Entry Level' : 'Mid-Senior');

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: body.title || 'Untitled Role',
      company: body.company || 'Unknown Company',
      location: body.location || 'Remote',
      isRemote: body.isRemote ?? true,
      isRaleighHybrid: body.isRaleighHybrid ?? false,
      type: body.type || 'Direct',
      experienceLevel: expLevel,
      isEntryLevel: isEntry,
      datePosted: body.datePosted || today,
      dateFetched: body.dateFetched || today,
      dateFound: body.dateFound || today,
      recruiterName: body.recruiterName,
      recruiterTitle: body.recruiterTitle,
      recruiterProfileUrl: body.recruiterProfileUrl,
      recruiterPostSnippet: body.recruiterPostSnippet,
      url: body.url || '#',
      source: body.source || 'Manual',
      roleCategory: body.roleCategory || 'Product Manager',
      status: 'New',
      salarySnippet: body.salarySnippet,
      description: body.description || '',
      matchScore: body.matchScore || 85,
      primaryProfile: body.primaryProfile || 'Product',
      matchedKeywords: body.matchedKeywords || ['product'],
      notes: body.notes
    };

    jobs.unshift(newJob);
    writeJobsToFile(jobs);

    return NextResponse.json({ success: true, job: newJob });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes, tailoredPitch, outreachDraft } = body;

    const jobs = readJobsFromFile();
    const index = jobs.findIndex(j => j.id === id || j.url === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    if (status) {
      jobs[index].status = status as JobStatus;
      if (status === 'Applied') {
        jobs[index].appliedDate = new Date().toISOString().split('T')[0];
      }
    }
    if (notes !== undefined) jobs[index].notes = notes;
    if (tailoredPitch) jobs[index].tailoredPitch = tailoredPitch;
    if (outreachDraft) jobs[index].outreachDraft = outreachDraft;

    writeJobsToFile(jobs);

    // Trigger Google Sheet sync asynchronously in background
    syncJobStatusToGoogleSheet(id, status as JobStatus).catch(err => {
      console.warn('Background Google Sheet sync warning:', err);
    });

    return NextResponse.json({ success: true, job: jobs[index] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

