"use client";

import { useState } from "react";
import { Payment } from "@/lib/types";

const NETWORKS: { key: NonNullable<Payment["method"]>; label: string; envNumber?: string }[] = [
  { key: "MTN_MOMO", label: "MTN MoMo" },
  { key: "MOOV_MONEY", label: "Moov Money" },
  { key: "CELTIIS_CASH", label: "Celtiis Cash" },
];

export function ManualPaymentClaim({
  amount,
  paymentId,
  onClaimed,
}: {
  amount: number;
  paymentId: string;
  onClaimed: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [network, setNetwork] = useState<NonNullable<Payment["method"]>>("MTN_MOMO");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const numbers: Record<string, string | undefined> = {
    MTN_MOMO: process.env.NEXT_PUBLIC_MTN_MOMO_NUMBER,
    MOOV_MONEY: process.env.NEXT_PUBLIC_MOOV_MONEY_NUMBER,
    CELTIIS_CASH: process.env.NEXT_PUBLIC_CELTIIS_CASH_NUMBER,
  };

  async function confirmClaim() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payments/manual-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, method: network }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      onClaimed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-bougainvillier hover:bg-bougainvillier-deep transition text-coquillage text-xs font-medium px-4 py-2 rounded-full"
      >
        Payer {amount.toLocaleString("fr-FR")} FCFA
      </button>
    );
  }

  return (
    <div className="bg-lagune-deep text-coquillage rounded-2xl p-4 text-left text-xs space-y-3 w-full max-w-xs">
      <p className="font-medium">1. Choisissez votre réseau</p>
      <div className="flex gap-1.5">
        {NETWORKS.map((n) => (
          <button
            key={n.key}
            onClick={() => setNetwork(n.key)}
            className={`px-2.5 py-1.5 rounded-full border ${
              network === n.key ? "bg-or text-lagune-deep border-or" : "border-coquillage/25"
            }`}
          >
            {n.label}
          </button>
        ))}
      </div>

      <p className="font-medium">2. Envoyez {amount.toLocaleString("fr-FR")} FCFA au</p>
      <p className="text-lg font-display text-or">
        {numbers[network] || "numéro à configurer"}
      </p>

      <p className="font-medium">3. Confirmez ici une fois le transfert fait</p>
      {error && <p className="text-red-300">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={confirmClaim}
          disabled={loading}
          className="bg-feuille px-4 py-2 rounded-full font-medium disabled:opacity-60"
        >
          {loading ? "Envoi..." : "J'ai effectué le paiement"}
        </button>
        <button onClick={() => setOpen(false)} className="text-coquillage/50 underline">
          Annuler
        </button>
      </div>
      <p className="text-coquillage/40">
        Votre paiement passera en « vérification » jusqu'à confirmation par l'équipe.
      </p>
    </div>
  );
}
