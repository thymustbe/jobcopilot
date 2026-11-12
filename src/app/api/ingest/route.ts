import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Job, RoleCategory } from '@/lib/types';
import { analyzeJobFit } from '@/lib/copilotEngine';
import { appendJobToGoogleSheet } from '@/lib/googleSheets';

const SEED_PATH = path.join(process.cwd(), 'public', 'data', 'seed_jobs.json');

const TARGET_COMPANIES = ['pendo', 'databricks', 'cloudflare', 'gitlab', 'stripe'];

const TARGET_KEYWORD_PATTERNS = [
  'product manager',
  'technical product manager',
  'associate product manager',
  'product marketing',
  'program manager',
  'technical program manager',
  'ai search',
  'geo',
  'generative engine',
  'seo'
];

function categorizeRole(title: string): RoleCategory {
  const lower = title.toLowerCase();
  if (lower.includes('technical product manager') || lower.includes('tpm')) return 'Technical PM';
  if (lower.includes('associate product manager') || lower.includes('apm')) return 'Associate PM';
  if (lower.includes('product marketing') || lower.includes('pmm')) return 'Product Marketing';
  if (lower.includes('geo') || lower.includes('ai search') || lower.includes('generative engine')) return 'GEO / AI Search';
  if (lower.includes('program manager')) return 'Program Manager';
  return 'Product Manager';
}

export async function POST(req: NextRequest) {
  try {
    let existing: Job[] = [];
    if (fs.existsSync(SEED_PATH)) {
      existing = JSON.parse(fs.readFileSync(SEED_PATH, 'utf-8'));
    }

    const existingUrls = new Set(existing.map(j => j.url));
    const newlyDiscovered: Job[] = [];

    // Query real public Greenhouse ATS boards
    for (const company of TARGET_COMPANIES) {
      try {
        const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${company}/jobs`, {
          headers: { 'Accept': 'application/json' },
          next: { revalidate: 3600 }
        });
        if (res.ok) {
          const data = await res.json();
          const jobs = data.jobs || [];

          for (const item of jobs) {
            const title = item.title || '';
            const titleLower = title.toLowerCase();

            if (!TARGET_KEYWORD_PATTERNS.some(k => titleLower.includes(k))) {
              continue;
            }

            const url = item.absolute_url || `https://boards.greenhouse.io/${company}/jobs/${item.id}`;
            if (existingUrls.has(url)) continue;

            // Strictly exclude internships and co-ops (user is seeking permanent full-time roles)
            if (
              titleLower.includes('intern') || 
              titleLower.includes('internship') || 
              titleLower.includes('co-op') || 
              titleLower.includes('coop') || 
              titleLower.includes('fellow') ||
              titleLower.includes('part-time')
            ) {
              continue;
            }

            // Exclude sales/quota roles that accidentally matched keywords
            if (titleLower.includes('account executive') || titleLower.includes('sales representative') || titleLower.includes('sales engineer')) {
              continue;
            }

            const locName = (item.location?.name || 'Remote (US)');
            const locLower = locName.toLowerCase();

            // Exclude non-US locations (candidate is in the US on F-1 STEM OPT visa)
            const nonUsLocations = ['israel', 'germany', 'france', 'united kingdom', 'london', 'lisbon', 'tokyo', 'japan', 'singapore', 'australia', 'sydney', 'india', 'bangalore', 'berlin', 'paris', 'dublin', 'ireland', 'canada', 'toronto', 'vancouver', 'netherlands', 'amsterdam', 'spain', 'madrid', 'barcelona', 'belgrade', 'serbia', 'romania', 'bucharest', 'mexico', 'auckland', 'new zealand'];
            if (nonUsLocations.some(k => locLower.includes(k))) {
              continue;
            }

            const isRemote = locLower.includes('remote') || locLower.includes('united states') || locLower.includes('us');
            const isRaleigh = locLower.includes('raleigh') || locLower.includes('nc') || locLower.includes('durham') || locLower.includes('triangle');

            const roleCategory = categorizeRole(title);
            const isEntry = titleLower.includes('associate') || titleLower.includes('junior') || titleLower.includes('entry') || titleLower.includes('early') || titleLower.includes('new grad') || titleLower.includes('apm');
            const isLead = titleLower.includes('lead') || titleLower.includes('principal') || titleLower.includes('director') || titleLower.includes('staff') || titleLower.includes('vp');
            const experienceLevel = isEntry ? 'Entry Level' : isLead ? 'Lead / Executive' : 'Mid-Senior';
            const today = new Date().toISOString().split('T')[0];

            const newJob: Job = {
              id: `gh-live-${company}-${item.id}`,
              title,
              company: company.charAt(0).toUpperCase() + company.slice(1),
              location: locName,
              isRemote,
              isRaleighHybrid: isRaleigh,
              type: 'Direct',
              experienceLevel,
              isEntryLevel: isEntry,
              isStemOptFriendly: true,
              datePosted: today,
              dateFetched: today,
              dateFound: today,
              url,
              source: 'JobSpy',
              roleCategory,
              status: 'New',
              salarySnippet: undefined,
              description: `Real-time open requisition at ${company.toUpperCase()} for ${title}. Location: ${locName}. Apply directly on their Greenhouse career portal. Eligible for F-1 STEM OPT (3-year work authorization).`,
              matchScore: 92,
              primaryProfile: ['GEO / AI Search', 'Product Marketing'].includes(roleCategory) ? 'Growth' : 'Product',
              matchedKeywords: ['product', 'agile', 'roadmap']
            };

            const fit = analyzeJobFit(newJob);
            newJob.matchScore = fit.score;
            newJob.matchedKeywords = fit.matchedKeywords;

            newlyDiscovered.push(newJob);
            existingUrls.add(url);
          }
        }
      } catch (e) {
        console.warn(`Greenhouse fetch error for ${company}:`, e);
      }
    }

    if (newlyDiscovered.length > 0) {
      existing = [...newlyDiscovered, ...existing];
      fs.writeFileSync(SEED_PATH, JSON.stringify(existing, null, 2), 'utf-8');

      // Append to Google Sheet if configured
      for (const j of newlyDiscovered) {
        appendJobToGoogleSheet(j).catch(() => {});
      }
    }

    return NextResponse.json({
      success: true,
      addedCount: newlyDiscovered.length,
      jobs: newlyDiscovered,
      totalCount: existing.length
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
