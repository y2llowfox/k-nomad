import { NextResponse } from "next/server";
import { compareCities } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slugsParam = searchParams.get("slugs");

  if (!slugsParam) {
    return NextResponse.json({ error: "slugs parameter required" }, { status: 400 });
  }

  const slugs = slugsParam.split(",").filter(Boolean);
  const cities = await compareCities(slugs);
  return NextResponse.json(cities);
}
