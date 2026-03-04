import { kilnFetch } from "@/lib/kiln";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const wallets = request.nextUrl.searchParams.get("wallets");
  if (!wallets) {
    return NextResponse.json({ error: "wallets parameter is required" }, { status: 400 });
  }

  try {
    const res = await kilnFetch("/ada/stakes", { wallets });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
    const errData = await res.json().catch(() => ({}));
    return NextResponse.json({ error: errData.message || `Kiln API error: ${res.status}`, data: [] }, { status: res.status });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
