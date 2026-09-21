import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getUserById, getPaymentsForUser, getMemberSummary, getMessagesForUser } from "@/lib/db";
import { FORMULE_LABELS, FORMULE_HEBERGEMENT } from "@/lib/types";
import { MarkPaidButton } from "@/components/admin/MarkPaidButton";
import { ConfirmRefuseButtons } from "@/components/admin/ConfirmRefuseButtons";
import { LogoutButton } from "@/components/LogoutButton";

const MONTH_NAMES = [
  "Mois 1", "Mois 2", "Mois 3", "Mois 4", "Mois 5", "Mois 6",
  "Mois 7", "Mois 8", "Mois 9", "Mois 10", "Mois 11",
];

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente de validation",
  CONFIRMED: "Confirmée",
  REFUSED: "Refusée",
};

export default async function AdminMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login?next=/admin");

  const { id } = await params;
  const member = await getUserById(id);
  if (!member) notFound();

  const payments = await getPaymentsForUser(member.id);
  const summary = await getMemberSummary(member.id);
  const messages = await getMessagesForUser(member.id);

  return (
    <div className="min-h-screen bg-coquillage text-lagune-deep">
      <header className="border-b border-lagune-deep/10 bg-coquillage/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-display text-xl">EcoBloom · Admin</span>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <Link href="/admin" className="text-xs text-bougainvillier underline underline-offset-4">
          ← Retour à la liste
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4 mt-4 mb-1">
          <h1 className="font-display text-3xl">{member.name}</h1>
          {member.status === "PENDING" && <ConfirmRefuseButtons userId={member.id} />}
        </div>
        <p className="text-lagune-deep/55 text-sm mb-1">
          {member.email} · {member.phone}
        </p>
        <p className="text-xs mb-8">
          Statut :{" "}
          <span
            className={
              member.status === "CONFIRMED"
                ? "text-feuille font-medium"
                : member.status === "REFUSED"
                ? "text-red-600 font-medium"
                : "text-or font-medium"
            }
          >
            {STATUS_LABELS[member.status]}
          </span>
        </p>

        {member.autresInfos && (
          <div className="bg-sable/60 rounded-xl px-4 py-3 mb-8 text-sm">
            <span className="text-xs uppercase tracking-wide text-lagune-deep/45 block mb-1">
              Informations complémentaires
            </span>
            {member.autresInfos}
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-lagune-deep text-coquillage rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wide text-coquillage/50 mb-1">Formule</p>
            <p className="font-display text-lg">{FORMULE_LABELS[member.formule]}</p>
            <p className="text-xs text-coquillage/45 mt-1">{FORMULE_HEBERGEMENT[member.formule]}</p>
          </div>
          <div className="bg-sable rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wide text-lagune-deep/50 mb-1">Total payé</p>
            <p className="font-display text-lg">{summary.totalPaid.toLocaleString("fr-FR")} FCFA</p>
          </div>
          <div className="bg-sable rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wide text-lagune-deep/50 mb-1">Groupe WhatsApp</p>
            <p className="font-display text-lg">{member.whatsappJoined ? "Rejoint" : "Pas encore"}</p>
          </div>
        </div>

        {member.status === "CONFIRMED" && (
          <>
            <h2 className="font-display text-xl mb-4">Suivi mensuel</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-10">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className={`rounded-2xl p-4 border text-center ${
                    p.status === "PAID"
                      ? "bg-feuille/10 border-feuille/30"
                      : p.status === "PROCESSING"
                      ? "bg-or/10 border-or/40"
                      : "bg-lagune-deep/[0.03] border-lagune-deep/10"
                  }`}
                >
                  <p className="text-xs uppercase tracking-wide text-lagune-deep/50 mb-1">
                    {MONTH_NAMES[p.month - 1]}
                  </p>
                  <p className="font-display text-lg mb-2">{p.amount.toLocaleString("fr-FR")} F</p>
                  {p.status === "PAID" ? (
                    <div>
                      <span className="text-xs text-feuille font-medium block">✓ Payé</span>
                      <span className="text-[10px] text-lagune-deep/40">{p.method}</span>
                    </div>
                  ) : p.status === "PROCESSING" ? (
                    <div className="space-y-1">
                      <span className="text-[10px] text-or font-medium block">
                        Déclaré · {p.method}
                      </span>
                      <MarkPaidButton paymentId={p.id} label="Confirmer réception" />
                    </div>
                  ) : (
                    <MarkPaidButton paymentId={p.id} />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <h2 className="font-display text-xl mb-4">
          Messages <span className="text-lagune-deep/40 text-base">({messages.length})</span>
        </h2>
        <div className="bg-white rounded-2xl border border-lagune-deep/10 divide-y divide-lagune-deep/5">
          {messages.length === 0 && (
            <p className="px-5 py-6 text-center text-sm text-lagune-deep/40">Aucun message envoyé.</p>
          )}
          {messages.map((m) => (
            <div key={m.id} className="px-5 py-3">
              <span className="text-[11px] uppercase tracking-wide text-bougainvillier-deep">
                {m.type === "QUESTION" ? "Question" : "Suggestion"}
              </span>
              <p className="text-sm">{m.message}</p>
              {m.response && (
                <p className="text-xs text-feuille mt-1">Répondu : {m.response}</p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
