import { ResolvedEntity } from "../types";

export interface ResolutionResult {
  entities: ResolvedEntity[];
  unresolved: string[];
}

export async function resolveInterests(
  interests: string[],
  apiKey?: string,
  baseUrl: string = "https://hackathon.api.qloo.com"
): Promise<ResolutionResult> {
  const resolved: ResolvedEntity[] = [];
  const unresolved: string[] = [];

  for (const interest of interests) {
    if (apiKey) {
      try {
        const searchUrl = `${baseUrl}/search?query=${encodeURIComponent(interest)}&take=1`;
        const res = await fetch(searchUrl, {
          method: "GET",
          headers: {
            "X-Api-Key": apiKey,
            "Accept": "application/json",
          },
          signal: AbortSignal.timeout(4000),
        });

        if (res.ok) {
          const data = await res.json();
          const first = data?.results?.[0] || data?.entities?.[0];
          if (first && first.entity_id) {
            resolved.push({
              id: first.entity_id,
              name: first.name || interest,
              type: first.type || "urn:entity",
              subtype: first.subtype,
              confidence: 0.95,
            });
            continue;
          }
        }
      } catch (err) {
        // Fall back to synthetic identifier if lookup fails
      }
    }

    // Deterministic representation for offline preview or unindexed terms
    const safeSlug = interest
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");

    resolved.push({
      id: `interest-${safeSlug}`,
      name: interest,
      type: "urn:entity:interest",
      confidence: 0.85,
    });
  }

  return {
    entities: resolved,
    unresolved,
  };
}
