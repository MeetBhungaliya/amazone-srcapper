import { NextResponse } from "next/server";

export async function GET() {
  const healthStatus = {
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date(),
  };

  return NextResponse.json(healthStatus, { status: 200 });
}
