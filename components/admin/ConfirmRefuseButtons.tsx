"use client";

import { useState } from "react";

export function ConfirmRefuseButtons({ userId }: { userId: string }) {
  const [loading, setLoading] = useState<"confirm" | "refuse" | null>(null);

  async function confirm() {
    setLoading("confirm");
    await fetch("/api/admin/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    window.location.reload();
  }

  async function refuse() {
    const reason = window.prompt("Motif du refus (optionnel) :") || undefined;
    setLoading("refuse");
    await fetch("/api/admin/refuse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, reason }),
    });
    window.location.reload();
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={confirm}
        disabled={loading !== null}
        className="text-xs bg-feuille text-white px-3 py-1.5 rounded-full hover:opacity-90 transition disabled:opacity-50"
      >
        {loading === "confirm" ? "..." : "Confirmer"}
      </button>
      <button
        onClick={refuse}
        disabled={loading !== null}
        className="text-xs border border-red-300 text-red-600 px-3 py-1.5 rounded-full hover:bg-red-50 transition disabled:opacity-50"
      >
        {loading === "refuse" ? "..." : "Refuser"}
      </button>
    </div>
  );
}
