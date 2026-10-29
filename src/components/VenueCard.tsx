"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
  Accessibility,
} from "lucide-react";
import { DiscoveryResult, VerificationStatus, AccessibilityClaim } from "../lib/types";

interface VenueCardProps {
  venue: DiscoveryResult;
}

export function VenueCard({ venue }: VenueCardProps) {
  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />,
          label: "Independently Verified",
          badgeClass: "bg-emerald-50 text-emerald-900 border-emerald-300",
        };
      case "partially_verified":
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />,
          label: "Partially Verified",
          badgeClass: "bg-amber-50 text-amber-900 border-amber-300",
        };
      case "conflicting":
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-red-700" aria-hidden="true" />,
          label: "Conflicting Evidence",
          badgeClass: "bg-red-50 text-red-900 border-red-300",
        };
      case "unknown":
      default:
        return {
          icon: <HelpCircle className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />,
          label: "Physical Access Unverified",
          badgeClass: "bg-slate-100 text-slate-800 border-slate-300",
        };
    }
  };

  const overallBadge = getStatusBadge(venue.overallAccessibilityStatus);

  return (
    <article className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Top Banner / Image Area */}
      {venue.imageUrl ? (
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
          <img
            src={venue.imageUrl}
            alt={venue.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white/95 text-slate-800 backdrop-blur-xs shadow-xs border border-slate-200">
              {venue.category}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md border shadow-xs ${overallBadge.badgeClass}`}
            >
              {overallBadge.icon}
              <span>{overallBadge.label}</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="h-28 w-full bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-between p-4 border-b border-slate-100">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white text-slate-700 shadow-2xs border border-slate-200">
            {venue.category}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md border shadow-2xs ${overallBadge.badgeClass}`}
          >
            {overallBadge.icon}
            <span>{overallBadge.label}</span>
          </span>
        </div>
      )}

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Venue Name & Location */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">{venue.name}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" aria-hidden="true" />
                <span>{venue.address}</span>
              </p>
            </div>
            {venue.officialWebsiteUrl && (
              <a
                href={venue.officialWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit official website for ${venue.name} (opens in new tab)`}
                className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Qloo Cultural Taste Resonance Box */}
          <div className="mt-3.5 p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-xs">
            <div className="flex items-center gap-1.5 text-blue-900 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
              <span>Cultural Affinity (Qloo Signal)</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {venue.culturalMatch.summaryReason}
            </p>
          </div>
        </div>

        {/* Physical Accessibility Claims Section */}
        <div className="border-t border-slate-100 pt-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Accessibility className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              Physical Access Audit Evidence
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">Independent of Qloo</span>
          </div>

          <div className="space-y-2">
            {venue.accessibility.map((claim, idx) => {
              const claimBadge = getStatusBadge(claim.status);
              const featureLabel =
                claim.feature === "wheelchair_access" ? "Wheelchair Access" : "Step-Free Entry";

              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs ${
                    claim.status === "verified"
                      ? "bg-emerald-50/40 border-emerald-200"
                      : claim.status === "partially_verified"
                      ? "bg-amber-50/40 border-amber-200"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900">{featureLabel}</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${claimBadge.badgeClass}`}
                    >
                      {claimBadge.icon}
                      <span>{claimBadge.label}</span>
                    </span>
                  </div>

                  <p className="text-slate-700 text-[11px] leading-relaxed mb-1.5">
                    {claim.statement}
                  </p>

                  {/* Provenance & Audit Date */}
                  {claim.status !== "unknown" ? (
                    <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/50">
                      <a
                        href={claim.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                      >
                        Source: {claim.sourceName}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5 text-slate-400" />
                        Checked: {claim.checkedAt}
                      </span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-200/50">
                      Recommendation: Call venue directly before your visit to verify access details.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
