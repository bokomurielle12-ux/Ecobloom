"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    openKkiapayWidget?: (options: Record<string, unknown>) => void;
    addSuccessListener?: (cb: (response: { transactionId: string }) => void) => void;
    addFailedListener?: (cb: (response: unknown) => void) => void;
  }
}

interface KkiapayButtonProps {
  amount: number;
  paymentId: string;
  fullname: string;
  email: string;
  phone: string;
  onVerifying: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export function KkiapayButton({
  amount,
  paymentId,
  fullname,
  email,
  phone,
  onVerifying,
  onSuccess,
  onError,
}: KkiapayButtonProps) {
  const [scriptReady, setScriptReady] = useState(false);
  const publicKey = process.env.NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY;
  const sandbox = process.env.NEXT_PUBLIC_KKIAPAY_SANDBOX !== "false";

  useEffect(() => {
    if (!scriptReady || !window.addSuccessListener) return;

    window.addSuccessListener(async (response) => {
      onVerifying();
      try {
        const res = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, transactionId: response.transactionId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Vérification échouée");
        onSuccess();
      } catch (err) {
        onError(err instanceof Error ? err.message : "Erreur de vérification");
      }
    });

    window.addFailedListener?.(() => {
      onError("Le paiement a été annulé ou a échoué.");
    });
  }, [scriptReady, paymentId, onVerifying, onSuccess, onError]);

  function openWidget() {
    if (!window.openKkiapayWidget) {
      onError("Le module de paiement n'a pas pu se charger. Réessaie.");
      return;
    }
    window.openKkiapayWidget({
      amount,
      key: publicKey,
      sandbox,
      fullname,
      email,
      phone,
      data: paymentId,
      // MVP: MTN Mobile Money only. Remove this line to accept every
      // network KKiaPay supports (Moov, Celtiis...).
      partner_id: "mtn",
    });
  }

  return (
    <>
      <Script
        src="https://cdn.kkiapay.me/k.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <button
        onClick={openWidget}
        className="bg-bougainvillier hover:bg-bougainvillier-deep transition text-coquillage text-sm font-medium px-5 py-2.5 rounded-full"
      >
        Payer {amount.toLocaleString("fr-FR")} FCFA · MTN MoMo
      </button>
    </>
  );
}

