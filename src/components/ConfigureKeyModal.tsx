"use client";

import React from "react";
import { X, Key, ShieldCheck, Terminal, Copy, Check } from "lucide-react";

interface ConfigureKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigureKeyModal({ isOpen, onClose }: ConfigureKeyModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const copyCommand = () => {
    navigator.clipboard.writeText("copy .env.example .env.local");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-600" aria-hidden="true" />
            <h2 id="modal-title" className="text-base font-bold text-slate-900">
              Configuring Your Qloo API Key
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-slate-600">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
            <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <strong className="font-semibold block text-blue-950">Strict Security Guarantee</strong>
              OpenDoor never exposes your Qloo key to the browser. All API calls execute strictly on the server side via Next.js route handlers.
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Step 1: Create local secrets file</h3>
            <p className="mb-2">Run this in your Windows 10 PowerShell terminal in the project folder:</p>
            <div className="flex items-center justify-between bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-xs">
              <code>copy .env.example .env.local</code>
              <button
                onClick={copyCommand}
                aria-label="Copy command"
                className="text-slate-400 hover:text-white p-1"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Step 2: Add your hackathon key</h3>
            <p className="mb-1">Open <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">.env.local</code> and replace the placeholder:</p>
            <pre className="bg-slate-100 p-2.5 rounded-lg font-mono text-slate-800 text-[11px] overflow-x-auto">
              QLOO_API_KEY=your_actual_hackathon_key_here
            </pre>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Step 3: Restart development server</h3>
            <p>Run <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">npm run dev</code>. OpenDoor will automatically detect the key and switch to live Qloo taste graph queries.</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
