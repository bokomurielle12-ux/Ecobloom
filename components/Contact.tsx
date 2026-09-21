"use client";

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.148.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.05 2C6.5 2 2 6.5 2 12.05c0 1.85.49 3.65 1.42 5.24L2 22l4.83-1.4a10 10 0 0 0 5.22 1.45h.005c5.55 0 10.05-4.5 10.05-10.05C22.1 6.5 17.6 2 12.05 2zm0 18.3h-.004a8.24 8.24 0 0 1-4.2-1.15l-.3-.18-3.11.9.83-3.03-.2-.31a8.25 8.25 0 0 1-1.27-4.38c0-4.56 3.71-8.27 8.27-8.27 2.21 0 4.28.86 5.84 2.42a8.2 8.2 0 0 1 2.42 5.85c0 4.56-3.71 8.15-8.27 8.15z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93V8.55c0-.86.24-1.44 1.47-1.44h1.57V4.46A21 21 0 0 0 14.6 4.3c-2.44 0-4.11 1.49-4.11 4.22v2.35H7.93v2.96h2.56V21h3.01z" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.94 8.5H3.56V20.4h3.38V8.5zM5.25 3.6a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92zM20.44 20.4h-3.37v-6.24c0-1.49-.03-3.4-2.07-3.4-2.08 0-2.4 1.62-2.4 3.29v6.35H9.24V8.5h3.24v1.63h.05c.45-.86 1.56-1.77 3.2-1.77 3.43 0 4.06 2.26 4.06 5.19v6.85z" />
    </svg>
  );
}

function MailIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

const CONTACTS = [
  { label: "Email", value: "ecobloom60@gmail.com", href: "mailto:ecobloom60@gmail.com", Icon: MailIcon },
  { label: "Téléphone", value: "+229 01 52 03 09 40", href: "tel:+2290152030940", Icon: PhoneIcon },
  { label: "WhatsApp", value: "+229 01 52 03 09 40", href: "https://wa.me/2290152030940", Icon: WhatsAppIcon },
];

const SOCIALS = [
  { href: "https://instagram.com/ecobloom", label: "Instagram", Icon: InstagramIcon },
  { href: "https://facebook.com/ecobloom", label: "Facebook", Icon: FacebookIcon },
  { href: "https://linkedin.com/company/ecobloom", label: "LinkedIn", Icon: LinkedinIcon },
];

export function Contact() {
  return (
    <section id="contact" className="bg-sable text-lagune-deep py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-bougainvillier-deep mb-4">
          Une question avant de vous inscrire ?
        </p>
        <h2 className="font-display text-4xl lg:text-5xl mb-12">Restons en contact</h2>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {CONTACTS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="bg-coquillage rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-lagune-deep/5 flex items-center justify-center text-lagune-deep">
                <c.Icon size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-lagune-deep/45">{c.label}</p>
                <p className="text-sm font-medium">{c.value}</p>
              </div>
            </a>
          ))}
        </div>

        <p className="text-xs uppercase tracking-widest text-lagune-deep/45 mb-4">Suivez-nous</p>
        <div className="flex items-center justify-center gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="w-11 h-11 rounded-full border border-lagune-deep/15 flex items-center justify-center hover:border-bougainvillier hover:text-bougainvillier-deep transition-colors"
            >
              <s.Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
