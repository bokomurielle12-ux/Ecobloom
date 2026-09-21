"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const QA = [
  {
    q: "Qui peut participer à EcoBloom 2027 ?",
    a: "Toute femme majeure souhaitant préparer un séjour bien-être collectif au Bénin : entrepreneures, salariées, indépendantes. La cotisation peut aussi être offerte par un proche.",
  },
  {
    q: "Comment fonctionne l'épargne ?",
    a: "Vous choisissez une formule (Essentiel, Confort ou Premium) et versez une cotisation mensuelle fixe pendant 11 mois. Le montant total finance directement votre place au séjour collectif.",
  },
  {
    q: "Quelle est la destination du séjour ?",
    a: "Pour cette édition pilote 2027, le séjour se déroule sur la côte béninoise, à Grand-Popo ou Ouidah, pendant 5 à 7 jours.",
  },
  {
    q: "Quelles activités sont prévues ?",
    a: "Excursions culturelles et nautiques, yoga, spa et massage, ateliers de développement personnel, soirées entre femmes, dîner de gala et activités environnementales, selon la formule choisie.",
  },
  {
    q: "Puis-je offrir une participation ?",
    a: "Oui. Un proche peut cotiser pour vous et vous offrir cette parenthèse bien-être. Contactez-nous pour organiser un cadeau EcoBloom.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-sable text-lagune-deep py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-bougainvillier-deep mb-4 text-center">
          FAQ
        </p>
        <h2 className="font-display text-4xl lg:text-5xl text-center leading-tight">
          Vos questions, <span className="italic">nos réponses</span>
        </h2>

        <div className="mt-14 divide-y divide-lagune-deep/15 border-t border-b border-lagune-deep/15">
          {QA.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-xl">{item.q}</span>
                  <Plus
                    size={22}
                    className={`shrink-0 text-bougainvillier transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="font-body text-lagune-deep/70 leading-relaxed pb-6 max-w-xl">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
