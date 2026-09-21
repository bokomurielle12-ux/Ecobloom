import { MemberStatus, FORMULE_LABELS, Formule } from "@/lib/types";

export function StatusBanner({ status, formule }: { status: MemberStatus; formule: Formule }) {
  if (status === "PENDING") {
    return (
      <div className="bg-or/10 border border-or/30 rounded-2xl p-6 flex items-start gap-4">
        <span className="text-2xl">⏳</span>
        <div>
          <h2 className="font-display text-xl mb-1">Votre demande est en cours d&apos;examen</h2>
          <p className="text-sm text-lagune-deep/65 leading-relaxed">
            Vous avez choisi la formule <strong>{FORMULE_LABELS[formule]}</strong>. Notre équipe
            valide les inscriptions dans l&apos;ordre d&apos;arrivée — vous recevrez une
            notification dès que votre place est confirmée. Le suivi de vos cotisations et
            l&apos;accès au groupe WhatsApp s&apos;activeront automatiquement à ce moment-là.
          </p>
        </div>
      </div>
    );
  }

  if (status === "REFUSED") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
        <span className="text-2xl">✕</span>
        <div>
          <h2 className="font-display text-xl mb-1">Inscription non retenue</h2>
          <p className="text-sm text-lagune-deep/65 leading-relaxed">
            Votre demande n&apos;a pas pu être retenue pour cette édition. N&apos;hésitez pas à
            nous contacter pour en savoir plus, ou à candidater à une prochaine édition.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
