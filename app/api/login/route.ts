import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, ensureAdminAccount } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Lazily provisions the admin account (from ADMIN_EMAIL / ADMIN_PASSWORD,
  // or the ecobloom60@gmail.com / admin1234 default) the first time anyone
  // logs in, so a fresh deployment or a copy where `npm run seed` was
  // skipped still has a working admin space.
  await ensureAdminAccount();

  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
  }

  await setSessionCookie({ userId: user.id, role: user.role, name: user.name });

  return NextResponse.json({ ok: true, role: user.role });
}
