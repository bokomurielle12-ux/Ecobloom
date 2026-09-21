"use client";

import { motion } from "framer-motion";

const TEMOIGNAGES = [
  {
    quote:
      "L'idée de préparer mes vacances petit à petit, entourée d'autres femmes, change tout. J'ai enfin l'impression que mes rêves de voyage sont accessibles.",
    name: "Aïcha K.",
    role: "Entrepreneure, Cotonou",
  },
  {
    quote:
      "Entre le boulot, la famille et les engagements, je n'osais plus penser à moi. EcoBloom me redonne une bulle de bien-être à anticiper avec joie.",
    name: "Marie-Claire D.",
    role: "Professionnelle, Porto-Novo",
  },
  {
    quote:
      "Cotiser pour ma femme était un cadeau différent. Elle mérite ce temps pour elle, loin du quotidien, dans une communauté bienveillante.",
    name: "Thomas N.",
    role: "Mari d'une participante",
  },
];

export function Temoignages() {
  return (
    <section className="bg-lagune text-coquillage py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-or mb-4">
          Témoignages
        </p>
        <h2 className="font-display text-4xl lg:text-5xl max-w-xl leading-tight">
          Elles se projettent <span className="italic text-bougainvillier">déjà</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {TEMOIGNAGES.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-3xl bg-white/[0.04] border border-white/10 p-8 flex flex-col"
            >
              <span className="font-display italic text-5xl text-bougainvillier leading-none mb-4">
                &ldquo;
              </span>
              <blockquote className="font-body text-coquillage/85 leading-relaxed flex-1">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 pt-6 border-t border-white/10">
                <p className="font-display italic text-lg">{t.name}</p>
                <p className="font-mono text-xs uppercase tracking-widest text-coquillage/50 mt-1">
                  {t.role}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
