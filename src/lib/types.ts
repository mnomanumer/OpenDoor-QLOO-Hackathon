/**
 * Core Data Models & Schemas for OpenDoor
 * Designed strictly according to OPENDOOR_MASTER_SPEC.md
 */

export type MobilityFeature = "wheelchair_access" | "step_free_entry";
export type MobilityRequirement = "wheelchair_access" | "step_free_entry" | "both";

export type VerificationStatus =
  | "verified"           // Reliable source explicitly confirms feature
  | "partially_verified" // Evidence exists but does not establish whole requirement
  | "unknown"            // Reliable evidence not found - contact venue
  | "conflicting";        // Sources disagree - human confirmation required

export interface AccessibilityClaim {
  feature: MobilityFeature;
  status: VerificationStatus;
  statement: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: "official_venue_guide" | "official_accessibility_page" | "government_registry" | "independent_access_audit";
  checkedAt: string; // ISO YYYY-MM-DD
  notes?: string;
}

export interface VenueEvidence {
  venueId: string;
  venueName: string;
  aliases?: string[];
  category: "museum" | "gallery" | "theatre" | "cinema" | "library" | "cultural_centre" | "dining" | "music_venue";
  address: string;
  city: string;
  postalCode?: string;
  officialWebsiteUrl?: string;
  accessibilityClaims: AccessibilityClaim[];
}

export interface UserDiscoveryRequest {
  city: string;
  interests: string[];
  mobilityRequirement: MobilityRequirement;
}

export interface ResolvedEntity {
  id: string;
  name: string;
  type: string;
  subtype?: string;
  confidence?: number;
}

export interface QlooPlaceEntity {
  entityId: string;
  name: string;
  type: string;
  subtype?: string;
  properties?: {
    address?: string;
    description?: string;
    image?: {
      url: string;
    };
    geocode?: {
      city?: string;
      admin1_region?: string;
      country_code?: string;
    };
  };
  explainability?: {
    score?: number;
    contributingInterests?: Array<{
      entityId: string;
      name?: string;
      score: number;
    }>;
  };
}

export interface CulturalMatch {
  matchedInterests: string[];
  summaryReason: string;
  affinityScore?: number;
}

export interface DiscoveryResult {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  imageUrl?: string;
  officialWebsiteUrl?: string;
  culturalMatch: CulturalMatch;
  accessibility: AccessibilityClaim[];
  overallAccessibilityStatus: VerificationStatus;
  evidenceMatched: boolean;
  dataSource: "live_qloo" | "preview_fixture";
}

export interface AgentStageLog {
  stageNumber: number;
  name: string;
  status: "success" | "warning" | "error";
  latencyMs: number;
  details: string;
  metadata?: Record<string, unknown>;
}

export interface AgentTrace {
  requestId: string;
  timestamp: string;
  city: string;
  interests: string[];
  mobilityRequirement: MobilityRequirement;
  executionMode: "live_qloo" | "preview_fixture";
  stages: AgentStageLog[];
  totalLatencyMs: number;
  resultsCount: number;
  evidenceMatchedCount: number;
}

export interface DiscoveryResponse {
  success: boolean;
  results: DiscoveryResult[];
  trace: AgentTrace;
  error?: string;
}
