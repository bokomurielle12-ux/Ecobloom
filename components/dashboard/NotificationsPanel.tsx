"use client";

import { useEffect, useState } from "react";
import { Notification } from "@/lib/types";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} h`;
  return `il y a ${Math.floor(hours / 24)} j`;
}

export function NotificationsPanel({ initial }: { initial: Notification[] }) {
  const [notifs, setNotifs] = useState(initial);
  const unread = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    if (unread > 0) {
      fetch("/api/notifications/read", { method: "POST" }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (notifs.length === 0) {
    return <p className="text-sm text-lagune-deep/40 px-1">Aucune notification pour le moment.</p>;
  }

  return (
    <div className="bg-white rounded-2xl border border-lagune-deep/10 divide-y divide-lagune-deep/5">
      {notifs.map((n) => (
        <div key={n.id} className="px-4 py-3 flex items-start gap-2">
          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-bougainvillier mt-1.5 shrink-0" />}
          <div>
            <p className="text-sm">{n.message}</p>
            <p className="text-xs text-lagune-deep/40 mt-0.5">{timeAgo(n.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
