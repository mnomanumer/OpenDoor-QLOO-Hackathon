import { UserDiscoveryRequest, DiscoveryResponse, AgentStageLog, AgentTrace } from "../types";
import { validateDiscoveryRequest } from "./validator";
import { resolveInterests } from "./resolver";
import { fetchQlooPlaceRecommendations } from "./qlooConnector";
import { normalizeQlooPlaces } from "./normalizer";
import { matchPlacesToEvidence } from "./evidenceMatcher";
import { rankAndAssessResults } from "./transparentRanker";

export async function runDiscoveryAgent(rawRequest: unknown): Promise<DiscoveryResponse> {
  const overallStart = performance.now();
  const requestId = `trace-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const stages: AgentStageLog[] = [];

  // STAGE 1: Request Validation
  const stage1Start = performance.now();
  const validation = validateDiscoveryRequest(rawRequest);
  const stage1Latency = Math.round(performance.now() - stage1Start);

  if (!validation.isValid || !validation.sanitized) {
    stages.push({
      stageNumber: 1,
      name: "Request Validation",
      status: "error",
      latencyMs: stage1Latency,
      details: `Input validation failed: ${validation.errors.join("; ")}`,
    });

    const totalLatency = Math.round(performance.now() - overallStart);
    const trace: AgentTrace = {
      requestId,
      timestamp: new Date().toISOString(),
      city: "Unknown",
      interests: [],
      mobilityRequirement: "wheelchair_access",
      executionMode: "preview_fixture",
      stages,
      totalLatencyMs: totalLatency,
      resultsCount: 0,
      evidenceMatchedCount: 0,
    };

    return {
      success: false,
      results: [],
      trace,
      error: validation.errors.join("; "),
    };
  }

  const { city, interests, mobilityRequirement } = validation.sanitized;
  stages.push({
    stageNumber: 1,
    name: "Request Validation & Normalization",
    status: "success",
    latencyMs: stage1Latency,
    details: `Validated query for ${city} with ${interests.length} cultural interest(s) and '${mobilityRequirement}' mobility filter.`,
    metadata: { city, interestsCount: interests.length, mobilityRequirement },
  });

  // STAGE 2: Cultural Interest Resolution
  const stage2Start = performance.now();
  const resolution = await resolveInterests(interests, process.env.QLOO_API_KEY, process.env.QLOO_BASE_URL);
  const stage2Latency = Math.round(performance.now() - stage2Start);

  stages.push({
    stageNumber: 2,
    name: "Interest Resolution",
    status: "success",
    latencyMs: stage2Latency,
    details: `Resolved ${resolution.entities.length} cultural entities to seed Qloo taste graph.`,
    metadata: { resolvedEntities: resolution.entities.map((e) => e.name) },
  });

  // STAGE 3: Qloo Insights Connector
  const stage3Start = performance.now();
  const entityIds = resolution.entities.map((e) => e.id);
  const qlooRes = await fetchQlooPlaceRecommendations(city, entityIds);
  const stage3Latency = Math.round(performance.now() - stage3Start);

  stages.push({
    stageNumber: 3,
    name: "Qloo Cultural Insights Call",
    status: qlooRes.warning ? "warning" : "success",
    latencyMs: stage3Latency,
    details: qlooRes.warning || `Retrieved ${qlooRes.entities.length} cultural venues from Qloo Insights API.`,
    metadata: {
      dataSource: qlooRes.dataSource,
      returnedEntitiesCount: qlooRes.entities.length,
      statusCode: qlooRes.statusCode,
    },
  });

  // STAGE 4: Place Normalization & Explainability Extraction
  const stage4Start = performance.now();
  const normalizedPlaces = normalizeQlooPlaces(qlooRes.entities, interests, city);
  const stage4Latency = Math.round(performance.now() - stage4Start);

  stages.push({
    stageNumber: 4,
    name: "Place Normalization & Signal Extraction",
    status: "success",
    latencyMs: stage4Latency,
    details: `Extracted taste affinity signals and cultural match justifications for ${normalizedPlaces.length} venues.`,
  });

  // STAGE 5: Grounded Accessibility Evidence Matching
  const stage5Start = performance.now();
  const matchedPlaces = matchPlacesToEvidence(normalizedPlaces);
  const matchedCount = matchedPlaces.filter((m) => m.evidence !== null).length;
  const stage5Latency = Math.round(performance.now() - stage5Start);

  stages.push({
    stageNumber: 5,
    name: "Accessibility Evidence Matching",
    status: "success",
    latencyMs: stage5Latency,
    details: `Conservatively linked ${matchedCount} of ${matchedPlaces.length} venues to independently verified physical access audits.`,
    metadata: { matchedWithVerifiedEvidence: matchedCount, unverifiedCount: matchedPlaces.length - matchedCount },
  });

  // STAGE 6: Multi-Criteria Assessment & Transparent Ranking
  const stage6Start = performance.now();
  const rankedResults = rankAndAssessResults(matchedPlaces, mobilityRequirement, qlooRes.dataSource);
  const stage6Latency = Math.round(performance.now() - stage6Start);

  stages.push({
    stageNumber: 6,
    name: "Explainable Ranking & Safety Prioritization",
    status: "success",
    latencyMs: stage6Latency,
    details: `Prioritized venues with verified accessibility claims, followed by cultural taste relevance. Strictly assigned 'unknown' to unverified venues.`,
  });

  // STAGE 7: Audit Trace Generation
  const totalLatencyMs = Math.round(performance.now() - overallStart);
  stages.push({
    stageNumber: 7,
    name: "Audit Trail & Verification Packaging",
    status: "success",
    latencyMs: 1,
    details: `Trace packaging completed in ${totalLatencyMs}ms total pipeline duration.`,
  });

  const trace: AgentTrace = {
    requestId,
    timestamp: new Date().toISOString(),
    city,
    interests,
    mobilityRequirement,
    executionMode: qlooRes.dataSource,
    stages,
    totalLatencyMs,
    resultsCount: rankedResults.length,
    evidenceMatchedCount: matchedCount,
  };

  return {
    success: true,
    results: rankedResults,
    trace,
  };
}
