"use client";

import React, { useState } from "react";
import { Terminal, ChevronDown, ChevronUp, CheckCircle, Clock, ShieldCheck, Info } from "lucide-react";
import { AgentTrace } from "../lib/types";

interface AgentTraceDrawerProps {
  trace: AgentTrace;
}

export function AgentTraceDrawer({ trace }: AgentTraceDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      aria-label="Agent Execution Trace"
      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mt-8"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
            <Terminal className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Agent Execution & Reasoning Trace
            </h3>
            <p className="text-xs text-slate-500">
              Inspect how OpenDoor orchestrated all 7 deterministic stages ({trace.totalLatencyMs}ms total)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[11px]">
            Mode: {trace.executionMode === "live_qloo" ? "Live Qloo API" : "Offline Preview Fixtures"}
          </span>
          <span className="text-slate-400 font-medium">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-slate-200 bg-slate-900 text-slate-100 font-mono text-xs space-y-4">
          {/* Metadata bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-800/80 rounded-lg text-[11px] border border-slate-700/60">
            <div>
              <span className="text-slate-400 block">Trace ID:</span>
              <span className="text-slate-200 font-bold truncate block">{trace.requestId}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Target City:</span>
              <span className="text-slate-200 font-bold">{trace.city}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Mobility Requirement:</span>
              <span className="text-slate-200 font-bold">{trace.mobilityRequirement}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Verified Evidence Match:</span>
              <span className="text-emerald-400 font-bold">
                {trace.evidenceMatchedCount} of {trace.resultsCount} venues
              </span>
            </div>
          </div>

          {/* Sequential Stages */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase text-slate-400 tracking-wider font-semibold font-sans">
              Sequential Pipeline Stages
            </h4>
            <div className="space-y-2">
              {trace.stages.map((stage) => (
                <div
                  key={stage.stageNumber}
                  className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-600 flex items-center justify-center text-[10px] font-bold">
                      {stage.stageNumber}
                    </span>
                    <div>
                      <span className="font-semibold text-slate-100 mr-2">{stage.name}</span>
                      <p className="text-[11px] text-slate-300 font-sans mt-0.5">{stage.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 flex-shrink-0">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{stage.latencyMs}ms</span>
                    <span
                      className={`px-1.5 py-0.5 rounded uppercase text-[9px] font-bold ${
                        stage.status === "success"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : stage.status === "warning"
                          ? "bg-amber-950 text-amber-400 border border-amber-800"
                          : "bg-red-950 text-red-400 border border-red-800"
                      }`}
                    >
                      {stage.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance & Safety Guarantee */}
          <div className="p-3 bg-blue-950/40 border border-blue-900 rounded-lg text-[11px] text-blue-200 flex items-start gap-2 font-sans">
            <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Audit Safety Note:</strong> No secrets (API keys) are ever output in traces, server responses, or logs. All user cultural selections are processed in memory and never stored.
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
