"use client";

import React from "react";
import { AlertCircle, Key, ExternalLink } from "lucide-react";

interface MissingKeyBannerProps {
  onOpenKeyModal: () => void;
}

export function MissingKeyBanner({ onOpenKeyModal }: MissingKeyBannerProps) {
  return (
    <div
      role="region"
      aria-label="Offline Mode Notice"
      className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg shadow-sm"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-semibold text-amber-900">
              Running in Offline Preview Mode <span className="font-normal text-xs text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-full ml-1">Demo Fixtures</span>
            </h2>
            <p className="text-xs text-amber-800 mt-0.5">
              No <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-900">QLOO_API_KEY</code> detected in environment.
              OpenDoor is using verified offline preview fixtures for cultural discovery. All accessibility evidence shown is real and source-backed.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenKeyModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-sm transition-colors focus:ring-2 focus:ring-amber-500 focus:outline-none flex-shrink-0"
        >
          <Key className="w-3.5 h-3.5" aria-hidden="true" />
          Configure Live Qloo Key
        </button>
      </div>
    </div>
  );
}
