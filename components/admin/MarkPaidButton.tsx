"use client";

import { useState } from "react";

export function MarkPaidButton({ paymentId, label = "Marquer payé" }: { paymentId: string; label?: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch("/api/admin/mark-paid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId }),
        });
        window.location.reload();
      }}
      className="text-xs bg-lagune-deep text-coquillage px-3 py-1.5 rounded-full hover:opacity-90 transition disabled:opacity-50"
    >
      {loading ? "..." : label}
    </button>
  );
}
