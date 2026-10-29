import { QlooPlaceEntity } from "../types";
import previewFixtures from "../../../data/fixtures/qloo.preview.json";

export interface QlooConnectorResponse {
  entities: QlooPlaceEntity[];
  dataSource: "live_qloo" | "preview_fixture";
  latencyMs: number;
  statusCode?: number;
  warning?: string;
  error?: string;
}

export async function fetchQlooPlaceRecommendations(
  city: string,
  entityIds: string[],
  signalTimeoutMs: number = 8000
): Promise<QlooConnectorResponse> {
  const startTime = performance.now();
  const apiKey = process.env.QLOO_API_KEY;
  const baseUrl = process.env.QLOO_BASE_URL || "https://hackathon.api.qloo.com";

  // Check if API key is provided
  if (!apiKey || apiKey === "replace_with_your_qloo_api_key") {
    const elapsed = Math.round(performance.now() - startTime);
    return {
      entities: previewFixtures.entities as QlooPlaceEntity[],
      dataSource: "preview_fixture",
      latencyMs: elapsed,
      warning: "QLOO_API_KEY is not configured in .env.local. Running in offline preview mode with verified demo fixtures.",
    };
  }

  try {
    const params = new URLSearchParams();
    params.set("filter.type", "urn:entity:place");
    params.set("signal.location.query", city);
    params.set("take", "20");
    params.set("feature.explainability", "true");

    if (entityIds.length > 0) {
      params.set("signal.interests.entities", entityIds.join(","));
    }

    const requestUrl = `${baseUrl}/v2/insights?${params.toString()}`;

    const res = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "X-Api-Key": apiKey,
        "Accept": "application/json",
      },
      signal: AbortSignal.timeout(signalTimeoutMs),
    });

    const elapsed = Math.round(performance.now() - startTime);

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      let errorMessage = `Qloo API responded with HTTP status ${res.status}.`;
      if (res.status === 401 || res.status === 403) {
        errorMessage = "Invalid or expired Qloo API key. Please check your credentials.";
      } else if (res.status === 429) {
        errorMessage = "Qloo API rate limit exceeded. Please wait a moment before trying again.";
      }

      // Return offline fixtures as a graceful fallback with error notice
      return {
        entities: previewFixtures.entities as QlooPlaceEntity[],
        dataSource: "preview_fixture",
        latencyMs: elapsed,
        statusCode: res.status,
        warning: `${errorMessage} (Fell back to offline preview fixtures: ${errorText.substring(0, 100)})`,
      };
    }

    const data = await res.json();
    const rawEntities = data?.results?.entities || data?.entities || [];

    const entities: QlooPlaceEntity[] = rawEntities.map((e: any) => ({
      entityId: e.entity_id || e.id || "unknown-id",
      name: e.name || "Unnamed Place",
      type: e.type || "urn:entity",
      subtype: e.subtype,
      properties: {
        address: e.properties?.address,
        description: e.properties?.description,
        image: e.properties?.image,
        geocode: e.properties?.geocode,
      },
      explainability: {
        score: e.explainability?.score,
        contributingInterests: e.explainability?.contributing_interests || e.explainability?.contributingInterests,
      },
    }));

    return {
      entities,
      dataSource: "live_qloo",
      latencyMs: elapsed,
      statusCode: res.status,
    };
  } catch (err: any) {
    const elapsed = Math.round(performance.now() - startTime);
    const isTimeout = err?.name === "TimeoutError" || err?.name === "AbortError";
    const message = isTimeout ? "Qloo API request timed out after 8s." : (err?.message || "Network error");

    return {
      entities: previewFixtures.entities as QlooPlaceEntity[],
      dataSource: "preview_fixture",
      latencyMs: elapsed,
      warning: `Unable to connect to live Qloo API: ${message}. Using verified preview fixtures.`,
    };
  }
}
