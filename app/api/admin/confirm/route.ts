import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { confirmUser } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }
  const { userId } = await req.json();
  const user = await confirmUser(userId);
  if (!user) return NextResponse.json({ error: "Membre introuvable." }, { status: 404 });
  return NextResponse.json({ ok: true, user });
}
