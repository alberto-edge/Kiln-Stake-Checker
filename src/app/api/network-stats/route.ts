import { kilnFetch } from "@/lib/kiln";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const integration = request.nextUrl.searchParams.get("integration");
  if (!integration) {
    return NextResponse.json({ error: "integration parameter is required" }, { status: 400 });
  }

  try {
    const res = await kilnFetch("/eth/onchain/v2/network-stats", { integration });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
