#!/usr/bin/env python3
"""
LinkedIn Recruiter Post Filter & Discovery Engine
Captures hidden job postings shared directly by recruiters and hiring managers
using keyword matching and dedicated post inspection.
"""

import re
import json
import os
import sys
from datetime import datetime
from typing import List, Dict, Any

RECRUITER_INTENT_KEYWORDS = [
  r"\bwe(?:'re| are)\s+hiring\b",
  r"\bhiring\s+for\s+my\s+team\b",
  r"\bmy\s+team\s+is\s+looking\s+for\b",
  r"\blooking\s+for\s+an?\s+(?:apm|pm|product manager|tpm|pmm)\b",
  r"\b(dm|message|inmail)\s+me\b",
  r"\bsend\s+me\s+your\s+resume\b",
  r"\bdrop\s+your\s+resume\b",
  r"\bshare\s+with\s+your\s+network\b",
  r"\bjoin\s+our\s+team\b",
  r"\bhiring\s+manager\b",
  r"\bteam\s+is\s+growing\b",
]

TARGET_ROLE_PATTERNS = [
  (r"technical\s+product\s+manager", "Technical PM"),
  (r"associate\s+product\s+manager|\bapm\b", "Associate PM"),
  (r"product\s+marketing\s+manager|\bpmm\b", "Product Marketing"),
  (r"technical\s+program\s+manager|\btpm\b", "Program Manager"),
  (r"program\s+manager", "Program Manager"),
  (r"geo|generative\s+engine\s+optimization|ai\s+search", "GEO / AI Search"),
  (r"product\s+manager|\bpm\b", "Product Manager"),
  (r"marketing\s+manager", "Product Marketing"),
]

def is_recruiter_hiring_post(text: str) -> bool:
  """Check if post text contains recruiter/hiring manager hiring intent."""
  lower_text = text.lower()
  for pattern in RECRUITER_INTENT_KEYWORDS:
    if re.search(pattern, lower_text):
      return True
  return False

def extract_role_category(text: str) -> str:
  lower_text = text.lower()
  for pattern, cat in TARGET_ROLE_PATTERNS:
    if re.search(pattern, lower_text):
      return cat
  return "Product Manager"

def filter_and_format_recruiter_post(
  raw_post: Dict[str, Any]
) -> Dict[str, Any]:
  """
  Transforms a raw LinkedIn post / feed item into a structured Job object.
  """
  content = raw_post.get("text", "")
  author_name = raw_post.get("author_name", "Hiring Lead")
  author_title = raw_post.get("author_title", "Talent / Engineering Leader")
  company = raw_post.get("company", "High-Growth Tech")
  post_url = raw_post.get("url", "https://linkedin.com")
  location = raw_post.get("location", "Raleigh, NC / Remote")

  is_remote = "remote" in (location + content).lower()
  is_raleigh = "raleigh" in (location + content).lower() or "nc" in (location + content).lower()

  role_cat = extract_role_category(content)
  
  # Calculate candidate profile match
  matched_kws = []
  score = 75
  kw_weights = {
    "scrum": 6, "cspo": 8, "agile": 5, "geo": 10, "ai search": 10,
    "llm": 8, "python": 6, "sql": 6, "cro": 6, "gtm": 6, "roadmap": 6,
    "raleigh": 5, "remote": 5
  }
  for kw, weight in kw_weights.items():
    if kw in content.lower():
      matched_kws.append(kw)
      score += weight
  score = min(98, score)

  primary_profile = "Growth" if role_cat in ["GEO / AI Search", "Product Marketing"] else "Product"

  return {
    "id": f"rec-{int(datetime.now().timestamp())}-{abs(hash(author_name)) % 1000}",
    "title": f"{role_cat} (Team Opening)",
    "company": company,
    "location": location,
    "isRemote": is_remote,
    "isRaleighHybrid": is_raleigh,
    "type": "Recruiter Post",
    "recruiterName": author_name,
    "recruiterTitle": author_title,
    "recruiterProfileUrl": raw_post.get("author_profile_url", "https://linkedin.com"),
    "recruiterPostSnippet": content[:240] + ("..." if len(content) > 240 else ""),
    "url": post_url,
    "source": "Recruiter Post",
    "roleCategory": role_cat,
    "dateFound": datetime.now().strftime("%Y-%m-%d"),
    "status": "New",
    "salarySnippet": raw_post.get("salary", "Competitive Market Comp"),
    "description": content,
    "matchScore": score,
    "primaryProfile": primary_profile,
    "matchedKeywords": matched_kws
  }

if __name__ == "__main__":
  sample_posts = [
    {
      "author_name": "Amanda Vance",
      "author_title": "Head of Technical Recruiting @ Cloudflare",
      "company": "Cloudflare",
      "location": "Remote (US)",
      "text": "We're hiring for my team! Looking for a Technical Product Manager to lead our developer platform APIs and AI routing infrastructure. If you have experience with Python/SQL, LLM benchmarks, and agile sprint planning, DM me directly with your resume.",
      "url": "https://linkedin.com/feed/sample-1"
    },
    {
      "author_name": "Jason Reynolds",
      "author_title": "Director of Product Management @ Epic Games",
      "company": "Epic Games",
      "location": "Raleigh / Cary, NC",
      "text": "My team is growing in Cary/Raleigh! We are looking for an Associate Product Manager (APM) with CSPO Scrum training and UX empathy to help steer developer tools. Drop me a DM or message me!",
      "url": "https://linkedin.com/feed/sample-2"
    }
  ]

  print(f"[LinkedIn Scraper] Processing {len(sample_posts)} candidate posts...")
  for p in sample_posts:
    if is_recruiter_hiring_post(p["text"]):
      job = filter_and_format_recruiter_post(p)
      print(f"-> Captured Recruiter Post: {job['title']} at {job['company']} (Recruiter: {job['recruiterName']}) | Score: {job['matchScore']}")

