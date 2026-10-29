import { QlooPlaceEntity, CulturalMatch } from "../types";

export interface NormalizedPlace {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  imageUrl?: string;
  culturalMatch: CulturalMatch;
}

export function normalizeQlooPlaces(
  entities: QlooPlaceEntity[],
  requestedInterests: string[],
  city: string
): NormalizedPlace[] {
  return entities.map((entity) => {
    const name = entity.name || "Cultural Venue";
    const address = entity.properties?.address || `${city}, United Kingdom`;
    const imageUrl = entity.properties?.image?.url;

    // Determine category
    let category = "Cultural Venue";
    const sub = (entity.subtype || "").toLowerCase();
    const desc = (entity.properties?.description || "").toLowerCase();

    if (sub.includes("museum") || desc.includes("museum")) category = "Museum";
    else if (sub.includes("gallery") || desc.includes("gallery") || desc.includes("art")) category = "Gallery";
    else if (sub.includes("theatre") || desc.includes("theatre") || desc.includes("playhouse")) category = "Theatre";
    else if (sub.includes("cinema") || desc.includes("cinema") || desc.includes("film")) category = "Cinema";
    else if (sub.includes("library") || desc.includes("library") || desc.includes("book")) category = "Literature & Library";
    else if (sub.includes("music") || desc.includes("concert")) category = "Music Venue";

    // Build cultural match explanation
    const contributing = entity.explainability?.contributingInterests || [];
    const matchedInterests: string[] = [];

    if (contributing.length > 0) {
      for (const item of contributing) {
        if (item.name) matchedInterests.push(item.name);
      }
    }

    if (matchedInterests.length === 0) {
      matchedInterests.push(...requestedInterests.slice(0, 2));
    }

    let summaryReason = "";
    if (entity.explainability?.score) {
      const pct = Math.round(entity.explainability.score * 100);
      summaryReason = `Qloo taste model matches your interest in ${matchedInterests.join(" & ")} (${pct}% affinity signal).`;
    } else {
      summaryReason = `Recommended for high cultural resonance with ${matchedInterests.join(" & ")}.`;
    }

    return {
      id: entity.entityId,
      name,
      category,
      address,
      city,
      imageUrl,
      culturalMatch: {
        matchedInterests,
        summaryReason,
        affinityScore: entity.explainability?.score,
      },
    };
  });
}
