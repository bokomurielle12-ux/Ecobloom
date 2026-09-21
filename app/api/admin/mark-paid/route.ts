import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPaymentById, markPaymentPaid } from "@/lib/db";

// Manual override for admins — e.g. a member paid in cash, declared a
// transfer that's now verified, or the automatic KKiaPay confirmation
// needs a human check. Preserves the network the member declared, if any.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const { paymentId } = await req.json();
  const existing = await getPaymentById(paymentId);
  const method = existing?.method ?? "MANUEL";
  const updated = await markPaymentPaid(paymentId, method, existing?.transactionId ?? null);

  return NextResponse.json({ ok: true, payment: updated });
}
