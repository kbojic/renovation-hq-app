import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();

  return NextResponse.json({
    reply: `Advisor received: ${prompt}. AI can be connected later with an API key.`
  });
}
