"use client";

import { useScroll, useSpring, motion } from "framer-motion";
import { useRef } from "react";
import { Bloom } from "./Bloom";

const STOPS = [
  { id: "concept", label: "Le concept" },
  { id: "formules", label: "Les formules" },
  { id: "sejour", label: "Le séjour" },
  { id: "faq", label: "FAQ" },
  { id: "rejoindre", label: "Rejoindre" },
];

/**
 * A vertical rail that fills as the visitor scrolls, echoing the product's
 * own mechanic: an 11-month savings journey that gradually "blooms" into
 * a trip. Hidden on small screens to keep mobile uncluttered.
 */
export function BloomRail() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const height = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    mass: 0.3,
  });

  return (
    <div
      ref={ref}
      className="hidden lg:flex fixed left-6 top-0 h-screen w-10 z-30 flex-col items-center pointer-events-none"
      aria-hidden="true"
    >
      <div className="relative w-px h-full bg-[color-mix(in_srgb,var(--bloom-coquillage)_18%,transparent)] mt-10 mb-10">
        <motion.div
          className="absolute top-0 left-0 w-px origin-top bg-gradient-to-b from-or to-bougainvillier"
          style={{ scaleY: height, height: "100%" }}
        />
        {STOPS.map((s, i) => (
          <div
            key={s.id}
            className="absolute -left-2.5"
            style={{ top: `${(i / (STOPS.length - 1)) * 100}%` }}
          >
            <Bloom size={20} openness={1} />
          </div>
        ))}
      </div>
    </div>
  );
}
