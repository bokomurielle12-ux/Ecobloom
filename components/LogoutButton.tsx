"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
      }}
      className="text-sm text-lagune-deep/60 hover:text-lagune-deep underline underline-offset-4"
    >
      Se déconnecter
    </button>
  );
}
