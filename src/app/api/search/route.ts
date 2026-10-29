import { NextRequest, NextResponse } from "next/server";
import { runDiscoveryAgent } from "@/lib/agent/pipeline";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await runDiscoveryAgent(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred while processing discovery request.",
        details: err?.message,
      },
      { status: 500 }
    );
  }
}
