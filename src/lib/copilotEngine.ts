import { Job, CopilotAssets } from './types';
import { MANAV_PROFILE } from './candidateProfile';

interface KeywordWeight {
  term: string;
  category: 'product' | 'growth' | 'tech' | 'leadership';
  weight: number;
}

const KEYWORD_BANK: KeywordWeight[] = [
  { term: 'product manager', category: 'product', weight: 15 },
  { term: 'product', category: 'product', weight: 8 },
  { term: 'roadmap', category: 'product', weight: 10 },
  { term: 'agile', category: 'product', weight: 8 },
  { term: 'scrum', category: 'product', weight: 10 },
  { term: 'cspo', category: 'product', weight: 12 },
  { term: 'sprint', category: 'product', weight: 7 },
  { term: 'user stories', category: 'product', weight: 8 },
  { term: 'ux', category: 'product', weight: 7 },
  { term: 'geo', category: 'growth', weight: 18 },
  { term: 'ai search', category: 'growth', weight: 16 },
  { term: 'generative engine optimization', category: 'growth', weight: 20 },
  { term: 'seo', category: 'growth', weight: 12 },
  { term: 'product marketing', category: 'growth', weight: 15 },
  { term: 'pmm', category: 'growth', weight: 15 },
  { term: 'gtm', category: 'growth', weight: 12 },
  { term: 'go-to-market', category: 'growth', weight: 12 },
  { term: 'cro', category: 'growth', weight: 12 },
  { term: 'conversion rate', category: 'growth', weight: 10 },
  { term: 'llm', category: 'growth', weight: 14 },
  { term: 'ai', category: 'growth', weight: 8 },
  { term: 'python', category: 'tech', weight: 10 },
  { term: 'sql', category: 'tech', weight: 10 },
  { term: 'analytics', category: 'growth', weight: 8 },
  { term: 'program manager', category: 'leadership', weight: 12 },
  { term: 'cross-functional', category: 'leadership', weight: 8 },
  { term: 'leadership', category: 'leadership', weight: 8 },
  { term: 'kpi', category: 'product', weight: 6 },
  { term: 'okr', category: 'product', weight: 6 },
];

export function analyzeJobFit(job: Job, overrideProfile?: 'Product' | 'Growth'): {
  score: number;
  profile: 'Product' | 'Growth';
  matchedKeywords: string[];
  missingKeywords: string[];
  strategicAdvice: string;
} {
  const text = `${job.title} ${job.description} ${job.company}`.toLowerCase();
  
  const matched: string[] = [];
  let productScore = 0;
  let growthScore = 0;
  let generalScore = 30; // base score for candidate pedigree

  for (const kw of KEYWORD_BANK) {
    if (text.includes(kw.term.toLowerCase())) {
      matched.push(kw.term);
      if (kw.category === 'product') productScore += kw.weight;
      else if (kw.category === 'growth') growthScore += kw.weight;
      else {
        productScore += kw.weight * 0.7;
        growthScore += kw.weight * 0.7;
      }
    }
  }

  const determinedProfile: 'Product' | 'Growth' = overrideProfile 
    ? overrideProfile 
    : (growthScore > productScore ? 'Growth' : 'Product');

  const rawScore = generalScore + (determinedProfile === 'Growth' ? growthScore : productScore);
  const normalizedScore = Math.min(98, Math.max(65, Math.round(rawScore)));

  // Identify strategic opportunities
  const missingKeywords: string[] = [];
  if (!matched.includes('sql')) missingKeywords.push('Data-driven SQL querying');
  if (!matched.includes('cspo') && !matched.includes('agile')) missingKeywords.push('CSPO Agile sprint governance');
  if (!matched.includes('geo') && determinedProfile === 'Growth') missingKeywords.push('AI citation engine benchmarking');

  let strategicAdvice = "";
  if (determinedProfile === 'Growth') {
    strategicAdvice = "Anchor conversation on Lenovo's 40%→65%+ AI citation growth and Times Algo's conversion optimization frameworks. Position as an AI-native growth strategist.";
  } else {
    strategicAdvice = "Emphasize 5+ years of Managing Director product delivery at Times Algo combined with NC State Master of Engineering Management analytical rigor and CSPO certification.";
  }

  return {
    score: normalizedScore,
    profile: determinedProfile,
    matchedKeywords: Array.from(new Set(matched)),
    missingKeywords,
    strategicAdvice
  };
}

