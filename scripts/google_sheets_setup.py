#!/usr/bin/env python3
"""
Google Sheets Initialization Script (gspread)
Sets up headers, formatting, and validation in a target Google Sheet using gspread.
"""

import os
import sys

def setup_gspread_sheet(sheet_id: str, creds_path: str):
  try:
    import gspread
    from google.oauth2.service_account import Credentials
  except ImportError:
    print("[Error] gspread and google-auth are required: pip install gspread google-auth")
    return

  scopes = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
  ]
  
  if not os.path.exists(creds_path):
    print(f"[Error] Credentials file not found at: {creds_path}")
    return

  credentials = Credentials.from_service_account_file(creds_path, scopes=scopes)
  gc = gspread.authorize(credentials)
  
  try:
    sh = gc.open_by_key(sheet_id)
    worksheet = sh.get_worksheet(0)
    
    headers = [
      "Date Found", "Role Title", "Company", "Type", "Location", 
      "Job URL", "Status", "Tailored Outreach / Pitch", "Match Score", 
      "Primary Profile", "Recruiter Info", "Applied Date", "Notes"
    ]
    
    existing_vals = worksheet.get_all_values()
    if not existing_vals:
      worksheet.append_row(headers)
      print("[Success] Appended standardized headers to Google Sheet.")
    else:
      print(f"[Info] Sheet already contains {len(existing_vals)} rows.")
      
    print(f"[Success] Google Sheet connected: {sh.title} ({sh.url})")
  except Exception as e:
    print(f"[Error] Failed to connect to Google Sheet: {e}")

if __name__ == "__main__":
  sheet_id = os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID")
  creds = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "service_account.json")
  if not sheet_id:
    print("Usage: Set GOOGLE_SHEETS_SPREADSHEET_ID in environment or pass as argument.")
    print("Example: python scripts/google_sheets_setup.py <sheet_id>")
    if len(sys.argv) > 1:
      sheet_id = sys.argv[1]
  if sheet_id:
    setup_gspread_sheet(sheet_id, creds)

