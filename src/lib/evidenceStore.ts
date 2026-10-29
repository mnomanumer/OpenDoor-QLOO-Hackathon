import { VenueEvidence } from "./types";
import londonVenues from "../../data/evidence/venues.london.json";

export class EvidenceStore {
  private venues: VenueEvidence[];

  constructor() {
    this.venues = londonVenues as VenueEvidence[];
  }

  public getAllVenues(): VenueEvidence[] {
    return this.venues;
  }

  public findEvidence(name: string, address?: string): VenueEvidence | null {
    const cleanSearchName = this.normalize(name);

    for (const venue of this.venues) {
      const cleanVenueName = this.normalize(venue.venueName);
      if (cleanVenueName === cleanSearchName) {
        return venue;
      }

      // Check aliases
      if (venue.aliases) {
        for (const alias of venue.aliases) {
          if (this.normalize(alias) === cleanSearchName) {
            return venue;
          }
        }
      }

      // Substring check only if names are sufficiently long and specific
      if (cleanVenueName.length > 5 && cleanSearchName.length > 5) {
        if (cleanVenueName.includes(cleanSearchName) || cleanSearchName.includes(cleanVenueName)) {
          // If address is provided, cross-check street or postcode to prevent false positives
          if (address && venue.postalCode) {
            const cleanSearchAddr = this.normalize(address);
            const cleanPostal = this.normalize(venue.postalCode);
            if (cleanSearchAddr.includes(cleanPostal)) {
              return venue;
            }
          } else {
            return venue;
          }
        }
      }
    }

    return null;
  }

  private normalize(str: string): string {
    return str
      .toLowerCase()
      .replace(/^(the|a|an)\s+/i, "")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
}

export const evidenceStore = new EvidenceStore();
