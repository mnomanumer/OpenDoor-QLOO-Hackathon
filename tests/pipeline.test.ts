import { describe, it, expect } from "vitest";
import { runDiscoveryAgent } from "../src/lib/agent/pipeline";

describe("Agent Pipeline End-to-End", () => {
  it("executes all 7 stages and produces structured trace and results in preview mode", async () => {
    const request = {
      city: "London",
      interests: ["Drama", "Shakespeare"],
      mobilityRequirement: "both",
    };

    const res = await runDiscoveryAgent(request);

    expect(res.success).toBe(true);
    expect(res.results.length).toBeGreaterThan(0);

    // Verify trace structure
    expect(res.trace).toBeDefined();
    expect(res.trace.stages.length).toBe(7);
    expect(res.trace.stages[0].name).toContain("Request Validation");
    expect(res.trace.stages[1].name).toContain("Interest Resolution");
    expect(res.trace.stages[2].name).toContain("Qloo Cultural Insights Call");
    expect(res.trace.stages[3].name).toContain("Place Normalization");
    expect(res.trace.stages[4].name).toContain("Accessibility Evidence Matching");
    expect(res.trace.stages[5].name).toContain("Explainable Ranking");
    expect(res.trace.stages[6].name).toContain("Audit Trail");

    // Check individual results
    const globe = res.results.find((r) => r.name.includes("Shakespeare's Globe"));
    expect(globe).toBeDefined();
    if (globe) {
      expect(globe.evidenceMatched).toBe(true);
      // In our evidence dataset, Shakespeare's Globe has step-free entry verified and wheelchair access partially verified
      const stepFree = globe.accessibility.find((a) => a.feature === "step_free_entry");
      const wheelchair = globe.accessibility.find((a) => a.feature === "wheelchair_access");
      expect(stepFree?.status).toBe("verified");
      expect(wheelchair?.status).toBe("partially_verified");
      expect(stepFree?.sourceUrl).toContain("shakespearesglobe.com");
    }
  });

  it("handles malformed requests gracefully with error status", async () => {
    const invalidReq = { city: "", interests: [] };
    const res = await runDiscoveryAgent(invalidReq);

    expect(res.success).toBe(false);
    expect(res.results).toEqual([]);
    expect(res.error).toBeDefined();
    expect(res.trace.stages[0].status).toBe("error");
  });
});
