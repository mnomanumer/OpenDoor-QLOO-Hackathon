"use client";

import React, { useState, useEffect } from "react";
import { DiscoveryForm } from "@/components/DiscoveryForm";
import { VenueCard } from "@/components/VenueCard";
import { AgentTraceDrawer } from "@/components/AgentTraceDrawer";
import { MissingKeyBanner } from "@/components/MissingKeyBanner";
import { ConfigureKeyModal } from "@/components/ConfigureKeyModal";
import { UserDiscoveryRequest, DiscoveryResult, AgentTrace, DiscoveryResponse } from "@/lib/types";
import { Compass, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";

export default function HomePage() {
  const [results, setResults] = useState<DiscoveryResult[]>([]);
  const [trace, setTrace] = useState<AgentTrace | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(true);

  // Initial automatic discovery on mount with London cultural seeds
  useEffect(() => {
    handleSearch({
      city: "London",
      interests: ["Modern & Contemporary Art", "Auteur Cinema & Film Noir"],
      mobilityRequirement: "both",
    });
  }, []);

  const handleSearch = async (request: UserDiscoveryRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      const data: DiscoveryResponse = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "An error occurred while finding venues.");
        setResults([]);
        if (data.trace) setTrace(data.trace);
      } else {
        setResults(data.results);
        setTrace(data.trace);
        setIsOfflineMode(data.trace.executionMode === "preview_fixture");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to communicate with discovery server.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Offline Mode Banner */}
      {isOfflineMode && (
        <MissingKeyBanner onOpenKeyModal={() => setIsKeyModalOpen(true)} />
      )}

      {/* Hero Header */}
      <section className="mb-8 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Cultural Discovery With Grounded Accessibility
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          OpenDoor queries Qloo taste intelligence for cultural recommendations and reconciles each venue
          with <strong>source-verified physical accessibility audits</strong>. Qloo affinities do not guarantee wheelchair access.
        </p>
      </section>

      {/* Discovery Form */}
      <section className="mb-10">
        <DiscoveryForm isLoading={isLoading} onSearch={handleSearch} />
      </section>

      {/* Results Header & Summary */}
      <section aria-live="polite">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" aria-hidden="true" />
              <span>Recommended Cultural Outings</span>
            </h3>
            {trace && (
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {results.length} venues in {trace.city} for {trace.interests.join(", ")}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified First
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3 my-6">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block">Discovery Error</strong>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        ) : !isLoading && !error ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 p-8">
            <p className="text-sm font-semibold text-slate-700">No cultural venues found matching your criteria.</p>
            <p className="text-xs text-slate-500 mt-1">Try broadening your cultural interests or selecting another city.</p>
          </div>
        ) : null}
      </section>

      {/* Transparent Agent Execution Trace */}
      {trace && <AgentTraceDrawer trace={trace} />}

      {/* Configure Key Guide Modal */}
      <ConfigureKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
      />
    </div>
  );
}
