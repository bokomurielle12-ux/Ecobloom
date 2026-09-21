import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Concept } from "@/components/Concept";
import { Formules } from "@/components/Formules";
import { Sejour } from "@/components/Sejour";
import { Confiance } from "@/components/Confiance";
import { Temoignages } from "@/components/Temoignages";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { BloomRail } from "@/components/BloomRail";

export default function Home() {
  return (
    <>
      <BloomRail />
      <Header />
      <main>
        <Hero />
        <Concept />
        <Formules />
        <Sejour />
        <Confiance />
        <Temoignages />
        <FAQ />
        <Contact />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
