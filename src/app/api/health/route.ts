import { NextResponse } from "next/server";

export async function GET() {
  const hasKey = Boolean(process.env.QLOO_API_KEY && process.env.QLOO_API_KEY !== "replace_with_your_qloo_api_key");

  return NextResponse.json({
    status: "ok",
    service: "OpenDoor Accessibility Discovery Agent",
    version: "1.0.0",
    qlooIntegration: {
      mode: hasKey ? "live_qloo" : "offline_preview_fixtures",
      baseUrl: process.env.QLOO_BASE_URL || "https://hackathon.api.qloo.com",
      keyConfigured: hasKey,
    },
    timestamp: new Date().toISOString(),
  });
}
