# Job Copilot // Manav Sharma

> **Zero-Cost, Responsive Personal Job Aggregator & Application Copilot** built with **Next.js, Tailwind CSS, TypeScript**, and a **Google Sheet Database Backend**.

Designed specifically for **Manav Sharma** (Master of Engineering Management at NC State, Ex-Managing Director at Times Algo, Lenovo AI Search Intern, CSPO, AWS AI Practitioner, Google UX Design).

---

## 🎯 Target Roles & Candidate Context

### Target Titles
* **Product Management:** Product Manager, Associate Product Manager (APM), Technical Product Manager (TPM)
* **Program Management:** Program Manager, Technical Program Manager (TPM)
* **Growth & Marketing:** Product Marketing Manager (PMM), Marketing Manager
* **AI Search & Discovery:** SEO / Generative Engine Optimization (GEO) / AI Search Manager

### Candidate Profile (Manav Sharma)
* **Education:** Master of Engineering Management (MEM) at North Carolina State University (NC State), GPA **3.67 / 4.0**, graduating **May 2027**.
* **Leadership Experience:** Ex-Managing Director at **Times Algo** (5+ years leading digital product lifecycles, GTM strategy, cross-functional engineering execution, and conversion rate optimization).
* **AI Search Experience:** AI Search Intern at **Lenovo** (benchmarked 6 frontier LLMs, engineered GEO semantic schemas and content strategies, expanding brand AI citation share from **40% to 65%+**).
* **Certifications:** Certified Scrum Product Owner (**CSPO**), **AWS Certified AI Practitioner**, **Google UX Design**.
* **Technical Skills:** Python, SQL (BigQuery/PostgreSQL), Next.js, React, Tailwind CSS, Google Analytics 4, Schema.org, SEO/GEO frameworks.
* **Work Authorization:** F-1 STEM OPT Eligible (**3 years US work authorization** without immediate H-1B sponsorship required).

---

## ⚡ Core Functional Modules

```
                    ┌────────────────────────────────────────────────────────┐
                    │                   JOB COPILOT ENGINE                   │
                    └──────────────────────────┬─────────────────────────────┘
                                               │
       ┌───────────────────────────────────────┼────────────────────────────────────────┐
       │                                       │                                        │
┌──────▼──────────────────────────┐  ┌─────────▼───────────────────────────┐  ┌─────────▼──────────────────────────┐
│    Job Ingestion & Discovery    │  │     Google Sheet Database DB        │  │     Side-by-Side App Copilot       │
│                                 │  │                                     │  │                                    │
│ • python-jobspy multi-board     │  │ • Zero-cost Google Apps Script      │  │ • Dual-Profile Toggler:            │
│   (LinkedIn, Indeed, Glassdoor) │  │   Webhook backend                   │  │   Product/TPM vs Growth/GEO        │
│ • LinkedIn Recruiter Post       │  │ • gspread / Google Sheets API v4    │  │ • Customized 3-Bullet Pitch        │
│   Filter ("we're hiring", "DM") │  │ • Automatic schema formatting       │  │ • High-Conversion Recruiter DMs    │
│ • Raleigh Hybrid & Remote flags │  │ • Real-time status update sync      │  │ • Pre-filled Screening Form Answers│
└─────────────────────────────────┘  └─────────────────────────────────────┘  └────────────────────────────────────┘
```

### 1. Job Ingestion & Discovery Engine
* **`scripts/jobspy_ingest.py`**: Automated pipeline powered by `python-jobspy` searching for target roles across Raleigh-Durham and Remote US.
* **`scripts/linkedin_recruiter_scraper.py`**: Dedicated parser capturing hidden job posts shared directly by recruiters and hiring managers using trigger patterns:
  `"we're hiring"`, `"hiring for my team"`, `"DM me"`, `"looking for an APM"`, `"drop your resume"`.

### 2. Google Sheet Database Integration
* Connects directly to Google Sheets with standardized columns:
  `Date Found | Role Title | Company | Type | Location | Job URL | Status | Tailored Outreach / Pitch | Match Score | Primary Profile | Recruiter Info | Applied Date | Notes`
* Includes **`google-apps-script/Code.gs`** which provides a **100% free serverless backend**:
  - No Google Cloud billing required
  - Deployable in 30 seconds
  - Serves REST endpoints for `APPEND_JOB`, `UPDATE_STATUS`, and `GET_JOBS`
* **Real-time optimistic UI update**: Clicking *"Mark as Applied"* instantly updates local UI state, triggers visual confetti feedback, and syncs status to Google Sheets in the background.

### 3. Application Copilot (Side-by-Side Panel)
* **Dual-Profile Switcher**: Dynamically re-scores and re-aligns application materials for either **Product-focused** (Times Algo MD, CSPO, Agile roadmaps) or **Growth/GEO-focused** (Lenovo 6-LLM benchmarks, citation lift 40%→65%+, CRO).
* **3-Bullet Point Alignment Pitch**: Synthesizes laser-focused bullet points combining leadership scale, AI technical depth, and NC State MEM academic rigor.
* **High-Conversion Recruiter DMs**: Ready-to-send messages tailored with 4 tone variants:
  1. *Direct (<75 words)* — optimized for free LinkedIn connection note limits
  2. *Metric-Driven* — Lenovo 40%→65% citation lift & Times Algo 5-yr scale
  3. *Referral / Coffee Chat* — warm networking approach
  4. *Casual DM* — low-friction hiring manager outreach
