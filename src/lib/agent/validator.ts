import { UserDiscoveryRequest, MobilityRequirement } from "../types";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized?: UserDiscoveryRequest;
}

const SUPPORTED_CITIES = ["London", "New York"];
const VALID_MOBILITY: MobilityRequirement[] = ["wheelchair_access", "step_free_entry", "both"];

export function validateDiscoveryRequest(input: unknown): ValidationResult {
  const errors: string[] = [];

  if (!input || typeof input !== "object") {
    return { isValid: false, errors: ["Request body must be a valid JSON object."] };
  }

  const raw = input as Record<string, unknown>;

  // Validate City
  if (typeof raw.city !== "string" || !raw.city.trim()) {
    errors.push("City is required.");
  } else {
    const trimmedCity = raw.city.trim();
    if (trimmedCity.length > 50) {
      errors.push("City name is too long (maximum 50 characters).");
    }
  }

  // Validate Interests
  let sanitizedInterests: string[] = [];
  if (!Array.isArray(raw.interests) || raw.interests.length === 0) {
    errors.push("At least one cultural interest is required.");
  } else {
    sanitizedInterests = raw.interests
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (sanitizedInterests.length === 0) {
      errors.push("At least one valid non-empty cultural interest is required.");
    } else if (sanitizedInterests.length > 5) {
      sanitizedInterests = sanitizedInterests.slice(0, 5); // Bound to max 5
    }

    for (const interest of sanitizedInterests) {
      if (interest.length > 80) {
        errors.push(`Interest '${interest.substring(0, 20)}...' exceeds 80 characters limit.`);
      }
    }
  }

  // Validate Mobility Requirement
  let mobility: MobilityRequirement = "wheelchair_access";
  if (!raw.mobilityRequirement || !VALID_MOBILITY.includes(raw.mobilityRequirement as MobilityRequirement)) {
    errors.push("Mobility requirement must be one of: 'wheelchair_access', 'step_free_entry', 'both'.");
  } else {
    mobility = raw.mobilityRequirement as MobilityRequirement;
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    sanitized: {
      city: (raw.city as string).trim(),
      interests: sanitizedInterests,
      mobilityRequirement: mobility,
    },
  };
}
