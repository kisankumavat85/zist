import { inngest } from "@/lib/inngest/client";
import { NextResponse } from "next/server";

// Opt out of caching; every request should send a new event
export const dynamic = "force-dynamic";

export async function GET() {
  await inngest.send({
    name: "test/hello.world",
    data: {
      email: "testUser@example.com",
    },
  });

  return NextResponse.json({ message: "Event sent!" });
}
