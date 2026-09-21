import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getUserById,
  getPaymentsForUser,
  getMemberSummary,
  getNotificationsForUser,
  getMessagesForUser,
} from "@/lib/db";
import { FORMULE_LABELS, FORMULE_HEBERGEMENT } from "@/lib/types";
import { PaymentTracker } from "@/components/dashboard/PaymentTracker";
import { PaymentHistory } from "@/components/dashboard/PaymentHistory";
import { WhatsappJoinCard } from "@/components/dashboard/WhatsappJoinCard";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { MessagesPanel } from "@/components/dashboard/MessagesPanel";
import { StatusBanner } from "@/components/dashboard/StatusBanner";
import { LogoutButton } from "@/components/LogoutButton";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await getUserById(session.userId);
  if (!user) redirect("/login");

  const payments = await getPaymentsForUser(user.id);
  const summary = await getMemberSummary(user.id);
  const notifications = await getNotificationsForUser(user.id);
  const messages = await getMessagesForUser(user.id);
  const progressPct = Math.round((summary.paidCount / summary.monthsTotal) * 100);
  const isConfirmed = user.status === "CONFIRMED";

  return (
    <div className="min-h-screen bg-coquillage text-lagune-deep">
      <header className="border-b border-lagune-deep/10 bg-coquillage/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-display text-xl">EcoBloom</span>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl mb-1">Bonjour {user.name.split(" ")[0]} 🌸</h1>
        <p className="text-lagune-deep/60 mb-8">Voici le suivi de votre parcours EcoBloom 2027.</p>

        {!isConfirmed && (
          <div className="mb-8">
            <StatusBanner status={user.status} formule={user.formule} />
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-lagune-deep text-coquillage rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wide text-coquillage/50 mb-1">Formule</p>
            <p className="font-display text-xl">{FORMULE_LABELS[user.formule]}</p>
            <p className="text-xs text-coquillage/45 mt-1">{FORMULE_HEBERGEMENT[user.formule]}</p>
          </div>
          <div className="bg-sable rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wide text-lagune-deep/50 mb-1">Total épargné</p>
            <p className="font-display text-xl">{summary.totalPaid.toLocaleString("fr-FR")} FCFA</p>
            <p className="text-xs text-lagune-deep/45 mt-1">
              sur {summary.totalDue.toLocaleString("fr-FR")} FCFA
            </p>
          </div>
          <div className="bg-sable rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wide text-lagune-deep/50 mb-1">Progression</p>
            <p className="font-display text-xl">
              {summary.paidCount} / {summary.monthsTotal} mois
            </p>
            <div className="h-1.5 bg-lagune-deep/10 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-or" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        {isConfirmed && (
          <div className="mb-8">
            <WhatsappJoinCard alreadyJoined={user.whatsappJoined} />
          </div>
        )}

        {isConfirmed && (
          <>
            <h2 className="font-display text-xl mb-4">Mon suivi mensuel</h2>
            <div className="mb-8">
              <PaymentTracker
                payments={payments}
                user={{ id: user.id, name: user.name, email: user.email, phone: user.phone }}
              />
            </div>
          </>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {isConfirmed && <PaymentHistory payments={payments} />}
          <NotificationsPanel initial={notifications} />
        </div>

        <MessagesPanel initial={messages} />
      </main>
    </div>
  );
}
