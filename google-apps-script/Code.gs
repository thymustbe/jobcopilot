/**
 * JOB COPILOT - GOOGLE SHEET DATABASE BACKEND
 * Zero-Cost Serverless Backend for Manav Sharma's Job Aggregator & Copilot
 * 
 * Instructions to Deploy:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Rename sheet tab or title to "Job Tracker - Copilot DB"
 * 3. Click Extensions > Apps Script
 * 4. Paste this entire code replacing any existing content
 * 5. Click "Deploy" > "New deployment"
 * 6. Select type: "Web app"
 * 7. Configuration:
 *    - Description: "Job Copilot Webhook"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (allows Next.js client/server to read/write without OAuth tokens)
 * 8. Click "Deploy" and copy the Web App URL (ends in /exec)
 * 9. Paste the URL into your Job Copilot Settings modal or NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL
 */

const HEADERS = [
  "Date Found",
  "Role Title",
  "Company",
  "Type",
  "Location",
  "Job URL",
  "Status",
  "Tailored Outreach / Pitch",
  "Match Score",
  "Primary Profile",
  "Recruiter Info",
  "Applied Date",
  "Notes"
];

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getActiveSheet();
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground("#0f172a");
    headerRange.setFontColor("#f8fafc");
    headerRange.setFontWeight("bold");
    headerRange.setFontFamily("Consolas");
    sheet.setFrozenRows(1);
  }

  // Set dropdown validation for Status column (Column G, index 7)
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["New", "Saved", "Applied", "Interview", "Offer", "Rejected", "Archived"])
    .setAllowInvalid(false)
    .build();
  sheet.getRange("G2:G1000").setDataValidation(rule);
}

function doPost(e) {
  try {
    const rawData = e.postData.contents;
    const body = JSON.parse(rawData);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getActiveSheet();

    if (sheet.getLastRow() === 0) {
      setupSheet();
    }

    const action = body.action || "APPEND_JOB";

    if (action === "APPEND_JOB") {
      const job = body.job || {};
      const newRow = [
        job.dateFound || new Date().toISOString().split("T")[0],
        job.roleTitle || job.title || "",
        job.company || "",
        job.type || "Direct",
        job.location || "",
        job.jobUrl || job.url || "",
        job.status || "New",
        job.tailoredOutreach || (job.tailoredPitch ? job.tailoredPitch.join(" | ") : ""),
        job.matchScore || 85,
        job.primaryProfile || "Product",
        job.recruiterName ? `${job.recruiterName} (${job.recruiterTitle || ''})` : "",
        job.appliedDate || "",
        job.notes || ""
      ];

      // Check if job URL already exists to prevent duplicates
      const data = sheet.getDataRange().getValues();
      let exists = false;
      for (let i = 1; i < data.length; i++) {
        if (data[i][5] === newRow[5] && newRow[5] !== "") {
          exists = true;
          break;
        }
      }

      if (!exists) {
        sheet.appendRow(newRow);
      }

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: exists ? "Job already exists in sheet" : "Job appended successfully"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "UPDATE_STATUS") {
      const targetId = body.id || "";
      const targetUrl = body.url || "";
      const newStatus = body.status || "Applied";
      const appliedDate = body.appliedDate || new Date().toISOString().split("T")[0];

      const data = sheet.getDataRange().getValues();
      let updated = false;

      for (let i = 1; i < data.length; i++) {
        // match by URL (col index 5) or title/company
        if ((targetUrl && data[i][5] === targetUrl) || (targetId && data[i][5].includes(targetId))) {
          sheet.getRange(i + 1, 7).setValue(newStatus); // Status is Col G (7)
          if (newStatus === "Applied") {
            sheet.getRange(i + 1, 12).setValue(appliedDate); // Applied Date is Col L (12)
          }
          updated = true;
          break;
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        success: updated,
        message: updated ? `Status updated to ${newStatus}` : "Job not found in sheet"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: "Unknown action"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getActiveSheet();

    if (sheet.getLastRow() <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        jobs: []
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    const rows = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[1] && !row[2]) continue; // skip empty rows

      rows.push({
        id: `gsheet-${i}`,
        dateFound: row[0],
        title: row[1],
        company: row[2],
        type: row[3] || "Direct",
        location: row[4],
        isRemote: String(row[4]).toLowerCase().includes("remote"),
        isRaleighHybrid: String(row[4]).toLowerCase().includes("raleigh") || String(row[4]).toLowerCase().includes("hybrid"),
        url: row[5],
        status: row[6] || "New",
        tailoredPitch: row[7] ? String(row[7]).split(" | ") : [],
        outreachDraft: row[7],
        matchScore: Number(row[8]) || 85,
        primaryProfile: row[9] || "Product",
        recruiterName: row[10],
        appliedDate: row[11],
        notes: row[12],
        source: row[3] === "Recruiter Post" ? "Recruiter Post" : "JobSpy",
        description: `${row[1]} at ${row[2]}. Location: ${row[4]}.`
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      jobs: rows
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

