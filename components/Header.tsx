"use client";

import { useEffect, useState } from "react";
import { Bloom } from "./Bloom";

const LINKS = [
  { href: "#concept", label: "Le concept" },
  { href: "#formules", label: "Les formules" },
  { href: "#sejour", label: "Le séjour" },
  { href: "#confiance", label: "Confiance" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "bg-lagune-deep/90 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-10 flex items-center justify-between h-20">
        <a href="#" className="flex items-center gap-2.5 group">
          <Bloom size={30} openness={0.85} />
          <span className="font-display italic text-xl tracking-tight text-coquillage">
            EcoBloom
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7 font-body text-sm text-coquillage/80">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-or transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-5 pl-6 ml-2 border-l border-coquillage/15">
          <a
            href="/login"
            className="text-sm text-coquillage/70 hover:text-or transition-colors"
          >
            Espace membre
          </a>
          <a
            href="#rejoindre"
            className="inline-flex items-center rounded-full bg-bougainvillier px-5 py-2.5 text-sm font-medium text-coquillage hover:bg-bougainvillier-deep transition-colors"
          >
            Rejoindre la liste d&apos;attente
          </a>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden text-coquillage p-2"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
        >
          <span className="block w-6 h-px bg-coquillage mb-1.5" />
          <span className="block w-6 h-px bg-coquillage mb-1.5" />
          <span className="block w-4 h-px bg-coquillage" />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-lagune-deep border-t border-white/5 px-6 py-6 flex flex-col gap-5">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-coquillage/90 font-body"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/login"
            onClick={() => setOpen(false)}
            className="text-coquillage/90 font-body pt-4 border-t border-coquillage/10"
          >
            Espace membre
          </a>
          <a
            href="#rejoindre"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center rounded-full bg-bougainvillier px-5 py-2.5 text-sm font-medium text-coquillage"
          >
            Rejoindre la liste d&apos;attente
          </a>
        </div>
      )}
    </header>
  );
}
