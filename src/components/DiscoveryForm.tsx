"use client";

import React, { useState } from "react";
import { Search, Plus, X, Sparkles, Accessibility } from "lucide-react";
import { MobilityRequirement, UserDiscoveryRequest } from "../lib/types";

interface DiscoveryFormProps {
  isLoading: boolean;
  onSearch: (request: UserDiscoveryRequest) => void;
}

const POPULAR_SUGGESTIONS = [
  "Sculpture & Antiquities",
  "Modern & Contemporary Art",
  "Auteur Cinema & Film Noir",
  "Elizabethan Drama",
  "Brutalist Architecture",
  "Classical & Orchestral Music",
  "Contemporary Literature",
];

export function DiscoveryForm({ isLoading, onSearch }: DiscoveryFormProps) {
  const [city, setCity] = useState("London");
  const [interests, setInterests] = useState<string[]>([
    "Modern & Contemporary Art",
    "Auteur Cinema & Film Noir",
  ]);
  const [customInput, setCustomInput] = useState("");
  const [mobilityRequirement, setMobilityRequirement] = useState<MobilityRequirement>("both");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddInterest = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (interests.includes(trimmed)) return;
    if (interests.length >= 5) {
      setValidationError("You can select up to 5 cultural interests at a time.");
      return;
    }
    setInterests([...interests, trimmed]);
    setCustomInput("");
    setValidationError(null);
  };

  const handleRemoveInterest = (tag: string) => {
    setInterests(interests.filter((i) => i !== tag));
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (interests.length === 0) {
      setValidationError("Please select or enter at least one cultural interest.");
      return;
    }
    setValidationError(null);
    onSearch({
      city,
      interests,
      mobilityRequirement,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-6"
    >
      <div>
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" aria-hidden="true" />
          Where & What Are You Exploring?
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          OpenDoor connects your cultural tastes through Qloo and cross-verifies physical accessibility audits.
        </p>
      </div>

      {/* City & Mobility Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* City Input */}
        <div>
          <label htmlFor="city-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Select Destination City
          </label>
          <select
            id="city-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white"
          >
            <option value="London">London, United Kingdom (Dense Verified Evidence)</option>
            <option value="New York">New York, NY, United States</option>
          </select>
        </div>

        {/* Mobility Filter Selection */}
        <div>
          <fieldset>
            <legend className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Accessibility className="w-4 h-4 text-slate-500" aria-hidden="true" />
              Physical Mobility Requirement
            </legend>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMobilityRequirement("wheelchair_access")}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all text-center ${
                  mobilityRequirement === "wheelchair_access"
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Wheelchair
              </button>
              <button
                type="button"
                onClick={() => setMobilityRequirement("step_free_entry")}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all text-center ${
                  mobilityRequirement === "step_free_entry"
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Step-Free
              </button>
              <button
                type="button"
                onClick={() => setMobilityRequirement("both")}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all text-center ${
                  mobilityRequirement === "both"
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Both Features
              </button>
            </div>
          </fieldset>
        </div>
      </div>

      {/* Cultural Interests Input */}
      <div>
        <label htmlFor="custom-interest" className="block text-xs font-semibold text-slate-700 mb-1.5">
          Cultural Interests (Films, Directors, Movements, Arts, Books)
        </label>
        <div className="flex gap-2">
          <input
            id="custom-interest"
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddInterest(customInput);
              }
            }}
            placeholder="e.g. Christopher Nolan, Impressionism, Jane Austen..."
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
          <button
            type="button"
            onClick={() => handleAddInterest(customInput)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 flex items-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Add
          </button>
        </div>

        {/* Selected Interests Tags */}
        <div className="mt-3 flex flex-wrap gap-2 items-center" aria-live="polite">
          {interests.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-medium border border-blue-200 shadow-2xs"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveInterest(tag)}
                aria-label={`Remove interest: ${tag}`}
                className="hover:text-blue-950 p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          {interests.length === 0 && (
            <span className="text-xs text-slate-400 italic">No cultural interests selected yet.</span>
          )}
        </div>

        {/* Popular Suggestions */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-[11px] font-medium text-slate-400 mb-2">Popular discovery seeds:</p>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SUGGESTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                disabled={interests.includes(tag)}
                onClick={() => handleAddInterest(tag)}
                className="px-2.5 py-1 text-[11px] rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-40 disabled:pointer-events-none transition-colors border border-slate-200"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {validationError && (
        <div role="alert" className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
          {validationError}
        </div>
      )}

      {/* Submit Action */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all focus:ring-4 focus:ring-blue-200"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Agent Running 7 Discovery Stages...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" aria-hidden="true" />
              <span>Discover Accessible Cultural Outings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
