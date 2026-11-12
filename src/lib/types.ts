export type JobType = 'Direct' | 'Recruiter Post';

export type JobStatus = 'New' | 'Saved' | 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Archived' | 'Reported';

export type RoleCategory = 
  | 'Product Manager'
  | 'Technical PM'
  | 'Associate PM'
  | 'Product Marketing'
  | 'Program Manager'
  | 'GEO / AI Search'
  | 'Other';

export type ExperienceLevel = 'Entry Level' | 'Mid-Senior' | 'Lead / Executive';

export type JobSource = 
  | 'JobSpy' 
  | 'LinkedIn' 
  | 'Indeed' 
  | 'Glassdoor' 
  | 'ZipRecruiter' 
  | 'Recruiter Post' 
  | 'Manual';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  isRaleighHybrid: boolean;
  type: JobType;
  experienceLevel: ExperienceLevel;
  isEntryLevel: boolean;
  isStemOptFriendly?: boolean;
  datePosted: string;
  dateFetched: string;
  dateFound?: string; // backwards compatibility
  recruiterName?: string;
  recruiterTitle?: string;
  recruiterProfileUrl?: string;
  recruiterPostSnippet?: string;
  url: string;
  source: JobSource;
  roleCategory: RoleCategory;
  status: JobStatus;
  appliedDate?: string;
  salarySnippet?: string;
  description: string;
  matchScore: number;
  primaryProfile: 'Product' | 'Growth';
  matchedKeywords: string[];
  tailoredPitch?: string[];
  outreachDraft?: string;
  notes?: string;
}

export interface CandidateDossier {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  degree: string;
  school: string;
  gpa: string;
  graduationDate: string;
  workAuthorization: string;
  certifications: string[];
  technicalSkills: string[];
  profiles: {
    product: {
      summary: string;
      targetTitles: string[];
      coreHighlights: string[];
      featuredAchievement: string;
    };
    growth: {
      summary: string;
      targetTitles: string[];
      coreHighlights: string[];
      featuredAchievement: string;
    };
  };
}

export interface CopilotAssets {
  linkedinDMs: {
    short: string;
    metrics: string;
    referral: string;
  };
  coverLetters: {
    standard: string;
    product: string;
    growth: string;
  };
  pitchBullets?: string[];
  outreachDrafts?: {
    direct: string;
    metric: string;
    referral: string;
    casual: string;
  };
  screeningAnswers?: {
    workAuth: string;
    elevatorPitch: string;
    leadershipStory: string;
    aiTechnicalStory: string;
    whyCompany: string;
    salary: string;
  };
  matchAnalysis: {
    score: number;
    profile: 'Product' | 'Growth';
    matchedKeywords: string[];
    missingKeywords: string[];
    strategicAdvice: string;
  };
}
