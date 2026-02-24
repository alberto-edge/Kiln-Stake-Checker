import { kilnFetch } from "@/lib/kiln";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const wallets = request.nextUrl.searchParams.get("wallets");
  if (!wallets) {
    return NextResponse.json({ error: "wallets parameter is required" }, { status: 400 });
  }

  try {
    const [v2Res, v1Res] = await Promise.all([
      kilnFetch("/eth/onchain/v2/stakes", { wallets }),
      kilnFetch("/eth/stakes", { wallets }),
    ]);

    const v2Data = v2Res.ok ? await v2Res.json() : { data: [] };
    const v1Data = v1Res.ok ? await v1Res.json() : { data: [] };

    return NextResponse.json({
      data: v2Data.data || [],
      v1_data: v1Data.data || [],
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