* **Screening Form Assistant**: Pre-filled answers for standard application questions:
  - Work Authorization & F-1 STEM OPT status
  - Elevator Pitch / "Why should we hire you?"
  - Leadership & Cross-functional sprint story
  - AI & Technical problem-solving story
  - "Why this company?"
  - Salary expectation
* **Gemini AI Dynamic Refinement**: Built-in support for Gemini 2.5 Flash via `/api/copilot` for custom prompt adjustments.

### 4. Developer UI & Dashboard
* Dark-mode developer interface (`#080a0f`, `#0d111a`, cyber accents).
* Instant multi-select filters for roles, locations (Remote / Raleigh Hybrid), type, and status.
* Keyboard navigation:
  - `/` : Focus search input
  - `J` / `K` : Navigate next / previous job
  - `A` : Mark selected role as Applied
  - `Esc` : Close copilot panel

---

## 🚀 Quick Start Guide

### Option A: Interactive Standalone Preview (Zero Install Required)
You can immediately preview and interact with the application:
1. Open `standalone-preview/index.html` in Google Chrome or any browser:
   ```bash
   open standalone-preview/index.html
   ```
2. Test instant filtering, open the Application Copilot side panel, toggle dual profiles, generate pitches, and test marking roles as applied!

### Option B: Run the Full Next.js Application
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   *(Optional: Add your Google Sheet Webhook URL or Gemini API Key)*
3. **Start local dev server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 30-Second Google Sheet Database Setup

1. Create a new Google Sheet at **[sheets.new](https://sheets.new)** and title it `Job Tracker - Copilot DB`.
2. In the menu, go to **Extensions > Apps Script**.
3. Replace any code with the contents of **[`google-apps-script/Code.gs`](file:///Users/shreensharma/Desktop/Workstation/Websites/JOB/google-apps-script/Code.gs)**.
4. Click **Deploy > New deployment**:
   * Select type: **Web app**
   * Execute as: **Me**
   * Who has access: **Anyone**
5. Copy the generated **Web App URL** (ends in `/exec`).
6. In the Job Copilot app, click the **Connect Google Sheet** button in the top navbar and paste your URL.
7. That's it! All newly ingested jobs and status changes will now sync automatically to your personal Google Sheet at zero cost.

---

## 🐍 Running the Ingestion Scrapers

To run the open-source scrapers (`python-jobspy` & LinkedIn Recruiter filter):

```bash
# 1. Install scraper requirements
pip install -r scripts/requirements.txt

# 2. Run the LinkedIn Recruiter Post Filter
python3 scripts/linkedin_recruiter_scraper.py

# 3. Run the JobSpy multi-board aggregator
python3 scripts/jobspy_ingest.py
```

---

## 📁 Repository Structure

```
JOB/
├── .env.example                       # Environment template
├── package.json                       # Next.js & React dependencies
├── tsconfig.json                      # TypeScript configuration
├── tailwind.config.ts                 # Dark developer theme styling
├── postcss.config.js                  # PostCSS plugins
├── standalone-preview/
│   └── index.html                     # Instant interactive browser preview
├── google-apps-script/
│   ├── Code.gs                        # Zero-cost Google Sheet Webhook backend
│   └── README.md                      # Apps script deployment guide
├── public/
│   └── data/
│       └── seed_jobs.json             # Seed job & recruiter post dataset
├── scripts/
│   ├── requirements.txt               # Python scraper dependencies
│   ├── jobspy_ingest.py               # python-jobspy multi-board scraper
│   ├── linkedin_recruiter_scraper.py  # LinkedIn recruiter post keyword filter
│   └── google_sheets_setup.py         # gspread service account setup script
└── src/
    ├── app/
    │   ├── layout.tsx                 # Root layout & metadata
    │   ├── page.tsx                   # Main dashboard & copilot layout
    │   ├── globals.css                # Dark mode styling & glow effects
    │   └── api/
    │       ├── jobs/route.ts          # GET/POST/PATCH jobs & Google Sheet sync
    │       ├── ingest/route.ts        # Recruiter post discovery endpoint
    │       └── copilot/route.ts       # Dynamic pitch & Gemini refinement
    ├── components/
    │   ├── Header.tsx                 # Brand, profile chips, global actions
    │   ├── StatsBar.tsx               # Velocity metrics & pipeline counters
    │   ├── FilterBar.tsx              # Multi-select filters & search
    │   ├── JobCard.tsx                # Card listing with recruiter callouts
    │   ├── JobTable.tsx               # High-density developer table
    │   ├── ApplicationCopilot.tsx     # Flagship side-by-side copilot drawer
    │   ├── SettingsModal.tsx          # Google Sheet & Gemini configuration
    │   ├── AddJobModal.tsx            # Manual listing / recruiter post adder
    │   └── Toast.tsx                  # Action feedback notification
    └── lib/
        ├── types.ts                   # TypeScript interfaces
        ├── candidateProfile.ts        # Manav Sharma candidate dossier
        ├── copilotEngine.ts           # Algorithmic pitch & outreach synthesizer
        ├── googleSheets.ts            # Google Sheets sync adapter
        └── utils.ts                   # Styling & date helpers
```

