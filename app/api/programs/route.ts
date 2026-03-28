import { NextResponse } from "next/server";
import { getWorkationPrograms } from "@/lib/data";

export async function GET() {
  const programs = await getWorkationPrograms();
  return NextResponse.json(programs);
}
