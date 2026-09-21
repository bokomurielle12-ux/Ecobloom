import { NextRequest, NextResponse } from "next/server";
import { createWaitlistUser, getUserByEmail } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { Formule } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { prenom, nom, email, phone, password, formule, autresInfos } = body as {
    prenom: string;
    nom: string;
    email: string;
    phone: string;
    password: string;
    formule: Formule;
    autresInfos?: string;
  };

  if (!prenom || !nom || !email || !phone || !password || !formule) {
    return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
  }

  if (await getUserByEmail(email)) {
    return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await createWaitlistUser({ prenom, nom, email, phone, passwordHash, formule, autresInfos });

  await setSessionCookie({ userId: user.id, role: user.role, name: user.name });

  return NextResponse.json({ ok: true, userId: user.id });
}
