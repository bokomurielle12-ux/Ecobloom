"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput({
  value,
  onChange,
  placeholder = "Mot de passe",
  required = true,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        required={required}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-full pl-5 pr-12 py-3 text-sm text-lagune-deep bg-coquillage placeholder:text-lagune-deep/40 focus:outline-none focus:ring-2 focus:ring-or"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-lagune-deep/40 hover:text-lagune-deep/70 transition-colors"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
