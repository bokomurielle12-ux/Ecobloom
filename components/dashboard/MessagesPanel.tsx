"use client";

import { useState } from "react";
import { Message, MessageType } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export function MessagesPanel({ initial }: { initial: Message[] }) {
  const [messages, setMessages] = useState(initial);
  const [type, setType] = useState<MessageType>("QUESTION");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, content }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [data.message, ...prev]);
        setContent("");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-lagune-deep/10 p-5">
      <h3 className="font-display text-lg mb-4">Suggestions & questions</h3>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <div className="flex gap-2">
          {(["QUESTION", "SUGGESTION"] as MessageType[]).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setType(t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                type === t
                  ? "bg-lagune-deep text-coquillage border-lagune-deep"
                  : "border-lagune-deep/15 text-lagune-deep/60"
              }`}
            >
              {t === "QUESTION" ? "Question" : "Suggestion"}
            </button>
          ))}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder={
            type === "QUESTION"
              ? "Posez votre question à l'équipe EcoBloom..."
              : "Partagez une idée pour améliorer EcoBloom..."
          }
          className="w-full rounded-xl border border-lagune-deep/10 px-4 py-3 text-sm focus:outline-none focus:border-bougainvillier/40 resize-none"
        />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="text-sm bg-bougainvillier text-coquillage px-4 py-2 rounded-full font-medium disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </form>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-sm text-lagune-deep/40 text-center py-4">
            Vous n&apos;avez pas encore envoyé de message.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className="rounded-xl bg-sable/50 p-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs uppercase tracking-wide text-lagune-deep/45">
                {m.type === "QUESTION" ? "Question" : "Suggestion"}
              </span>
              <span className="text-xs text-lagune-deep/40">{formatDate(m.createdAt)}</span>
            </div>
            <p className="text-sm">{m.message}</p>
            {m.response && (
              <div className="mt-3 pl-3 border-l-2 border-bougainvillier/40">
                <p className="text-xs uppercase tracking-wide text-bougainvillier-deep mb-1">
                  Réponse EcoBloom
                </p>
                <p className="text-sm text-lagune-deep/80">{m.response}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
