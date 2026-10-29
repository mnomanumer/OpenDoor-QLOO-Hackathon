import { describe, it, expect } from "vitest";
import { runDiscoveryAgent } from "../src/lib/agent/pipeline";

describe("Security & Secret Isolation", () => {
  it("never leaks QLOO_API_KEY into discovery results or agent trace", async () => {
    const fakeKey = "qloo-secret-test-key-xyz-987654321";
    process.env.QLOO_API_KEY = fakeKey;

    const request = {
      city: "London",
      interests: ["Cinema"],
      mobilityRequirement: "wheelchair_access",
    };

    const res = await runDiscoveryAgent(request);

    // Serialize complete response to JSON string
    const serialized = JSON.stringify(res);

    // Verify key NEVER appears anywhere in the serialized payload
    expect(serialized).not.toContain(fakeKey);

    // Restore env
    delete process.env.QLOO_API_KEY;
  });
});
