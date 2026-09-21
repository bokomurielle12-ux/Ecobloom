"use client";

import { motion } from "framer-motion";

const ACTIVITES = [
  "Excursion touristique",
  "Découverte culturelle",
  "Yoga & stretching",
  "Massage & spa",
  "Activités nautiques",
  "Activité touristique",
  "Feu de camp",
  "Journée ludique",
  "Session bien-être",
  "Soirée entre femmes",
  "Atelier développement personnel",
  "Shooting photo",
  "Temps libre",
  "Dîner de gala",
  "Réseautage",
];

export function Sejour() {
  return (
    <section id="sejour" className="relative bg-sable text-lagune-deep py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 lg:px-10 grid lg:grid-cols-[1fr_1.1fr] gap-16 items-start">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-bougainvillier-deep mb-4">
            Le séjour 2027
          </p>
          <h2 className="font-display text-4xl lg:text-5xl leading-tight">
            Grand-Popo <span className="italic">ou</span> Ouidah,
            <br /> Bénin
          </h2>
          <p className="font-body text-lagune-deep/70 text-lg leading-relaxed mt-6">
            Pour cette première édition pilote, nous vous emmenons sur la
            côte béninoise, entre plages dorées, lagunes tranquilles et
            richesses culturelles. Un cadre idéal pour reposer, se
            reconnecter et s&apos;émerveiller.
          </p>

          <div className="flex items-center gap-4 mt-10">
            <div className="font-display text-5xl italic text-bougainvillier">
              5–7
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-lagune-deep/60 leading-snug">
              jours
              <br />
              de séjour
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Coastal illustration echoing the hero, in daylight palette */}
          <div className="rounded-3xl overflow-hidden mb-8 aspect-[16/10]">
            <svg viewBox="0 0 800 500" className="w-full h-full" aria-hidden="true">
              <defs>
                <linearGradient id="seiSky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d9a441" />
                  <stop offset="100%" stopColor="#f4e9d6" />
                </linearGradient>
                <linearGradient id="seiSea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4c7a5e" />
                  <stop offset="100%" stopColor="#0f2620" />
                </linearGradient>
              </defs>
              <rect width="800" height="500" fill="url(#seiSky)" />
              <rect y="320" width="800" height="180" fill="url(#seiSea)" />
              <rect y="300" width="800" height="20" fill="#f4e9d6" opacity="0.5" />
              <g fill="#0f2620">
                <path d="M90 500 L98 350 Q40 320 24 280 Q76 296 100 328 Q80 270 100 220 Q134 270 108 332 Q152 306 196 314 Q152 346 106 358 L114 500 Z" />
                <path d="M700 500 L692 380 Q748 352 764 316 Q712 328 688 360 Q706 306 684 264 Q656 310 682 364 Q642 340 600 348 Q642 376 686 386 L680 500 Z" />
              </g>
            </svg>
          </div>

          <p className="font-mono text-xs uppercase tracking-widest text-lagune-deep/50 mb-4">
            Au programme
          </p>
          <ul className="flex flex-wrap gap-2.5">
            {ACTIVITES.map((a) => (
              <li
                key={a}
                className="font-body text-sm rounded-full border border-lagune-deep/15 px-4 py-2 hover:border-bougainvillier hover:text-bougainvillier-deep transition-colors"
              >
                {a}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
