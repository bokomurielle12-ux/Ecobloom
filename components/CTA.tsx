"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bloom } from "./Bloom";

export function CTA() {
  return (
    <section id="rejoindre" className="relative bg-lagune-deep text-coquillage py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
        <Bloom size={640} openness={1} />
      </div>

      <div className="relative mx-auto max-w-2xl px-6 lg:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <Bloom size={56} openness={1} />
        </motion.div>

        <h2 className="font-display text-4xl lg:text-5xl leading-tight">
          Prête à <span className="italic text-bougainvillier">fleurir</span>{" "}
          avec nous ?
        </h2>
        <p className="font-body text-coquillage/70 text-lg leading-relaxed mt-5 max-w-md mx-auto">
          Rejoignez la liste d&apos;attente de l&apos;édition pilote EcoBloom
          2027. Nous vous contacterons très prochainement pour vous
          accompagner dans votre inscription.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-10 max-w-md mx-auto justify-center">
          <Link
            href="/register"
            className="rounded-full bg-bougainvillier px-7 py-3.5 font-body font-medium text-coquillage hover:bg-bougainvillier-deep transition-colors text-center"
          >
            Créer mon espace EcoBloom
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-coquillage/25 px-7 py-3.5 font-body font-medium text-coquillage hover:border-or hover:text-or transition-colors text-center"
          >
            J&apos;ai déjà un compte
          </Link>
        </div>

        <p className="font-mono text-xs uppercase tracking-widest text-coquillage/40 mt-6">
          Sans engagement — suivez votre épargne dès l&apos;inscription
        </p>
      </div>
    </section>
  );
}
