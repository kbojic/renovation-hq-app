import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    contractors: [],
    note: "Google Places can be connected later with GOOGLE_PLACES_API_KEY."
  });
}
