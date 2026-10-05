"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to sign in. Please check your credentials.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      console.error("Login request error:", err);
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-xs text-rose-200"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Email Field */}
      <div>
        <label
          htmlFor="login-email"
          className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-emerald-100/80 mb-2"
        >
          Email Address
        </label>
        <div className="relative">
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            placeholder="client@atelier.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-emerald-400/20 bg-black/40 px-4 py-3 pl-11 text-sm text-white placeholder-white/25 transition-all focus:border-[#1fe0bb] focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-[#1fe0bb]"
          />
          <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-emerald-300/50" />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="login-password"
            className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-emerald-100/80"
          >
            Password
          </label>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-emerald-400/20 bg-black/40 px-4 py-3 pl-11 text-sm text-white placeholder-white/25 transition-all focus:border-[#1fe0bb] focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-[#1fe0bb]"
          />
          <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-emerald-300/50" />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1fe0bb] px-6 text-xs font-bold uppercase tracking-[0.16em] text-[#03251c] transition-all hover:bg-emerald-200 hover:shadow-lg hover:shadow-[#1fe0bb]/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <span>Authenticating…</span>
        ) : (
          <>
            <span>Access Atelier Account</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <div className="mt-6 border-t border-white/10 pt-5 text-center text-xs text-white/55">
        <span>Do not have an account yet? </span>
        <Link
          href={`/register${callbackUrl !== "/account" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
          className="font-semibold text-[#1fe0bb] hover:underline"
        >
          Create Atelier Profile
        </Link>
      </div>

      <div className="flex items-center justify-center gap-2 pt-2 text-[0.68rem] text-emerald-200/50">
        <ShieldCheck className="h-3.5 w-3.5 text-[#1fe0bb]" />
        <span>Secured with end-to-end encrypted session keys</span>
      </div>
    </form>
  );
}
