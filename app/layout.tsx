import type { Metadata } from "next";
import "./globals.css";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

export const metadata: Metadata = {
  title: "EcoBloom 2027 — Un rendez-vous du bien-être à petit pas",
  description: "Communauté féminine d'épargne, de bien-être et d'évasion au Bénin.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--bloom-lagune)] text-[var(--bloom-coquillage)]">
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
