import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { markWhatsappJoined } from "@/lib/db";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }
  await markWhatsappJoined(session.userId);
  return NextResponse.json({ ok: true });
}
