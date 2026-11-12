# Google Apps Script Webhook Backend

This directory contains the zero-cost Google Apps Script webhook that turns any Google Sheet into an instant, serverless database for Job Copilot.

## Why this approach?
- **$0.00 Cost Forever**: Uses Google's free Apps Script quota (thousands of requests/day).
- **No Google Cloud Project Required**: Bypasses the need to create GCP service accounts, enable billing, or configure IAM roles.
- **Bi-directional Sync**: Supports reading listings (`doGet`), appending listings (`doPost` action `APPEND_JOB`), and updating statuses (`doPost` action `UPDATE_STATUS`).

## Deployment Steps

1. Create a new Google Sheet at [https://sheets.new](https://sheets.new).
2. Title it `Job Tracker - Copilot DB`.
3. In the top menu, select **Extensions > Apps Script**.
4. Delete any boilerplate code in `Code.gs` and paste the contents of [`google-apps-script/Code.gs`](./Code.gs).
5. Click **Deploy > New deployment**.
6. Click the gear icon next to "Select type" and choose **Web app**.
7. Set the fields:
   - **Description**: `Job Copilot Webhook`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(Note: This allows your Job Copilot app to read/write without complex OAuth)*
8. Click **Deploy**. Google may prompt you to authorize permissions — click *Advanced > Go to Job Copilot (unsafe)* and allow.
9. Copy the generated **Web App URL** (which ends with `/exec`).
10. In your Job Copilot app, open the **Connect Google Sheet** modal and paste the URL.

