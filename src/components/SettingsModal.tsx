'use client';

import React, { useState } from 'react';
import { 
  X, 
  Database, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  Key, 
  Sparkles,
  Copy
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: { webhookUrl: string; geminiKey: string }) => void;
  initialWebhookUrl?: string;
  initialGeminiKey?: string;
}

export function SettingsModal({
  isOpen,
  onClose,
  onSave,
  initialWebhookUrl = '',
  initialGeminiKey = '',
}: SettingsModalProps) {
  if (!isOpen) return null;

  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl);
  const [geminiKey, setGeminiKey] = useState(initialGeminiKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  const handleTestConnection = async () => {
    if (!webhookUrl) {
      setTestResult({ success: false, msg: 'Please enter a webhook URL first.' });
      return;
    }
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch(`${webhookUrl}?action=GET_JOBS`, {
        method: 'GET',
        mode: 'cors',
      });
      if (res.ok) {
        setTestResult({ success: true, msg: 'Successfully connected to Google Sheet database!' });
      } else {
        setTestResult({ success: false, msg: `HTTP error ${res.status}. Check your Apps Script deployment permissions.` });
      }
    } catch (err: any) {
      setTestResult({ success: false, msg: `Connection failed: ${err.message || 'CORS or Network issue'}` });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSave({ webhookUrl, geminiKey });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 dark:bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">
                Google Sheet & AI Settings
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                Connect your zero-cost Google Sheet database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs font-mono">
          {/* Section 1: Google Sheet Webhook */}
          <div className="space-y-2">
            <label className="text-zinc-700 dark:text-zinc-300 font-bold flex items-center justify-between">
              <span>Google Apps Script Webhook URL (Zero-Cost):</span>
              <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold">Recommended</span>
            </label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
            />
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="px-3 py-1.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all disabled:opacity-50 font-bold"
              >
                {testing ? 'Testing...' : 'Test Connection'}
              </button>
              {testResult && (
                <span
                  className={`text-[11px] flex items-center gap-1 ${
                    testResult.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {testResult.success ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5" />
                  )}
                  {testResult.msg}
                </span>
              )}
            </div>
          </div>

          {/* Quick Setup Instructions Callout */}
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-2 text-zinc-700 dark:text-zinc-300">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-cyan-700 dark:text-cyan-300 flex items-center gap-1">
              ⚡ 30-Second Google Sheet Setup:
            </span>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              <li>Open a new spreadsheet at <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-400 font-semibold underline">sheets.new</a></li>
              <li>Click <strong>Extensions &gt; Apps Script</strong></li>
              <li>Paste the code from <code className="text-zinc-800 dark:text-zinc-200 bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded font-mono">google-apps-script/Code.gs</code></li>
              <li>Click <strong>Deploy &gt; New deployment</strong>, select type <strong>Web app</strong>, set <em>Who has access</em> to <strong>Anyone</strong>, and copy the URL.</li>
            </ol>
          </div>

          {/* Section 2: Gemini API Key */}
          <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <label className="text-zinc-700 dark:text-zinc-300 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                Google Gemini API Key (Optional):
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5 font-semibold"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-purple-500"
            />
            <p className="text-[11px] text-zinc-500">
              Enables real-time dynamic pitch generation and custom prompt refinements powered by Gemini 2.5 Flash.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg text-xs font-mono bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 font-bold transition-all shadow-sm"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

