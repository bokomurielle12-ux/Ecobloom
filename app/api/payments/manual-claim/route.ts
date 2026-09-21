import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPaymentById, markPaymentProcessing } from "@/lib/db";
import { Payment } from "@/lib/types";

// Fallback path used while KKiaPay isn't configured yet (or if a client
// simply prefers to pay by direct transfer): the member declares she has
// sent the money to one of the Mobile Money numbers, the payment goes to
// "PROCESSING", and an admin confirms it once the funds are verified.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { paymentId, method } = (await req.json()) as {
    paymentId: string;
    method: Payment["method"];
  };

  const payment = await getPaymentById(paymentId);
  if (!payment || payment.userId !== session.userId) {
    return NextResponse.json({ error: "Paiement introuvable." }, { status: 404 });
  }
  if (payment.status === "PAID") {
    return NextResponse.json({ error: "Ce mois est déjà payé." }, { status: 400 });
  }

  const updated = await markPaymentProcessing(paymentId, method ?? "MANUEL");
  return NextResponse.json({ ok: true, payment: updated });
}
