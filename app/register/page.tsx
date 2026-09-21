"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FORMULE_LABELS, FORMULE_PRICES, FORMULE_HEBERGEMENT } from "@/lib/types";
import { PasswordInput } from "@/components/PasswordInput";

const FORMULES = ["ESSENTIEL", "CONFORT", "PREMIUM"] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    phone: "",
    password: "",
    formule: "CONFORT" as (typeof FORMULES)[number],
    autresInfos: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-lagune text-coquillage flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-or/15 text-or flex items-center justify-center mx-auto mb-6 text-2xl">
            ⏳
          </div>
          <h1 className="font-display text-3xl mb-3">Vous êtes sur la liste d&apos;attente 🌸</h1>
          <p className="text-coquillage/70 mb-8 leading-relaxed">
            Merci pour votre inscription ! Notre équipe examine votre demande et vous confirmera
            votre place très prochainement. Vous pourrez suivre le statut de votre dossier depuis
            votre espace personnel.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 bg-bougainvillier text-coquillage px-6 py-3 rounded-full font-medium hover:bg-bougainvillier-deep transition"
          >
            Accéder à mon espace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lagune text-coquillage flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full">
        <h1 className="font-display text-3xl mb-2 text-center">Rejoindre la liste d&apos;attente</h1>
        <p className="text-coquillage/60 text-center mb-8 text-sm">
          Remplissez le formulaire ci-dessous, notre équipe validera votre inscription.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="Prénom"
              value={form.prenom}
              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
              className="w-full rounded-full px-5 py-3 text-sm text-lagune-deep bg-coquillage placeholder:text-lagune-deep/40 focus:outline-none focus:ring-2 focus:ring-or"
            />
            <input
              required
              placeholder="Nom"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className="w-full rounded-full px-5 py-3 text-sm text-lagune-deep bg-coquillage placeholder:text-lagune-deep/40 focus:outline-none focus:ring-2 focus:ring-or"
            />
          </div>
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-full px-5 py-3 text-sm text-lagune-deep bg-coquillage placeholder:text-lagune-deep/40 focus:outline-none focus:ring-2 focus:ring-or"
          />
          <input
            required
            placeholder="Numéro de téléphone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-full px-5 py-3 text-sm text-lagune-deep bg-coquillage placeholder:text-lagune-deep/40 focus:outline-none focus:ring-2 focus:ring-or"
          />
          <PasswordInput
            value={form.password}
            onChange={(password) => setForm({ ...form, password })}
          />
          <div className="grid grid-cols-3 gap-2">
            {FORMULES.map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => setForm({ ...form, formule: f })}
                className={`rounded-xl px-2 py-3 text-xs font-medium border transition ${
                  form.formule === f
                    ? "bg-bougainvillier border-bougainvillier text-coquillage"
                    : "border-coquillage/20 text-coquillage/70"
                }`}
              >
                {FORMULE_LABELS[f].replace("Bloom ", "")}
                <br />
                <span className="opacity-70">{FORMULE_PRICES[f].toLocaleString("fr-FR")} F</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-coquillage/45 px-2">{FORMULE_HEBERGEMENT[form.formule]}</p>
          <textarea
            placeholder="Autres informations utiles (allergies, questions, préférences...) — optionnel"
            value={form.autresInfos}
            onChange={(e) => setForm({ ...form, autresInfos: e.target.value })}
            rows={3}
            className="w-full rounded-2xl px-5 py-3 text-sm text-lagune-deep bg-coquillage placeholder:text-lagune-deep/40 focus:outline-none focus:ring-2 focus:ring-or resize-none"
          />
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-bougainvillier hover:bg-bougainvillier-deep transition rounded-full py-3 text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Envoi de la demande..." : "Rejoindre la liste d'attente"}
          </button>
        </form>
        <p className="text-center text-xs text-coquillage/50 mt-6">
          Déjà inscrite ?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
