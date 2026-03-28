import { NextResponse } from "next/server";
import { getNearbyCities } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const cities = await getNearbyCities(slug);
  return NextResponse.json(cities);
}
