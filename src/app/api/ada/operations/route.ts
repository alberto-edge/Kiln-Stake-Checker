import { kilnFetch } from "@/lib/kiln";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const wallets = request.nextUrl.searchParams.get("wallets");
  if (!wallets) {
    return NextResponse.json({ error: "wallets parameter is required" }, { status: 400 });
  }

  const params: Record<string, string> = { wallets };
  const startDate = request.nextUrl.searchParams.get("start_date");
  const endDate = request.nextUrl.searchParams.get("end_date");
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;

  try {
    const res = await kilnFetch("/ada/operations", params);
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
    return NextResponse.json({ data: [] });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
