import { NextRequest, NextResponse } from 'next/server';
import { generateTailoredCopilotAssets } from '@/lib/copilotEngine';
import { Job } from '@/lib/types';
import { MANAV_PROFILE } from '@/lib/candidateProfile';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { job, targetProfile, customInstruction, apiKey } = body as {
      job: Job;
      targetProfile?: 'Product' | 'Growth';
      customInstruction?: string;
      apiKey?: string;
    };

    if (!job) {
      return NextResponse.json({ success: false, error: 'Job data required' }, { status: 400 });
    }

    // Heuristic base generation
    const baseAssets = generateTailoredCopilotAssets(job, targetProfile);

    // If Gemini API Key is provided, dynamically synthesize advanced AI refinements
    const geminiKey = apiKey || process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const prompt = `
You are an expert executive career coach helping Manav Sharma tailor his application materials.
Candidate Dossier:
- Name: Manav Sharma
- Master of Engineering Management (MEM) at NC State (GPA 3.67/4.0, Graduating May 2027)
- Ex-Managing Director at Times Algo (5+ years leading digital product lifecycles, GTM strategy, and conversion rate optimization)
- AI Search Intern at Lenovo (benchmarked 6 LLMs, scaled Generative Engine Optimization (GEO) content strategies and schema optimizations, boosting AI citation share from 40% to 65%+)
- Certifications: Certified Scrum Product Owner (CSPO), AWS Certified AI Practitioner, Google UX Design
- Technical Skills: Python, SQL, Next.js, React, Tailwind CSS, Google Analytics, SEO/GEO frameworks

Target Job Listing:
- Title: ${job.title}
- Company: ${job.company}
- Type: ${job.type} (${job.recruiterName ? `Recruiter: ${job.recruiterName}` : 'Direct'})
- Role Category: ${job.roleCategory}
- Description: ${job.description}
- Profile Mode: ${targetProfile || baseAssets.matchAnalysis.profile}
${customInstruction ? `Custom Instruction: ${customInstruction}` : ''}

Generate JSON with:
1. "pitchBullets": array of 3 ultra-targeted bullet points matching Manav's background directly to the job requirements.
2. "directOutreach": a concise LinkedIn DM under 75 words directly addressed to the recruiter/hiring manager.
3. "screeningAnswer": answer to "Why should we hire you for this role?" (120-150 words).

Output ONLY raw JSON with keys: pitchBullets, directOutreach, screeningAnswer.
`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.2
            }
          })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            if (Array.isArray(parsed.pitchBullets)) {
              baseAssets.pitchBullets = parsed.pitchBullets;
            }
            if (parsed.directOutreach) {
              if (!baseAssets.outreachDrafts) {
                baseAssets.outreachDrafts = { direct: '', metric: '', referral: '', casual: '' };
              }
              baseAssets.outreachDrafts.direct = parsed.directOutreach;
              baseAssets.linkedinDMs.short = parsed.directOutreach;
            }
            if (parsed.screeningAnswer) {
              if (!baseAssets.screeningAnswers) {
                baseAssets.screeningAnswers = { 
                  workAuth: '', 
                  elevatorPitch: '', 
                  leadershipStory: '', 
                  aiTechnicalStory: '', 
                  whyCompany: '', 
                  salary: '' 
                };
              }
              baseAssets.screeningAnswers.elevatorPitch = parsed.screeningAnswer;
            }
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini dynamic enhancement failed, falling back to algorithmic assets:', geminiErr);
      }
    }

    return NextResponse.json({
      success: true,
      assets: baseAssets
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

