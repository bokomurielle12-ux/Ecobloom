"use client";

import { motion } from "framer-motion";

const POINTS = [
  {
    title: "Fonds suivis individuellement",
    text: "Chaque cotisation est enregistrée à votre nom et vous recevez une confirmation à chaque versement, visible dans votre espace.",
    icon: "🔒",
  },
  {
    title: "Flexibilité en cas d'imprévu",
    text: "Un mois difficile ? Contactez-nous depuis votre espace : nous trouvons ensemble une solution, sans perdre votre épargne déjà versée.",
    icon: "↺",
  },
  {
    title: "Paiement sécurisé",
    text: "Les cotisations passent par KKiaPay, qui sécurise les transactions Mobile Money — aucune donnée bancaire n'est stockée sur notre site.",
    icon: "✓",
  },
  {
    title: "Partenaires vérifiés",
    text: "Hébergements et prestataires locaux sélectionnés pour leur sérieux et leur engagement dans un tourisme responsable.",
    icon: "🤝",
  },
];

export function Confiance() {
  return (
    <section id="confiance" className="relative bg-lagune-deep text-coquillage py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-or mb-4 text-center">
          Votre tranquillité
        </p>
        <h2 className="font-display text-4xl lg:text-5xl text-center mb-16">
          Une épargne en toute confiance
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl bg-coquillage/5 border border-coquillage/10 p-6"
            >
              <div className="w-11 h-11 rounded-full bg-or/15 text-lg flex items-center justify-center mb-4">
                {p.icon}
              </div>
              <h3 className="font-display text-lg mb-2">{p.title}</h3>
              <p className="font-body text-sm text-coquillage/65 leading-relaxed">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
