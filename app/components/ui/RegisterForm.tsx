"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify and retype.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone: phone || undefined,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to complete registration. Please review the details.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      console.error("Registration request error:", err);
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-xs text-rose-200"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label
          htmlFor="reg-name"
          className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-emerald-100/80 mb-1.5"
        >
          Full Name
        </label>
        <div className="relative">
          <input
            id="reg-name"
            type="text"
            required
            autoComplete="name"
            placeholder="Lord / Lady Vici"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-emerald-400/20 bg-black/40 px-4 py-2.5 pl-11 text-sm text-white placeholder-white/25 transition-all focus:border-[#1fe0bb] focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-[#1fe0bb]"
          />
          <User className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-emerald-300/50" />
        </div>
      </div>

      {/* Email Address */}
      <div>
        <label
          htmlFor="reg-email"
          className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-emerald-100/80 mb-1.5"
        >
          Email Address
        </label>
        <div className="relative">
          <input
            id="reg-email"
            type="email"
            required
            autoComplete="email"
            placeholder="client@atelier.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-emerald-400/20 bg-black/40 px-4 py-2.5 pl-11 text-sm text-white placeholder-white/25 transition-all focus:border-[#1fe0bb] focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-[#1fe0bb]"
          />
          <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-emerald-300/50" />
        </div>
      </div>

      {/* Phone Number (Optional) */}
      <div>
        <label
          htmlFor="reg-phone"
          className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-emerald-100/80 mb-1.5"
        >
          Mobile / Contact (Optional)
        </label>
        <div className="relative">
          <input
            id="reg-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-emerald-400/20 bg-black/40 px-4 py-2.5 pl-11 text-sm text-white placeholder-white/25 transition-all focus:border-[#1fe0bb] focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-[#1fe0bb]"
          />
          <Phone className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-emerald-300/50" />
        </div>
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="reg-password"
          className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-emerald-100/80 mb-1.5"
        >
          Password (min 8 chars, 1 number)
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-emerald-400/20 bg-black/40 px-4 py-2.5 pl-11 text-sm text-white placeholder-white/25 transition-all focus:border-[#1fe0bb] focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-[#1fe0bb]"
          />
          <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-emerald-300/50" />
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="reg-confirm-password"
          className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-emerald-100/80 mb-1.5"
        >
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="reg-confirm-password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-emerald-400/20 bg-black/40 px-4 py-2.5 pl-11 text-sm text-white placeholder-white/25 transition-all focus:border-[#1fe0bb] focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-[#1fe0bb]"
          />
          <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-emerald-300/50" />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1fe0bb] px-6 text-xs font-bold uppercase tracking-[0.16em] text-[#03251c] transition-all hover:bg-emerald-200 hover:shadow-lg hover:shadow-[#1fe0bb]/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <span>Creating Profile…</span>
        ) : (
          <>
            <span>Establish Client Account</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <div className="mt-5 border-t border-white/10 pt-4 text-center text-xs text-white/55">
        <span>Already have an atelier profile? </span>
        <Link
          href={`/login${callbackUrl !== "/account" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
          className="font-semibold text-[#1fe0bb] hover:underline"
        >
          Sign In
        </Link>
      </div>

      <div className="flex items-center justify-center gap-2 pt-1 text-[0.68rem] text-emerald-200/50">
        <ShieldCheck className="h-3.5 w-3.5 text-[#1fe0bb]" />
        <span>Passwords hashed with cryptographic scrypt & salt</span>
      </div>
    </form>
  );
}
