import { Payment } from "@/lib/types";

const METHOD_LABELS: Record<string, string> = {
  MTN_MOMO: "MTN Mobile Money",
  MOOV_MONEY: "Moov Money",
  CELTIIS_CASH: "Celtiis Cash",
  MANUEL: "Enregistré manuellement",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

export function PaymentHistory({ payments }: { payments: Payment[] }) {
  const paid = payments.filter((p) => p.status === "PAID").sort((a, b) => a.month - b.month);

  return (
    <div className="bg-white rounded-2xl border border-lagune-deep/10">
      <h3 className="font-display text-lg px-5 py-4 border-b border-lagune-deep/5">
        Historique des paiements
      </h3>
      <div className="divide-y divide-lagune-deep/5">
        {paid.length === 0 && (
          <p className="px-5 py-6 text-center text-sm text-lagune-deep/40">
            Aucun paiement enregistré pour l&apos;instant.
          </p>
        )}
        {paid.map((p) => (
          <div key={p.id} className="px-5 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Mois {p.month}</p>
              <p className="text-xs text-lagune-deep/45">
                {p.paidAt ? formatDate(p.paidAt) : ""} · {METHOD_LABELS[p.method ?? ""] ?? p.method}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{p.amount.toLocaleString("fr-FR")} F</p>
              <span className="text-xs text-feuille">✓ Payé</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
