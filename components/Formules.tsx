"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Bloom } from "./Bloom";

const FORMULES = [
  {
    name: "Bloom Essentiel",
    price: "25 000",
    room: "Chambre standard",
    petals: 1,
    features: [
      "Cotisation mensuelle sur 11 mois",
      "Accès complet au séjour et à toutes les activités",
      "Feu de camp, journée ludique, activité touristique",
      "Ateliers bien-être et sessions de sororité",
      "Accompagnement épargne personnalisé",
    ],
    featured: false,
  },
  {
    name: "Bloom Confort",
    price: "30 000",
    room: "Chambre confort",
    petals: 3,
    features: [
      "Cotisation mensuelle sur 11 mois",
      "Accès complet au séjour et à toutes les activités",
      "Feu de camp, journée ludique, activité touristique",
      "Ateliers bien-être et sessions de sororité",
      "Accompagnement épargne personnalisé",
    ],
    featured: true,
  },
  {
    name: "Bloom Premium",
    price: "35 000",
    room: "Chambre premium",
    petals: 5,
    features: [
      "Cotisation mensuelle sur 11 mois",
      "Accès complet au séjour et à toutes les activités",
      "Feu de camp, journée ludique, activité touristique",
      "Ateliers bien-être et sessions de sororité",
      "Accompagnement épargne personnalisé",
    ],
    featured: false,
  },
];

export function Formules() {
  return (
    <section
      id="formules"
      className="bg-lagune text-coquillage py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-or mb-4">
          Les formules
        </p>
        <h2 className="font-display text-4xl lg:text-5xl max-w-2xl leading-tight">
          Choisissez votre <span className="italic text-bougainvillier">rythme d&apos;épargne</span>
        </h2>
        <p className="font-body text-coquillage/70 max-w-xl mt-5 text-lg leading-relaxed">
          Trois formules pour s&apos;adapter à votre budget. Chaque
          cotisation mensuelle vous rapproche un peu plus du séjour.
        </p>
        <p className="font-body text-coquillage/50 max-w-xl mt-2 text-sm italic">
          Le service est identique pour toutes : seul le confort de la chambre change.
        </p>

        <div className="grid lg:grid-cols-3 gap-6 mt-16 items-stretch">
          {FORMULES.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-3xl p-8 ${
                f.featured
                  ? "bg-bougainvillier text-coquillage shadow-2xl shadow-bougainvillier/20 lg:-translate-y-4"
                  : "bg-white/[0.04] border border-white/10"
              }`}
            >
              {f.featured && (
                <span className="absolute -top-3 left-8 font-mono text-[10px] uppercase tracking-widest bg-or text-lagune-deep rounded-full px-3 py-1">
                  Recommandée
                </span>
              )}

              <div className="flex items-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, p) => (
                  <Bloom
                    key={p}
                    size={22}
                    openness={p < f.petals ? 1 : 0.15}
                    color={f.featured ? "var(--bloom-coquillage)" : "var(--bloom-bougainvillier)"}
                    center={f.featured ? "var(--bloom-or)" : "var(--bloom-or)"}
                  />
                ))}
              </div>

              <h3 className="font-display text-2xl">{f.name}</h3>
              <p className="font-mono text-3xl mt-3">
                {f.price}
                <span className="text-base font-body opacity-70"> FCFA / mois</span>
              </p>

              <ul className="flex flex-col gap-3 mt-7 mb-9 flex-1">
                {f.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-sm font-body">
                    <Check
                      size={16}
                      className={`mt-0.5 shrink-0 ${f.featured ? "text-or" : "text-feuille"}`}
                    />
                    <span className={f.featured ? "text-coquillage/90" : "text-coquillage/75"}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#rejoindre"
                className={`inline-flex items-center justify-center rounded-full px-6 py-3 font-body font-medium transition-colors ${
                  f.featured
                    ? "bg-lagune-deep text-coquillage hover:bg-black"
                    : "border border-coquillage/25 hover:border-or hover:text-or"
                }`}
              >
                Choisir cette formule
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
