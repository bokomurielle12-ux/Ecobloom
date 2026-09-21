"use client";

import { motion } from "framer-motion";
import { Bloom } from "./Bloom";

const PILIERS = [
  {
    title: "L'épargne",
    text: "Constituez progressivement votre budget voyage grâce à une cotisation mensuelle sur 11 mois. Plus de stress, plus de sommes impossibles à débloquer d'un coup.",
    openness: 0.25,
    image: "/images/concept-epargne.jpg",
  },
  {
    title: "Le bien-être",
    text: "Repos, détente et reconnexion à soi. Yoga, massage, spa, ateliers de développement personnel : chaque moment est pensé pour vous ressourcer.",
    openness: 0.5,
    image: "/images/concept-bienetre.jpg",
  },
  {
    title: "La sororité",
    text: "Créez des liens authentiques avec d'autres femmes partageant les mêmes aspirations. Entrepreneures, salariées, indépendantes : toutes sont les bienvenues.",
    openness: 0.75,
    image: "/images/concept-sororite.jpg",
  },
  {
    title: "L'engagement",
    text: "Un séjour conçu avec le tourisme responsable en tête : hébergements éco-responsables, activités environnementales et respect des destinations.",
    openness: 1,
    image: null,
  },
];

export function Concept() {
  return (
    <section id="concept" className="bg-sable text-lagune-deep py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-bougainvillier-deep mb-4">
          Le concept
        </p>
        <h2 className="font-display text-4xl lg:text-5xl max-w-2xl leading-tight">
          Quatre piliers, <span className="italic">une communauté</span>
        </h2>
        <p className="font-body text-lagune-deep/70 max-w-xl mt-5 text-lg leading-relaxed">
          EcoBloom repose sur une idée simple : préparer ses vacances comme un
          projet collectif, mois après mois, dans un esprit de sororité et de
          bien-être.
        </p>

        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-14 mt-16">
          {PILIERS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="border-t border-lagune-deep/15 pt-6"
            >
              {p.image && (
                <div className="rounded-2xl overflow-hidden h-40 mb-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <Bloom
                openness={p.openness}
                size={40}
                color="var(--bloom-bougainvillier)"
                center="var(--bloom-or)"
              />
              <h3 className="font-display text-2xl mt-4 mb-2">{p.title}</h3>
              <p className="font-body text-lagune-deep/70 leading-relaxed">
                {p.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
