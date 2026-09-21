import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPaymentById, markPaymentPaid, getUserById } from "@/lib/db";
import { verifyKkiapayTransaction } from "@/lib/kkiapay";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { paymentId, transactionId } = await req.json();
  const payment = await getPaymentById(paymentId);

  if (!payment || payment.userId !== session.userId) {
    return NextResponse.json({ error: "Paiement introuvable." }, { status: 404 });
  }

  const user = await getUserById(session.userId);
  if (!user || user.status !== "CONFIRMED") {
    return NextResponse.json(
      { error: "Votre inscription doit être confirmée par l'administration avant de pouvoir cotiser." },
      { status: 403 }
    );
  }

  try {
    const result = await verifyKkiapayTransaction(transactionId);

    if (result.status !== "SUCCESS") {
      return NextResponse.json({ error: "Le paiement n'a pas été confirmé par KKiaPay." }, { status: 402 });
    }

    const updated = await markPaymentPaid(paymentId, "MTN_MOMO", transactionId);

    return NextResponse.json({ ok: true, payment: updated });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur de vérification KKiaPay." },
      { status: 500 }
    );
  }
}
