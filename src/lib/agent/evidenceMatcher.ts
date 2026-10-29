import { NormalizedPlace } from "./normalizer";
import { VenueEvidence } from "../types";
import { evidenceStore } from "../evidenceStore";

export interface PlaceWithEvidence {
  place: NormalizedPlace;
  evidence: VenueEvidence | null;
  matchType: "exact" | "alias" | "street_verified" | "none";
}

export function matchPlacesToEvidence(places: NormalizedPlace[]): PlaceWithEvidence[] {
  return places.map((place) => {
    const evidence = evidenceStore.findEvidence(place.name, place.address);

    let matchType: "exact" | "alias" | "street_verified" | "none" = "none";
    if (evidence) {
      if (evidence.venueName.toLowerCase() === place.name.toLowerCase()) {
        matchType = "exact";
      } else if (evidence.aliases?.some((a) => a.toLowerCase() === place.name.toLowerCase())) {
        matchType = "alias";
      } else {
        matchType = "street_verified";
      }
    }

    return {
      place,
      evidence,
      matchType,
    };
  });
}
