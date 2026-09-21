import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { respondToFeedback } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }
  const { feedbackId, response } = await req.json();
  const item = await respondToFeedback(feedbackId, response);
  if (!item) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  return NextResponse.json({ ok: true, item });
}