export function generateTailoredCopilotAssets(job: Job, targetProfile?: 'Product' | 'Growth'): CopilotAssets {
  const analysis = analyzeJobFit(job, targetProfile);
  const companyName = job.company || 'your team';
  const roleName = job.title;
  const recruiter = job.recruiterName || 'Hiring Lead';
  const recruiterFirstName = recruiter.split(' ')[0] || 'Hiring Manager';

  // 1. LinkedIn DMs (exact formatting preferred by user)
  const linkedinShort = `Hi ${recruiterFirstName}, \n\nKeeping it short:\n\nAbout me\n>Engg. Management Grad Student @ NC State\n>5+ YOE in products, customer growth\n>Summer '26 intern @ Lenovo\n>Fall '26 intern @ Invisa\n\nApplied for ${roleName} @ ${companyName}.\n\nWould love this opportunity and your guidance. :)\n\nBest,\nManav`;

  const linkedinMetrics = `Hi ${recruiterFirstName}, \n\nKeeping it short:\n\nAbout me\n>Engg. Management Grad Student @ NC State (BS in Computer Science)\n>5+ YOE Founder & product lifecycle leadership\n>Lenovo AI Search (benchmarked 6 LLMs, lifted citation share to 65%)\n>Growth Lead Intern @ INVISA (customer discovery, feature PRDs, GTM waitlist growth)\n\nApplied for ${roleName} @ ${companyName}.\n\nWould love this opportunity and your guidance. :)\n\nBest,\nManav`;

  const linkedinReferral = `Hi ${recruiterFirstName}, \n\nHope you're having a great week!\n\nAbout me\n>Engg. Management Grad Student @ NC State\n>5+ YOE in products, customer growth\n>Summer '26 intern @ Lenovo\n>Fall '26 intern @ Invisa\n\nI noticed the open ${roleName} role @ ${companyName} and recently submitted my application. Would love to learn more about the team's roadmap and would deeply appreciate your guidance. :)\n\nBest,\nManav`;

  // 2. Cover Letter / Email (exact formatting preferred by user)
  const coverLetterStandard = `Hi ${recruiterFirstName},\n\nI am writing to express my strong interest in the ${roleName} role at ${companyName}. \n\nAbout me\nEngineering Management Master’s Student @ NC State (BS in Computer Science)   \nGrowth Lead Intern @ INVISA (customer discovery, feature requirements, GTM waitlist growth)\nEx-Lenovo Intern (benchmarked 6 LLMs, lifting AI citation share to 65%) | 5+ YOE Founder   \n\nWhat I bring:\nTechnical Storytelling: Translated complex schemas and data pipelines into high-converting sales collateral and customer proof points.\nData Fluency: Hands-on with SQL and Python to analyze product metrics, validate impact, and ground narratives in empirical outcomes.\nCross-Functional Execution: Partnered across engineering and sales to coordinate product rollouts and launch readiness.\n\nI’ve attached my resume and am available full-time starting in January. I’d love the chance to connect.\n\nBest regards,\nManav Sharma\n\nLinkedIn: https://linkedin.com/in/mnvsharma\nPortfolio: https://mnvsharma.com`;

  const coverLetterProduct = `Hi ${recruiterFirstName},\n\nI am writing to express my strong interest in the ${roleName} role at ${companyName}. \n\nAbout me\nEngineering Management Master’s Student @ NC State (BS in Computer Science)   \nGrowth Lead Intern @ INVISA (customer discovery, feature requirements, GTM waitlist growth)\nEx-Lenovo Intern (benchmarked 6 LLMs, lifting AI citation share to 65%) | 5+ YOE Founder   \n\nWhat I bring:\nProduct Roadmapping & PRDs: Led cross-functional agile development from 0-to-1, prioritizing sprint backlogs via customer telemetry and market signals.\nData Fluency: Hands-on with SQL and Python to analyze product metrics, validate impact, and ground narratives in empirical outcomes.\nCross-Functional Execution: Partnered across engineering and sales to coordinate product rollouts and launch readiness.\n\nI’ve attached my resume and am available full-time starting in January. I’d love the chance to connect.\n\nBest regards,\nManav Sharma\n\nLinkedIn: https://linkedin.com/in/mnvsharma\nPortfolio: https://mnvsharma.com`;

  const coverLetterGrowth = `Hi ${recruiterFirstName},\n\nI am writing to express my strong interest in the ${roleName} role at ${companyName}. \n\nAbout me\nEngineering Management Master’s Student @ NC State (BS in Computer Science)   \nGrowth Lead Intern @ INVISA (customer discovery, feature requirements, GTM waitlist growth)\nEx-Lenovo Intern (benchmarked 6 LLMs, lifting AI citation share to 65%) | 5+ YOE Founder   \n\nWhat I bring:\nTechnical Storytelling: Translated complex schemas and data pipelines into high-converting sales collateral and customer proof points.\nGenerative Engine Optimization (GEO): Benchmarked 6 LLMs at Lenovo, engineering semantic schema models that lifted brand AI citation share from 40% to 65%+.\nCross-Functional Execution: Partnered across engineering and sales to coordinate product rollouts and launch readiness.\n\nI’ve attached my resume and am available full-time starting in January. I’d love the chance to connect.\n\nBest regards,\nManav Sharma\n\nLinkedIn: https://linkedin.com/in/mnvsharma\nPortfolio: https://mnvsharma.com`;

  return {
    linkedinDMs: {
      short: linkedinShort,
      metrics: linkedinMetrics,
      referral: linkedinReferral
    },
    coverLetters: {
      standard: coverLetterStandard,
      product: coverLetterProduct,
      growth: coverLetterGrowth
    },
    outreachDrafts: {
      direct: linkedinShort,
      metric: linkedinMetrics,
      referral: linkedinReferral,
      casual: linkedinShort
    },
    matchAnalysis: analysis
  };
}

