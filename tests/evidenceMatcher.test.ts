import { describe, it, expect } from "vitest";
import { matchPlacesToEvidence } from "../src/lib/agent/evidenceMatcher";
import { NormalizedPlace } from "../src/lib/agent/normalizer";

describe("Stage 5: Conservative Evidence Matcher", () => {
  it("links known venues by exact name", () => {
    const places: NormalizedPlace[] = [
      {
        id: "ent-1",
        name: "The British Museum",
        category: "Museum",
        address: "Great Russell Street, London WC1B 3DG",
        city: "London",
        culturalMatch: {
          matchedInterests: ["History"],
          summaryReason: "Matches history",
        },
      },
    ];

    const results = matchPlacesToEvidence(places);
    expect(results).toHaveLength(1);
    expect(results[0].evidence).not.toBeNull();
    expect(results[0].evidence?.venueId).toBe("gb-lon-british-museum");
    expect(results[0].matchType).toBe("exact");
  });

  it("links known venues by alias", () => {
    const places: NormalizedPlace[] = [
      {
        id: "ent-2",
        name: "British Museum",
        category: "Museum",
        address: "Great Russell Street, London",
        city: "London",
        culturalMatch: {
          matchedInterests: ["History"],
          summaryReason: "Matches history",
        },
      },
    ];

    const results = matchPlacesToEvidence(places);
    expect(results[0].evidence?.venueId).toBe("gb-lon-british-museum");
  });

  it("strictly leaves unverified/unknown places unmatched without guessing", () => {
    const places: NormalizedPlace[] = [
      {
        id: "ent-random",
        name: "The Mystery Speakeasy & Art Room",
        category: "Cultural Venue",
        address: "99 Unknown Alley, London",
        city: "London",
        culturalMatch: {
          matchedInterests: ["Jazz"],
          summaryReason: "Matches jazz",
        },
      },
    ];

    const results = matchPlacesToEvidence(places);
    expect(results[0].evidence).toBeNull();
    expect(results[0].matchType).toBe("none");
  });
});
