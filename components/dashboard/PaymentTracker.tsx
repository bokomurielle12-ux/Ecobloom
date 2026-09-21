"use client";

import { useState } from "react";
import { Payment } from "@/lib/types";
import { KkiapayButton } from "@/components/payment/KkiapayButton";
import { ManualPaymentClaim } from "@/components/payment/ManualPaymentClaim";

const MONTH_NAMES = [
  "Mois 1", "Mois 2", "Mois 3", "Mois 4", "Mois 5", "Mois 6",
  "Mois 7", "Mois 8", "Mois 9", "Mois 10", "Mois 11",
];

const kkiapayConfigured = Boolean(process.env.NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY);

export function PaymentTracker({
  payments,
  user,
}: {
  payments: Payment[];
  user: { id: string; name: string; email: string; phone: string };
}) {
  const [status, setStatus] = useState<"idle" | "verifying" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [activePaymentId, setActivePaymentId] = useState<string | null>(null);

  // Only allow paying the next unpaid month in sequence, to keep the
  // 11-month plan orderly (matches how the admin will read the tracker).
  // A month "en vérification" (PROCESSING) still counts as "next" so a
  // later month can't be paid while an earlier one awaits confirmation.
  const nextPendingIndex = payments.findIndex((p) => p.status !== "PAID");

  return (
    <div>
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
          {errorMsg}
        </div>
      )}
      {!kkiapayConfigured && (
        <div className="bg-or/10 border border-or/30 text-lagune-deep text-xs rounded-xl px-4 py-2.5 mb-4">
          Paiement par transfert manuel — le paiement automatique par carte KKiaPay sera activé prochainement.
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {payments.map((p, i) => {
          const isPaid = p.status === "PAID";
          const isProcessing = p.status === "PROCESSING";
          const isNext = i === nextPendingIndex;
          const isActive = activePaymentId === p.id && status === "verifying";

          return (
            <div
              key={p.id}
              className={`rounded-2xl p-4 border text-center flex flex-col items-center ${
                isPaid
                  ? "bg-feuille/10 border-feuille/30"
                  : isProcessing
                  ? "bg-or/10 border-or/40"
                  : isNext
                  ? "bg-bougainvillier/5 border-bougainvillier/40"
                  : "bg-lagune-deep/[0.03] border-lagune-deep/10 opacity-60"
              }`}
            >
              <p className="text-xs uppercase tracking-wide text-lagune-deep/50 mb-1">
                {MONTH_NAMES[p.month - 1]}
              </p>
              <p className="font-display text-lg mb-2">{p.amount.toLocaleString("fr-FR")} F</p>

              {isPaid ? (
                <span className="inline-flex items-center gap-1 text-xs text-feuille font-medium">
                  ✓ Payé
                </span>
              ) : isProcessing ? (
                <span className="text-xs text-or font-medium">⏳ En vérification</span>
              ) : isNext ? (
                isActive ? (
                  <span className="text-xs text-lagune-deep/50">Vérification...</span>
                ) : kkiapayConfigured ? (
                  <KkiapayButton
                    amount={p.amount}
                    paymentId={p.id}
                    fullname={user.name}
                    email={user.email}
                    phone={user.phone}
                    onVerifying={() => {
                      setActivePaymentId(p.id);
                      setStatus("verifying");
                      setErrorMsg("");
                    }}
                    onSuccess={() => {
                      window.location.reload();
                    }}
                    onError={(msg) => {
                      setStatus("error");
                      setErrorMsg(msg);
                    }}
                  />
                ) : (
                  <ManualPaymentClaim
                    amount={p.amount}
                    paymentId={p.id}
                    onClaimed={() => window.location.reload()}
                  />
                )
              ) : (
                <span className="text-xs text-lagune-deep/35">À venir</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
