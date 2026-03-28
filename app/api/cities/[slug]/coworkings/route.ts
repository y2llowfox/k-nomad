import { NextResponse } from "next/server";
import { getCoworkingsForCity } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const coworkings = await getCoworkingsForCity(slug);
  return NextResponse.json(coworkings);
}
