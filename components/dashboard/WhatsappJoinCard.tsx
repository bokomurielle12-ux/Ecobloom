"use client";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.148.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.462 3.484 1.34 5.002L2 22l5.116-1.334a9.96 9.96 0 004.888 1.278h.004c5.514 0 9.997-4.483 9.997-9.997 0-2.67-1.04-5.18-2.928-7.069a9.93 9.93 0 00-7.073-2.875zm0 18.166a8.16 8.16 0 01-4.166-1.14l-.299-.177-3.037.792.811-2.96-.195-.304a8.147 8.147 0 01-1.253-4.38c0-4.504 3.666-8.169 8.173-8.169 2.183 0 4.234.85 5.777 2.393a8.114 8.114 0 012.396 5.782c0 4.504-3.666 8.163-8.207 8.163z" />
    </svg>
  );
}

export function WhatsappJoinCard({ alreadyJoined }: { alreadyJoined: boolean }) {
  const link =
    process.env.NEXT_PUBLIC_WHATSAPP_GROUP_LINK || "https://chat.whatsapp.com/votre-lien-de-groupe";

  return (
    <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
          <WhatsAppIcon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-medium">Groupe WhatsApp de votre promotion</p>
          <p className="text-xs text-lagune-deep/50">
            {alreadyJoined ? "Vous avez rejoint le groupe" : "Échangez avec les autres membres"}
          </p>
        </div>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => fetch("/api/whatsapp/join", { method: "POST" })}
        className="text-sm font-medium bg-[#25D366] text-white px-4 py-2 rounded-full hover:opacity-90 transition"
      >
        {alreadyJoined ? "Ouvrir le groupe" : "Rejoindre"}
      </a>
    </div>
  );
}
