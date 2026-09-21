"use client";

import { motion } from "framer-motion";
import { Bloom } from "./Bloom";

const PILLARS = [
  { word: "Épargner", ensemble: "ensemble", openness: 0.35 },
  { word: "S'évader", ensemble: "ensemble", openness: 0.65 },
  { word: "Fleurir", ensemble: "ensemble", openness: 1 },
];

const POLAROIDS = [
  { src: "/images/polaroid-1.jpg", caption: "Une communauté forte", rotate: "-rotate-3" },
  { src: "/images/polaroid-2.jpg", caption: "Des moments inoubliables", rotate: "rotate-2" },
  { src: "/images/polaroid-3.jpg", caption: "Convivialité & partage", rotate: "-rotate-2" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-lagune-deep min-h-screen flex flex-col">
      {/* Full-bleed background photo */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src="/images/hero.jpg"
          alt="Une membre EcoBloom savourant un moment de bien-être"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
        />
        {/* Dark gradient so the white text stays readable over the photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-lagune-deep via-lagune-deep/60 to-lagune-deep/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-lagune-deep/80 via-lagune-deep/20 to-transparent" />
      </div>

      <div className="relative flex-1 flex items-center mx-auto max-w-6xl w-full px-6 lg:px-10 pt-28 pb-16">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs uppercase tracking-[0.2em] text-or mb-6"
          >
            Édition 2027-Bénin
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl leading-[1.02] text-coquillage"
          >
            EcoBloom <span className="italic text-or">2027</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display italic text-2xl lg:text-3xl text-bougainvillier mt-5"
          >
            « Un rendez-vous du bien-être à petit pas »
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-body text-coquillage/90 text-lg max-w-xl mt-6 leading-relaxed"
          >
            Une communauté féminine d&apos;épargne, de bien-être et
            d&apos;évasion. Préparez progressivement un séjour collectif de
            vacances entre femmes, au rythme d&apos;une cotisation mensuelle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap gap-4 mt-10"
          >
            <a
              href="#rejoindre"
              className="inline-flex items-center rounded-full bg-bougainvillier px-7 py-3.5 font-body font-medium text-coquillage hover:bg-bougainvillier-deep transition-colors"
            >
              Rejoindre la liste d&apos;attente
            </a>
            <a
              href="#concept"
              className="inline-flex items-center rounded-full border border-coquillage/40 px-7 py-3.5 font-body text-coquillage hover:border-or hover:text-or transition-colors backdrop-blur-sm"
            >
              Découvrir le concept
            </a>
          </motion.div>

          {/* Signature: three words, one bloom each, unfurling in sequence */}
          <div className="flex items-center gap-8 sm:gap-10 mt-16">
            {PILLARS.map((step, i) => (
              <motion.div
                key={step.word}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
                className="flex flex-col items-center text-center gap-3"
              >
                <Bloom openness={step.openness} size={40} />
                <div>
                  <p className="font-display italic text-base text-coquillage leading-none">
                    {step.word}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-coquillage/50 mt-1">
                    {step.ensemble}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-life photo strip, tucked over the bottom edge of the photo */}
      <div className="relative flex flex-wrap justify-center gap-6 sm:gap-10 px-6 pb-12 lg:pb-16">
        {POLAROIDS.map((p, i) => (
          <motion.div
            key={p.caption}
            initial={{ opacity: 0, y: 24, rotate: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 + i * 0.12 }}
            whileHover={{ y: -6, scale: 1.03, transition: { duration: 0.25 } }}
            className={`bg-coquillage rounded-xl p-2.5 pb-4 shadow-xl w-32 sm:w-44 cursor-default ${p.rotate}`}
          >
            <div className="rounded-md overflow-hidden aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.caption} className="w-full h-full object-cover" />
            </div>
            <p className="font-display italic text-xs text-lagune-deep text-center mt-2.5">
              {p.caption}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
