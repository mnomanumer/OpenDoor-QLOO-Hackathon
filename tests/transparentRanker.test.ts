import { describe, it, expect } from "vitest";
import { rankAndAssessResults } from "../src/lib/agent/transparentRanker";
import { PlaceWithEvidence } from "../src/lib/agent/evidenceMatcher";

describe("Stage 6: Transparent Ranker & Evidence Assessor", () => {
  it("assigns 'unknown' status with honest disclaimer when evidence is missing", () => {
    const unverifiedPlace: PlaceWithEvidence = {
      place: {
        id: "ent-unverified",
        name: "Unknown Cultural Spot",
        category: "Gallery",
        address: "123 Random St, London",
        city: "London",
        culturalMatch: {
          matchedInterests: ["Contemporary Art"],
          summaryReason: "Matches art",
          affinityScore: 0.99, // High Qloo affinity!
        },
      },
      evidence: null,
      matchType: "none",
    };

    const results = rankAndAssessResults([unverifiedPlace], "wheelchair_access", "live_qloo");
    expect(results).toHaveLength(1);
    expect(results[0].overallAccessibilityStatus).toBe("unknown");
    expect(results[0].accessibility[0].status).toBe("unknown");
    expect(results[0].accessibility[0].statement).toContain("Not verified — contact the venue before visiting");
  });

  it("prioritizes physically verified venues above high-affinity unverified venues", () => {
    const verifiedPlace: PlaceWithEvidence = {
      place: {
        id: "ent-verified",
        name: "The British Museum",
        category: "Museum",
        address: "Great Russell St",
        city: "London",
        culturalMatch: {
          matchedInterests: ["History"],
          summaryReason: "Matches history",
          affinityScore: 0.60,
        },
      },
      evidence: {
        venueId: "gb-lon-bm",
        venueName: "The British Museum",
        category: "museum",
        address: "Great Russell St",
        city: "London",
        accessibilityClaims: [
          {
            feature: "wheelchair_access",
            status: "verified",
            statement: "Full wheelchair access confirmed.",
            sourceName: "Official Guide",
            sourceUrl: "https://example.com",
            sourceType: "official_accessibility_page",
            checkedAt: "2026-10-30",
          },
        ],
      },
      matchType: "exact",
    };

    const unverifiedPlace: PlaceWithEvidence = {
      place: {
        id: "ent-unverified",
        name: "Trendy Loft",
        category: "Gallery",
        address: "Soho",
        city: "London",
        culturalMatch: {
          matchedInterests: ["Modern Art"],
          summaryReason: "Matches art",
          affinityScore: 0.99, // Much higher Qloo affinity!
        },
      },
      evidence: null,
      matchType: "none",
    };

    // Note: unverifiedPlace passed first in input array
    const results = rankAndAssessResults([unverifiedPlace, verifiedPlace], "wheelchair_access", "live_qloo");

    // Verified venue MUST be ranked first for mobility safety
    expect(results[0].id).toBe("ent-verified");
    expect(results[0].overallAccessibilityStatus).toBe("verified");
    expect(results[1].id).toBe("ent-unverified");
    expect(results[1].overallAccessibilityStatus).toBe("unknown");
  });
});
