import { NextResponse } from "next/server";
import { getMeetups } from "@/lib/data";

export async function GET() {
  const meetups = await getMeetups();
  return NextResponse.json(meetups);
}
