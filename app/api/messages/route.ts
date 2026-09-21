import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createMessage } from "@/lib/db";
import { MessageType } from "@/lib/types";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }
  const { type, content } = (await req.json()) as { type: MessageType; content: string };
  if (!content?.trim()) {
    return NextResponse.json({ error: "Le message ne peut pas être vide." }, { status: 400 });
  }
  const message = await createMessage(session.userId, type, content.trim());
  return NextResponse.json({ ok: true, message });
}
