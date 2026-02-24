import { kilnFetch } from "@/lib/kiln";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const wallets = request.nextUrl.searchParams.get("wallets");
  if (!wallets) {
    return NextResponse.json({ error: "wallets parameter is required" }, { status: 400 });
  }

  const params: Record<string, string> = { wallets, include_usd: "1" };
  const startDate = request.nextUrl.searchParams.get("start_date");
  const endDate = request.nextUrl.searchParams.get("end_date");
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;

  try {
    const [v2Res, v1Res] = await Promise.all([
      kilnFetch("/eth/onchain/v2/rewards", params),
      kilnFetch("/eth/rewards", params),
    ]);

    const v2Data = v2Res.ok ? await v2Res.json() : { data: [] };
    const v1Data = v1Res.ok ? await v1Res.json() : { data: [] };

    const data = (v2Data.data && v2Data.data.length > 0) ? v2Data.data : (v1Data.data || []);

    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
