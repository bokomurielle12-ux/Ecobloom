"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PasswordInput } from "@/components/PasswordInput";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(data.role === "ADMIN" ? "/admin" : next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-lagune text-coquillage flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <h1 className="font-display text-3xl mb-2 text-center">Connexion</h1>
        <p className="text-coquillage/60 text-center mb-8 text-sm">Accédez à votre espace EcoBloom.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-full px-5 py-3 text-sm text-lagune-deep bg-coquillage placeholder:text-lagune-deep/40 focus:outline-none focus:ring-2 focus:ring-or"
          />
          <PasswordInput
            value={form.password}
            onChange={(password) => setForm({ ...form, password })}
          />
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-bougainvillier hover:bg-bougainvillier-deep transition rounded-full py-3 text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <p className="text-center text-xs text-coquillage/50 mt-6">
          Pas encore de compte ?{" "}
          <Link href="/register" className="underline underline-offset-4">
            S'inscrire
          </Link>
        </p>
        {/* <p className="text-center text-xs text-coquillage/30 mt-8">
          Démo admin : ecobloom60@gmail.com / admin1234
        </p> */}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
