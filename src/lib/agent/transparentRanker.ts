import { PlaceWithEvidence } from "./evidenceMatcher";
import {
  DiscoveryResult,
  MobilityRequirement,
  MobilityFeature,
  AccessibilityClaim,
  VerificationStatus,
} from "../types";

export function rankAndAssessResults(
  matches: PlaceWithEvidence[],
  mobilityReq: MobilityRequirement,
  dataSource: "live_qloo" | "preview_fixture"
): DiscoveryResult[] {
  const featuresToAssess: MobilityFeature[] =
    mobilityReq === "both"
      ? ["wheelchair_access", "step_free_entry"]
      : [mobilityReq];

  const results: DiscoveryResult[] = matches.map(({ place, evidence }) => {
    const claims: AccessibilityClaim[] = [];

    for (const feature of featuresToAssess) {
      const existingClaim = evidence?.accessibilityClaims.find((c) => c.feature === feature);

      if (existingClaim) {
        claims.push(existingClaim);
      } else {
        // Honest fallback for unknown evidence
        const featureLabel = feature === "wheelchair_access" ? "wheelchair access" : "step-free entry";
        claims.push({
          feature,
          status: "unknown",
          statement: `Not verified — contact the venue before visiting. No independent physical audit found for ${featureLabel}.`,
          sourceName: "OpenDoor Verification Engine",
          sourceUrl: evidence?.officialWebsiteUrl || "https://opendoor.access",
          sourceType: "official_accessibility_page",
          checkedAt: new Date().toISOString().split("T")[0],
          notes: "Do not assume access without direct venue confirmation.",
        });
      }
    }

    // Determine overall status
    let overallStatus: VerificationStatus = "unknown";
    if (claims.every((c) => c.status === "verified")) {
      overallStatus = "verified";
    } else if (claims.some((c) => c.status === "conflicting")) {
      overallStatus = "conflicting";
    } else if (claims.some((c) => c.status === "partially_verified" || c.status === "verified")) {
      overallStatus = "partially_verified";
    } else {
      overallStatus = "unknown";
    }

    return {
      id: place.id,
      name: place.name,
      category: place.category,
      address: place.address,
      city: place.city,
      imageUrl: place.imageUrl,
      officialWebsiteUrl: evidence?.officialWebsiteUrl,
      culturalMatch: place.culturalMatch,
      accessibility: claims,
      overallAccessibilityStatus: overallStatus,
      evidenceMatched: Boolean(evidence),
      dataSource,
    };
  });

  // Transparent sort:
  // 1. Venues with verified accessibility first
  // 2. Then partially verified
  // 3. Then unknown / conflicting
  // Within each tier, order by Qloo affinity score (if present)
  const statusRank: Record<VerificationStatus, number> = {
    verified: 3,
    partially_verified: 2,
    unknown: 1,
    conflicting: 0,
  };

  return results.sort((a, b) => {
    const rankDiff = statusRank[b.overallAccessibilityStatus] - statusRank[a.overallAccessibilityStatus];
    if (rankDiff !== 0) return rankDiff;

    const scoreA = a.culturalMatch.affinityScore || 0;
    const scoreB = b.culturalMatch.affinityScore || 0;
    return scoreB - scoreA;
  });
}
