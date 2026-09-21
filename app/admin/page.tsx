import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getWaitlist, getConfirmedMembers, getAllPayments, getActivity, getPaymentsThisMonth, getLatePayments, getAllMessages, getAllClients } from "@/lib/db";
import { FORMULE_LABELS, DUREE_MOIS } from "@/lib/types";
import { LogoutButton } from "@/components/LogoutButton";
import { ConfirmRefuseButtons } from "@/components/admin/ConfirmRefuseButtons";
import { MessagesInbox } from "@/components/admin/MessagesInbox";
import { MarkPaidButton } from "@/components/admin/MarkPaidButton";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} j`;
}

export default async function AdminPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login?next=/admin");

  const waitlist = await getWaitlist();
  const confirmed = await getConfirmedMembers();
  const payments = await getAllPayments();
  const activity = await getActivity(15);
  const paymentsThisMonth = await getPaymentsThisMonth();
  const latePayments = await getLatePayments();
  const clients = await getAllClients();
  const lateWithUser = latePayments
    .map((payment) => ({ payment, user: clients.find((c) => c.id === payment.userId) }))
    .filter((x): x is { payment: (typeof latePayments)[number]; user: NonNullable<typeof x.user> } => !!x.user);
  const messages = await getAllMessages();
  const allClients = clients;

  const processingPayments = payments
    .filter((p) => p.status === "PROCESSING")
    .map((payment) => ({ payment, user: allClients.find((c) => c.id === payment.userId) }))
    .filter((x): x is { payment: (typeof payments)[number]; user: NonNullable<typeof x.user> } => !!x.user);

  const totalCollected = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);
  const collectedThisMonth = paymentsThisMonth.reduce((sum, p) => sum + p.amount, 0);
  const activeCount = confirmed.filter((c) =>
    payments.some((p) => p.userId === c.id && p.status === "PAID")
  ).length;

  const userNames: Record<string, string> = {};
  allClients.forEach((u) => (userNames[u.id] = u.name));

  const rows = confirmed.map((c) => {
    const own = payments.filter((p) => p.userId === c.id);
    const paidCount = own.filter((p) => p.status === "PAID").length;
    const totalPaid = own.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
    return { ...c, paidCount, totalPaid };
  });

  const stats = [
    { label: "Liste d'attente", value: waitlist.length },
    { label: "Participantes confirmées", value: confirmed.length },
    { label: "Participantes actives", value: activeCount },
    { label: "Paiements en retard", value: latePayments.length },
  ];

  return (
    <div className="min-h-screen bg-coquillage text-lagune-deep">
      <header className="border-b border-lagune-deep/10 bg-coquillage/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-display text-xl">EcoBloom · Admin</span>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-sable rounded-2xl p-5">
              <p className="text-xs uppercase tracking-wide text-lagune-deep/50 mb-1">{s.label}</p>
              <p className="font-display text-2xl">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-lagune-deep text-coquillage rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wide text-coquillage/50 mb-1">Montant collecté (total)</p>
            <p className="font-display text-2xl">{totalCollected.toLocaleString("fr-FR")} FCFA</p>
          </div>
          <div className="bg-lagune-deep text-coquillage rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wide text-coquillage/50 mb-1">Collecté ce mois-ci</p>
            <p className="font-display text-2xl">{collectedThisMonth.toLocaleString("fr-FR")} FCFA</p>
            <p className="text-xs text-coquillage/45 mt-1">{paymentsThisMonth.length} paiement(s)</p>
          </div>
        </div>

        {waitlist.length > 0 && (
          <div className="mb-10">
            <h2 className="font-display text-xl mb-4">
              Demandes en attente <span className="text-lagune-deep/40 text-base">({waitlist.length})</span>
            </h2>
            <div className="bg-white rounded-2xl border border-lagune-deep/10 divide-y divide-lagune-deep/5">
              {waitlist.map((w) => (
                <div key={w.id} className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm">{w.name}</p>
                    <p className="text-xs text-lagune-deep/45">
                      {w.email} · {w.phone} · {FORMULE_LABELS[w.formule]}
                    </p>
                    {w.autresInfos && (
                      <p className="text-xs text-lagune-deep/50 mt-1 italic">« {w.autresInfos} »</p>
                    )}
                  </div>
                  <ConfirmRefuseButtons userId={w.id} />
                </div>
              ))}
            </div>
          </div>
        )}

        {processingPayments.length > 0 && (
          <div className="mb-10">
            <h2 className="font-display text-xl mb-4 text-or">
              Paiements à confirmer{" "}
              <span className="text-lagune-deep/40 text-base">({processingPayments.length})</span>
            </h2>
            <div className="bg-or/10 border border-or/30 rounded-2xl divide-y divide-or/20">
              {processingPayments.map(({ user, payment }) => (
                <div key={payment.id} className="px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-sm">
                    {user.name} — mois {payment.month} · {payment.amount.toLocaleString("fr-FR")} FCFA ·{" "}
                    <span className="text-lagune-deep/50">{payment.method}</span>
                  </span>
                  <MarkPaidButton paymentId={payment.id} label="Confirmer réception" />
                </div>
              ))}
            </div>
          </div>
        )}

        {latePayments.length > 0 && (
          <div className="mb-10">
            <h2 className="font-display text-xl mb-4 text-red-700">
              Paiements en retard <span className="text-lagune-deep/40 text-base">({latePayments.length})</span>
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-2xl divide-y divide-red-200/60">
              {lateWithUser.slice(0, 8).map(({ user, payment }) => (
                <div key={payment.id} className="px-5 py-3 flex items-center justify-between text-sm">
                  <span>
                    {user.name} — mois {payment.month}
                  </span>
                  <span className="text-red-700 font-medium">
                    {payment.amount.toLocaleString("fr-FR")} F
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl mb-4">Participantes confirmées</h2>
            <div className="bg-white rounded-2xl border border-lagune-deep/10 overflow-hidden overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead className="bg-sable/60 text-lagune-deep/60 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-4 py-3">Membre</th>
                    <th className="text-left px-4 py-3">Formule</th>
                    <th className="text-left px-4 py-3">Progression</th>
                    <th className="text-left px-4 py-3">Total payé</th>
                    <th className="text-left px-4 py-3">WhatsApp</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-t border-lagune-deep/5">
                      <td className="px-4 py-3">
                        <p className="font-medium">{r.name}</p>
                        <p className="text-xs text-lagune-deep/45">{r.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-xs">{FORMULE_LABELS[r.formule]}</td>
                      <td className="px-4 py-3 text-xs">
                        {r.paidCount}/{DUREE_MOIS} mois
                      </td>
                      <td className="px-4 py-3 text-xs">{r.totalPaid.toLocaleString("fr-FR")} F</td>
                      <td className="px-4 py-3 text-xs">
                        {r.whatsappJoined ? (
                          <span className="text-feuille">✓ Dans le groupe</span>
                        ) : (
                          <span className="text-lagune-deep/35">Pas encore</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/${r.id}`}
                          className="text-xs text-bougainvillier underline underline-offset-4"
                        >
                          Détails
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-lagune-deep/40 text-sm">
                        Aucune participante confirmée pour le moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl mb-4">Activité récente</h2>
            <div className="bg-white rounded-2xl border border-lagune-deep/10 divide-y divide-lagune-deep/5 max-h-[440px] overflow-y-auto">
              {activity.map((a) => (
                <div key={a.id} className="px-4 py-3">
                  <p className="text-sm">{a.message}</p>
                  <p className="text-xs text-lagune-deep/40 mt-0.5">{timeAgo(a.createdAt)}</p>
                </div>
              ))}
              {activity.length === 0 && (
                <p className="px-4 py-8 text-center text-lagune-deep/40 text-sm">Rien à signaler.</p>
              )}
            </div>
          </div>
        </div>

        <h2 className="font-display text-xl mb-4">
          Suggestions & questions <span className="text-lagune-deep/40 text-base">({messages.length})</span>
        </h2>
        <MessagesInbox initial={messages} userNames={userNames} />
      </main>
    </div>
  );
}
