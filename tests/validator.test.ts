import { describe, it, expect } from "vitest";
import { validateDiscoveryRequest } from "../src/lib/agent/validator";

describe("Stage 1: Request Validator", () => {
  it("accepts a well-formed request", () => {
    const input = {
      city: "London",
      interests: ["Art", "Sculpture"],
      mobilityRequirement: "wheelchair_access",
    };
    const res = validateDiscoveryRequest(input);
    expect(res.isValid).toBe(true);
    expect(res.sanitized?.city).toBe("London");
    expect(res.sanitized?.interests).toEqual(["Art", "Sculpture"]);
    expect(res.sanitized?.mobilityRequirement).toBe("wheelchair_access");
  });

  it("rejects an empty city", () => {
    const input = {
      city: "   ",
      interests: ["Art"],
      mobilityRequirement: "wheelchair_access",
    };
    const res = validateDiscoveryRequest(input);
    expect(res.isValid).toBe(false);
    expect(res.errors).toContain("City is required.");
  });

  it("rejects missing or empty interests", () => {
    const input = {
      city: "London",
      interests: [],
      mobilityRequirement: "wheelchair_access",
    };
    const res = validateDiscoveryRequest(input);
    expect(res.isValid).toBe(false);
    expect(res.errors).toContain("At least one cultural interest is required.");
  });

  it("bounds excessive interests to 5 maximum", () => {
    const input = {
      city: "London",
      interests: ["1", "2", "3", "4", "5", "6", "7"],
      mobilityRequirement: "step_free_entry",
    };
    const res = validateDiscoveryRequest(input);
    expect(res.isValid).toBe(true);
    expect(res.sanitized?.interests.length).toBe(5);
  });

  it("rejects invalid mobility requirement values", () => {
    const input = {
      city: "London",
      interests: ["Film"],
      mobilityRequirement: "flying_car",
    };
    const res = validateDiscoveryRequest(input);
    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toMatch(/Mobility requirement must be one of/);
  });
});
