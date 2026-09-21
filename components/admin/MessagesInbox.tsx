"use client";

import { useState } from "react";
import { Message } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function MessagesInbox({
  initial,
  userNames,
}: {
  initial: Message[];
  userNames: Record<string, string>;
}) {
  const [messages, setMessages] = useState(initial);
  const [openId, setOpenId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendReply(messageId: string) {
    if (!replyText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, reply: replyText.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => prev.map((m) => (m.id === messageId ? data.message : m)));
        setOpenId(null);
        setReplyText("");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-lagune-deep/10 divide-y divide-lagune-deep/5">
      {messages.length === 0 && (
        <p className="px-5 py-8 text-center text-sm text-lagune-deep/40">Aucun message pour le moment.</p>
      )}
      {messages.map((m) => (
        <div key={m.id} className="px-5 py-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium">{userNames[m.userId] ?? "Membre"}</p>
            <span className="text-xs text-lagune-deep/40">{formatDate(m.createdAt)}</span>
          </div>
          <span className="inline-block text-[11px] uppercase tracking-wide text-bougainvillier-deep mb-1.5">
            {m.type === "QUESTION" ? "Question" : "Suggestion"}
          </span>
          <p className="text-sm text-lagune-deep/80 mb-2">{m.message}</p>

          {m.response ? (
            <div className="pl-3 border-l-2 border-feuille/40">
              <p className="text-xs uppercase tracking-wide text-feuille mb-1">Votre réponse</p>
              <p className="text-sm text-lagune-deep/70">{m.response}</p>
            </div>
          ) : openId === m.id ? (
            <div className="flex gap-2 mt-2">
              <input
                autoFocus
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Votre réponse..."
                className="flex-1 rounded-full border border-lagune-deep/15 px-4 py-2 text-sm focus:outline-none"
              />
              <button
                onClick={() => sendReply(m.id)}
                disabled={loading}
                className="text-xs bg-lagune-deep text-coquillage px-4 py-2 rounded-full disabled:opacity-50"
              >
                Envoyer
              </button>
            </div>
          ) : (
            <button
              onClick={() => setOpenId(m.id)}
              className="text-xs text-bougainvillier underline underline-offset-4"
            >
              Répondre
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
